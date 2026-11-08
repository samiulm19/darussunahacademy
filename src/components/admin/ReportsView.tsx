import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Layers,
  TrendingUp,
  CreditCard,
  Users,
} from 'lucide-react';
import { useApp, toBnDigits, formatTaka } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const {
    students,
    applications,
    bills,
    receipts,
    classes,
    activeSessionYear,
    settings,
  } = useApp();

  const [activeReport, setActiveReport] = useState<'fees' | 'admissions' | 'attendance'>('fees');

  // Metrics for fees report
  const classFeeSummary = classes.map((cls) => {
    const classStudents = students.filter(
      (s) => s.classId === cls.id && s.sessionYear === activeSessionYear
    );
    const classBills = bills.filter((b) =>
      classStudents.some((s) => s.id === b.studentId)
    );
    const billed = classBills.reduce((acc, b) => acc + b.netPayable, 0);
    const collected = classBills.reduce((acc, b) => acc + b.paidAmount, 0);
    const due = classBills.reduce((acc, b) => acc + b.dueAmount, 0);

    return {
      cls,
      studentCount: classStudents.length,
      billed,
      collected,
      due,
    };
  });

  const totalBilled = classFeeSummary.reduce((acc, c) => acc + c.billed, 0);
  const totalCollected = classFeeSummary.reduce((acc, c) => acc + c.collected, 0);
  const totalDue = classFeeSummary.reduce((acc, c) => acc + c.due, 0);

  return (
    <div className="space-y-6 text-xs">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            একাডেমিক ও প্রাতিষ্ঠানিক প্রতিবেদন (Reports)
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            শিক্ষাবর্ষ {toBnDigits(activeSessionYear)} · প্রিন্ট ও অডিট উপযোগী এ৪ (A4) রিপোর্ট
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>প্রতিবেদন প্রিন্ট করুন (A4)</span>
        </button>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E9D4B3] pb-1 text-xs no-print">
        <button
          onClick={() => setActiveReport('fees')}
          className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
            activeReport === 'fees'
              ? 'border-[#984710] text-[#984710]'
              : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
          }`}
        >
          ফি আদায় ও বকেয়া বিবরণী
        </button>
        <button
          onClick={() => setActiveReport('admissions')}
          className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
            activeReport === 'admissions'
              ? 'border-[#984710] text-[#984710]'
              : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
          }`}
        >
          ভর্তি ফানেল ও আবেদন অগ্রগতি
        </button>
      </div>

      {/* Printable Report Document Area */}
      <div className="bg-white rounded-2xl border border-neutral-300 p-8 shadow-sm printable-area">
        {/* Official Report Header */}
        <div className="text-center space-y-1 border-b-2 border-[#984710] pb-4 mb-6">
          <div className="flex items-center justify-center gap-2">
            <img
              src={settings.logoUrl}
              alt="Logo"
              referrerPolicy="no-referrer"
              className="w-10 h-10 object-contain"
            />
            <h3 className="text-xl font-extrabold text-[#2E2017]">
              {settings.academyNameBn}
            </h3>
          </div>
          <p className="text-xs font-bold text-[#984710]">
            {activeReport === 'fees' ? 'শ্রেণিভিত্তিক ফি আদায় ও বকেয়া সারসংক্ষেপ' : 'ভর্তি আবেদন ও রূপান্তর প্রতিবেদন'}
          </p>
          <p className="text-[10px] text-neutral-500">
            শিক্ষাবর্ষ {toBnDigits(activeSessionYear)} · প্রতিবেদন তৈরির তারিখ: {new Date().toLocaleDateString('bn-BD')}
          </p>
        </div>

        {/* Tab 1: Fees Report */}
        {activeReport === 'fees' && (
          <div className="space-y-6">
            {/* Top Aggregate Summary */}
            <div className="grid grid-cols-3 gap-4 bg-[#FCF8EF] p-4 rounded-xl border border-[#E9D4B3]">
              <div>
                <span className="text-neutral-500 block">মোট নিট দাবি:</span>
                <span className="font-extrabold text-base text-[#2E2017] tabular-nums">{formatTaka(totalBilled)}</span>
              </div>
              <div>
                <span className="text-emerald-700 block">সর্বমোট আদায়:</span>
                <span className="font-extrabold text-base text-emerald-800 tabular-nums">{formatTaka(totalCollected)}</span>
              </div>
              <div>
                <span className="text-red-700 block">সর্বমোট বকেয়া:</span>
                <span className="font-extrabold text-base text-red-700 tabular-nums">{formatTaka(totalDue)}</span>
              </div>
            </div>

            {/* Class-wise Breakdown Table */}
            <div className="border border-neutral-300 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 border-b border-neutral-300 font-bold">
                  <tr>
                    <th className="p-3">শ্রেণি / বিভাগ</th>
                    <th className="p-3">শিক্ষার্থী সংখ্যা</th>
                    <th className="p-3">ধার্যকৃত বিল</th>
                    <th className="p-3">আদায়কৃত ফি</th>
                    <th className="p-3">বকেয়া পরিমাণ</th>
                    <th className="p-3">আদায় হার (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {classFeeSummary.map((item) => {
                    const rate = item.billed > 0 ? Math.round((item.collected / item.billed) * 100) : 100;
                    return (
                      <tr key={item.cls.id}>
                        <td className="p-3 font-bold text-neutral-800">{item.cls.nameBn}</td>
                        <td className="p-3 tabular-nums">{toBnDigits(item.studentCount)} জন</td>
                        <td className="p-3 tabular-nums font-mono">{formatTaka(item.billed)}</td>
                        <td className="p-3 tabular-nums font-mono text-emerald-800 font-bold">{formatTaka(item.collected)}</td>
                        <td className="p-3 tabular-nums font-mono text-red-700 font-bold">{formatTaka(item.due)}</td>
                        <td className="p-3 tabular-nums font-bold">
                          {toBnDigits(rate)}%
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-neutral-100 font-bold text-sm">
                    <td className="p-3 text-[#2E2017]">সর্বমোট হিসাব:</td>
                    <td className="p-3 tabular-nums">{toBnDigits(students.filter(s => s.sessionYear === activeSessionYear).length)} জন</td>
                    <td className="p-3 font-mono tabular-nums">{formatTaka(totalBilled)}</td>
                    <td className="p-3 font-mono tabular-nums text-emerald-800">{formatTaka(totalCollected)}</td>
                    <td className="p-3 font-mono tabular-nums text-red-700">{formatTaka(totalDue)}</td>
                    <td className="p-3 tabular-nums text-[#984710]">
                      {totalBilled > 0 ? toBnDigits(Math.round((totalCollected / totalBilled) * 100)) : 100}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Admission Funnel Report */}
        {activeReport === 'admissions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-neutral-100 rounded-xl">
                <span className="text-neutral-500 block">মোট আবেদন</span>
                <span className="text-lg font-bold text-neutral-800 tabular-nums">{toBnDigits(applications.length)} টি</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl">
                <span className="text-amber-800 block">যাচাইাধীন</span>
                <span className="text-lg font-bold text-amber-900 tabular-nums">
                  {toBnDigits(applications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length)} টি
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <span className="text-emerald-800 block">অনুমোদিত</span>
                <span className="text-lg font-bold text-emerald-900 tabular-nums">
                  {toBnDigits(applications.filter((a) => a.status === 'approved').length)} টি
                </span>
              </div>
              <div className="p-3 bg-emerald-600 text-white rounded-xl">
                <span className="block opacity-90">চূড়ান্ত ভর্তি</span>
                <span className="text-lg font-bold tabular-nums">
                  {toBnDigits(applications.filter((a) => a.status === 'enrolled').length)} জন
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Signatures for audit */}
        <div className="pt-16 flex justify-between items-end text-xs text-neutral-700">
          <div className="text-center">
            <p className="border-t border-neutral-400 pt-1">প্রস্তুতকারী কর্মকর্তা</p>
          </div>
          <div className="text-center">
            <p className="border-t border-neutral-400 pt-1 font-bold">হিসাব নিয়ন্ত্রক</p>
          </div>
          <div className="text-center">
            <p className="border-t border-neutral-400 pt-1 font-bold">মুহতামিম / প্রিন্সিপাল</p>
          </div>
        </div>
      </div>
    </div>
  );
};
