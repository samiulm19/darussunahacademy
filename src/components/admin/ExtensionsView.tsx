import React, { useState } from 'react';
import {
  Sliders,
  Book,
  Package,
  Home,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ExtensionsView: React.FC = () => {
  const { settings, updateSettings } = useApp();

  // Daily Vocabulary & Hadith items
  const [hadithList, setHadithList] = useState([
    {
      id: 1,
      arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
      meaning: 'তোমাদের মধ্যে সর্বোত্তম সেই ব্যক্তি, যে নিজে কুরআন শিখে এবং অন্যকে শিক্ষা দেয়।',
      source: 'সহীহ বুখারী, হাদিস: ৫০২৭',
    },
    {
      id: 2,
      arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
      meaning: 'দ্বীনি জ্ঞান অর্জন করা প্রত্যেক মুসলিমের ওপর ফরজ বা আবশ্যক।',
      source: 'সুনানে ইবনে মাজাহ, হাদিস: ২২৪',
    },
  ]);

  const [booksList, setBooksList] = useState([
    { id: 'b1', title: 'সহীহ বুখারী শরীফ (১-১০ম খণ্ড)', author: 'ইমাম বুখারী (রহ.)', copies: 5, available: 4 },
    { id: 'b2', title: 'রিয়াদুস সালেহীন', author: 'ইমাম নববী (রহ.)', copies: 8, available: 7 },
    { id: 'b3', title: 'সীরাতুল মুস্তফা (সা.)', author: 'আল্লামা ইদরীস কান্ধলবী (রহ.)', copies: 4, available: 3 },
  ]);

  const [hostelRooms, setHostelRooms] = useState([
    { id: 'r1', roomNo: '৩০১ (উবাই ইবনে কাব হল)', totalBeds: 8, allocated: 7, superName: 'হাফেজ ক্বারী আব্দুর রহমান' },
    { id: 'r2', roomNo: '৩০২ (আব্দুল্লাহ ইবনে মাসউদ হল)', totalBeds: 8, allocated: 6, superName: 'মাওলানা মাহমুদ হাসান' },
  ]);

  const toggleModule = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            মডিউলার এক্সটেনশনস ও বিশেষায়িত সেবা
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            লাইব্রেরি, ইনভেন্টরি, আবাসিক হোস্টেল, প্রতিদিনের হাদিস ও এআই লার্নিং এসিস্ট্যান্ট
          </p>
        </div>
      </div>

      {/* 4 Feature Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Toggle 1: Library */}
        <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Book className="w-5 h-5 text-[#984710]" />
            <div>
              <h4 className="font-bold text-[#2E2017]">কুতুবখানা ও লাইব্রেরি</h4>
              <p className="text-[10px] text-[#534231]">বই ইস্যু ও ক্যাটালগ</p>
            </div>
          </div>
          <button
            onClick={() => toggleModule('libraryEnabled')}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              settings.libraryEnabled ? 'bg-[#984710]' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                settings.libraryEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Inventory */}
        <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-[#984710]" />
            <div>
              <h4 className="font-bold text-[#2E2017]">স্টক ও ইনভেন্টরি</h4>
              <p className="text-[10px] text-[#534231]">বই ও আসবাব মালামাল</p>
            </div>
          </div>
          <button
            onClick={() => toggleModule('inventoryEnabled')}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              settings.inventoryEnabled ? 'bg-[#984710]' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                settings.inventoryEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Toggle 3: Residential */}
        <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Home className="w-5 h-5 text-[#984710]" />
            <div>
              <h4 className="font-bold text-[#2E2017]">আবাসিক হোস্টেল</h4>
              <p className="text-[10px] text-[#534231]">রুম ও সিট বরাদ্দ</p>
            </div>
          </div>
          <button
            onClick={() => toggleModule('residentialEnabled')}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              settings.residentialEnabled ? 'bg-[#984710]' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                settings.residentialEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Toggle 4: AI Study Assistant */}
        <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#984710]" />
            <div>
              <h4 className="font-bold text-[#2E2017]">এআই কারিকুলাম সহায়িকা</h4>
              <p className="text-[10px] text-[#534231]">সিলেবাস নির্দেশক টিউটর</p>
            </div>
          </div>
          <button
            onClick={() => toggleModule('aiAssistantEnabled')}
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
              settings.aiAssistantEnabled ? 'bg-[#984710]' : 'bg-neutral-300'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                settings.aiAssistantEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Module 1: Daily Hadith & Vocabulary (Active) */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E9D4B3] pb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#984710]" />
            <h3 className="font-bold text-[#2E2017] text-sm">
              প্রতিদিনের নির্বাচিত হাদিস ও শব্দভাণ্ডার (Daily Hadith & Vocabulary)
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hadithList.map((h) => (
            <div key={h.id} className="p-4 bg-[#FCF8EF] rounded-xl border border-[#E9D4B3] space-y-2">
              <p className="font-serif text-right text-base text-[#2E2017] font-semibold leading-relaxed">
                {h.arabic}
              </p>
              <p className="text-xs text-[#2E2017]/90 leading-relaxed font-medium">
                "{h.meaning}"
              </p>
              <p className="text-[10px] text-[#984710] font-bold">— {h.source}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Module 2: Residential Hostel Beds Management */}
      {settings.residentialEnabled && (
        <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E9D4B3] pb-2">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-[#984710]" />
              <h3 className="font-bold text-[#2E2017] text-sm">
                হোস্টেল রুম ও শিক্ষার্থী সিট বরাদ্দ ব্যবস্থাপনা
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hostelRooms.map((r) => (
              <div key={r.id} className="p-4 bg-[#FCF8EF] rounded-xl border border-[#E9D4B3] space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-[#2E2017] text-sm">{r.roomNo}</h4>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                    {r.allocated}/{r.totalBeds} সিট পূর্ণ
                  </span>
                </div>
                <p className="text-[#534231] text-xs">দায়িত্বপ্রাপ্ত সুপার: {r.superName}</p>
                <div className="w-full bg-[#E9D4B3]/50 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#984710] h-full"
                    style={{ width: `${(r.allocated / r.totalBeds) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Module 3: Library Catalog */}
      {settings.libraryEnabled && (
        <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E9D4B3] pb-2">
            <div className="flex items-center gap-2">
              <Book className="w-4 h-4 text-[#984710]" />
              <h3 className="font-bold text-[#2E2017] text-sm">কুতুবখানা (লাইব্রেরি) ক্যাটালগ</h3>
            </div>
          </div>

          <div className="divide-y divide-[#E9D4B3]/60">
            {booksList.map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2E2017]">{b.title}</p>
                  <p className="text-[11px] text-[#534231]">লেখক: {b.author}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700">উপলব্ধ: {b.available} কপি</span>
                  <span className="block text-[10px] text-[#534231]">মোট: {b.copies} কপি</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
