import React, { useState } from 'react';
import {
  School,
  PlusCircle,
  Edit,
  CheckCircle2,
  BookOpen,
  Layers,
  Settings,
  Calendar,
  X,
} from 'lucide-react';
import { useApp, toBnDigits, formatTaka } from '../../context/AppContext';
import { AcademicClass } from '../../types';

export const AcademicSetupView: React.FC = () => {
  const {
    sessions,
    programs,
    classes,
    subjects,
    addClass,
    updateClass,
    activeSessionYear,
    setActiveSessionYear,
  } = useApp();

  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClass, setNewClass] = useState<Partial<AcademicClass>>({
    nameBn: '',
    nameEn: '',
    code: '',
    programId: programs[0]?.id || 'prog-integrated',
    sections: ['ক'],
    shifts: ['morning'],
    monthlyFee: 2500,
    admissionFee: 5000,
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.nameBn || !newClass.code) return;

    const created: AcademicClass = {
      id: `cls-${Date.now()}`,
      nameBn: newClass.nameBn!,
      nameEn: newClass.nameEn || newClass.nameBn!,
      code: newClass.code!.toUpperCase(),
      programId: newClass.programId!,
      sections: newClass.sections || ['ক'],
      shifts: newClass.shifts || ['morning'],
      monthlyFee: Number(newClass.monthlyFee) || 2000,
      admissionFee: Number(newClass.admissionFee) || 5000,
    };

    addClass(created);
    setShowAddClassModal(false);
    alert(`নতুন শ্রেণি '${created.nameBn}' সফলভাবে যুক্ত হয়েছে!`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            একাডেমিক কাঠামো ও সেশন সেটআপ
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            শিক্ষাবর্ষ, বিভাগ, শ্রেণি, শাখা, শিফট এবং বিষয় ম্যাপিং কনফিগারেশন
          </p>
        </div>

        <button
          onClick={() => setShowAddClassModal(true)}
          className="px-4 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন শ্রেণি তৈরি করুন</span>
        </button>
      </div>

      {/* Sessions Card */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#E9D4B3] pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#984710]" />
            <h3 className="font-bold text-[#2E2017] text-sm">শিক্ষাবর্ষ ও সেশন তালিকা</h3>
          </div>
          <span className="text-xs text-[#984710] font-semibold">
            চলমান সক্রিয় সেশন: {activeSessionYear}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {sessions.map((ses) => (
            <div
              key={ses.id}
              onClick={() => setActiveSessionYear(ses.year)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                activeSessionYear === ses.year
                  ? 'bg-[#FCF8EF] border-[#984710] shadow-xs'
                  : 'bg-white border-[#E9D4B3] hover:border-[#984710]/50'
              }`}
            >
              <div>
                <p className="font-bold text-[#2E2017]">{ses.name}</p>
                <p className="text-[11px] text-[#534231]">
                  মেয়াদ: {ses.startDate} হতে {ses.endDate}
                </p>
              </div>

              {activeSessionYear === ses.year ? (
                <span className="bg-[#984710] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  নির্বাচিত
                </span>
              ) : (
                <span className="text-[#534231] text-[11px] hover:text-[#984710]">
                  সুইচ করুন
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] shadow-xs overflow-hidden">
        <div className="p-3.5 bg-[#FCF8EF] border-b border-[#E9D4B3] flex items-center justify-between text-xs">
          <span className="font-bold text-[#2E2017]">
            অনুমোদিত শ্রেণি ও মাসিক ফি তালিকা ({classes.length}টি শ্রেণি)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCF8EF]/60 text-[#2E2017] border-b border-[#E9D4B3] font-semibold">
              <tr>
                <th className="p-3.5">শ্রেণির নাম</th>
                <th className="p-3.5">কোড</th>
                <th className="p-3.5">শিক্ষাধারা</th>
                <th className="p-3.5">শাখা</th>
                <th className="p-3.5">শিফট</th>
                <th className="p-3.5">ভর্তি ফি</th>
                <th className="p-3.5">মাসিক বেতন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9D4B3]/50">
              {classes.map((cls) => {
                const prog = programs.find((p) => p.id === cls.programId);
                return (
                  <tr key={cls.id} className="hover:bg-[#FCF8EF]/40 transition-colors">
                    <td className="p-3.5 font-bold text-[#2E2017]">
                      {cls.nameBn}
                      <span className="block text-[11px] font-normal text-[#534231]">{cls.nameEn}</span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#984710]">{cls.code}</td>
                    <td className="p-3.5 font-medium text-[#2E2017]">{prog?.nameBn}</td>
                    <td className="p-3.5">
                      <div className="flex gap-1">
                        {cls.sections.map((sec) => (
                          <span key={sec} className="bg-white border border-[#E9D4B3] px-2 py-0.5 rounded text-[11px] font-semibold">
                            {sec}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 text-[#534231]">
                      {cls.shifts.map((s) => (s === 'morning' ? 'প্রভাতী' : 'দিবা')).join(', ')}
                    </td>
                    <td className="p-3.5 font-mono tabular-nums">{formatTaka(cls.admissionFee)}</td>
                    <td className="p-3.5 font-bold font-mono tabular-nums text-[#984710]">
                      {formatTaka(cls.monthlyFee)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-3">
        <h3 className="font-bold text-[#2E2017] text-sm border-b border-[#E9D4B3] pb-2">
          সিলেবাসের বিষয়সমূহ ({subjects.length}টি বিষয়)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {subjects.map((sub) => (
            <div key={sub.id} className="p-3 bg-[#FCF8EF] rounded-xl border border-[#E9D4B3]">
              <span className="font-mono text-[10px] text-[#984710] block">{sub.code}</span>
              <p className="font-bold text-[#2E2017] text-xs mt-0.5">{sub.nameBn}</p>
              <p className="text-[11px] text-[#534231] mt-1">
                পূর্ণমান: {toBnDigits(sub.totalMarks)} (পাস: {toBnDigits(sub.passMarks)})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddClassModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#2E2017] hover:bg-[#E9D4B3]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#2E2017] mb-3 border-b border-[#E9D4B3] pb-2">
              নতুন শ্রেণি বা বিভাগ যুক্ত করুন
            </h3>

            <form onSubmit={handleCreateClass} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium mb-1">শ্রেণির নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  value={newClass.nameBn}
                  onChange={(e) => setNewClass({ ...newClass, nameBn: e.target.value })}
                  placeholder="যেমন: ষষ্ঠ শ্রেণি"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Class Name (English)</label>
                <input
                  type="text"
                  value={newClass.nameEn}
                  onChange={(e) => setNewClass({ ...newClass, nameEn: e.target.value })}
                  placeholder="Class 6"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">কোড *</label>
                  <input
                    type="text"
                    required
                    value={newClass.code}
                    onChange={(e) => setNewClass({ ...newClass, code: e.target.value })}
                    placeholder="C6"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">শিক্ষাধারা *</label>
                  <select
                    value={newClass.programId}
                    onChange={(e) => setNewClass({ ...newClass, programId: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>{p.nameBn}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium mb-1">ভর্তি ফি (টাকা)</label>
                  <input
                    type="number"
                    value={newClass.admissionFee}
                    onChange={(e) => setNewClass({ ...newClass, admissionFee: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">মাসিক বেতন (টাকা)</label>
                  <input
                    type="number"
                    value={newClass.monthlyFee}
                    onChange={(e) => setNewClass({ ...newClass, monthlyFee: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E9D4B3]">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
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
