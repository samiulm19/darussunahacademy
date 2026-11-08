import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Phone,
  Mail,
  Printer,
  Calendar,
  DollarSign,
  GraduationCap,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useApp, toBnDigits, formatTaka } from '../../context/AppContext';
import { StaffMember } from '../../types';

export const StaffView: React.FC = () => {
  const { staff, addStaff, updateStaff, classes, subjects, settings } = useApp();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayslipModal, setShowPayslipModal] = useState<StaffMember | null>(null);

  // New staff form state
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    nameBn: '',
    nameEn: '',
    designation: 'সহকারী শিক্ষক',
    department: 'দ্বীনিয়াত ও আরবি',
    phone: '',
    email: '',
    joiningDate: '2025-01-01',
    bloodGroup: 'B+',
    status: 'active',
    monthlySalary: 25000,
    qualification: 'দাওরায়ে হাদিস ও বি.এ',
    assignedClasses: ['cls-1'],
    assignedSubjects: ['sub-arabic'],
  });

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.nameBn || !newStaff.phone) return;

    const nextCode = `DSA-T-${100 + staff.length + 1}`;
    const created: StaffMember = {
      id: `stf-${Date.now()}`,
      code: nextCode,
      nameBn: newStaff.nameBn!,
      nameEn: newStaff.nameEn || newStaff.nameBn!,
      designation: newStaff.designation || 'শিক্ষক',
      department: newStaff.department || 'দ্বীনিয়াত',
      phone: newStaff.phone!,
      email: newStaff.email || `${nextCode.toLowerCase()}@darussunnah.edu.bd`,
      joiningDate: newStaff.joiningDate || new Date().toISOString().split('T')[0],
      bloodGroup: newStaff.bloodGroup || 'B+',
      status: 'active',
      monthlySalary: Number(newStaff.monthlySalary) || 20000,
      qualification: newStaff.qualification || 'দাওরায়ে হাদিস',
      assignedClasses: newStaff.assignedClasses || [],
      assignedSubjects: newStaff.assignedSubjects || [],
    };

    addStaff(created);
    setShowAddModal(false);
    alert(`শিক্ষক/স্টাফ সফলভাবে যুক্ত হয়েছেন! কোড: ${nextCode}`);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            শিক্ষক ও কর্মচারী ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            শিক্ষক প্রোফাইল, বিষয় বরাদ্দ, উপস্থিতি ও পে-রোল (বেতন) শিট
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন শিক্ষক/কর্মী যোগ করুন</span>
        </button>
      </div>

      {/* Staff Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staff.map((stf) => (
          <div
            key={stf.id}
            className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs hover:border-[#984710]/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#FCF8EF] border border-[#E9D4B3] flex items-center justify-center font-bold text-[#984710] text-base">
                    {stf.nameBn.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2E2017] text-sm leading-tight">
                      {stf.nameBn}
                    </h3>
                    <p className="text-[11px] text-[#984710] font-semibold">{stf.designation}</p>
                    <p className="text-[10px] text-[#534231] font-mono">{stf.code}</p>
                  </div>
                </div>

                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  সক্রিয়
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-[#2E2017]/85 border-t border-[#E9D4B3]/60 pt-3">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#534231]" />
                  <span className="font-mono tabular-nums">{stf.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-[#534231]" />
                  <span className="truncate">{stf.qualification}</span>
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-[#534231]" />
                  <span>মাসিক বেতন: <strong className="tabular-nums">{formatTaka(stf.monthlySalary)}</strong></span>
                </p>
              </div>

              {/* Assigned Subjects Pills */}
              <div className="mt-3 pt-2 border-t border-[#E9D4B3]/40">
                <p className="text-[10px] font-bold text-[#534231] mb-1">বরাদ্দকৃত শ্রেণি ও বিষয়:</p>
                <div className="flex flex-wrap gap-1">
                  {stf.assignedSubjects.map((subId) => {
                    const sub = subjects.find((s) => s.id === subId);
                    return (
                      <span
                        key={subId}
                        className="bg-[#FCF8EF] border border-[#E9D4B3] text-[#2E2017] text-[10px] px-2 py-0.5 rounded"
                      >
                        {sub?.nameBn || subId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-3 border-t border-[#E9D4B3]/60 flex items-center justify-between">
              <span className="text-[11px] text-[#534231]">
                যোগদান: {stf.joiningDate}
              </span>

              <button
                onClick={() => setShowPayslipModal(stf)}
                className="px-3 py-1 bg-[#2E2017] hover:bg-black text-white text-xs font-semibold rounded-lg cursor-pointer"
              >
                পে-স্লিপ
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Payslip Modal */}
      {showPayslipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-neutral-300 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8 printable-area">
            <button
              onClick={() => setShowPayslipModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 no-print cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Payslip Header */}
            <div className="text-center space-y-1 border-b-2 border-[#984710] pb-3 mb-4">
              <h3 className="text-xl font-extrabold text-[#2E2017]">{settings.academyNameBn}</h3>
              <p className="text-xs text-[#984710] font-bold">কর্মচারী মাসিক বেতন রশিদ (Salary Pay Slip)</p>
              <p className="text-[10px] text-neutral-500">{settings.addressBn}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-[#FCF8EF] p-3 rounded-xl border border-[#E9D4B3] text-xs mb-4">
              <div>
                <span className="text-neutral-500">নাম:</span>{' '}
                <span className="font-bold text-[#2E2017]">{showPayslipModal.nameBn}</span>
              </div>
              <div>
                <span className="text-neutral-500">পদবী:</span>{' '}
                <span className="font-semibold text-[#2E2017]">{showPayslipModal.designation}</span>
              </div>
              <div>
                <span className="text-neutral-500">স্টাফ কোড:</span>{' '}
                <span className="font-mono font-bold text-[#984710]">{showPayslipModal.code}</span>
              </div>
              <div>
                <span className="text-neutral-500">মাসের নাম:</span>{' '}
                <span className="font-bold text-neutral-800">ফেব্রুয়ারি ২০২৬</span>
              </div>
            </div>

            <div className="border border-neutral-300 rounded-xl overflow-hidden mb-6 text-xs">
              <table className="w-full text-left">
                <thead className="bg-neutral-100 border-b border-neutral-300 font-bold">
                  <tr>
                    <th className="p-2.5">আয়ের বিবরণ (Earnings)</th>
                    <th className="p-2.5 text-right">টাকার পরিমাণ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  <tr>
                    <td className="p-2.5">মূল বেতন (Basic Salary)</td>
                    <td className="p-2.5 text-right font-mono tabular-nums">{formatTaka(showPayslipModal.monthlySalary * 0.7)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">বাড়ি ভাড়া ভাতা (House Allowance)</td>
                    <td className="p-2.5 text-right font-mono tabular-nums">{formatTaka(showPayslipModal.monthlySalary * 0.2)}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">চিকিৎসা ও যাতায়াত ভাতা</td>
                    <td className="p-2.5 text-right font-mono tabular-nums">{formatTaka(showPayslipModal.monthlySalary * 0.1)}</td>
                  </tr>
                  <tr className="bg-neutral-50 font-bold text-sm">
                    <td className="p-2.5 text-[#2E2017]">সর্বমোট প্রদেয় বেতন (Net Payable)</td>
                    <td className="p-2.5 text-right text-[#984710] tabular-nums">{formatTaka(showPayslipModal.monthlySalary)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-8 flex justify-between items-end text-xs text-neutral-700">
              <div className="text-center">
                <p className="border-t border-neutral-400 pt-1">কর্মচারীর স্বাক্ষর</p>
              </div>
              <div className="text-center">
                <p className="border-t border-neutral-400 pt-1 font-bold">হিসাবরক্ষণ কর্মকর্তা</p>
              </div>
              <div className="text-center">
                <p className="border-t border-neutral-400 pt-1 font-bold">প্রিন্সিপাল</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-6 border-t border-neutral-200 no-print mt-6">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#984710] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 hover:bg-[#7e3a0c] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>পে-স্লিপ প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#2E2017] hover:bg-[#E9D4B3]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#2E2017] mb-3 border-b border-[#E9D4B3] pb-2">
              নতুন শিক্ষক বা কর্মচারী নিবন্ধন
            </h3>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">পূর্ণ নাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.nameBn}
                    onChange={(e) => setNewStaff({ ...newStaff, nameBn: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Name (English)</label>
                  <input
                    type="text"
                    value={newStaff.nameEn}
                    onChange={(e) => setNewStaff({ ...newStaff, nameEn: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">পদবী *</label>
                  <input
                    type="text"
                    required
                    value={newStaff.designation}
                    onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">বিভাগ</label>
                  <input
                    type="text"
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">মাসিক বেতন (টাকা)</label>
                  <input
                    type="number"
                    value={newStaff.monthlySalary}
                    onChange={(e) => setNewStaff({ ...newStaff, monthlySalary: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">শিক্ষাগত যোগ্যতা</label>
                <input
                  type="text"
                  value={newStaff.qualification}
                  onChange={(e) => setNewStaff({ ...newStaff, qualification: e.target.value })}
                  placeholder="যেমন: দাওরায়ে হাদিস ও এম.এ"
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
