import React from 'react';
import { Award, BookOpen, Users, GraduationCap, Clock } from 'lucide-react';

export const StatisticsBand: React.FC = () => {
  const stats = [
    {
      icon: <Award className="w-6 h-6 text-[#E9D4B3]" />,
      value: '৯৮.৬%',
      label: 'বোর্ড ও বেফাক পাশের হার',
      subtext: 'ধারাবাহিক শ্রেষ্ঠত্ব ও এ+ অর্জন',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#E9D4B3]" />,
      value: '১৮০+',
      label: 'হাফেজে কুরআন তৈরি',
      subtext: 'আন্তর্জাতিক হিফজ সনদপ্রাপ্ত',
    },
    {
      icon: <Users className="w-6 h-6 text-[#E9D4B3]" />,
      value: '১,২৫০+',
      label: 'বর্তমান শিক্ষার্থী',
      subtext: 'শিশু শ্রেণি থেকে দাখিল পর্যন্ত',
    },
    {
      icon: <GraduationCap className="w-6 h-6 text-[#E9D4B3]" />,
      value: '৬৫+',
      label: 'দক্ষ মুহাদ্দিস ও শিক্ষক',
      subtext: 'দেওবন্দ, মদিনা ও ঢাবি গ্র্যাজুয়েট',
    },
    {
      icon: <Clock className="w-6 h-6 text-[#E9D4B3]" />,
      value: '১৫ : ১',
      label: 'শিক্ষক-শিক্ষার্থী অনুপাত',
      subtext: 'প্রতিটি শিক্ষার্থীর নিবিড় যত্ন',
    },
  ];

  return (
    <section className="bg-[#2E2017] text-[#FFFBF3] py-12 sm:py-16 border-y border-[#534231] relative overflow-hidden">
      {/* Subtle geometric pattern aura */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#E9D4B3_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-xs font-semibold tracking-wider text-[#E9D4B3] uppercase">
            যাচাইকৃত পরিসংখ্যান ও অর্জন
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            পরিসংখ্যানে দারুস সুন্নাহ একাডেমির অগ্রযাত্রা
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#534231]">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`pt-4 md:pt-0 ${idx > 0 ? 'md:px-4' : 'md:pr-4'} text-center space-y-1.5`}
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-[#534231]/40 border border-[#534231] flex items-center justify-center mb-2">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#E9D4B3] tracking-tight tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white">
                {stat.label}
              </div>
              <div className="text-[11px] text-[#E9D4B3]/70 font-normal">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
