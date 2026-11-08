import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  CheckCircle2,
  Calendar,
  CreditCard,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useApp, toBnDigits } from '../../context/AppContext';

export const CommunicationSMSView: React.FC = () => {
  const { settings, updateSettings, students, classes, activeSessionYear } = useApp();

  const [selectedTemplate, setSelectedTemplate] = useState<string>('absence');
  const [recipientTarget, setRecipientTarget] = useState<string>('all');
  const [customMessage, setCustomMessage] = useState(
    'সম্মানিত অভিভাবক, দারুস সুন্নাহ একাডেমি থেকে জানানো যাচ্ছে যে, আপনার সন্তান আজ ক্লাসে অনুপস্থিত রয়েছে। নিয়মিত উপস্থিতির জন্য অনুরোধ করা যাচ্ছে।'
  );
  const [sentSuccess, setSentSuccess] = useState<string | null>(null);

  // Sample sent history log
  const [smsLogs, setSmsLogs] = useState([
    {
      id: 'log-01',
      date: '2026-02-18 09:30',
      recipient: 'হিফজুল কুরআন বিভাগ (ক শাখা)',
      count: 2,
      text: 'সম্মানিত অভিভাবক, আপনার সন্তান আজ ক্লাসে অনুপস্থিত রয়েছে...',
      status: 'সফলভাবে প্রেরিত',
    },
    {
      id: 'log-02',
      date: '2026-02-10 11:15',
      recipient: 'সকল অভিভাবক (১ম-৫ম শ্রেণি)',
      count: 45,
      text: 'দারুস সুন্নাহ একাডেমি: প্রথম সাময়িক পরীক্ষার সময়সূচি প্রকাশিত হয়েছে...',
      status: 'সফলভাবে প্রেরিত',
    },
  ]);

  const templates: Record<string, string> = {
    absence:
      'সম্মানিত অভিভাবক, দারুস সুন্নাহ একাডেমি থেকে জানানো যাচ্ছে যে, আপনার সন্তান আজ ক্লাসে অনুপস্থিত রয়েছে। নিয়মিত উপস্থিতির জন্য অনুরোধ করা যাচ্ছে।',
    fee_due:
      'সম্মানিত অভিভাবক, দারুস সুন্নাহ একাডেমিতে আপনার সন্তানের চলতি মাসের মাসিক বেতন বকেয়া রয়েছে। অনুগ্রহ করে আগামী ২৫ তারিখের মধ্যে পরিশোধ করার অনুরোধ রইল।',
    exam_result:
      'সম্মানিত অভিভাবক, দারুস সুন্নাহ একাডেমির প্রথম সাময়িক পরীক্ষার ফলাফল অভিভাবক পোর্টালে প্রকাশিত হয়েছে। লগইন করে মার্কশিট দেখার অনুরোধ করা হচ্ছে।',
    holiday:
      'আসসালামু আলাইকুম, পবিত্র মাহে রমজান ও শব-ই-বরাত উপলক্ষে একাডেমি আগামী ২৩ ফেব্রুয়ারি হতে বন্ধ থাকবে। অফিস খোলা থাকবে সকাল ৯টা হতে দুপুর ১টা।',
  };

  const handleTemplateSelect = (key: string) => {
    setSelectedTemplate(key);
    setCustomMessage(templates[key] || '');
  };

  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;

    let targetCount = 1;
    if (recipientTarget === 'all') {
      targetCount = students.filter((s) => s.sessionYear === activeSessionYear).length;
    }

    if (settings.smsBalance < targetCount) {
      alert('পর্যাপ্ত এসএমএস ক্রেডিট নেই! অনুগ্রহ করে ব্যালেন্স রিচার্জ করুন।');
      return;
    }

    updateSettings({ smsBalance: settings.smsBalance - targetCount });

    const newLog = {
      id: `log-${Date.now()}`,
      date: new Date().toLocaleString('bn-BD'),
      recipient: recipientTarget === 'all' ? 'সকল শিক্ষার্থী ও অভিভাবক' : 'নির্বাচিত শ্রেণি',
      count: targetCount,
      text: customMessage.slice(0, 50) + '...',
      status: 'সফলভাবে প্রেরিত',
    };

    setSmsLogs([newLog, ...smsLogs]);
    setSentSuccess(`${toBnDigits(targetCount)} টি অভিভাবক নম্বরে এসএমএস সফলভাবে পাঠানো হয়েছে!`);
    setTimeout(() => setSentSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            অভিভাবক যোগাযোগ ও এসএমএস গেটওয়ে
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            শিক্ষাবর্ষ {toBnDigits(activeSessionYear)} · তাৎক্ষণিক নোটিফিকেশন, বকেয়া তাগাদা ও অনুপস্থিতি সতর্কবার্তা
          </p>
        </div>

        <div className="bg-[#FFFBF3] border border-[#E9D4B3] px-4 py-2 rounded-2xl flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs">
            <span className="text-[#534231] block text-[10px]">এসএমএস ক্রেডিট ব্যালেন্স:</span>
            <span className="font-extrabold text-[#984710] tabular-nums text-sm">
              {toBnDigits(settings.smsBalance)} টি
            </span>
          </div>
        </div>
      </div>

      {sentSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{sentSuccess}</span>
        </div>
      )}

      {/* Main Grid: Send Form & Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-[#2E2017] border-b border-[#E9D4B3] pb-2 flex items-center gap-2">
            <Send className="w-4 h-4 text-[#984710]" />
            <span>নতুন এসএমএস বার্তা পাঠান</span>
          </h3>

          <form onSubmit={handleSendSms} className="space-y-3">
            <div>
              <label className="block font-medium mb-1">প্রাপক নির্বাচন (Audience Filter) *</label>
              <select
                value={recipientTarget}
                onChange={(e) => setRecipientTarget(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] font-semibold text-xs"
              >
                <option value="all">
                  সকল অভিভাবক ({toBnDigits(students.filter(s => s.sessionYear === activeSessionYear).length)} জন)
                </option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameBn} শাখা</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-medium">মেসেজ কন্টেন্ট *</label>
                <span className="text-[10px] text-[#534231]">
                  অক্ষর সংখ্যা: {customMessage.length} (১টি এসএমএস)
                </span>
              </div>
              <textarea
                rows={4}
                required
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3 rounded-xl bg-white border border-[#E9D4B3] text-xs leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#534231]">
                মাস্কিং প্রেরক আইডি: <strong>DARUSSUNNAH</strong>
              </span>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>মেসেজ পাঠান</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Fast Templates (5 cols) */}
        <div className="lg:col-span-5 bg-[#FCF8EF] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-3 text-xs">
          <h4 className="font-bold text-[#2E2017] text-xs border-b border-[#E9D4B3] pb-2">
            প্রস্তুতকৃত দ্রুত টেমপ্লেট
          </h4>

          <div className="space-y-2">
            {[
              { id: 'absence', label: 'অনুপস্থিতির অ্যালার্ট', desc: 'দৈনিক অনুপস্থিতির তাৎক্ষণিক নোটিশ' },
              { id: 'fee_due', label: 'বকেয়া ফি রিমাইন্ডার', desc: 'মাসিক বেতনের বিনীত তাগাদা' },
              { id: 'exam_result', label: 'পরীক্ষার ফল প্রকাশ', desc: 'অনলাইন ফলাফল সংক্রান্ত বিজ্ঞপ্তি' },
              { id: 'holiday', label: 'জরুরি ছুটির বার্তা', desc: 'ছুটি ও ক্লাস সংক্রান্ত বিজ্ঞপ্তি' },
            ].map((t) => (
              <div
                key={t.id}
                onClick={() => handleTemplateSelect(t.id)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  selectedTemplate === t.id
                    ? 'bg-[#FFFBF3] border-[#984710] shadow-xs'
                    : 'bg-white/80 border-[#E9D4B3] hover:bg-white'
                }`}
              >
                <p className="font-bold text-[#2E2017]">{t.label}</p>
                <p className="text-[11px] text-[#534231] mt-0.5">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SMS Delivery Log */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] shadow-xs overflow-hidden">
        <div className="p-3.5 bg-[#FCF8EF] border-b border-[#E9D4B3] flex items-center justify-between text-xs">
          <span className="font-bold text-[#2E2017]">সম্প্রতি প্রেরিত বার্তা ও লগ</span>
        </div>

        <div className="divide-y divide-[#E9D4B3]/50 text-xs">
          {smsLogs.map((log) => (
            <div key={log.id} className="p-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-[#FCF8EF]/30">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#2E2017]">{log.recipient}</span>
                  <span className="text-[10px] text-[#534231] font-mono">({toBnDigits(log.count)} টি নম্বর)</span>
                </div>
                <p className="text-[#534231] text-[11px] line-clamp-1">{log.text}</p>
              </div>

              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                  {log.status}
                </span>
                <span className="block text-[10px] text-[#534231] font-mono mt-0.5">{log.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
