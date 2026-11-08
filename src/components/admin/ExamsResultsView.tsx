import React, { useState } from 'react';
import {
  Award,
  Lock,
  Unlock,
  Printer,
  CheckCircle2,
  FileText,
  AlertCircle,
  Plus,
  Search,
} from 'lucide-react';
import { useApp, toBnDigits } from '../../context/AppContext';
import { ExamMarkItem, ExamTerm } from '../../types';

export const ExamsResultsView: React.FC = () => {
  const {
    students,
    classes,
    subjects,
    examTerms,
    examMarks,
    saveExamMarks,
    publishExamTerm,
    activeSessionYear,
    settings,
  } = useApp();

  const [selectedTermId, setSelectedTermId] = useState<string>(examTerms[0]?.id || 'term-1');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-hifz');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub-quran');
  const [showTranscriptModal, setShowTranscriptModal] = useState<any | null>(null);

  const selectedTerm = examTerms.find((t) => t.id === selectedTermId);
  const targetStudents = students.filter(
    (s) => s.classId === selectedClassId && s.sessionYear === activeSessionYear
  );

  // Helper to calculate Grade and GPA
  const calculateGrade = (total: number) => {
    if (total >= 80) return { grade: 'A+', gpa: 5.0 };
    if (total >= 70) return { grade: 'A', gpa: 4.0 };
    if (total >= 60) return { grade: 'A-', gpa: 3.5 };
    if (total >= 50) return { grade: 'B', gpa: 3.0 };
    if (total >= 40) return { grade: 'C', gpa: 2.0 };
    if (total >= 33) return { grade: 'D', gpa: 1.0 };
    return { grade: 'F', gpa: 0.0 };
  };

  // Local state for marks matrix: studentId -> { written, viva }
  const [localMarks, setLocalMarks] = useState<Record<string, { written: number; viva: number }>>(() => {
    const map: Record<string, { written: number; viva: number }> = {};
    targetStudents.forEach((st) => {
      const existing = examMarks.find(
        (m) =>
          m.studentId === st.id &&
          m.examTermId === selectedTermId &&
          m.subjectId === selectedSubjectId
      );
      map[st.id] = {
        written: existing ? existing.writtenMarks : 40,
        viva: existing ? existing.vivaMarks : 40,
      };
    });
    return map;
  });

  const handleMarksChange = (studentId: string, field: 'written' | 'viva', val: number) => {
    setLocalMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: val,
      },
    }));
  };

  const handleSaveMarks = () => {
    const itemsToSave: ExamMarkItem[] = targetStudents.map((st) => {
      const entry = localMarks[st.id] || { written: 0, viva: 0 };
      const total = entry.written + entry.viva;
      const { grade, gpa } = calculateGrade(total);

      return {
        studentId: st.id,
        subjectId: selectedSubjectId,
        examTermId: selectedTermId,
        writtenMarks: entry.written,
        vivaMarks: entry.viva,
        totalMarks: total,
        grade,
        gradePoint: gpa,
      };
    });

    saveExamMarks(itemsToSave);
    alert('নম্বর সফলভাবে সংরক্ষিত হয়েছে!');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            পরীক্ষা ব্যবস্থাপনা ও ফলাফল প্রকাশনা
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            শিক্ষাবর্ষ {toBnDigits(activeSessionYear)} · নম্বর এন্ট্রি, ফলাফল লক ও মার্কশিট জেনারেশন
          </p>
        </div>

        {selectedTerm && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => publishExamTerm(selectedTerm.id, !selectedTerm.isPublished)}
              className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors ${
                selectedTerm.isPublished
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                  : 'bg-[#984710] text-white hover:bg-[#7e3a0c]'
              }`}
            >
              {selectedTerm.isPublished ? (
                <>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>ফলাফল প্রকাশিত (লুকান)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>ফলাফল অনুমোদন ও প্রকাশ করুন</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Control Bar: Term, Class, Subject */}
      <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div>
            <label className="block text-[11px] font-semibold text-[#534231] mb-1">পরীক্ষা টার্ম:</label>
            <select
              value={selectedTermId}
              onChange={(e) => setSelectedTermId(e.target.value)}
              className="p-2 rounded-xl bg-white border border-[#E9D4B3] font-bold text-[#2E2017]"
            >
              {examTerms.map((t) => (
                <option key={t.id} value={t.id}>{t.nameBn}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#534231] mb-1">শ্রেণি:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="p-2 rounded-xl bg-white border border-[#E9D4B3] font-semibold text-[#2E2017]"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.nameBn}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#534231] mb-1">বিষয়:</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="p-2 rounded-xl bg-white border border-[#E9D4B3] font-semibold text-[#2E2017]"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.nameBn} (পূর্ণমান: {s.totalMarks})</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSaveMarks}
          className="px-5 py-2.5 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full shadow-xs cursor-pointer text-xs"
        >
          নম্বরপত্র সংরক্ষণ করুন
        </button>
      </div>

      {/* Marks Matrix Table */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] shadow-xs overflow-hidden">
        <div className="p-3 bg-[#FCF8EF] border-b border-[#E9D4B3] flex items-center justify-between text-xs">
          <span className="font-bold text-[#2E2017]">
            বিষয়ভিত্তিক নম্বর এন্ট্রি তালিকা · মোট শিক্ষার্থী: {toBnDigits(targetStudents.length)} জন
          </span>
          <span className="text-[#534231]">
            অবস্থা: {selectedTerm?.isPublished ? 'পাবলিকলি প্রকাশিত' : 'অভ্যন্তরীণ পর্যালোচনাধীন'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCF8EF]/60 text-[#2E2017] border-b border-[#E9D4B3] font-semibold">
              <tr>
                <th className="p-3">রোল</th>
                <th className="p-3">শিক্ষার্থীর নাম</th>
                <th className="p-3">লিখিত নম্বর (৫০)</th>
                <th className="p-3">মৌখিক নম্বর (৫০)</th>
                <th className="p-3">মোট নম্বর (১০০)</th>
                <th className="p-3">গ্রেড</th>
                <th className="p-3">জিপিএ</th>
                <th className="p-3 text-right">মার্কশিট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9D4B3]/50">
              {targetStudents.length > 0 ? (
                targetStudents.map((st) => {
                  const entry = localMarks[st.id] || { written: 0, viva: 0 };
                  const total = (entry.written || 0) + (entry.viva || 0);
                  const { grade, gpa } = calculateGrade(total);

                  return (
                    <tr key={st.id} className="hover:bg-[#FCF8EF]/40 transition-colors">
                      <td className="p-3 font-extrabold text-[#984710] tabular-nums text-sm">
                        {st.rollNo}
                      </td>
                      <td className="p-3 font-bold text-[#2E2017]">
                        {st.nameBn}
                        <span className="block text-[11px] font-normal text-[#534231]">
                          আইডি: {st.id}
                        </span>
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={entry.written}
                          onChange={(e) =>
                            handleMarksChange(st.id, 'written', parseInt(e.target.value) || 0)
                          }
                          className="w-20 p-1.5 rounded-lg bg-white border border-[#E9D4B3] font-bold text-center text-xs"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={entry.viva}
                          onChange={(e) =>
                            handleMarksChange(st.id, 'viva', parseInt(e.target.value) || 0)
                          }
                          className="w-20 p-1.5 rounded-lg bg-white border border-[#E9D4B3] font-bold text-center text-xs"
                        />
                      </td>
                      <td className="p-3 font-extrabold text-[#2E2017] text-sm tabular-nums">
                        {toBnDigits(total)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            grade === 'F' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {grade}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#534231] tabular-nums">
                        {gpa.toFixed(1)}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setShowTranscriptModal(st)}
                          className="px-2.5 py-1 bg-[#2E2017] hover:bg-black text-white text-[11px] font-medium rounded-lg cursor-pointer"
                        >
                          মার্কশিট
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#534231]">
                    এই শ্রেণিতে কোনো শিক্ষার্থী পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Marksheet / Academic Transcript Modal */}
      {showTranscriptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-neutral-300 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 printable-area">
            <button
              onClick={() => setShowTranscriptModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 no-print cursor-pointer"
            >
              ✕
            </button>

            {/* Transcript Header */}
            <div className="text-center space-y-1 border-b-2 border-[#984710] pb-3 mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 object-contain"
                />
                <h3 className="text-xl font-extrabold text-[#2E2017]">
                  {settings.academyNameBn}
                </h3>
              </div>
              <p className="text-xs text-[#984710] font-bold">
                একাডেমিক প্রগ্রেস রিপোর্ট ও নম্বরপত্র (Academic Transcript)
              </p>
              <p className="text-[11px] text-neutral-600">
                {selectedTerm?.nameBn} · শিক্ষাবর্ষ {toBnDigits(activeSessionYear)}
              </p>
            </div>

            {/* Student Info Box */}
            <div className="grid grid-cols-2 gap-2 bg-[#FCF8EF] p-3 rounded-xl border border-[#E9D4B3] text-xs mb-4">
              <div>
                <span className="text-neutral-500">শিক্ষার্থীর নাম:</span>{' '}
                <span className="font-bold text-[#2E2017]">{showTranscriptModal.nameBn}</span>
              </div>
              <div>
                <span className="text-neutral-500">আইডি ও রোল:</span>{' '}
                <span className="font-mono font-bold text-[#2E2017]">
                  {showTranscriptModal.id} (রোল: {showTranscriptModal.rollNo})
                </span>
              </div>
              <div>
                <span className="text-neutral-500">শ্রেণি ও শাখা:</span>{' '}
                <span className="font-semibold text-[#2E2017]">
                  {classes.find((c) => c.id === showTranscriptModal.classId)?.nameBn} ({showTranscriptModal.section} শাখা)
                </span>
              </div>
              <div>
                <span className="text-neutral-500">ফলাফল স্ট্যাটাস:</span>{' '}
                <span className="font-bold text-emerald-700">কৃতকার্য (Passed)</span>
              </div>
            </div>

            {/* Subject Marks Table */}
            <div className="border border-neutral-300 rounded-xl overflow-hidden mb-6">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 border-b border-neutral-300 font-bold">
                  <tr>
                    <th className="p-2.5">বিষয়</th>
                    <th className="p-2.5">পূর্ণমান</th>
                    <th className="p-2.5">প্রাপ্ত নম্বর</th>
                    <th className="p-2.5">লেটার গ্রেড</th>
                    <th className="p-2.5">গ্রেড পয়েন্ট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {subjects.slice(0, 4).map((sub, idx) => {
                    const mark = examMarks.find(
                      (m) =>
                        m.studentId === showTranscriptModal.id &&
                        m.subjectId === sub.id &&
                        m.examTermId === selectedTermId
                    );
                    const total = mark ? mark.totalMarks : 85 - idx * 4;
                    const { grade, gpa } = calculateGrade(total);

                    return (
                      <tr key={sub.id}>
                        <td className="p-2.5 font-semibold text-neutral-800">{sub.nameBn}</td>
                        <td className="p-2.5 tabular-nums">১০০</td>
                        <td className="p-2.5 font-bold tabular-nums text-[#984710]">{toBnDigits(total)}</td>
                        <td className="p-2.5 font-bold">{grade}</td>
                        <td className="p-2.5 font-mono">{gpa.toFixed(1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Signatures */}
            <div className="pt-10 flex justify-between items-end text-xs text-neutral-700">
              <div className="text-center">
                <p className="border-t border-neutral-400 pt-1">শ্রেণি শিক্ষকের স্বাক্ষর</p>
              </div>
              <div className="text-center">
                <p className="border-t border-neutral-400 pt-1">পরীক্ষা নিয়ন্ত্রকের স্বাক্ষর</p>
              </div>
              <div className="text-center">
                <p className="border-t border-neutral-400 pt-1 font-bold">মুহতামিম / প্রিন্সিপাল</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-6 border-t border-neutral-200 no-print mt-6">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#984710] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 hover:bg-[#7e3a0c] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>মার্কশিট প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
