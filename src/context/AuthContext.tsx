"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { UserResponse } from "@/types/api";
import { authApi } from "@/lib/api";
import { useToast } from "./ToastContext";

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<UserResponse>;
  register: (name: string, email: string, password: string) => Promise<UserResponse>;
  logout: () => void;
  refreshUser: () => Promise<UserResponse | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { success, error, info } = useToast();

  const refreshUser = useCallback(async (): Promise<UserResponse | null> => {
    const savedToken = localStorage.getItem("aurelian_token");
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return null;
    }

    try {
      setToken(savedToken);
      const currentUser = await authApi.getMe();
      setUser(currentUser);
      localStorage.setItem("aurelian_user", JSON.stringify(currentUser));
      return currentUser;
    } catch {
      // Invalid or expired token
      localStorage.removeItem("aurelian_token");
      localStorage.removeItem("aurelian_user");
      setUser(null);
      setToken(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load
    try {
      const cachedUser = localStorage.getItem("aurelian_user");
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }
    } catch {}

    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<UserResponse> => {
    try {
      const tokenRes = await authApi.login({ email, password });
      localStorage.setItem("aurelian_token", tokenRes.access_token);
      setToken(tokenRes.access_token);

      const profile = await authApi.getMe();
      setUser(profile);
      localStorage.setItem("aurelian_user", JSON.stringify(profile));
      success(`Welcome back, ${profile.name.split(" ")[0]}!`, "Logged In");
      return profile;
    } catch (err: any) {
      error(err.message || "Failed to log in", "Authentication Error");
      throw err;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<UserResponse> => {
    try {
      await authApi.register({ name, email, password });
      // Automatically log in after registration
      return await login(email, password);
    } catch (err: any) {
      error(err.message || "Failed to register account", "Registration Error");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("aurelian_token");
    localStorage.removeItem("aurelian_user");
    setUser(null);
    setToken(null);
    info("You have been signed out.", "Logged Out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin: !!user?.is_admin,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
