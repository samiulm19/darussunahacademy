import React, { useState } from 'react';
import { FileText, ClipboardCheck, Award, CreditCard, ChevronDown, Download, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdmissionStepsSectionProps {
  onOpenAdmissionModal: () => void;
  onOpenProspectusModal: () => void;
}

export const AdmissionStepsSection: React.FC<AdmissionStepsSectionProps> = ({
  onOpenAdmissionModal,
  onOpenProspectusModal,
}) => {
  const { settings } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      num: '০১',
      title: 'আবেদন ফরম পূরণ',
      desc: 'অনলাইনে মাত্র ৫ মিনিটে অথবা একাডেমি অফিস থেকে ফরম সংগ্রহ করে প্রয়োজনীয় তথ্যসহ জমা দিন।',
      icon: <FileText className="w-5 h-5 text-[#984710]" />,
    },
    {
      num: '০২',
      title: 'মৌখিক মূল্যায়ন ও ভাইভা',
      desc: 'শিক্ষার্থীর মেধা ও আগ্রহ যাচাইয়ের জন্য সহজ ও স্নেহপূর্ণ পরিবেশে মৌখিক মূল্যায়ন অনুষ্ঠিত হয়।',
      icon: <ClipboardCheck className="w-5 h-5 text-[#984710]" />,
    },
    {
      num: '০৩',
      title: 'ফলাফল ও অনুমোদন',
      desc: 'অনলাইন পোর্টালে ফলাফল প্রকাশ এবং অভিভাবকের মোবাইল ফোনে এসএমএসের মাধ্যমে ফলাফল নিশ্চিতকরণ।',
      icon: <Award className="w-5 h-5 text-[#984710]" />,
    },
    {
      num: '০৪',
      title: 'ভর্তি ও আইডি কার্ড প্রদান',
      desc: 'ভর্তি ফি পরিশোধ সাপেক্ষে স্থায়ী শিক্ষার্থী আইডি, বই-খাতা ও ইউনিফর্ম গ্রহণের মাধ্যমে ভর্তি সম্পন্ন।',
      icon: <CreditCard className="w-5 h-5 text-[#984710]" />,
    },
  ];

  const faqs = [
    {
      q: 'তাহফিজুল কুরআন বিভাগে ভর্তির নূন্যতম বয়স কত?',
      a: 'তাহফিজুল কুরআন বিভাগে ৬ বছর থেকে ১২ বছর বয়স পর্যন্ত শিক্ষার্থী ভর্তি করানো হয়। তবে নূরানী শিশু শ্রেণিতে ৪ বছর বয়স থেকেই আবেদন করা যায়।',
    },
    {
      q: 'ভর্তির সময় কী কী কাগজপত্র জমা দিতে হবে?',
      a: 'শিক্ষার্থীর অনলাইন জন্মনিবন্ধন সনদের ফটোকপি, অভিভাবকের জাতীয় পরিচয়পত্রের (NID) কপি, পাসপোর্ট সাইজের ৪ কপি ছবি এবং পূর্ববর্তী প্রতিষ্ঠানের ছাড়পত্র (যদি থাকে)।',
    },
    {
      q: 'মেধাবী ও অসচ্ছল শিক্ষার্থীদের জন্য বৃত্তির কোনো ব্যবস্থা আছে কি?',
      a: 'হ্যাঁ, দারুস সুন্নাহ একাডেমি ওয়েলফেয়ার ট্রাস্টের মাধ্যমে এতিম, দরিদ্র ও প্রতিভাবান হাফেজদের জন্য ২৫% থেকে ১০০% পর্যন্ত শিক্ষা উপবৃত্তি ও ফি মওকুফের ব্যবস্থা রয়েছে।',
    },
    {
      q: 'হোস্টেল বা আবাসিক শিক্ষার্থীদের অভিভাবকরা কখন দেখা করতে পারবেন?',
      a: 'প্রতি মাসের ২য় ও ৪র্থ শুক্রবার সকাল ৯:০০ টা থেকে বিকাল ৫:০০ টা পর্যন্ত অভিভাবক সাক্ষাতের নির্ধারিত সময়। জরুরি প্রয়োজনে সুপারের সাথে যোগাযোগ করা যাবে।',
    },
  ];

  return (
    <section id="admission" className="py-16 sm:py-20 bg-[#FCF8EF] border-y border-[#E9D4B3]/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#984710] bg-[#FFFBF3] border border-[#E9D4B3] px-3 py-0.5 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#984710]" />
            <span>ভর্তি প্রক্রিয়া ও নির্দেশিকা</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2E2017] tracking-tight">
            সহজ ৪টি ধাপে সম্পন্ন করুন আপনার সন্তানের ভর্তি
          </h2>
          <p className="text-sm sm:text-base text-[#2E2017]/80 mt-2">
            ২০২৬ শিক্ষাবর্ষের ভর্তি কার্যক্রম এখন উন্মুক্ত। ঘরে বসেই আবেদন জমা দিন।
          </p>
        </div>

        {/* 4 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs relative hover:border-[#984710] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#F4ECDD] flex items-center justify-center border border-[#E9D4B3]">
                  {step.icon}
                </div>
                <span className="text-xl font-extrabold text-[#E9D4B3] tabular-nums">
                  {step.num}
                </span>
              </div>
              <h4 className="text-base font-bold text-[#2E2017] mb-1.5">{step.title}</h4>
              <p className="text-xs text-[#2E2017]/75 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Campaign Banner & FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Campaign Action Box - 5 cols */}
          <div className="lg:col-span-5 bg-[#2E2017] text-[#FFFBF3] rounded-2xl p-6 sm:p-7 border border-[#534231] shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-[#534231] pb-3">
              <span className="text-xs font-semibold text-[#E9D4B3]">ভর্তি বিজ্ঞপ্তি ২০২৬</span>
              <span className="text-[11px] bg-[#984710] px-2.5 py-0.5 rounded-full text-white font-medium">
                আবেদন চলছে
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                অনলাইন ভর্তি আবেদন ও প্রসপেক্টাস
              </h3>
              <p className="text-xs text-[#E9D4B3]/90 leading-relaxed">
                আবেদনের শেষ তারিখ: <span className="font-bold text-white">{settings.admissionDeadline}</span>। প্রতিটি শ্রেণিতে আসন সংখ্যা কঠোরভাবে সীমাবদ্ধ।
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={onOpenAdmissionModal}
                className="w-full py-3 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>অনলাইনে ভর্তি আবেদন ফরম পূরণ করুন</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenProspectusModal}
                className="w-full py-2.5 bg-[#3B2B20] hover:bg-[#4a3629] text-[#FFFBF3] border border-[#534231] font-medium rounded-full text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#E9D4B3]" />
                <span>একাডেমিক প্রসপেক্টাস ডাউনলোড (PDF)</span>
              </button>
            </div>

            <div className="bg-[#231710] p-3 rounded-xl border border-[#534231] text-[11px] text-[#E9D4B3]/80 space-y-1">
              <p className="font-semibold text-white">জরুরি ভর্তি হেল্পলাইন:</p>
              <p className="tabular-nums text-white">{settings.phone1} / {settings.phone2}</p>
              <p className="text-[10px] text-[#E9D4B3]/70">সকাল ৮:০০ হতে বিকাল ৪:৩০ পর্যন্ত খোলা</p>
            </div>
          </div>

          {/* FAQ Accordion - 7 cols */}
          <div className="lg:col-span-7 bg-[#FFFBF3] rounded-2xl p-6 sm:p-7 border border-[#E9D4B3] shadow-xs">
            <h3 className="text-lg font-bold text-[#2E2017] mb-4 pb-2 border-b border-[#E9D4B3]">
              ভর্তি সংক্রান্ত সাধারণ প্রশ্নোত্তর (FAQ)
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-[#E9D4B3] rounded-xl overflow-hidden bg-[#FCF8EF]/60 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-3.5 text-left font-bold text-xs sm:text-sm text-[#2E2017] flex items-center justify-between gap-3 cursor-pointer hover:text-[#984710]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 text-[#984710] transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-3.5 pb-3.5 text-xs text-[#2E2017]/85 leading-relaxed border-t border-[#E9D4B3]/50 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
