import React from 'react';
import {
  Users,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  PlusCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  BookOpen,
  MessageSquare,
  Sparkles,
  Printer,
  Heart,
  Droplet,
} from 'lucide-react';
import { useApp, formatTaka, toBnDigits } from '../../context/AppContext';
import { AdminTab } from './AdminLayout';

interface AdminDashboardProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const {
    students,
    applications,
    attendanceSheets,
    bills,
    receipts,
    activeSessionYear,
    classes,
    quranLogs,
    routine,
    settings,
  } = useApp();

  // Metrics for active session
  const sessionStudents = students.filter((s) => s.sessionYear === activeSessionYear);
  const pendingApps = applications.filter(
    (a) => a.sessionYear === activeSessionYear && (a.status === 'submitted' || a.status === 'under_review')
  );

  // Today's attendance calculation
  const todayStr = '2026-02-18'; // fixed demo date for seamless continuity
  const todaySheets = attendanceSheets.filter((s) => s.date === todayStr);
  let totalPresent = 0;
  let totalRecords = 0;
  todaySheets.forEach((s) => {
    s.records.forEach((r) => {
      totalRecords++;
      if (r.status === 'present') totalPresent++;
    });
  });
  const attendanceRate = totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 94;

  // Monthly fees collected
  const totalCollected = receipts.reduce((acc, curr) => acc + curr.amount, 0);

  // Gender Distribution
  const maleCount = sessionStudents.filter((s) => s.gender === 'male').length;
  const femaleCount = sessionStudents.filter((s) => s.gender === 'female').length;

  // Blood group counts
  const bloodGroups: Record<string, number> = {};
  sessionStudents.forEach((s) => {
    bloodGroups[s.bloodGroup] = (bloodGroups[s.bloodGroup] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Active Session Reminder & Notification */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-[#984710]">
            দারুস সুন্নাহ একাডেমি অফিস কন্ট্রোল প্যানেল
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            স্বাগতম! শিক্ষাবর্ষ {toBnDigits(activeSessionYear)} এর কার্যক্রম চলছে
          </h1>
          <p className="text-xs text-[#2E2017]/70 mt-0.5">
            আজকের তারিখ: ১৮ ফেব্রুয়ারি ২০২৬ | {classes.length}টি সক্রিয় শ্রেণি ও বিভাগ
          </p>
        </div>

        {/* 4 Numbered Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('admissions')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs font-semibold rounded-full shadow-xs cursor-pointer transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>নতুন আবেদন যাচাই</span>
          </button>
          <button
            onClick={() => onNavigateTab('attendance')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#2E2017] hover:bg-black text-[#FFFBF3] text-xs font-medium rounded-full cursor-pointer transition-colors"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-[#E9D4B3]" />
            <span>হাজিরা এন্ট্রি</span>
          </button>
          <button
            onClick={() => onNavigateTab('fees')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFBF3] hover:bg-[#FCF8EF] border border-[#2E2017]/30 text-[#2E2017] text-xs font-medium rounded-full cursor-pointer transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-[#984710]" />
            <span>ফি গ্রহণ ও রসিদ</span>
          </button>
          <button
            onClick={() => onNavigateTab('students')}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FFFBF3] hover:bg-[#FCF8EF] border border-[#2E2017]/30 text-[#2E2017] text-xs font-medium rounded-full cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#534231]" />
            <span>আইডি কার্ড প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* 4 Key Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigateTab('students')}
          className="bg-[#FFFBF3] p-5 rounded-2xl border border-[#E9D4B3] shadow-xs hover:border-[#984710] cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#534231]">নিবন্ধিত শিক্ষার্থী</span>
            <div className="w-8 h-8 rounded-lg bg-[#FCF8EF] border border-[#E9D4B3] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#984710]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2E2017] tabular-nums">
            {toBnDigits(sessionStudents.length)} জন
          </div>
          <p className="text-[11px] text-[#984710] font-medium mt-1 flex items-center gap-1">
            <span>সেশন {toBnDigits(activeSessionYear)} এর সক্রিয় তালিকা</span>
            <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigateTab('admissions')}
          className="bg-[#FFFBF3] p-5 rounded-2xl border border-[#E9D4B3] shadow-xs hover:border-[#984710] cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#534231]">অপেক্ষমান ভর্তি আবেদন</span>
            <div className="w-8 h-8 rounded-lg bg-[#FCF8EF] border border-[#E9D4B3] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-[#984710]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2E2017] tabular-nums">
            {toBnDigits(pendingApps.length)} টি
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
            <span>ভাইভা ও যাচাই প্রক্রিয়াধীন</span>
            <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="bg-[#FFFBF3] p-5 rounded-2xl border border-[#E9D4B3] shadow-xs hover:border-[#984710] cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#534231]">আজকের গড় উপস্থিতি</span>
            <div className="w-8 h-8 rounded-lg bg-[#FCF8EF] border border-[#E9D4B3] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 text-[#984710]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2E2017] tabular-nums">
            {toBnDigits(attendanceRate)}%
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <span>{todaySheets.length}টি শাখার হাজিরা সংরক্ষিত</span>
            <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => onNavigateTab('fees')}
          className="bg-[#FFFBF3] p-5 rounded-2xl border border-[#E9D4B3] shadow-xs hover:border-[#984710] cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#534231]">মোট ফি আদায় (চলতি মাস)</span>
            <div className="w-8 h-8 rounded-lg bg-[#FCF8EF] border border-[#E9D4B3] flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#984710]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2E2017] tabular-nums">
            {formatTaka(totalCollected)}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <span>{receipts.length}টি পেমেন্ট রসিদ ইস্যু</span>
            <ArrowUpRight className="w-3 h-3" />
          </p>
        </div>
      </div>

      {/* Middle Section: Applications Queue & Today's Routine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Admission Applications Queue (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E9D4B3] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#984710]" />
              <h3 className="text-base font-bold text-[#2E2017]">
                ভর্তি আবেদন পর্যালোচনা কিউ (Queue)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('admissions')}
              className="text-xs font-semibold text-[#984710] hover:underline"
            >
              সকল আবেদন দেখুন
            </button>
          </div>

          <div className="space-y-3">
            {applications.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="p-3 bg-[#FCF8EF] rounded-xl border border-[#E9D4B3]/70 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#2E2017] text-sm">{app.applicantNameBn}</span>
                    <span className="text-[10px] text-[#534231] font-mono">{app.trackingNumber}</span>
                  </div>
                  <p className="text-[#534231] mt-0.5">
                    শ্রেণি: {classes.find((c) => c.id === app.appliedClassId)?.nameBn} | পিতা: {app.fatherNameBn} ({app.fatherPhone})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      app.status === 'enrolled'
                        ? 'bg-emerald-600 text-white'
                        : app.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status === 'enrolled'
                      ? 'ভর্তি সম্পন্ন'
                      : app.status === 'approved'
                      ? 'অনুমোদিত'
                      : 'যাচাইাধীন'}
                  </span>
                  <button
                    onClick={() => onNavigateTab('admissions')}
                    className="p-1 text-[#984710] hover:bg-[#E9D4B3]/40 rounded cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Today's Routine Schedule (5 cols) */}
        <div className="lg:col-span-5 bg-[#2E2017] text-[#FFFBF3] rounded-2xl border border-[#534231] p-5 sm:p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#534231] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E9D4B3]" />
                <h3 className="text-base font-bold text-white">আজকের ক্লাস সময়সূচি</h3>
              </div>
              <button
                onClick={() => onNavigateTab('routine')}
                className="text-xs text-[#E9D4B3] hover:underline"
              >
                পূর্ণ রুটিন
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {routine.slice(0, 4).map((slot) => {
                const cls = classes.find((c) => c.id === slot.classId);
                return (
                  <div
                    key={slot.id}
                    className="p-2.5 rounded-xl bg-[#3B2B20] border border-[#534231] flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-white">{cls?.nameBn} ({slot.section} শাখা)</p>
                      <p className="text-[11px] text-[#E9D4B3]/70">{slot.roomNo}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[#E9D4B3]">{slot.startTime} - {slot.endTime}</span>
                      <span className="block text-[10px] text-neutral-300">পিরিয়ড {toBnDigits(slot.periodNumber)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#534231] text-[11px] text-[#E9D4B3]/70 mt-4">
            কোনো শিক্ষক অনুপস্থিত থাকলে রুটিন মডিউলে গিয়ে বিকল্প শিক্ষক নির্ধারণ করুন।
          </div>
        </div>
      </div>

      {/* Secondary Information Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Widget 1: Gender & Class Distribution */}
        <div className="bg-[#FFFBF3] p-5 rounded-2xl border border-[#E9D4B3] shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-[#534231] uppercase tracking-wider">
            জেন্ডার ও শ্রেণি বণ্টন
          </h4>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-[#2E2017] mb-1">
                <span>ছাত্র: {toBnDigits(maleCount)} জন</span>
                <span>{sessionStudents.length > 0 ? Math.round((maleCount / sessionStudents.length) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-[#E9D4B3]/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#984710] h-full"
                  style={{ width: `${sessionStudents.length > 0 ? (maleCount / sessionStudents.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-[#2E2017] mb-1">
                <span>ছাত্রী: {toBnDigits(femaleCount)} জন</span>
                <span>{sessionStudents.length > 0 ? Math.round((femaleCount / sessionStudents.length) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-[#E9D4B3]/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-600 h-full"
                  style={{ width: `${sessionStudents.length > 0 ? (femaleCount / sessionStudents.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: SMS Balance & Gateway Status */}
        <div className="bg-[#FFFBF3] p-5 rounded-2xl border border-[#E9D4B3] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#534231] uppercase tracking-wider">
              এসএমএস ক্রেডিট ও গেটওয়ে
            </h4>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-[#2E2017] tabular-nums">
            {toBnDigits(settings.smsBalance)} টি বাকি
          </div>
          <p className="text-xs text-[#2E2017]/70">
            অনুপস্থিতির অ্যালার্ট, ফলাফল প্রকাশ এবং নোটিশের জন্য সক্রিয় গেটওয়ে।
          </p>
          <button
            onClick={() => onNavigateTab('sms')}
            className="text-xs font-semibold text-[#984710] hover:underline"
          >
            এসএমএস পাঠান ও লগ দেখুন →
          </button>
        </div>

        {/* Widget 3: Blood Group Counts */}
        <div className="bg-[#FFFBF3] p-5 rounded-2xl border border-[#E9D4B3] shadow-xs space-y-3">
          <h4 className="text-xs font-bold text-[#534231] uppercase tracking-wider flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-red-600" />
            <span>শিক্ষার্থীদের রক্তের গ্রুপ</span>
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            {['A+', 'B+', 'O+', 'AB+'].map((bg) => (
              <div key={bg} className="p-2 bg-[#FCF8EF] rounded-xl border border-[#E9D4B3]">
                <p className="font-bold text-[#984710]">{bg}</p>
                <p className="text-xs text-[#2E2017] tabular-nums font-semibold">
                  {toBnDigits(bloodGroups[bg] || 0)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
