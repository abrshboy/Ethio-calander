/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { Calendar, ArrowRightLeft, Info, ChevronDown, RefreshCw, Clock } from "lucide-react";
import { format } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  toEthiopianDate, 
  formatEthiopianDate, 
  formatEthiopianDateEn,
  type EthiopianDate 
} from "./utils/ethiopianCalendar.ts";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [ethDate, setEthDate] = useState<EthiopianDate>(toEthiopianDate(new Date()));
  const [todayEthDate, setTodayEthDate] = useState<EthiopianDate>(toEthiopianDate(new Date()));
  const [isToday, setIsToday] = useState(true);
  const converterRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  useEffect(() => {
    setEthDate(toEthiopianDate(selectedDate));
    const today = new Date();
    setIsToday(
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setSelectedDate(date);
    }
  };

  const setToday = () => {
    setSelectedDate(new Date());
  };

  const scrollToConverter = () => {
    converterRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111111] font-sans selection:bg-black selection:text-white">
      {/* 1. HERO SECTION: TODAY'S DATE */}
      <motion.section 
        style={{ opacity, scale }}
        className="h-[90vh] flex flex-col items-center justify-center px-6 relative overflow-hidden"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8 max-w-md w-full"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
            <Clock className="w-3 h-3" />
            Today in Ethiopia
          </div>

          <div className="space-y-4">
            <h1 className="text-7xl md:text-8xl font-display font-black tracking-tighter leading-none">
              {todayEthDate.day}
            </h1>
            <div className="text-3xl md:text-4xl font-display font-medium text-black/80">
              {todayEthDate.monthNameAm}
            </div>
            <div className="text-xl md:text-2xl font-display font-light text-black/40">
              {todayEthDate.year}
            </div>
          </div>

          <div className="pt-8 flex flex-col items-center gap-4">
            <div className="text-sm font-medium text-black/40 italic">
              {formatEthiopianDateEn(todayEthDate)}
            </div>
            <div className="h-px w-12 bg-black/10" />
            <div className="text-xs font-bold uppercase tracking-widest text-black/20">
              {format(new Date(), "EEEE, MMMM do")}
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToConverter}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-black/30 hover:text-black transition-colors"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Converter</span>
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </motion.section>

      {/* 2. CONVERTER SECTION */}
      <section 
        ref={converterRef}
        className="min-h-screen py-24 px-6 bg-white border-t border-black/5"
      >
        <div className="max-w-xl mx-auto space-y-16">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-display font-bold tracking-tight">Date Converter</h2>
            <p className="text-black/50 leading-relaxed">
              Convert any Gregorian date to the Ethiopian calendar instantly.
            </p>
          </div>

          {/* Input Card */}
          <div className="bg-[#F5F5F5] rounded-[40px] p-8 md:p-12 space-y-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30 ml-2">
                  Gregorian Input
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={format(selectedDate, "yyyy-MM-dd")}
                    onChange={handleDateChange}
                    className="w-full bg-white border-none rounded-3xl px-8 py-6 text-2xl font-display font-bold focus:ring-4 focus:ring-black/5 transition-all outline-none shadow-sm"
                  />
                  <Calendar className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-black/10 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={setToday}
                disabled={isToday}
                className={cn(
                  "w-full py-6 rounded-3xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                  isToday 
                    ? "bg-black/5 text-black/20 cursor-not-allowed" 
                    : "bg-black text-white hover:bg-black/80 active:scale-[0.98] shadow-xl shadow-black/10"
                )}
              >
                <RefreshCw className={cn("w-4 h-4", !isToday && "animate-spin-slow")} />
                Reset to Today
              </button>
            </div>

            <div className="h-px bg-black/5" />

            {/* Result Area */}
            <div className="space-y-8">
              <div className="flex items-center gap-2 text-black/30">
                <ArrowRightLeft className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Ethiopian Equivalent</span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={formatEthiopianDate(ethDate)}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <div className="text-5xl font-display font-black tracking-tighter">
                      {formatEthiopianDate(ethDate)}
                    </div>
                    <div className="text-xl font-medium text-black/40 italic">
                      {formatEthiopianDateEn(ethDate)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Day", value: ethDate.day },
                      { label: "Month", value: ethDate.month },
                      { label: "Year", value: ethDate.year }
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-black/5">
                        <div className="text-[9px] font-black uppercase tracking-widest text-black/20 mb-1">{stat.label}</div>
                        <div className="text-xl font-display font-bold">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-black text-white rounded-[40px] p-10 space-y-6 shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold">The 13th Month</h3>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Ethiopia follows a unique calendar system. It has 12 months of 30 days each, 
              plus a 13th month called <span className="text-white font-bold italic">Pagume</span> which has 5 days (6 in leap years). 
              This is why Ethiopia is often called the land of "13 Months of Sunshine".
            </p>
          </div>

          {/* Footer */}
          <footer className="pt-12 flex flex-col items-center gap-8 text-black/20 text-[10px] font-bold uppercase tracking-[0.2em]">
            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-black transition-colors">Github</a>
              <div className="w-1 h-1 rounded-full bg-black/10" />
              <a href="#" className="hover:text-black transition-colors">Privacy</a>
              <div className="w-1 h-1 rounded-full bg-black/10" />
              <a href="#" className="hover:text-black transition-colors">Terms</a>
            </div>
            <p>© {new Date().getFullYear()} EthioCal Studio</p>
          </footer>
        </div>
      </section>
    </div>
  );
}
