"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  RefreshCcw,
  Home,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("PlanWAB Critical Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-6xl bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-2xl p-8 sm:p-12 grid lg:grid-cols-2 gap-12 items-center"
      >
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-rose-100 text-rose-500 mx-auto lg:mx-0">
            <ShieldAlert size={36} strokeWidth={1.5} />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              Oops! Something went wrong at PlanWAB.
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              We faced a temporary issue while loading your event planning
              experience. Our team has been notified and is working to restore
              everything quickly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-indigo-600 transition-all"
            >
              <RefreshCcw size={16} />
              Try Again
            </button>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 bg-white text-slate-800 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-all"
            >
              <Home size={16} />
              Go to Homepage
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Quick Help
            </h3>

            <Link
              href="/status"
              className="group flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-400 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-100 text-amber-500">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">
                    System Status
                  </p>
                  <p className="text-xs text-slate-500">
                    Check if there’s a temporary outage
                  </p>
                </div>
              </div>
              <ArrowRight
                size={16}
                className="text-slate-400 group-hover:translate-x-1 transition-all"
              />
            </Link>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-indigo-300 mb-1">
                Priority Support
              </p>
              <p className="font-semibold text-sm">
                Need urgent assistance?
              </p>
            </div>
            <span className="font-bold text-sm">support@planwab.com</span>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-6 text-center w-full text-[10px] text-slate-400 font-medium tracking-widest">
        Error Ref: {error?.digest || "PLW_SYSTEM_EXCEPTION"}
      </div>
    </div>
  );
}
