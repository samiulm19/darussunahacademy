import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Save,
  Send,
  UserCheck,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useApp, toBnDigits } from '../../context/AppContext';
import { AttendanceStatus, AttendanceSheet, AttendanceRecordItem } from '../../types';

export const AttendanceView: React.FC = () => {
  const {
    students,
    classes,
    attendanceSheets,
    saveAttendanceSheet,
    activeSessionYear,
    currentUser,
    staff,
  } = useApp();

  const [attendanceType, setAttendanceType] = useState<'student' | 'staff'>('student');
  const [selectedDate, setSelectedDate] = useState<string>('2026-02-18');
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-hifz');
  const [selectedSection, setSelectedSection] = useState<string>('ক');
  const [selectedShift, setSelectedShift] = useState<'morning' | 'day'>('morning');
  const [correctionReason, setCorrectionReason] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Target students for the selected class & section
  const targetStudents = students.filter(
    (s) =>
      s.sessionYear === activeSessionYear &&
      s.classId === selectedClassId &&
      s.section === selectedSection &&
      s.shift === selectedShift &&
      s.status === 'active'
  );

  // Find existing sheet or initialize
  const existingSheet = attendanceSheets.find(
    (s) =>
      s.date === selectedDate &&
      s.classId === selectedClassId &&
      s.section === selectedSection &&
      s.shift === selectedShift
  );

  // Local record state: map of studentId -> { status, remarks }
  const [localRecords, setLocalRecords] = useState<Record<string, { status: AttendanceStatus; remarks?: string }>>(() => {
    const map: Record<string, { status: AttendanceStatus; remarks?: string }> = {};
    if (existingSheet) {
      existingSheet.records.forEach((r) => {
        map[r.studentId] = { status: r.status, remarks: r.remarks };
      });
    } else {
      targetStudents.forEach((st) => {
        map[st.id] = { status: 'present' };
      });
    }
    return map;
  });

  // Re-sync when filters change
  const handleFilterChange = (newClass: string, newSec: string, newShift: 'morning' | 'day', newDate: string) => {
    setSelectedClassId(newClass);
    setSelectedSection(newSec);
    setSelectedShift(newShift);
    setSelectedDate(newDate);

    const sheet = attendanceSheets.find(
      (s) =>
        s.date === newDate &&
        s.classId === newClass &&
        s.section === newSec &&
        s.shift === newShift
    );

    const newTarget = students.filter(
      (s) =>
        s.sessionYear === activeSessionYear &&
        s.classId === newClass &&
        s.section === newSec &&
        s.shift === newShift &&
        s.status === 'active'
    );

    const map: Record<string, { status: AttendanceStatus; remarks?: string }> = {};
    if (sheet) {
      sheet.records.forEach((r) => {
        map[r.studentId] = { status: r.status, remarks: r.remarks };
      });
    } else {
      newTarget.forEach((st) => {
        map[st.id] = { status: 'present' };
      });
    }
    setLocalRecords(map);
    setFeedback(null);
  };

  const setStudentStatus = (studentId: string, status: AttendanceStatus, remarks?: string) => {
    setLocalRecords((prev) => ({
      ...prev,
      [studentId]: { status, remarks: remarks !== undefined ? remarks : prev[studentId]?.remarks },
    }));
  };

  const markAllPresent = () => {
    const updated: Record<string, { status: AttendanceStatus; remarks?: string }> = {};
    targetStudents.forEach((st) => {
      updated[st.id] = { status: 'present' };
    });
    setLocalRecords(updated);
  };

  const handleSave = (isDraft: boolean) => {
    const recordsList: AttendanceRecordItem[] = targetStudents.map((st) => ({
      studentId: st.id,
      status: localRecords[st.id]?.status || 'present',
      remarks: localRecords[st.id]?.remarks,
    }));

    const sheetId =
      existingSheet?.id ||
      `att-${selectedDate}-${selectedClassId}-${selectedSection}-${selectedShift}`;

    const sheet: AttendanceSheet = {
      id: sheetId,
      date: selectedDate,
      sessionYear: activeSessionYear,
      classId: selectedClassId,
      section: selectedSection,
      shift: selectedShift,
      records: recordsList,
      submittedBy: currentUser.nameBn,
      submittedAt: new Date().toISOString(),
      isDraft,
      correctionReason: correctionReason || existingSheet?.correctionReason,
    };

    saveAttendanceSheet(sheet);
    setFeedback(isDraft ? 'হাজিরা খসড়া (Draft) হিসেবে সংরক্ষিত হয়েছে।' : 'হাজিরা সফলভাবে সাবমিট ও চূড়ান্ত করা হয়েছে!');
    setTimeout(() => setFeedback(null), 4000);
  };

  // Metrics
  const presentCount = Object.values(localRecords).filter((r) => r.status === 'present').length;
  const absentCount = Object.values(localRecords).filter((r) => r.status === 'absent').length;
  const lateCount = Object.values(localRecords).filter((r) => r.status === 'late').length;
  const leaveCount = Object.values(localRecords).filter((r) => r.status === 'leave').length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            দৈনিক উপস্থিতি ও হাজিরা খাতা
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            শিক্ষাবর্ষ {toBnDigits(activeSessionYear)} · ডিজিটাল হাজিরা ও অনুপস্থিতি ট্র্যাকিং
          </p>
        </div>

        {/* Toggle between Student & Staff Attendance */}
        <div className="flex items-center gap-1 bg-[#FCF8EF] p-1 rounded-full border border-[#E9D4B3] text-xs">
          <button
            onClick={() => setAttendanceType('student')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
              attendanceType === 'student' ? 'bg-[#984710] text-white' : 'text-[#2E2017]'
            }`}
          >
            শিক্ষার্থী হাজিরা
          </button>
          <button
            onClick={() => setAttendanceType('staff')}
            className={`px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
              attendanceType === 'staff' ? 'bg-[#984710] text-white' : 'text-[#2E2017]'
            }`}
          >
            শিক্ষক ও কর্মচারী হাজিরা
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {attendanceType === 'student' ? (
        <>
          {/* Controls Bar: Date, Class, Section, Shift */}
          <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-white border border-[#E9D4B3] rounded-xl px-2.5 py-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#984710]" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) =>
                    handleFilterChange(selectedClassId, selectedSection, selectedShift, e.target.value)
                  }
                  className="font-medium text-[#2E2017] focus:outline-hidden"
                />
              </div>

              <select
                value={selectedClassId}
                onChange={(e) =>
                  handleFilterChange(e.target.value, selectedSection, selectedShift, selectedDate)
                }
                className="p-2 rounded-xl bg-white border border-[#E9D4B3] font-semibold text-[#2E2017]"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameBn}</option>
                ))}
              </select>

              <select
                value={selectedSection}
                onChange={(e) =>
                  handleFilterChange(selectedClassId, e.target.value, selectedShift, selectedDate)
                }
                className="p-2 rounded-xl bg-white border border-[#E9D4B3] text-[#2E2017]"
              >
                <option value="ক">ক শাখা</option>
                <option value="খ">খ শাখা</option>
              </select>

              <select
                value={selectedShift}
                onChange={(e) =>
                  handleFilterChange(selectedClassId, selectedSection, e.target.value as any, selectedDate)
                }
                className="p-2 rounded-xl bg-white border border-[#E9D4B3] text-[#2E2017]"
              >
                <option value="morning">প্রভাতী</option>
                <option value="day">দিবা</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={markAllPresent}
                className="px-3 py-1.5 bg-[#FCF8EF] hover:bg-[#E9D4B3] border border-[#E9D4B3] text-[#2E2017] text-xs font-semibold rounded-xl cursor-pointer"
              >
                সবাই উপস্থিত
              </button>
            </div>
          </div>

          {/* Quick Summary Pill Strip */}
          <div className="grid grid-cols-4 gap-3 text-xs">
            <div className="bg-[#FFFBF3] p-3 rounded-xl border border-[#E9D4B3] text-center">
              <span className="text-[#534231] block">উপস্থিত</span>
              <span className="text-lg font-bold text-emerald-700 tabular-nums">
                {toBnDigits(presentCount)} জন
              </span>
            </div>
            <div className="bg-[#FFFBF3] p-3 rounded-xl border border-[#E9D4B3] text-center">
              <span className="text-[#534231] block">অনুপস্থিত</span>
              <span className="text-lg font-bold text-red-700 tabular-nums">
                {toBnDigits(absentCount)} জন
              </span>
            </div>
            <div className="bg-[#FFFBF3] p-3 rounded-xl border border-[#E9D4B3] text-center">
              <span className="text-[#534231] block">বিলম্ব</span>
              <span className="text-lg font-bold text-amber-700 tabular-nums">
                {toBnDigits(lateCount)} জন
              </span>
            </div>
            <div className="bg-[#FFFBF3] p-3 rounded-xl border border-[#E9D4B3] text-center">
              <span className="text-[#534231] block">ছুটি</span>
              <span className="text-lg font-bold text-blue-700 tabular-nums">
                {toBnDigits(leaveCount)} জন
              </span>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] shadow-xs overflow-hidden">
            <div className="p-3 bg-[#FCF8EF] border-b border-[#E9D4B3] flex items-center justify-between text-xs">
              <span className="font-bold text-[#2E2017]">
                {classes.find((c) => c.id === selectedClassId)?.nameBn} ({selectedSection} শাখা) · মোট শিক্ষার্থী: {toBnDigits(targetStudents.length)} জন
              </span>
              <span className="text-[#534231]">
                {existingSheet ? (existingSheet.isDraft ? 'খসড়া সংরক্ষিত' : 'চূড়ান্ত সাবমিটেড') : 'এখনও হাজিরা এন্ট্রি হয়নি'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FCF8EF]/60 text-[#2E2017] border-b border-[#E9D4B3] font-semibold">
                  <tr>
                    <th className="p-3">রোল</th>
                    <th className="p-3">শিক্ষার্থীর নাম</th>
                    <th className="p-3">আইডি</th>
                    <th className="p-3">হাজিরা স্ট্যাটাস</th>
                    <th className="p-3">বিলম্ব/ছুটির কারণ বা মন্তব্য</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9D4B3]/50">
                  {targetStudents.length > 0 ? (
                    targetStudents.map((st) => {
                      const currentRec = localRecords[st.id] || { status: 'present' };
                      return (
                        <tr key={st.id} className="hover:bg-[#FCF8EF]/40 transition-colors">
                          <td className="p-3 font-bold text-[#984710] tabular-nums text-sm">
                            {st.rollNo}
                          </td>
                          <td className="p-3 font-semibold text-[#2E2017]">
                            {st.nameBn}
                          </td>
                          <td className="p-3 font-mono text-[#534231] text-[11px]">
                            {st.id}
                          </td>
                          <td className="p-3">
                            <div className="inline-flex rounded-lg border border-[#E9D4B3] bg-white p-0.5 text-xs">
                              <button
                                type="button"
                                onClick={() => setStudentStatus(st.id, 'present')}
                                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                                  currentRec.status === 'present'
                                    ? 'bg-emerald-600 text-white'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                              >
                                উপস্থিত
                              </button>
                              <button
                                type="button"
                                onClick={() => setStudentStatus(st.id, 'absent')}
                                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                                  currentRec.status === 'absent'
                                    ? 'bg-red-600 text-white'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                              >
                                অনুপস্থিত
                              </button>
                              <button
                                type="button"
                                onClick={() => setStudentStatus(st.id, 'late')}
                                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                                  currentRec.status === 'late'
                                    ? 'bg-amber-600 text-white'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                              >
                                বিলম্ব
                              </button>
                              <button
                                type="button"
                                onClick={() => setStudentStatus(st.id, 'leave')}
                                className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                                  currentRec.status === 'leave'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                              >
                                ছুটি
                              </button>
                            </div>
                          </td>
                          <td className="p-3">
                            <input
                              type="text"
                              value={currentRec.remarks || ''}
                              onChange={(e) => setStudentStatus(st.id, currentRec.status, e.target.value)}
                              placeholder="কারণ লিখুন (প্রযোজ্য ক্ষেত্রে)..."
                              className="w-full max-w-xs p-1.5 rounded-lg bg-white border border-[#E9D4B3] text-xs text-[#2E2017]"
                            />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[#534231]">
                        এই শ্রেণিতে কোনো শিক্ষার্থী তালিকাভুক্ত নেই।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-[#FCF8EF] border-t border-[#E9D4B3] flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 max-w-sm">
                <input
                  type="text"
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="পূর্ববর্তী হাজিরা সংশোধনের কারণ (ঐচ্ছিক)..."
                  className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3] text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSave(true)}
                  className="px-4 py-2 bg-[#FFFBF3] hover:bg-[#E9D4B3]/40 border border-[#2E2017]/30 text-[#2E2017] text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>ড্রাফট সেভ করুন</span>
                </button>

                <button
                  onClick={() => handleSave(false)}
                  className="px-5 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>চূড়ান্ত হাজিরা সাবমিট</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Staff Attendance View */
        <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#E9D4B3] pb-3">
            <h3 className="font-bold text-[#2E2017] text-sm">শিক্ষক ও স্টাফ দৈনিক হাজিরা</h3>
            <span className="font-mono text-[#534231]">{selectedDate}</span>
          </div>

          <div className="divide-y divide-[#E9D4B3]/60">
            {staff.map((stf) => (
              <div key={stf.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[#2E2017]">{stf.nameBn}</p>
                  <p className="text-[11px] text-[#534231]">{stf.designation} · {stf.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                    উপস্থিত (সময়: ০৭:৫৫)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
