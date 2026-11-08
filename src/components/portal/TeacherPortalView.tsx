import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CalendarCheck,
  Clock,
  CheckCircle2,
  BookMarked,
  Sparkles,
  ArrowRight,
  Send,
} from 'lucide-react';
import { useApp, toBnDigits } from '../../context/AppContext';
import { AdminTab } from '../admin/AdminLayout';

interface TeacherPortalViewProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const TeacherPortalView: React.FC<TeacherPortalViewProps> = ({ onNavigateTab }) => {
  const { currentUser, staff, routine, classes, subjects, students, quranLogs, addQuranLog } = useApp();

  // Teacher details
  const teacherObj = staff.find((s) => s.id === currentUser.teacherId) || staff[1]; // default Hafez Abdur Rahman
  const myRoutine = routine.filter((r) => r.teacherId === teacherObj.id);

  const [quickSabaqModal, setQuickSabaqModal] = useState(false);
  const [sabaqStudentId, setSabaqStudentId] = useState('DSA-ST-2026001');
  const [sabaqSurah, setSabaqSurah] = useState('সুরা আল-বাকারাহ');
  const [sabaqAyat, setSabaqAyat] = useState('১৮৯-১৯৫ (পৃষ্ঠা ২৯)');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleQuickSabaq = (e: React.FormEvent) => {
    e.preventDefault();
    addQuranLog({
      id: `qlog-${Date.now()}`,
      studentId: sabaqStudentId,
      date: new Date().toISOString().split('T')[0],
      sabaqSurah,
      sabaqAyat,
      sabaqPages: 1,
      sabqiPara: 'পারা ২',
      manzilPara: 'পারা ১',
      tajweedQuality: 'উত্তম',
      memorizationPace: 'দ্রুত',
      tarbiyahNotes: 'মাখরাজ সুন্দর ও মনোযোগী।',
      teacherId: teacherObj.id,
    });
    setQuickSabaqModal(false);
    setFeedback('শিক্ষার্থীর সবক সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Teacher Profile Banner */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FCF8EF] border border-[#E9D4B3] flex items-center justify-center font-bold text-xl text-[#984710]">
            {teacherObj.nameBn.charAt(0)}
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#984710] bg-[#FCF8EF] px-2.5 py-0.5 rounded-full border border-[#E9D4B3]">
              শিক্ষক পোর্টাল
            </span>
            <h1 className="text-xl font-bold text-[#2E2017] mt-1">{teacherObj.nameBn}</h1>
            <p className="text-xs text-[#534231]">{teacherObj.designation} · {teacherObj.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('attendance')}
            className="px-4 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>আজকের ক্লাসের হাজিরা নিন</span>
          </button>
          <button
            onClick={() => setQuickSabaqModal(true)}
            className="px-4 py-2 bg-[#2E2017] hover:bg-black text-[#FFFBF3] font-semibold rounded-full shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#E9D4B3]" />
            <span>সবক এন্ট্রি</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid: Routine & Assigned Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: My Routine Schedule (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E9D4B3] pb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#984710]" />
              <h3 className="font-bold text-[#2E2017] text-sm">আমার দায়িত্বপ্রাপ্ত ক্লাস ও রুটিন</h3>
            </div>
            <span className="text-[11px] text-[#534231]">শনিবার থেকে বৃহস্পতিবার</span>
          </div>

          <div className="space-y-2.5">
            {myRoutine.map((slot) => {
              const cls = classes.find((c) => c.id === slot.classId);
              const sub = subjects.find((s) => s.id === slot.subjectId);
              return (
                <div
                  key={slot.id}
                  className="p-3 bg-[#FCF8EF] rounded-xl border border-[#E9D4B3] flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] text-[#984710] font-bold block">
                      {slot.startTime} - {slot.endTime} (পিরিয়ড {toBnDigits(slot.periodNumber)})
                    </span>
                    <h4 className="font-bold text-[#2E2017] text-sm mt-0.5">{cls?.nameBn} ({slot.section} শাখা)</h4>
                    <p className="text-[11px] text-[#534231]">{sub?.nameBn} · কক্ষ: {slot.roomNo}</p>
                  </div>

                  <button
                    onClick={() => onNavigateTab('attendance')}
                    className="px-3 py-1 bg-white border border-[#E9D4B3] hover:border-[#984710] text-[#2E2017] font-semibold rounded-lg text-xs cursor-pointer"
                  >
                    হাজিরা নিন
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Assigned Responsibilities (5 cols) */}
        <div className="lg:col-span-5 bg-[#2E2017] text-[#FFFBF3] rounded-2xl border border-[#534231] p-5 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-white text-sm border-b border-[#534231] pb-2">
              শিক্ষক ড্যাশবোর্ড অ্যাকশনস
            </h3>

            <div className="space-y-2.5">
              <div
                onClick={() => onNavigateTab('attendance')}
                className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231] hover:border-[#E9D4B3] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-white">দৈনিক উপস্থিতি প্রদান</h4>
                  <p className="text-[10px] text-[#E9D4B3]/70">অনুপস্থিতি ও বিলম্বের কারণ চিহ্নিতকরণ</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#E9D4B3]" />
              </div>

              <div
                onClick={() => onNavigateTab('exams')}
                className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231] hover:border-[#E9D4B3] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-white">পরীক্ষার নম্বর এন্ট্রি</h4>
                  <p className="text-[10px] text-[#E9D4B3]/70">লিখিত ও মৌখিক নম্বরপত্র প্রদান</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#E9D4B3]" />
              </div>

              <div
                onClick={() => onNavigateTab('quran')}
                className="p-3 bg-[#3B2B20] rounded-xl border border-[#534231] hover:border-[#E9D4B3] transition-colors cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-white">তাহফিজুল কুরআন সবক খাতা</h4>
                  <p className="text-[10px] text-[#E9D4B3]/70">সবক, সবকি ও মনজিল অগ্রগতি নিরীক্ষা</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#E9D4B3]" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#534231] text-[11px] text-[#E9D4B3]/70 mt-4">
            অভিভাবক মিটিং আগামী শুক্রবার সকাল ৯:৩০ টায়।
          </div>
        </div>
      </div>

      {/* Quick Sabaq Modal */}
      {quickSabaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-[#2E2017] mb-3 border-b border-[#E9D4B3] pb-2">
              দ্রুত সবক এন্ট্রি (Sabaq Entry)
            </h3>
            <form onSubmit={handleQuickSabaq} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">শিক্ষার্থী নির্বাচন *</label>
                <select
                  value={sabaqStudentId}
                  onChange={(e) => setSabaqStudentId(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                >
                  {students.filter(s => s.classId === 'cls-hifz').map((s) => (
                    <option key={s.id} value={s.id}>{s.nameBn} (রোল: {s.rollNo})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">সুরা *</label>
                <input
                  type="text"
                  required
                  value={sabaqSurah}
                  onChange={(e) => setSabaqSurah(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">আয়াত ও পৃষ্ঠা *</label>
                <input
                  type="text"
                  required
                  value={sabaqAyat}
                  onChange={(e) => setSabaqAyat(e.target.value)}
                  className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E9D4B3]">
                <button
                  type="button"
                  onClick={() => setQuickSabaqModal(false)}
                  className="px-4 py-1.5 border border-[#2E2017]/30 text-[#2E2017] rounded-full"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#984710] text-white font-semibold rounded-full hover:bg-[#7e3a0c]"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
