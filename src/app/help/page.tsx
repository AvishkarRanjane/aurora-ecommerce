"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  MessageSquare,
  Headphones,
  FileQuestion,
  Send,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  RotateCcw,
  Truck,
  ShieldCheck,
  X
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/ui/Modal";

const FAQS = [
  {
    q: "How fast is worldwide express courier delivery?",
    a: "Orders placed before 2:00 PM PST dispatch the same day via DHL Express or FedEx Priority. Deliveries to North America typically arrive in 1–2 business days; Europe and Asia-Pacific within 2–4 business days."
  },
  {
    q: "What is the Aurelian 30-day return policy?",
    a: "You may return any hardware in original packaging within 30 days of receipt for a 100% refund. We provide a prepaid DHL return shipping airbill and pick up directly from your doorstep."
  },
  {
    q: "How does 2-Year AurelianCare+ warranty work?",
    a: "Every Aurelian product includes 24 months of full hardware coverage against manufacturing defects, transducer degradation, battery capacity loss (>20%), and accidental drop damage with low deductible repair."
  },
  {
    q: "Can I use Aurelian Studio Max via lossless analog cable?",
    a: "Yes. The Aurelian Studio Max features an integrated 24-bit/96kHz DAC over USB-C for bit-perfect lossless playback, as well as an active 3.5mm low-noise analog input port."
  },
  {
    q: "How do I request an exchange or trade-in credit?",
    a: "Visit our Deals & Offers page to calculate your instant trade-in quote. Once submitted, the credit is immediately applied to your new order and a prepaid box is sent for your old device."
  }
];

export default function HelpFAQPage() {
  const { success } = useToast();
  const [search, setSearch] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Live Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    {
      sender: "bot",
      text: "Hello! I am Aurelian Concierge. How may I assist you with your hardware, shipment tracking, or audio setup today?"
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    success("Your concierge inquiry has been received. Ticket #CS-9921 created.");
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const nextMessages = [...chatMessages, { sender: "user" as const, text: userMsg }];
    setChatMessages(nextMessages);
    setChatInput("");

    setTimeout(() => {
      let reply = "Our support specialists are standing by. Your inquiry has been routed to our hardware engineering team.";
      const lower = userMsg.toLowerCase();
      if (lower.includes("track") || lower.includes("order")) {
        reply = "You can inspect live real-time GPS courier tracking by visiting 'Order History' in My Account or clicking 'Track Order' in your confirmation email.";
      } else if (lower.includes("return") || lower.includes("refund")) {
        reply = "We offer effortless 30-day returns with complimentary DHL pickup. Head over to our Returns & Refunds portal to schedule a courier pickup.";
      } else if (lower.includes("dac") || lower.includes("lossless") || lower.includes("sound")) {
        reply = "Aurelian Studio Max features 40mm titanium transducers and supports up to 24-bit/96kHz lossless audio over direct USB-C connection.";
      }

      setChatMessages([...nextMessages, { sender: "bot" as const, text: reply }]);
    }, 600);
  };

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
          Concierge Support & Knowledgebase
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          How can our hardware studio assist you?
        </h1>
        <p className="text-xs text-neutral-500">
          Instant answers to technical specifications, delivery dispatch, return pickups, and warranty coverage.
        </p>

        {/* Search Input */}
        <div className="pt-4 max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search FAQs, returns, warranty, lossless audio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-full bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-xs text-neutral-900 dark:text-white shadow-xs focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setChatOpen(true)}
          className="p-5 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-xs hover:shadow-md transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
            Live Chat Concierge
          </h3>
          <p className="text-xs text-neutral-500">
            Chat in real time with our automated concierge assistant.
          </p>
        </button>

        <Link
          href="/returns"
          className="p-5 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-xs hover:shadow-md transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
            Returns & Refunds
          </h3>
          <p className="text-xs text-neutral-500">
            Schedule a complimentary courier pickup or check refund progress.
          </p>
        </Link>

        <button
          onClick={() => setReportOpen(true)}
          className="p-5 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-xs hover:shadow-md transition-all text-left space-y-2 group"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
            Report a Problem
          </h3>
          <p className="text-xs text-neutral-500">
            Flag hardware issues, defective packaging, or courier delays.
          </p>
        </button>
      </div>

      {/* Accordion FAQs */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-neutral-900 dark:text-white">
          Frequently Answered Questions
        </h2>

        <div className="divide-y divide-black/5 dark:divide-white/5">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = expandedIndex === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  onClick={() => setExpandedIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-semibold text-neutral-900 dark:text-white hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed pl-1">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Concierge Form */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-neutral-100 dark:bg-neutral-900/50 border border-black/5 dark:border-white/5 space-y-6">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Contact Hardware Support Concierge
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Prefer direct email? Our engineering concierge replies within 2 hours.
          </p>
        </div>

        {contactSent ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Thank you {contactName || "Customer"}. Your message has been routed to our concierge team.</span>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Avishkar Patel"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@apple.design"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full h-10 px-4 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                How can we help? *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe your inquiry or order details..."
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message to Concierge</span>
            </button>
          </form>
        )}
      </div>

      {/* Report a Problem Modal */}
      <Modal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Report an Issue or Defect"
        description="Notify our quality control engineers of damaged items or delayed logistics."
        maxWidth="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setReportOpen(false);
            success("Incident reported to Aurelian Quality Assurance. Priority ticket assigned.");
          }}
          className="space-y-4 pt-2 text-xs"
        >
          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Issue Category
            </label>
            <select className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none">
              <option>Defective Transducer / Sound Distortion</option>
              <option>Damaged Packaging upon Courier Delivery</option>
              <option>Missing Cable / Accessory</option>
              <option>Courier Tracking Not Updating</option>
              <option>Billing or Payment Discrepancy</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Order ID or Serial Number (Optional)
            </label>
            <input
              type="text"
              placeholder="#AUR-94821"
              className="w-full h-10 px-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Detailed Description
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explain the symptom or issue observed..."
              className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md transition-colors"
          >
            Submit Incident Report
          </button>
        </form>
      </Modal>

      {/* Floating Simulated Live Chat Widget */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-[28px] bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col h-[480px]">
          {/* Chat Header */}
          <div className="p-4 bg-neutral-900 text-white flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div>
                <h3 className="font-bold text-xs">Aurelian Concierge</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Now
                </span>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-1 rounded-full text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800/50 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask about orders, tracking, specs..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 h-9 px-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 h-9 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
