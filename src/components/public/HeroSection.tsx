import React from 'react';
import { ArrowUpRight, Download, CheckCircle2, BookOpen, ShieldCheck, Sparkles, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeroSectionProps {
  onOpenAdmissionModal: () => void;
  onOpenProspectusModal: () => void;
  onOpenStatusModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenAdmissionModal,
  onOpenProspectusModal,
  onOpenStatusModal,
}) => {
  const { settings } = useApp();

  return (
    <section className="relative overflow-hidden bg-[#F4ECDD] pt-8 pb-14 sm:pt-12 sm:pb-20 border-b border-[#E9D4B3]/70">
      {/* Subtle arabesque watermark or background aura */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#E9D4B3]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#984710]/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column (Content & Actions) - 7 cols */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Dot-led kicker badge (Anti-pill text with separator) */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#984710] bg-[#FFFBF3] border border-[#E9D4B3] px-3 py-1 rounded-full shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#984710] animate-pulse" />
              <span>ভর্তি সেশন {settings.activeSessionYear}</span>
              <span className="text-[#534231] font-normal">·</span>
              <span className="text-[#2E2017]">সীমিত আসনে আবেদন চলছে</span>
            </div>

            {/* Bold Two-Tone Bengali Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#2E2017] tracking-tight leading-[1.25] text-balance">
              {settings.heroHeadline}{' '}
              <span className="text-[#984710] relative whitespace-nowrap">
                {settings.heroHighlight}
                <svg
                  className="absolute left-0 -bottom-1 w-full h-2 text-[#E9D4B3]"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 15 Q 50 0, 100 15" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
            </h1>

            {/* Subtitle description */}
            <p className="text-base sm:text-lg text-[#2E2017]/85 leading-relaxed max-w-xl">
              {settings.heroSubtitle}
            </p>

            {/* Action Buttons: Pill buttons with diagonal arrow for links */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onOpenAdmissionModal}
                className="flex items-center gap-2 px-6 py-3 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group text-sm sm:text-base"
              >
                <span>ভর্তি আবেদন করুন</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                onClick={onOpenProspectusModal}
                className="flex items-center gap-2 px-5 py-3 bg-[#FFFBF3] hover:bg-[#FCF8EF] border border-[#2E2017]/30 text-[#2E2017] font-semibold rounded-full shadow-xs hover:border-[#2E2017] transition-all duration-200 cursor-pointer text-sm sm:text-base"
              >
                <Download className="w-4 h-4 text-[#984710]" />
                <span>পরিচিতি ডাউনলোড (PDF)</span>
              </button>

              <button
                onClick={onOpenStatusModal}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#534231] hover:text-[#984710] px-3 py-2 cursor-pointer transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>আবেদন স্ট্যাটাস দেখুন</span>
              </button>
            </div>

            {/* Feature Highlights Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E9D4B3]/80">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#984710] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#2E2017]">আন্তর্জাতিক মান</h4>
                  <p className="text-[11px] text-[#2E2017]/70">সহীহ তাজবীদ ও হিফজ</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#984710] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#2E2017]">সুন্নাহ তারবিয়াহ</h4>
                  <p className="text-[11px] text-[#2E2017]/70">ব্যবহারিক আমল ও শিষ্টাচার</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-[#984710] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#2E2017]">আধুনিক পাঠ্যক্রম</h4>
                  <p className="text-[11px] text-[#2E2017]/70">ইংরেজি, গণিত ও আইসিটি</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Asymmetric Three-Photo Collage) - 5 cols */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Photo 1: Main Campus Architecture (Wide Top Card) */}
              <div className="rounded-2xl overflow-hidden border-2 border-[#E9D4B3] shadow-md bg-[#FFFBF3] transition-transform duration-300 hover:scale-[1.01]">
                <img
                  src={settings.heroImage1}
                  alt="দারুস সুন্নাহ একাডেমি ক্যাম্পাস"
                  referrerPolicy="no-referrer"
                  className="w-full h-52 sm:h-60 object-cover"
                />
                <div className="p-2.5 bg-[#FFFBF3] flex items-center justify-between text-xs text-[#2E2017]">
                  <span className="font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#984710]" />
                    শান্ত ও মনোরম একাডেমি ক্যাম্পাস
                  </span>
                  <span className="text-[#984710] text-[11px] font-medium">মিরপুর-১৪, ঢাকা</span>
                </div>
              </div>

              {/* Asymmetric Overlapping Sub-Grid */}
              <div className="grid grid-cols-2 gap-3.5 mt-3.5">
                {/* Photo 2: Students studying Quran */}
                <div className="rounded-xl overflow-hidden border-2 border-[#E9D4B3] shadow-sm bg-[#FFFBF3] -rotate-1 hover:rotate-0 transition-transform">
                  <img
                    src={settings.heroImage2}
                    alt="তাহফিজুল কুরআন ক্লাসরুম"
                    referrerPolicy="no-referrer"
                    className="w-full h-32 sm:h-36 object-cover"
                  />
                  <div className="p-2 bg-[#FFFBF3]">
                    <p className="text-[11px] font-bold text-[#2E2017] leading-tight">
                      তাহফিজুল কুরআন শাখা
                    </p>
                    <p className="text-[10px] text-[#2E2017]/70">তাজবীদ ও তারতীল চর্চা</p>
                  </div>
                </div>

                {/* Photo 3: Integrated Classroom */}
                <div className="rounded-xl overflow-hidden border-2 border-[#E9D4B3] shadow-sm bg-[#FFFBF3] rotate-1 hover:rotate-0 transition-transform">
                  <img
                    src={settings.heroImage3}
                    alt="সমন্বিত জ্ঞানচর্চা ক্লাসরুম"
                    referrerPolicy="no-referrer"
                    className="w-full h-32 sm:h-36 object-cover"
                  />
                  <div className="p-2 bg-[#FFFBF3]">
                    <p className="text-[11px] font-bold text-[#2E2017] leading-tight">
                      বিজ্ঞান ও গণিত ল্যাব
                    </p>
                    <p className="text-[10px] text-[#2E2017]/70">আধুনিক প্রযুক্তি পাঠ</p>
                  </div>
                </div>
              </div>

              {/* Floating Verified Achievement Tag */}
              <div className="absolute -bottom-4 -left-4 sm:left-4 bg-[#2E2017] text-[#FFFBF3] border border-[#E9D4B3] px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#984710] flex items-center justify-center text-white font-bold text-xs">
                  ★
                </div>
                <div>
                  <p className="text-xs font-bold leading-none text-[#FFFBF3]">১৮০+ হাফেজে কুরআন</p>
                  <p className="text-[10px] text-[#E9D4B3] leading-tight mt-0.5">১০০% বেফাক ও বোর্ড সাফল্য</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
