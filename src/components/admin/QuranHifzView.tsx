import React, { useState } from 'react';
import {
  BookOpen,
  PlusCircle,
  Calendar,
  CheckCircle2,
  Award,
  Clock,
  Sparkles,
  BookMarked,
  UserCheck,
} from 'lucide-react';
import { useApp, toBnDigits } from '../../context/AppContext';
import { QuranProgressLog } from '../../types';

export const QuranHifzView: React.FC = () => {
  const { students, quranLogs, addQuranLog, currentUser } = useApp();

  // Filter students who are in Hifz or Nazera classes
  const hifzStudents = students.filter(
    (s) => s.classId === 'cls-hifz' || s.classId === 'cls-nazera' || Boolean(s.hifzGroupId)
  );

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    hifzStudents[0]?.id || 'DSA-ST-2026001'
  );

  const [showAddLogModal, setShowAddLogModal] = useState(false);

  // New log form state
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split('T')[0],
    sabaqSurah: 'সুরা আল-বাকারাহ',
    sabaqAyat: '১৮৯-১৯৫ (পৃষ্ঠা ২৯)',
    sabaqPages: 1,
    sabqiPara: 'পারা ২ (সম্পূর্ণ)',
    manzilPara: 'পারা ১',
    tajweedQuality: 'উত্তম' as 'উত্তম' | 'সন্তোষজনক' | 'উন্নতি প্রয়োজন',
    memorizationPace: 'দ্রুত' as 'দ্রুত' | 'স্বাভাবিক' | 'ধীরগতি',
    tarbiyahNotes: 'মাখরাজ ও গুণ্নাহ সুন্দর। নিয়মিত তাহাজ্জুদ ও জামাতে নামাজ আদায় করেছে।',
  });

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const studentLogs = quranLogs.filter((l) => l.studentId === selectedStudentId);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: QuranProgressLog = {
      id: `qlog-${Date.now()}`,
      studentId: selectedStudentId,
      date: logForm.date,
      sabaqSurah: logForm.sabaqSurah,
      sabaqAyat: logForm.sabaqAyat,
      sabaqPages: Number(logForm.sabaqPages) || 1,
      sabqiPara: logForm.sabqiPara,
      manzilPara: logForm.manzilPara,
      tajweedQuality: logForm.tajweedQuality,
      memorizationPace: logForm.memorizationPace,
      tarbiyahNotes: logForm.tarbiyahNotes,
      teacherId: currentUser.teacherId || 'stf-002',
    };

    addQuranLog(newLog);
    setShowAddLogModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            তাহফিজুল কুরআন ও তারবিয়াহ ডায়েরি
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            দৈনিক সবক, সবকি, মনজিল তদারকি ও তাজবীদ গুণগত মান নিরীক্ষা
          </p>
        </div>

        <button
          onClick={() => setShowAddLogModal(true)}
          className="px-4 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>দৈনিক সবক এন্ট্রি করুন</span>
        </button>
      </div>

      {/* Student Selector Strip */}
      <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#984710]" />
          <span className="font-semibold text-[#2E2017]">হিফজ শিক্ষার্থী নির্বাচন:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="p-2 rounded-xl bg-white border border-[#E9D4B3] font-bold text-[#2E2017]"
          >
            {hifzStudents.map((st) => (
              <option key={st.id} value={st.id}>
                {st.nameBn} (আইডি: {st.id} · রোল: {st.rollNo})
              </option>
            ))}
          </select>
        </div>

        {selectedStudent && (
          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#534231]">
              রোল: <strong className="text-[#2E2017]">{selectedStudent.rollNo}</strong>
            </span>
            <span>·</span>
            <span className="text-[#534231]">
              গ্রুপ: <strong className="text-[#984710]">{selectedStudent.hifzGroupId || 'হিফজ শাখা ১'}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Student Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <BookMarked className="w-4 h-4 text-[#984710]" />
            <span className="text-xs font-bold text-[#534231]">সর্বশেষ সবক (নুতন পাঠ)</span>
          </div>
          <p className="text-base font-bold text-[#2E2017]">
            {studentLogs[0]?.sabaqSurah || 'সুরা আল-বাকারাহ'}
          </p>
          <p className="text-xs text-[#984710] font-medium mt-0.5">
            {studentLogs[0]?.sabaqAyat || 'পৃষ্ঠা ২৮'}
          </p>
        </div>

        <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#984710]" />
            <span className="text-xs font-bold text-[#534231]">চলমান সবকি ও মনজিল</span>
          </div>
          <p className="text-base font-bold text-[#2E2017]">
            {studentLogs[0]?.sabqiPara || 'পারা ২'}
          </p>
          <p className="text-xs text-[#534231] mt-0.5">
            মনজিল: {studentLogs[0]?.manzilPara || 'পারা ১'}
          </p>
        </div>

        <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-[#984710]" />
            <span className="text-xs font-bold text-[#534231]">তাজবীদ ও তারবিয়াহ মান</span>
          </div>
          <p className="text-base font-bold text-emerald-700">
            {studentLogs[0]?.tajweedQuality || 'উত্তম'}
          </p>
          <p className="text-xs text-[#534231] mt-0.5">
            হিফজ গতি: {studentLogs[0]?.memorizationPace || 'দ্রুত'}
          </p>
        </div>
      </div>

      {/* Progress History Log Table */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] shadow-xs overflow-hidden">
        <div className="p-3.5 bg-[#FCF8EF] border-b border-[#E9D4B3] flex items-center justify-between text-xs">
          <span className="font-bold text-[#2E2017]">
            {selectedStudent?.nameBn}-এর দৈনিক সবক ও তারবিয়াহ রেকর্ড ({studentLogs.length}টি এন্ট্রি)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCF8EF]/60 text-[#2E2017] border-b border-[#E9D4B3] font-semibold">
              <tr>
                <th className="p-3">তারিখ</th>
                <th className="p-3">সবক (নতুন পাঠ)</th>
                <th className="p-3">সবকি (রিভিশন)</th>
                <th className="p-3">মনজিল</th>
                <th className="p-3">তাজবীদ মান</th>
                <th className="p-3">তারবিয়াহ ও আমল মন্তব্য</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9D4B3]/50">
              {studentLogs.length > 0 ? (
                studentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FCF8EF]/40 transition-colors">
                    <td className="p-3 font-mono text-[#534231] whitespace-nowrap">{log.date}</td>
                    <td className="p-3">
                      <span className="font-bold text-[#2E2017]">{log.sabaqSurah}</span>
                      <span className="block text-[11px] text-[#984710]">{log.sabaqAyat}</span>
                    </td>
                    <td className="p-3 font-medium text-[#2E2017]">{log.sabqiPara}</td>
                    <td className="p-3 font-medium text-[#2E2017]">{log.manzilPara}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold">
                        {log.tajweedQuality}
                      </span>
                    </td>
                    <td className="p-3 text-[#2E2017]/85 text-xs max-w-xs leading-relaxed">
                      {log.tarbiyahNotes}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#534231]">
                    এই শিক্ষার্থীর জন্য এখনও কোনো সবক লগ তৈরি করা হয়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Log Modal */}
      {showAddLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-lg w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-[#2E2017] mb-1">
              দৈনিক সবক ও তারবিয়াহ এন্ট্রি
            </h3>
            <p className="text-xs text-[#984710] mb-4">
              শিক্ষার্থী: {selectedStudent?.nameBn} (রোল: {selectedStudent?.rollNo})
            </p>

            <form onSubmit={handleCreateLog} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">তারিখ *</label>
                  <input
                    type="date"
                    required
                    value={logForm.date}
                    onChange={(e) => setLogForm({ ...logForm, date: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">সবকের পরিমাণ (পৃষ্ঠা)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="10"
                    value={logForm.sabaqPages}
                    onChange={(e) => setLogForm({ ...logForm, sabaqPages: parseFloat(e.target.value) || 1 })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">সবক সুরা *</label>
                  <input
                    type="text"
                    required
                    value={logForm.sabaqSurah}
                    onChange={(e) => setLogForm({ ...logForm, sabaqSurah: e.target.value })}
                    placeholder="যেমন: সুরা আল-বাকারাহ"
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">সবক আয়াত ও পৃষ্ঠা *</label>
                  <input
                    type="text"
                    required
                    value={logForm.sabaqAyat}
                    onChange={(e) => setLogForm({ ...logForm, sabaqAyat: e.target.value })}
                    placeholder="যেমন: ১৮৯-১৯৫ (পৃষ্ঠা ২৯)"
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">সবকি (চলমান পারা রিভিশন) *</label>
                  <input
                    type="text"
                    required
                    value={logForm.sabqiPara}
                    onChange={(e) => setLogForm({ ...logForm, sabqiPara: e.target.value })}
                    placeholder="যেমন: পারা ২ (সম্পূর্ণ)"
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">মনজিল (পূর্ববর্তী পারা) *</label>
                  <input
                    type="text"
                    required
                    value={logForm.manzilPara}
                    onChange={(e) => setLogForm({ ...logForm, manzilPara: e.target.value })}
                    placeholder="যেমন: পারা ১"
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">তাজবীদ মান *</label>
                  <select
                    value={logForm.tajweedQuality}
                    onChange={(e) => setLogForm({ ...logForm, tajweedQuality: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  >
                    <option value="উত্তম">উত্তম (Mumtaz)</option>
                    <option value="সন্তোষজনক">সন্তোষজনক (Jayyid)</option>
                    <option value="উন্নতি প্রয়োজন">উন্নতি প্রয়োজন</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">হিফজ মুখস্থের গতি</label>
                  <select
                    value={logForm.memorizationPace}
                    onChange={(e) => setLogForm({ ...logForm, memorizationPace: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  >
                    <option value="দ্রুত">দ্রুত (Fast)</option>
                    <option value="স্বাভাবিক">স্বাভাবিক (Moderate)</option>
                    <option value="ধীরগতি">ধীরগতি (Slow)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">তারবিয়াহ ও আচরণ পর্যবেক্ষণ</label>
                <textarea
                  rows={2}
                  value={logForm.tarbiyahNotes}
                  onChange={(e) => setLogForm({ ...logForm, tarbiyahNotes: e.target.value })}
                  placeholder="নামাজ, আদব ও ক্লাসের ব্যবহারিক মূল্যায়ন..."
                  className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E9D4B3]">
                <button
                  type="button"
                  onClick={() => setShowAddLogModal(false)}
                  className="px-4 py-2 border border-[#2E2017]/30 text-[#2E2017] rounded-full"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#984710] text-white font-semibold rounded-full hover:bg-[#7e3a0c]"
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
