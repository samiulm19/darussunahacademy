import React, { useState } from 'react';
import { BookOpen, HeartHandshake, Compass, ArrowUpRight, Check, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AcademicProgram } from '../../types';

interface EducationPathwaysProps {
  onOpenAdmissionModal: () => void;
}

export const EducationPathways: React.FC<EducationPathwaysProps> = ({ onOpenAdmissionModal }) => {
  const { programs } = useApp();
  const [selectedProgram, setSelectedProgram] = useState<AcademicProgram | null>(null);

  const getProgramIcon = (type: string) => {
    switch (type) {
      case 'quran':
        return <BookOpen className="w-6 h-6 text-[#984710]" />;
      case 'islamic_studies':
        return <HeartHandshake className="w-6 h-6 text-[#984710]" />;
      default:
        return <Compass className="w-6 h-6 text-[#984710]" />;
    }
  };

  return (
    <section id="programs" className="py-14 sm:py-20 bg-[#F4ECDD] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#984710] bg-[#FFFBF3] border border-[#E9D4B3] px-3 py-0.5 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#984710]" />
            <span>আমাদের শিক্ষাধারা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2E2017] tracking-tight">
            তিনটি সমন্বিত শিক্ষা ধারায় আলোকিত ভবিষ্যৎ
          </h2>
          <p className="text-sm sm:text-base text-[#2E2017]/80 mt-2">
            পবিত্র কুরআনের আলোকবর্তিকা এবং আধুনিক জ্ঞানচর্চার মেলবন্ধনে দারুস সুন্নাহ একাডেমির বিশেষায়িত কারিকুলাম।
          </p>
        </div>

        {/* 3 Numbered Cards matching reference screenshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {programs.map((program, idx) => (
            <div
              key={program.id}
              className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-6 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group hover:border-[#984710]/40"
            >
              {/* Card Numbering & Icon */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FCF8EF] border border-[#E9D4B3] flex items-center justify-center">
                    {getProgramIcon(program.type)}
                  </div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#E9D4B3] group-hover:text-[#984710]/30 transition-colors">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#984710]">
                    {program.nameEn}
                  </span>
                  <h3 className="text-xl font-bold text-[#2E2017] leading-snug">
                    {program.nameBn}
                  </h3>
                  <p className="text-xs font-medium text-[#2E2017]/70 italic">
                    "{program.tagline}"
                  </p>
                </div>

                <p className="text-sm text-[#2E2017]/85 mt-4 leading-relaxed line-clamp-3">
                  {program.description}
                </p>

                {/* Levels checklist */}
                <div className="mt-5 space-y-2 border-t border-[#E9D4B3]/60 pt-4">
                  <p className="text-xs font-bold text-[#2E2017]">স্তরসমূহ ও ধাপ:</p>
                  <ul className="space-y-1.5">
                    {program.levels.slice(0, 3).map((level, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-[#2E2017]/85">
                        <Check className="w-3.5 h-3.5 text-[#984710] shrink-0" />
                        <span>{level}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-6 pt-4 border-t border-[#E9D4B3]/60 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedProgram(program)}
                  className="text-xs font-semibold text-[#2E2017] hover:text-[#984710] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>সিলেবাস ও বিবরণ</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onOpenAdmissionModal}
                  className="px-4 py-1.5 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>আবেদন করুন</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProgram(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#2E2017] hover:bg-[#E9D4B3] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FCF8EF] border border-[#E9D4B3] flex items-center justify-center">
                {getProgramIcon(selectedProgram.type)}
              </div>
              <div>
                <span className="text-xs font-medium text-[#984710]">{selectedProgram.nameEn}</span>
                <h3 className="text-xl font-bold text-[#2E2017]">{selectedProgram.nameBn}</h3>
              </div>
            </div>

            <p className="text-sm text-[#2E2017]/90 leading-relaxed mb-6">
              {selectedProgram.description}
            </p>

            <div className="space-y-4 text-xs text-[#2E2017]">
              <div className="bg-[#FCF8EF] p-4 rounded-xl border border-[#E9D4B3]">
                <h4 className="font-bold text-[#984710] mb-2 text-sm">পাঠ্যক্রম ও পাঠদান পদ্ধতি:</h4>
                <p className="leading-relaxed">{selectedProgram.curriculumSummary}</p>
              </div>

              <div className="bg-[#FCF8EF] p-4 rounded-xl border border-[#E9D4B3]">
                <h4 className="font-bold text-[#984710] mb-2 text-sm">ভর্তির যোগ্যতা ও শর্তাবলী:</h4>
                <p className="leading-relaxed">{selectedProgram.eligibility}</p>
              </div>

              <div>
                <h4 className="font-bold text-[#2E2017] mb-2 text-sm">অন্তর্ভুক্ত স্তর ও ধাপসমূহ:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProgram.levels.map((lvl, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 p-2 rounded-lg bg-white border border-[#E9D4B3]">
                      <Check className="w-3.5 h-3.5 text-[#984710]" />
                      <span className="font-medium">{lvl}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E9D4B3] flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 border border-[#2E2017]/30 text-[#2E2017] text-xs font-medium rounded-full"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => {
                  setSelectedProgram(null);
                  onOpenAdmissionModal();
                }}
                className="px-5 py-2 bg-[#984710] text-white text-xs font-semibold rounded-full hover:bg-[#7e3a0c]"
              >
                এই ধারায় ভর্তি আবেদন করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
