import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Printer,
  FileBadge,
  QrCode,
  ArrowRight,
  Edit,
  Trash2,
  X,
  CheckCircle,
  Phone,
  Droplet,
  GraduationCap,
} from 'lucide-react';
import { useApp, toBnDigits, formatTaka, normalizeDigits } from '../../context/AppContext';
import { StudentRecord } from '../../types';

export const StudentsView: React.FC = () => {
  const {
    students,
    classes,
    addStudent,
    updateStudent,
    deleteStudent,
    activeSessionYear,
    settings,
  } = useApp();

  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedShift, setSelectedShift] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStudent, setActiveStudent] = useState<StudentRecord | null>(null);
  const [showIdCardModal, setShowIdCardModal] = useState<StudentRecord | null>(null);
  const [showCertificateModal, setShowCertificateModal] = useState<StudentRecord | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Student Form
  const [newStudentData, setNewStudentData] = useState<Partial<StudentRecord>>({
    nameBn: '',
    nameEn: '',
    classId: classes[0]?.id || 'cls-hifz',
    section: 'ক',
    shift: 'morning',
    gender: 'male',
    bloodGroup: 'B+',
    dateOfBirth: '2016-01-01',
    guardianNameBn: '',
    guardianPhone: '',
    guardianRelation: 'পিতা',
    address: 'মিরপুর, ঢাকা',
    waiverPercent: 0,
  });

  const filteredStudents = students.filter((s) => {
    if (s.sessionYear !== activeSessionYear) return false;
    if (selectedClass !== 'all' && s.classId !== selectedClass) return false;
    if (selectedShift !== 'all' && s.shift !== selectedShift) return false;
    if (searchQuery.trim()) {
      const q = normalizeDigits(searchQuery);
      const match =
        normalizeDigits(s.nameBn).includes(q) ||
        normalizeDigits(s.nameEn).includes(q) ||
        normalizeDigits(s.id).includes(q) ||
        normalizeDigits(s.rollNo).includes(q) ||
        normalizeDigits(s.guardianPhone).includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.nameBn || !newStudentData.guardianPhone) return;

    const classStudents = students.filter(
      (s) => s.classId === newStudentData.classId && s.sessionYear === activeSessionYear
    );
    const nextRoll = classStudents.length + 1;
    const rollBn = toBnDigits(nextRoll.toString().padStart(2, '0'));
    const nextIdNum = students.length + 1;
    const studentId = `DSA-ST-${activeSessionYear}${String(nextIdNum).padStart(3, '0')}`;

    const created: StudentRecord = {
      id: studentId,
      rollNo: rollBn,
      nameBn: newStudentData.nameBn!,
      nameEn: newStudentData.nameEn || newStudentData.nameBn!,
      sessionYear: activeSessionYear,
      classId: newStudentData.classId!,
      section: newStudentData.section || 'ক',
      shift: newStudentData.shift as any || 'morning',
      gender: newStudentData.gender as any || 'male',
      bloodGroup: newStudentData.bloodGroup || 'B+',
      dateOfBirth: newStudentData.dateOfBirth || '2016-01-01',
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'active',
      guardianNameBn: newStudentData.guardianNameBn || 'অভিভাবক',
      guardianPhone: newStudentData.guardianPhone!,
      guardianRelation: newStudentData.guardianRelation || 'পিতা',
      address: newStudentData.address || 'ঢাকা',
      waiverPercent: Number(newStudentData.waiverPercent) || 0,
    };

    addStudent(created);
    setShowAddModal(false);
    alert(`শিক্ষার্থী সফলভাবে যুক্ত হয়েছে! আইডি: ${studentId}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            শিক্ষার্থী তথ্যভাণ্ডার ও প্রোফাইল
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            শিক্ষাবর্ষ {toBnDigits(activeSessionYear)} · আইডি কার্ড জেনারেশন ও প্রত্যয়নপত্র
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন শিক্ষার্থী ভর্তি করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="p-2 rounded-xl bg-white border border-[#E9D4B3] text-xs font-medium text-[#2E2017]"
          >
            <option value="all">সকল শ্রেণি ({toBnDigits(students.filter(s => s.sessionYear === activeSessionYear).length)} জন)</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.nameBn}</option>
            ))}
          </select>

          {/* Shift Filter */}
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="p-2 rounded-xl bg-white border border-[#E9D4B3] text-xs font-medium text-[#2E2017]"
          >
            <option value="all">সকল শিফট</option>
            <option value="morning">প্রভাতী</option>
            <option value="day">দিবা</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#534231]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, রোল (০১ বা 01), আইডি দিয়ে খুঁজুন..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017] focus:outline-hidden focus:border-[#984710]"
          />
        </div>
      </div>

      {/* Students Directory Table */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCF8EF] text-[#2E2017] border-b border-[#E9D4B3] font-semibold">
              <tr>
                <th className="p-3.5">রোল</th>
                <th className="p-3.5">শিক্ষার্থীর নাম</th>
                <th className="p-3.5">শিক্ষার্থী আইডি</th>
                <th className="p-3.5">শ্রেণি ও শাখা</th>
                <th className="p-3.5">অভিভাবক ও ফোন</th>
                <th className="p-3.5">রক্তের গ্রুপ</th>
                <th className="p-3.5">ফি ছাড়</th>
                <th className="p-3.5 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9D4B3]/50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-[#FCF8EF]/50 transition-colors">
                    <td className="p-3.5 font-extrabold text-[#984710] tabular-nums text-sm">
                      {st.rollNo}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-[#2E2017]">{st.nameBn}</span>
                      <span className="block text-[11px] text-[#534231]">{st.nameEn}</span>
                    </td>
                    <td className="p-3.5 font-mono text-xs font-semibold text-[#534231]">
                      {st.id}
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-[#2E2017]">
                        {classes.find((c) => c.id === st.classId)?.nameBn}
                      </span>
                      <span className="block text-[11px] text-[#534231]">
                        {st.section} শাখা · {st.shift === 'morning' ? 'প্রভাতী' : 'দিবা'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[#2E2017]">{st.guardianNameBn}</span>
                      <span className="block text-[11px] text-[#534231] font-mono tabular-nums">
                        {st.guardianPhone}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-[#2E2017]">
                      {st.bloodGroup}
                    </td>
                    <td className="p-3.5">
                      {st.waiverPercent > 0 ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold">
                          {toBnDigits(st.waiverPercent)}% ছাড়
                        </span>
                      ) : (
                        <span className="text-neutral-400">০%</span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setShowIdCardModal(st)}
                        title="আইডি কার্ড প্রিন্ট করুন"
                        className="px-2.5 py-1 bg-[#2E2017] hover:bg-black text-white text-[11px] font-medium rounded-lg cursor-pointer"
                      >
                        আইডি কার্ড
                      </button>
                      <button
                        onClick={() => setShowCertificateModal(st)}
                        title="প্রত্যয়নপত্র ও টিসি"
                        className="px-2.5 py-1 bg-[#FCF8EF] hover:bg-[#E9D4B3] border border-[#E9D4B3] text-[#2E2017] text-[11px] font-medium rounded-lg cursor-pointer"
                      >
                        প্রত্যয়নপত্র
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#534231]">
                    কোনো শিক্ষার্থী পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ID Card Modal */}
      {showIdCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-lg w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowIdCardModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#2E2017] hover:bg-[#E9D4B3] no-print"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-[#E9D4B3] pb-3 mb-4 flex items-center justify-between no-print">
              <h3 className="text-base font-bold text-[#2E2017]">শিক্ষার্থী পরিচয়পত্র (ID Card)</h3>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-[#984710] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-[#7e3a0c]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>

            {/* Printable ID Card (Front & Back Layout) */}
            <div className="printable-area space-y-4">
              {/* Card Front */}
              <div className="w-[320px] mx-auto bg-white rounded-xl border-2 border-[#984710] overflow-hidden shadow-md text-[#2E2017]">
                <div className="bg-[#2E2017] text-[#FFFBF3] p-3 text-center border-b-2 border-[#984710]">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <img
                      src={settings.logoUrl}
                      alt="Logo"
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full bg-white p-0.5 object-contain"
                    />
                    <h4 className="font-extrabold text-xs text-white leading-tight">
                      {settings.academyNameBn}
                    </h4>
                  </div>
                  <p className="text-[9px] text-[#E9D4B3]">দারুস সুন্নাহ একাডেমি · মিরপুর, ঢাকা</p>
                </div>

                <div className="p-4 text-center space-y-2">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[#F4ECDD] border-2 border-[#984710] flex items-center justify-center font-bold text-lg text-[#984710] shadow-inner">
                    {showIdCardModal.nameBn.charAt(0)}
                  </div>

                  <div>
                    <h5 className="font-extrabold text-sm text-[#2E2017]">
                      {showIdCardModal.nameBn}
                    </h5>
                    <p className="text-[11px] text-[#534231] font-semibold">{showIdCardModal.nameEn}</p>
                  </div>

                  <div className="bg-[#FCF8EF] p-2.5 rounded-lg border border-[#E9D4B3] text-left text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#534231]">আইডি নং:</span>
                      <span className="font-mono font-bold text-[#984710]">{showIdCardModal.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#534231]">শ্রেণি ও রোল:</span>
                      <span className="font-bold text-[#2E2017]">
                        {classes.find((c) => c.id === showIdCardModal.classId)?.nameBn} (রোল: {showIdCardModal.rollNo})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#534231]">শাখা ও শিফট:</span>
                      <span className="font-medium text-[#2E2017]">
                        {showIdCardModal.section} শাখা · {showIdCardModal.shift === 'morning' ? 'প্রভাতী' : 'দিবা'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#534231]">শিক্ষাবর্ষ:</span>
                      <span className="font-bold text-[#2E2017]">{toBnDigits(showIdCardModal.sessionYear)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#984710] text-white py-1 text-center text-[10px] font-bold tracking-wider">
                  STUDENT IDENTITY CARD
                </div>
              </div>

              {/* Card Back */}
              <div className="w-[320px] mx-auto bg-white rounded-xl border border-neutral-300 p-3.5 text-[10px] space-y-2 text-[#2E2017]">
                <p className="font-bold border-b border-neutral-200 pb-1 text-[#984710]">
                  জরুরি যোগাযোগ ও তথ্যাদি:
                </p>
                <div className="space-y-1">
                  <p><span className="text-neutral-500">পিতার নাম:</span> {showIdCardModal.guardianNameBn}</p>
                  <p><span className="text-neutral-500">মোবাইল:</span> <span className="font-mono">{showIdCardModal.guardianPhone}</span></p>
                  <p><span className="text-neutral-500">রক্তের গ্রুপ:</span> <span className="font-bold text-red-600">{showIdCardModal.bloodGroup}</span></p>
                  <p><span className="text-neutral-500">ঠিকানা:</span> {showIdCardModal.address}</p>
                </div>
                <div className="pt-4 flex justify-between items-end border-t border-neutral-200">
                  <div className="text-[8px] text-neutral-400">কার্ডটি পাওয়া গেলে ফেরত দিন</div>
                  <div className="text-center">
                    <span className="font-serif italic font-bold text-[#984710] block text-xs">M. Enamul</span>
                    <span className="text-[8px] border-t border-neutral-400 pt-0.5 block">প্রিন্সিপাল স্বাক্ষর</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificate / Testimonial Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-neutral-300 max-w-2xl w-full p-8 shadow-2xl relative my-8 printable-area">
            <button
              onClick={() => setShowCertificateModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 no-print"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Layout */}
            <div className="border-4 border-double border-[#984710] p-6 text-center space-y-5">
              <div className="space-y-1 border-b-2 border-[#984710] pb-4">
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 mx-auto object-contain"
                />
                <h3 className="text-2xl font-extrabold text-[#2E2017]">
                  {settings.academyNameBn}
                </h3>
                <p className="text-xs text-[#984710] font-semibold">{settings.taglineBn}</p>
                <p className="text-[11px] text-neutral-600">{settings.addressBn}</p>
              </div>

              <div className="py-2">
                <span className="text-base font-extrabold bg-[#FCF8EF] border border-[#984710] px-6 py-1 rounded-full text-[#984710]">
                  প্রত্যয়নপত্র / প্রশংসাপত্র (Testimonial)
                </span>
              </div>

              <p className="text-sm leading-loose text-justify text-[#2E2017] px-4">
                এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, <strong className="font-extrabold">{showCertificateModal.nameBn}</strong>, পিতা: {showCertificateModal.guardianNameBn}, দারুস সুন্নাহ একাডেমির <strong className="font-extrabold">{classes.find((c) => c.id === showCertificateModal.classId)?.nameBn}</strong> শ্রেণির একজন নিয়মিত ও চরিত্রবান শিক্ষার্থী। শিক্ষাবর্ষ {toBnDigits(showCertificateModal.sessionYear)}-এ তার শিক্ষার্থী আইডি <strong className="font-mono">{showCertificateModal.id}</strong> এবং শ্রেণি রোল <strong className="font-bold">{showCertificateModal.rollNo}</strong>। মাদ্রাসার অধ্যয়নকালে সে উত্তম আচরণ ও নিয়মানুবর্তিতা প্রদর্শন করেছে। সে কোনো প্রকার অনৈতিক কার্যকলাপে জড়িত নয়।
              </p>

              <p className="text-sm text-left px-4">
                আমরা তার দ্বীনি ও পার্থিব জীবনের সর্বাঙ্গীন উন্নতি ও সাফল্য কামনা করি।
              </p>

              <div className="pt-12 flex justify-between px-6 text-xs text-[#2E2017]">
                <div className="text-center">
                  <p className="border-t border-neutral-600 pt-1">তারিখ ও সিল</p>
                </div>
                <div className="text-center">
                  <p className="border-t border-neutral-600 pt-1 font-bold">প্রিন্সিপাল ও মুহতামিম</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 no-print">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#984710] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 hover:bg-[#7e3a0c] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-xl w-full p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#2E2017] hover:bg-[#E9D4B3]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-[#2E2017] mb-3 border-b border-[#E9D4B3] pb-2">
              সরাসরি শিক্ষার্থী ভর্তি ও নিবন্ধন
            </h3>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">শিক্ষার্থীর নাম (বাংলায়) *</label>
                  <input
                    type="text"
                    required
                    value={newStudentData.nameBn}
                    onChange={(e) => setNewStudentData({ ...newStudentData, nameBn: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Student Name (English)</label>
                  <input
                    type="text"
                    value={newStudentData.nameEn}
                    onChange={(e) => setNewStudentData({ ...newStudentData, nameEn: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">শ্রেণি *</label>
                  <select
                    value={newStudentData.classId}
                    onChange={(e) => setNewStudentData({ ...newStudentData, classId: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nameBn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">শাখা ও শিফট</label>
                  <div className="grid grid-cols-2 gap-1">
                    <select
                      value={newStudentData.section}
                      onChange={(e) => setNewStudentData({ ...newStudentData, section: e.target.value })}
                      className="p-2 rounded-xl bg-white border border-[#E9D4B3]"
                    >
                      <option value="ক">ক শাখা</option>
                      <option value="খ">খ শাখা</option>
                    </select>
                    <select
                      value={newStudentData.shift}
                      onChange={(e) => setNewStudentData({ ...newStudentData, shift: e.target.value as any })}
                      className="p-2 rounded-xl bg-white border border-[#E9D4B3]"
                    >
                      <option value="morning">প্রভাতী</option>
                      <option value="day">দিবা</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-medium mb-1">পিতার নাম *</label>
                  <input
                    type="text"
                    required
                    value={newStudentData.guardianNameBn}
                    onChange={(e) => setNewStudentData({ ...newStudentData, guardianNameBn: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">অভিভাবকের মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={newStudentData.guardianPhone}
                    onChange={(e) => setNewStudentData({ ...newStudentData, guardianPhone: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">রক্তের গ্রুপ</label>
                  <select
                    value={newStudentData.bloodGroup}
                    onChange={(e) => setNewStudentData({ ...newStudentData, bloodGroup: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">বিশেষ ফি ছাড় (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newStudentData.waiverPercent}
                    onChange={(e) => setNewStudentData({ ...newStudentData, waiverPercent: parseInt(e.target.value) || 0 })}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E9D4B3]">
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
                  সংরক্ষণ ও আইডি প্রদান
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
