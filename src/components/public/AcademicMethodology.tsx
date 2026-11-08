import React, { useState } from 'react';
import { BookMarked, Sparkles, HeartHandshake, Shield, CheckCircle2, ChevronRight } from 'lucide-react';

export const AcademicMethodology: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quran' | 'tarbiyah' | 'modern' | 'residential'>('quran');

  const tabs = [
    {
      id: 'quran' as const,
      title: 'তাহফিজ পদ্ধতি',
      subtitle: 'সবক, সবকি ও মনজিল',
      icon: <BookMarked className="w-4 h-4" />,
    },
    {
      id: 'tarbiyah' as const,
      title: 'দ্বীনি তারবিয়াহ',
      subtitle: 'আমল ও চরিত্র গঠন',
      icon: <HeartHandshake className="w-4 h-4" />,
    },
    {
      id: 'modern' as const,
      title: 'সমন্বিত কারিকুলাম',
      subtitle: 'বিজ্ঞান, গণিত ও ইংরেজি',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'residential' as const,
      title: 'আবাসিক পরিবেশ',
      subtitle: 'হোস্টেল ও যত্নশীল তত্ত্বাবধান',
      icon: <Shield className="w-4 h-4" />,
    },
  ];

  return (
    <section id="methodology" className="py-16 sm:py-20 bg-[#F4ECDD] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#984710] bg-[#FFFBF3] border border-[#E9D4B3] px-3 py-0.5 rounded-full mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#984710]" />
            <span>একাডেমিক পদ্ধতি ও বিশেষত্ব</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2E2017] tracking-tight">
            যুগোপযোগী পাঠদান ও নিবিড় তারবিয়াহ কাঠামো
          </h2>
          <p className="text-sm sm:text-base text-[#2E2017]/80 mt-2">
            কেবল মুখস্থবিদ্যা নয়, বরং প্রতিটি বিষয়ের প্রায়োগিক বোধ এবং চারিত্রিক উৎকর্ষ সাধনে আমাদের স্বতন্ত্র পরিকল্পনা।
          </p>
        </div>

        {/* Dark Tabbed Panel (#2E2017) inside Cream section */}
        <div className="bg-[#2E2017] rounded-3xl border border-[#534231] shadow-xl overflow-hidden">
          {/* Tab Controls Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-[#534231] bg-[#231710]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-4 text-left transition-all duration-200 border-b-2 cursor-pointer flex items-center gap-3 ${
                  activeTab === tab.id
                    ? 'border-[#984710] bg-[#2E2017] text-white shadow-inner'
                    : 'border-transparent text-[#E9D4B3]/70 hover:text-white hover:bg-[#2E2017]/50'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    activeTab === tab.id ? 'bg-[#984710] text-white' : 'bg-[#534231]/50 text-[#E9D4B3]'
                  }`}
                >
                  {tab.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-tight">{tab.title}</h4>
                  <p className="text-[11px] text-[#E9D4B3]/70 leading-tight mt-0.5">{tab.subtitle}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Active Tab Content Area */}
          <div className="p-6 sm:p-10 text-[#FFFBF3]">
            {activeTab === 'quran' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-block text-xs font-semibold text-[#E9D4B3] border border-[#534231] px-2.5 py-0.5 rounded-full">
                    কুরআন ও হিফজ পাঠক্রম
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    আন্তর্জাতিক মানের তাহফিজ ও তারতীল শিক্ষা
                  </h3>
                  <p className="text-sm text-[#E9D4B3]/90 leading-relaxed">
                    সহীহ তাজবীদ, মাখরাজ ও সিফাত নির্ভুল রেখে হিফজের ৩টি মূল স্তর পরিচালনা করা হয়:
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="bg-[#3B2B20] p-3.5 rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-sm flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#984710] text-white text-xs flex items-center justify-center">১</span>
                        সবক (নতুন পাঠ):
                      </h5>
                      <p className="text-xs text-[#E9D4B3]/80 mt-1 pl-7">
                        প্রতিদিন নির্দিষ্ট পরিমাণ নতুন আয়াত বা পৃষ্ঠা উস্তাদের সামনে তাজবীদ সহকারে তিলাওয়াত ও মুখস্থ প্রদান।
                      </p>
                    </div>

                    <div className="bg-[#3B2B20] p-3.5 rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-sm flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#984710] text-white text-xs flex items-center justify-center">২</span>
                        সবকি (সাম্প্রতিক পাঠের পুনরাবৃত্তি):
                      </h5>
                      <p className="text-xs text-[#E9D4B3]/80 mt-1 pl-7">
                        চলমান পারার পূর্বের পৃষ্ঠাসমূহ নিয়মিত শোনানো যাতে নতুন পাঠের সাথে সংযোগ মজবুত থাকে।
                      </p>
                    </div>

                    <div className="bg-[#3B2B20] p-3.5 rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-sm flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#984710] text-white text-xs flex items-center justify-center">৩</span>
                        মনজিল (পূর্ববর্তী সম্পূর্ণ পারাসমূহ রিভিশন):
                      </h5>
                      <p className="text-xs text-[#E9D4B3]/80 mt-1 pl-7">
                        হিফজ সম্পন্ন হওয়া পারাসমূহ দৈনিক চক্রাকারে ১-২ পারা উস্তাদকে মুখস্থ শোনানো।
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#231710] p-6 rounded-2xl border border-[#534231] space-y-4">
                  <h4 className="text-sm font-bold text-[#E9D4B3] border-b border-[#534231] pb-2">
                    হিফজ শাখার অনন্য বৈশিষ্ট্য
                  </h4>
                  <ul className="space-y-2.5 text-xs text-[#FFFBF3]/90">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#984710] shrink-0 mt-0.5" />
                      <span>আন্তর্জাতিক সনদধারী অভিজ্ঞ হাফেজ ও ক্বারীদের দ্বারা সরাসরি তালিম।</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#984710] shrink-0 mt-0.5" />
                      <span>প্রতি শিক্ষার্থীর জন্য দৈনিক সবক ডায়েরি ও অভিভাবক পোর্টাল ট্র্যাকিং।</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#984710] shrink-0 mt-0.5" />
                      <span>প্রতি তিন মাস অন্তর বিশেষ কিরাত ও হিফজ প্রতিযোগিতা আয়োজন।</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#984710] shrink-0 mt-0.5" />
                      <span>হিফজের পাশাপাশি বাংলা, ইংরেজি ও গণিত ক্লাসের সমান সুযোগ।</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'tarbiyah' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-block text-xs font-semibold text-[#E9D4B3] border border-[#534231] px-2.5 py-0.5 rounded-full">
                    আদর্শ চরিত্র গঠন
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    সুন্নাহভিত্তিক জীবন ও বাস্তবমুখী তারবিয়াহ
                  </h3>
                  <p className="text-sm text-[#E9D4B3]/90 leading-relaxed">
                    দারুস সুন্নাহ একাডেমিতে প্রতিটি শিক্ষার্থীকে নিছক পরীক্ষায় পাশের জন্য নয়, বরং দৈনন্দিন জীবনে রাসূলুল্লাহ (সা.)-এর সুন্নাত ও আদব অনুসরণের প্রশিক্ষণ দেওয়া হয়।
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-xs mb-1">পাঁচ ওয়াক্ত সালাত প্রশিক্ষণ</h5>
                      <p className="text-[11px] text-[#E9D4B3]/80">জামাতে নামাজ আদায়ের বাধ্যবাধকতা ও ইমামতি প্রশিক্ষণ।</p>
                    </div>
                    <div className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-xs mb-1">দৈনন্দিন মাসনুন দোয়া</h5>
                      <p className="text-[11px] text-[#E9D4B3]/80">খাবার, ঘুম, বাড়ি থেকে বের হওয়া ইত্যাদির সুন্নাত দোয়া মুখস্থ ও আমল।</p>
                    </div>
                    <div className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-xs mb-1">উত্তম আখলাক ও শিষ্টাচার</h5>
                      <p className="text-[11px] text-[#E9D4B3]/80">মাতা-পিতা ও শিক্ষকদের সম্মান, সহপাঠীদের প্রতি আন্তরিকতা।</p>
                    </div>
                    <div className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-xs mb-1">মাসিক তারবিয়াহ রিপোর্ট</h5>
                      <p className="text-[11px] text-[#E9D4B3]/80">প্রতিটি শিক্ষার্থীর আচরণ ও মানসিক বিকাশের ধারাবাহিক নোট।</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#3B2B20] p-6 rounded-2xl border border-[#534231] space-y-4">
                  <h4 className="text-sm font-bold text-[#E9D4B3] border-b border-[#534231] pb-2">
                    শিক্ষক-অভিভাবক যৌথ পার্টনারশিপ
                  </h4>
                  <p className="text-xs text-[#FFFBF3]/90 leading-relaxed">
                    সন্তানের দ্বীনি ও নৈতিক বিকাশে একাডেমি এবং ঘরের পরিবেশের সমন্বয় অপরিহার্য। নিয়মিত অভিভাবক মতবিনিময় সভার মাধ্যমে উভয়ের সমন্বিত চেষ্টায় সন্তানকে গড়ে তোলা হয়।
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'modern' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-block text-xs font-semibold text-[#E9D4B3] border border-[#534231] px-2.5 py-0.5 rounded-full">
                    এনসিটিবি অনুমোদিত সমন্বিত শিক্ষা
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    জাতীয় শিক্ষাক্রমের আধুনিক বিজ্ঞান ও গণিত
                  </h3>
                  <p className="text-sm text-[#E9D4B3]/90 leading-relaxed">
                    দ্বীনি শিক্ষার পাশাপাশি আধুনিক বিশ্বের প্রতিযোগিতায় টিকে থাকার জন্য জাতীয় শিক্ষাক্রমের শতভাগ পাঠ নিশ্চিত করা হয়।
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-xs mb-1">স্পোকেন ইংলিশ ও আরবি</h5>
                      <p className="text-[11px] text-[#E9D4B3]/80">ইংরেজি ও আরবি ভাষায় কার্যকর কথোপকথন চর্চা।</p>
                    </div>
                    <div className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-xs mb-1">গণিত ও বিজ্ঞান ল্যাব</h5>
                      <p className="text-[11px] text-[#E9D4B3]/80">ব্যবহারিক পরীক্ষা-নিরীক্ষা ও অলিম্পিয়াড প্রস্তুতি।</p>
                    </div>
                    <div className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-xs mb-1">কম্পিউটার ও আইসিটি শিক্ষা</h5>
                      <p className="text-[11px] text-[#E9D4B3]/80">মৌলিক তথ্যপ্রযুক্তি, টাইপিং ও কোডিং ফাউন্ডেশন।</p>
                    </div>
                    <div className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-xs mb-1">সুন্দর হস্তাক্ষর কর্মশালা</h5>
                      <p className="text-[11px] text-[#E9D4B3]/80">বাংলা, ইংরেজি ও আরবি ক্যালিগ্রাফি ও হস্তলিপি সুন্দরকরণ।</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#3B2B20] p-6 rounded-2xl border border-[#534231] space-y-4">
                  <h4 className="text-sm font-bold text-[#E9D4B3] border-b border-[#534231] pb-2">
                    ভবিষ্যৎ উচ্চশিক্ষার পথ সুগম
                  </h4>
                  <p className="text-xs text-[#FFFBF3]/90 leading-relaxed">
                    একাডেমির ছাত্ররা যাতে পরবর্তীতে ক্যাডেট কলেজ, সরকারি আলিয়া ও জেনারেল কলেজ বা বিশ্ববিদ্যালয় এবং দাওরায়ে হাদিস উভয় দিকেই সাবলীলভাবে অগ্রসর হতে পারে, সেভাবে তাদের পাঠপ্রক্রিয়া পরিচালিত হয়।
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'residential' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-block text-xs font-semibold text-[#E9D4B3] border border-[#534231] px-2.5 py-0.5 rounded-full">
                    নিরাপদ ও সুশৃঙ্খল পরিবেশ
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                    পরিকল্পিত আবাসিক ব্যবস্থাপনা ও সুষম খাদ্য
                  </h3>
                  <p className="text-sm text-[#E9D4B3]/90 leading-relaxed">
                    দূরদূরান্তের এবং নিবিড় তাহফিজুল কুরআন শিক্ষার্থীদের জন্য রয়েছে আধুনিক মানসম্পন্ন হোস্টেল ব্যবস্থা।
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-xs mb-1">২৪/৭ সিসিটিভি ও নিরাপত্তা</h5>
                      <p className="text-[11px] text-[#E9D4B3]/80">নিরাপদ ক্যাম্পাস ও সার্বক্ষণিক গার্ড পাহারা।</p>
                    </div>
                    <div className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-xs mb-1">পুষ্টিকর হালাল খাবার</h5>
                      <p className="text-[11px] text-[#E9D4B3]/80">অভিজ্ঞ শেফ দ্বারা সুষম খাদ্য তালিকা প্রস্তুত ও পরিবেশন।</p>
                    </div>
                    <div className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-xs mb-1">নিয়মিত চিকিৎসা সহায়তা</h5>
                      <p className="text-[11px] text-[#E9D4B3]/80">মাসিক স্বাস্থ্য পরীক্ষা ও তাৎক্ষণিক প্রাথমিক চিকিৎসা।</p>
                    </div>
                    <div className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231]">
                      <h5 className="font-bold text-white text-xs mb-1">হোস্টেল সুপারিনটেনডেন্ট</h5>
                      <p className="text-[11px] text-[#E9D4B3]/80">স্নেহশীল শিক্ষকের সার্বক্ষণিক নজরদারি।</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#3B2B20] p-6 rounded-2xl border border-[#534231] space-y-4">
                  <h4 className="text-sm font-bold text-[#E9D4B3] border-b border-[#534231] pb-2">
                    দৈনিক সুষম রুটিন
                  </h4>
                  <p className="text-xs text-[#FFFBF3]/90 leading-relaxed">
                    ভোর থেকে শুরু করে রাত ৯:৩০ পর্যন্ত তাহাজ্জুদ, ফজর, সকালের নাস্তা, সবক ক্লাস, খেলাধুলা, বিশ্রাম এবং রিভিশনের বৈজ্ঞানিক সময়সূচি মেনে পরিচালিত।
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
