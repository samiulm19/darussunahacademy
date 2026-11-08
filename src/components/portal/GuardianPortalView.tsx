import React, { useState } from 'react';
import {
  Users,
  CalendarCheck,
  CreditCard,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Printer,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp, toBnDigits, formatTaka } from '../../context/AppContext';

export const GuardianPortalView: React.FC = () => {
  const {
    students,
    classes,
    bills,
    receipts,
    quranLogs,
    examMarks,
    examTerms,
    subjects,
    routine,
    selectedChildId,
    setSelectedChildId,
    collectFeePayment,
    currentUser,
    notices,
  } = useApp();

  // The guardian Hafez Jahirul Islam has 2 children:
  // 1. Salman Ahmed (DSA-ST-2026001, Hifz class)
  // 2. Mariam Khatun (DSA-ST-2026002, Class 1)
  const myChildren = students.filter(
    (s) => s.guardianPhone === '০১৮১২২৩৩৪৪৪' || s.id === selectedChildId
  );

  const selectedChild =
    students.find((s) => s.id === selectedChildId) || myChildren[0] || students[0];

  const [activePortalTab, setActivePortalTab] = useState<'overview' | 'fees' | 'results' | 'quran'>('overview');
  const [onlinePayModal, setOnlinePayModal] = useState<any | null>(null);

  // Selected child's data
  const childBills = bills.filter((b) => b.studentId === selectedChild.id);
  const childReceipts = receipts.filter((r) => r.studentId === selectedChild.id);
  const childQuranLogs = quranLogs.filter((l) => l.studentId === selectedChild.id);
  const childMarks = examMarks.filter((m) => m.studentId === selectedChild.id);
  const childClass = classes.find((c) => c.id === selectedChild.classId);

  const handleOnlinePay = (bill: any) => {
    // Process simulated online payment
    collectFeePayment({
      studentId: selectedChild.id,
      billId: bill.id,
      date: new Date().toISOString().split('T')[0],
      amount: bill.dueAmount,
      paymentMethod: 'bkash',
      transactionRef: `BKASH-${Date.now().toString().slice(-6)}`,
      receivedBy: 'অনলাইন পেমেন্ট গেটওয়ে',
      notes: `${bill.month} এর ফি বিকাশ মারফত পরিশোধ`,
    });
    setOnlinePayModal(null);
    alert('আলহামদুলিল্লাহ! আপনার পেমেন্ট সফল হয়েছে এবং রসিদ তৈরি হয়েছে।');
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Top Guardian & Child Switcher Bar */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#984710] bg-[#FCF8EF] px-2.5 py-0.5 rounded-full border border-[#E9D4B3]">
            অভিভাবক পোর্টাল (Guardian Portal)
          </span>
          <h1 className="text-xl font-bold text-[#2E2017] mt-1">
            আসসালামু আলাইকুম, {currentUser.nameBn}
          </h1>
          <p className="text-xs text-[#534231]">
            আপনার নিবন্ধিত মোবাইল: <strong className="font-mono text-[#2E2017]">০১৮১২২৩৩৪৪৪</strong>
          </p>
        </div>

        {/* Child Switcher Component */}
        <div className="flex items-center gap-2 bg-[#FCF8EF] p-1.5 rounded-2xl border border-[#E9D4B3]">
          <span className="text-xs font-semibold text-[#534231] px-2">সন্তান নির্বাচন:</span>
          {myChildren.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedChild.id === child.id
                  ? 'bg-[#984710] text-white shadow-xs'
                  : 'text-[#2E2017] hover:bg-white'
              }`}
            >
              <span>{child.nameBn}</span>
              <span className="text-[10px] opacity-80">
                ({classes.find((c) => c.id === child.classId)?.nameBn})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Child Info Strip */}
      <div className="bg-[#2E2017] text-[#FFFBF3] rounded-2xl border border-[#534231] p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#3B2B20] border border-[#534231] flex items-center justify-center font-bold text-lg text-[#E9D4B3]">
            {selectedChild.nameBn.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{selectedChild.nameBn}</h2>
            <p className="text-xs text-[#E9D4B3]">
              আইডি: <span className="font-mono">{selectedChild.id}</span> · শ্রেণি রোল:{' '}
              <span className="font-bold">{selectedChild.rollNo}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-[#E9D4B3]/70 block">শ্রেণি ও শাখা</span>
            <span className="font-bold text-white">{childClass?.nameBn} ({selectedChild.section} শাখা)</span>
          </div>
          <div className="border-l border-[#534231] pl-4">
            <span className="text-[#E9D4B3]/70 block">উপস্থিতির হার</span>
            <span className="font-bold text-emerald-400">৯৬% (নিয়মিত)</span>
          </div>
          <div className="border-l border-[#534231] pl-4">
            <span className="text-[#E9D4B3]/70 block">বকেয়া ফি</span>
            <span className="font-bold text-amber-300">
              {formatTaka(childBills.reduce((acc, b) => acc + b.dueAmount, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E9D4B3] pb-1 text-xs">
        <button
          onClick={() => setActivePortalTab('overview')}
          className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
            activePortalTab === 'overview'
              ? 'border-[#984710] text-[#984710]'
              : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
          }`}
        >
          সার্বিক সারসংক্ষেপ ও রুটিন
        </button>
        <button
          onClick={() => setActivePortalTab('fees')}
          className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
            activePortalTab === 'fees'
              ? 'border-[#984710] text-[#984710]'
              : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
          }`}
        >
          ফি বিল ও পেমেন্ট রসিদ
        </button>
        <button
          onClick={() => setActivePortalTab('results')}
          className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
            activePortalTab === 'results'
              ? 'border-[#984710] text-[#984710]'
              : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
          }`}
        >
          পরীক্ষার ফলাফল ও মার্কশিট
        </button>
        {selectedChild.classId === 'cls-hifz' && (
          <button
            onClick={() => setActivePortalTab('quran')}
            className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
              activePortalTab === 'quran'
                ? 'border-[#984710] text-[#984710]'
                : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
            }`}
          >
            হিফজ ডায়েরি (সবক ও তারবিয়াহ)
          </button>
        )}
      </div>

      {/* Tab 1: Overview & Routine */}
      {activePortalTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Class Routine (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-[#2E2017] text-sm border-b border-[#E9D4B3] pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#984710]" />
              <span>{selectedChild.nameBn}-এর দৈনিক ক্লাস রুটিন</span>
            </h3>

            <div className="space-y-2">
              {routine
                .filter((r) => r.classId === selectedChild.classId)
                .map((slot) => {
                  const sub = subjects.find((s) => s.id === slot.subjectId);
                  return (
                    <div
                      key={slot.id}
                      className="p-3 bg-[#FCF8EF] rounded-xl border border-[#E9D4B3] flex justify-between items-center"
                    >
                      <div>
                        <span className="font-bold text-[#2E2017] text-xs">{sub?.nameBn}</span>
                        <span className="block text-[11px] text-[#534231]">কক্ষ নং: {slot.roomNo}</span>
                      </div>
                      <span className="font-mono text-[#984710] font-bold">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Right: Notices & Quick Alerts (5 cols) */}
          <div className="lg:col-span-5 bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-[#2E2017] text-sm border-b border-[#E9D4B3] pb-2">
              অভিভাবকদের জন্য একাডেমি নোটিশ
            </h3>
            <div className="space-y-2.5">
              {notices.slice(0, 3).map((n) => (
                <div key={n.id} className="p-3 bg-[#FCF8EF] rounded-xl border border-[#E9D4B3]">
                  <p className="font-bold text-[#2E2017] text-xs">{n.title}</p>
                  <p className="text-[11px] text-[#534231] line-clamp-2 mt-0.5">{n.content}</p>
                  <span className="text-[10px] text-[#984710] font-mono mt-1 block">{n.publishDate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Fees & Payment Receipts */}
      {activePortalTab === 'fees' && (
        <div className="space-y-6">
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-[#2E2017] text-sm border-b border-[#E9D4B3] pb-2">
              মাসিক ফি ও বিল বিবরণী
            </h3>

            <div className="divide-y divide-[#E9D4B3]/60">
              {childBills.map((bill) => (
                <div key={bill.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] text-[#534231] block">{bill.id}</span>
                    <h4 className="font-bold text-sm text-[#2E2017]">{bill.month}</h4>
                    <p className="text-[11px] text-[#534231]">
                      মোট ফি: {formatTaka(bill.totalAmount)} · মওকুফ: {formatTaka(bill.waiverAmount)} · নিট প্রদেয়: {formatTaka(bill.netPayable)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="font-extrabold text-[#984710] text-sm tabular-nums block">
                        বকেয়া: {formatTaka(bill.dueAmount)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          bill.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {bill.status === 'paid' ? 'পরিশোধিত' : 'পরিশোধ বাকি'}
                      </span>
                    </div>

                    {bill.dueAmount > 0 && (
                      <button
                        onClick={() => handleOnlinePay(bill)}
                        className="px-4 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full shadow-xs cursor-pointer"
                      >
                        বিকাশে ফি দিন
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Receipts History */}
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-[#2E2017] text-sm border-b border-[#E9D4B3] pb-2">
              টাকা জমার মানি রসিদ (Receipts)
            </h3>
            <div className="divide-y divide-[#E9D4B3]/60">
              {childReceipts.map((rcpt) => (
                <div key={rcpt.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-[#984710]">{rcpt.receiptNumber}</span>
                    <p className="text-[11px] text-[#2E2017] font-medium">{rcpt.notes}</p>
                    <span className="text-[10px] text-[#534231] font-mono">{rcpt.date} · {rcpt.paymentMethod}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-800 text-sm tabular-nums block">
                      {formatTaka(rcpt.amount)}
                    </span>
                    <button
                      onClick={() => window.print()}
                      className="text-[11px] text-[#984710] font-semibold underline cursor-pointer"
                    >
                      রসিদ ডাউনলোড
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Exam Results */}
      {activePortalTab === 'results' && (
        <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E9D4B3] pb-2">
            <div>
              <h3 className="font-bold text-[#2E2017] text-sm">পরীক্ষার ফলাফল ও মূল্যায়ন</h3>
              <p className="text-[11px] text-[#534231]">প্রথম সাময়িক মূল্যায়ন ২০২৬</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-[#2E2017] text-white font-semibold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>মার্কশিট প্রিন্ট</span>
            </button>
          </div>

          <div className="border border-[#E9D4B3] rounded-xl overflow-hidden bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FCF8EF] border-b border-[#E9D4B3] font-bold">
                <tr>
                  <th className="p-3">বিষয়</th>
                  <th className="p-3">পূর্ণমান</th>
                  <th className="p-3">প্রাপ্ত নম্বর</th>
                  <th className="p-3">লেটার গ্রেড</th>
                  <th className="p-3">গ্রেড পয়েন্ট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9D4B3]/50">
                {childMarks.length > 0 ? (
                  childMarks.map((m, idx) => {
                    const sub = subjects.find((s) => s.id === m.subjectId);
                    return (
                      <tr key={idx} className="hover:bg-[#FCF8EF]/30">
                        <td className="p-3 font-semibold text-[#2E2017]">{sub?.nameBn || m.subjectId}</td>
                        <td className="p-3 tabular-nums">১০০</td>
                        <td className="p-3 font-extrabold text-[#984710] tabular-nums">{toBnDigits(m.totalMarks)}</td>
                        <td className="p-3 font-bold">{m.grade}</td>
                        <td className="p-3 font-mono">{m.gradePoint.toFixed(1)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-[#534231]">
                      সাম্প্রতিক পরীক্ষার ফলাফল প্রকাশের কাজ প্রক্রিয়াধীন রয়েছে।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Quran Hifz Log */}
      {activePortalTab === 'quran' && (
        <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-4">
          <div className="border-b border-[#E9D4B3] pb-2">
            <h3 className="font-bold text-[#2E2017] text-sm">তাহফিজুল কুরআন দৈনিক অগ্রগতি ডায়েরি</h3>
            <p className="text-[11px] text-[#534231]">উস্তাদের সরাসরি পর্যবেক্ষণ ও মূল্যায়ন</p>
          </div>

          <div className="space-y-3">
            {childQuranLogs.map((log) => (
              <div key={log.id} className="p-4 bg-[#FCF8EF] rounded-xl border border-[#E9D4B3] space-y-2">
                <div className="flex justify-between items-center border-b border-[#E9D4B3]/60 pb-2">
                  <span className="font-bold text-[#984710] text-xs">সবক: {log.sabaqSurah} ({log.sabaqAyat})</span>
                  <span className="font-mono text-[10px] text-[#534231]">{log.date}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#534231]">সবকি (রিভিশন):</span>{' '}
                    <span className="font-semibold text-[#2E2017]">{log.sabqiPara}</span>
                  </div>
                  <div>
                    <span className="text-[#534231]">মনজিল:</span>{' '}
                    <span className="font-semibold text-[#2E2017]">{log.manzilPara}</span>
                  </div>
                  <div>
                    <span className="text-[#534231]">তাজবীদ মান:</span>{' '}
                    <span className="font-bold text-emerald-700">{log.tajweedQuality}</span>
                  </div>
                  <div>
                    <span className="text-[#534231]">হিফজ গতি:</span>{' '}
                    <span className="font-medium text-[#2E2017]">{log.memorizationPace}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#E9D4B3]/40 text-xs">
                  <span className="font-bold text-[#984710]">উস্তাদের মন্তব্য ও তারবিয়াহ:</span>{' '}
                  <span className="text-[#2E2017]">{log.tarbiyahNotes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
