"use client";

import React, { useState } from "react";
import { MapPin, Clock, Phone, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/ui/Modal";

const STORES = [
  {
    id: "st_1",
    city: "Cupertino",
    name: "Aurelian Flagship Infinite",
    address: "One Infinite Loop, Suite 100, Cupertino, CA 95014",
    phone: "+1 (408) 996-1010",
    hours: "Mon–Sat: 10:00 AM – 9:00 PM • Sun: 11:00 AM – 7:00 PM",
    features: ["Acoustic Sound Isolation Chambers", "Titanium Fitting Station", "Studio Bar"]
  },
  {
    id: "st_2",
    city: "New York",
    name: "Aurelian SoHo Studio",
    address: "103 Prince Street, New York, NY 10012",
    phone: "+1 (212) 226-3126",
    hours: "Mon–Sat: 10:00 AM – 8:00 PM • Sun: 11:00 AM – 6:00 PM",
    features: ["6K Display Color Calibration Bar", "Lossless Audio Lounge"]
  },
  {
    id: "st_3",
    city: "Tokyo",
    name: "Aurelian Ginza Studio",
    address: "3-5-12 Ginza, Chuo-ku, Tokyo 104-0061",
    phone: "+81 3 5159 8200",
    hours: "Daily: 10:00 AM – 9:00 PM",
    features: ["Ceramic Tactile Showcase", "Private Listening Suites"]
  },
  {
    id: "st_4",
    city: "London",
    name: "Aurelian Regent Street",
    address: "235 Regent Street, London W1B 2EL",
    phone: "+44 20 7153 9000",
    hours: "Mon–Sat: 10:00 AM – 8:00 PM • Sun: 12:00 PM – 6:00 PM",
    features: ["Acoustic Transducer Testing", "Personal Concierge Appointments"]
  }
];

export default function StoreLocatorPage() {
  const { success } = useToast();
  const [bookingStudio, setBookingStudio] = useState<string | null>(null);
  const [bookingDate, setBookingDate] = useState("2025-03-20");
  const [bookingTime, setBookingTime] = useState("14:00");

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    success(`Private listening appointment confirmed at ${bookingStudio} on ${bookingDate} at ${bookingTime}!`);
    setBookingStudio(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
          Physical Listening Studios
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Aurelian Flagship Studios Worldwide
        </h1>
        <p className="text-xs text-neutral-500">
          Experience our loss-less titanium acoustic chambers, tandem OLED workstations, and custom silicone fittings in person.
        </p>
      </div>

      {/* Studios Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {STORES.map((st) => (
          <div
            key={st.id}
            className="p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {st.city}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Open Today" />
              </div>

              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {st.name}
              </h2>

              <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <span>{st.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{st.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{st.phone}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5">
                {st.features.map((f, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-[10px] font-medium text-neutral-600 dark:text-neutral-400"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
              <button
                onClick={() => setBookingStudio(st.name)}
                className="w-full py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Listening Appointment</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={bookingStudio !== null}
        onClose={() => setBookingStudio(null)}
        title="Schedule Private Acoustic Session"
        description={`Reserved 45-minute studio listening session at ${bookingStudio}.`}
        maxWidth="md"
      >
        <form onSubmit={handleBook} className="space-y-4 pt-2 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Select Preferred Date
            </label>
            <input
              type="date"
              required
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Preferred Time Slot
            </label>
            <select
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            >
              <option value="11:00">11:00 AM – 11:45 AM</option>
              <option value="14:00">02:00 PM – 02:45 PM</option>
              <option value="16:00">04:00 PM – 04:45 PM</option>
              <option value="18:00">06:00 PM – 06:45 PM</option>
            </select>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-300 text-[11px] leading-relaxed">
            A certified acoustic engineer will prepare your selected headphones with high-res lossless test tracks.
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-colors"
          >
            Confirm Reservation
          </button>
        </form>
      </Modal>
    </div>
  );
}
