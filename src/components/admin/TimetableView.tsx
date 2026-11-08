import React, { useState } from 'react';
import {
  CalendarDays,
  PlusCircle,
  Clock,
  Printer,
  AlertTriangle,
  Trash2,
  Edit,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useApp, toBnDigits } from '../../context/AppContext';
import { TimetableSlot } from '../../types';

export const TimetableView: React.FC = () => {
  const {
    routine,
    classes,
    subjects,
    staff,
    saveRoutineSlot,
    deleteRoutineSlot,
    activeSessionYear,
  } = useApp();

  const [selectedDay, setSelectedDay] = useState<
    'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday'
  >('Saturday');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);

  // Slot Form
  const [slotForm, setSlotForm] = useState<Partial<TimetableSlot>>({
    dayOfWeek: 'Saturday',
    periodNumber: 1,
    startTime: '০৮:০০',
    endTime: '০৮:৪৫',
    classId: classes[0]?.id || 'cls-hifz',
    section: 'ক',
    subjectId: subjects[0]?.id || 'sub-quran',
    teacherId: staff[0]?.id || 'stf-001',
    roomNo: '১০১ (তাহফিজ হল)',
  });

  const daysOfWeek = [
    { id: 'Saturday', label: 'শনিবার' },
    { id: 'Sunday', label: 'রবিবার' },
    { id: 'Monday', label: 'সোমবার' },
    { id: 'Tuesday', label: 'মঙ্গলবার' },
    { id: 'Wednesday', label: 'বুধবার' },
    { id: 'Thursday', label: 'বৃহস্পতিবার' },
  ];

  const filteredSlots = routine.filter((r) => {
    if (r.dayOfWeek !== selectedDay) return false;
    if (selectedClassId !== 'all' && r.classId !== selectedClassId) return false;
    return true;
  });

  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: TimetableSlot = {
      id: slotForm.id || `rtn-${Date.now()}`,
      dayOfWeek: slotForm.dayOfWeek as any,
      periodNumber: Number(slotForm.periodNumber) || 1,
      startTime: slotForm.startTime || '০৮:০০',
      endTime: slotForm.endTime || '০৮:৪৫',
      classId: slotForm.classId!,
      section: slotForm.section || 'ক',
      subjectId: slotForm.subjectId!,
      teacherId: slotForm.teacherId!,
      roomNo: slotForm.roomNo || '১০১',
    };

    const res = saveRoutineSlot(newSlot);
    if (!res.success) {
      setConflictError(res.conflictMessage || 'রুটিনে সংঘাত পাওয়া গেছে!');
    } else {
      setConflictError(null);
      setShowAddModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            ক্লাস রুটিন ও সাপ্তাহিক সিডিউল
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            শিক্ষাবর্ষ {toBnDigits(activeSessionYear)} · শিক্ষক ও ক্লাসরুম সংঘাত নিরোধক রুটিন ম্যানেজার
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 bg-[#FCF8EF] border border-[#E9D4B3] text-[#2E2017] text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-[#E9D4B3]/50"
          >
            <Printer className="w-3.5 h-3.5 text-[#984710]" />
            <span>রুটিন প্রিন্ট</span>
          </button>

          <button
            onClick={() => {
              setConflictError(null);
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন পিরিয়ড বরাদ্দ</span>
          </button>
        </div>
      </div>

      {/* Day Selector Tabs & Class Filter */}
      <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-[#FCF8EF] p-1 rounded-xl border border-[#E9D4B3]">
          {daysOfWeek.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDay(d.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                selectedDay === d.id
                  ? 'bg-[#984710] text-white'
                  : 'text-[#2E2017] hover:bg-[#E9D4B3]/40'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#534231]">শ্রেণি ফিল্টার:</span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="p-1.5 rounded-xl bg-white border border-[#E9D4B3] text-xs font-semibold"
          >
            <option value="all">সকল শ্রেণি</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.nameBn}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Routine Slots Grid */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] shadow-xs overflow-hidden printable-area">
        <div className="p-3.5 bg-[#FCF8EF] border-b border-[#E9D4B3] flex items-center justify-between text-xs">
          <span className="font-bold text-[#2E2017]">
            {daysOfWeek.find((d) => d.id === selectedDay)?.label} এর ক্লাস সিডিউল
          </span>
          <span className="text-[#534231] font-mono">মোট {toBnDigits(filteredSlots.length)} টি পিরিয়ড বরাদ্দ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCF8EF]/60 text-[#2E2017] border-b border-[#E9D4B3] font-semibold">
              <tr>
                <th className="p-3.5">পিরিয়ড</th>
                <th className="p-3.5">সময়সীমা</th>
                <th className="p-3.5">শ্রেণি ও শাখা</th>
                <th className="p-3.5">বিষয়</th>
                <th className="p-3.5">নিযুক্ত শিক্ষক</th>
                <th className="p-3.5">কক্ষ নং</th>
                <th className="p-3.5 text-right no-print">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9D4B3]/50">
              {filteredSlots.length > 0 ? (
                filteredSlots
                  .sort((a, b) => a.periodNumber - b.periodNumber)
                  .map((slot) => {
                    const cls = classes.find((c) => c.id === slot.classId);
                    const sub = subjects.find((s) => s.id === slot.subjectId);
                    const teacher = staff.find((st) => st.id === slot.teacherId);

                    return (
                      <tr key={slot.id} className="hover:bg-[#FCF8EF]/40 transition-colors">
                        <td className="p-3.5 font-bold text-[#984710] tabular-nums">
                          {toBnDigits(slot.periodNumber)}ম পিরিয়ড
                        </td>
                        <td className="p-3.5 font-mono font-semibold text-[#2E2017]">
                          {slot.startTime} - {slot.endTime}
                        </td>
                        <td className="p-3.5 font-bold text-[#2E2017]">
                          {cls?.nameBn} ({slot.section} শাখা)
                        </td>
                        <td className="p-3.5 font-semibold text-[#984710]">
                          {sub?.nameBn}
                        </td>
                        <td className="p-3.5 font-medium text-[#2E2017]">
                          {teacher?.nameBn}
                        </td>
                        <td className="p-3.5 font-medium text-[#534231]">
                          রুম: {slot.roomNo}
                        </td>
                        <td className="p-3.5 text-right no-print">
                          <button
                            onClick={() => deleteRoutineSlot(slot.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#534231]">
                    এই দিনে কোনো পিরিয়ড সিডিউল করা নেই।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal with conflict detection */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#2E2017] hover:bg-[#E9D4B3]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#2E2017] mb-1">
              রুটিনে নতুন পিরিয়ড বরাদ্দ
            </h3>
            <p className="text-xs text-[#534231] mb-4">
              শিক্ষক ও রুমের সময় সংঘাত স্বয়ংক্রিয়ভাবে যাচাই করা হবে।
            </p>

            {conflictError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{conflictError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSlot} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">বার / দিন *</label>
                  <select
                    value={slotForm.dayOfWeek}
                    onChange={(e) => setSlotForm({ ...slotForm, dayOfWeek: e.target.value as any })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3] font-semibold"
                  >
                    {daysOfWeek.map((d) => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">পিরিয়ড নম্বর *</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={slotForm.periodNumber}
                    onChange={(e) => setSlotForm({ ...slotForm, periodNumber: parseInt(e.target.value) || 1 })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3] font-bold"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">শুরুর সময়</label>
                  <input
                    type="text"
                    value={slotForm.startTime}
                    onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                    placeholder="০৮:০০"
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">শেষের সময়</label>
                  <input
                    type="text"
                    value={slotForm.endTime}
                    onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                    placeholder="০৮:৪৫"
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">শ্রেণি *</label>
                  <select
                    value={slotForm.classId}
                    onChange={(e) => setSlotForm({ ...slotForm, classId: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nameBn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">শাখা *</label>
                  <select
                    value={slotForm.section}
                    onChange={(e) => setSlotForm({ ...slotForm, section: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  >
                    <option value="ক">ক শাখা</option>
                    <option value="খ">খ শাখা</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">বিষয় *</label>
                  <select
                    value={slotForm.subjectId}
                    onChange={(e) => setSlotForm({ ...slotForm, subjectId: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.nameBn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">শিক্ষক *</label>
                  <select
                    value={slotForm.teacherId}
                    onChange={(e) => setSlotForm({ ...slotForm, teacherId: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  >
                    {staff.map((st) => (
                      <option key={st.id} value={st.id}>{st.nameBn}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">কক্ষ নম্বর / হল *</label>
                <input
                  type="text"
                  required
                  value={slotForm.roomNo}
                  onChange={(e) => setSlotForm({ ...slotForm, roomNo: e.target.value })}
                  placeholder="যেমন: ১০১ / তাহফিজ মিলনায়তন"
                  className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E9D4B3]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
