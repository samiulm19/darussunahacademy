import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Printer,
  Search,
  Download,
  AlertCircle,
  FileCheck,
  Send,
  Building,
} from 'lucide-react';
import { useApp, formatTaka, toBnDigits } from '../../context/AppContext';
import { AdmissionApplication } from '../../types';

interface OnlineAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenStatusWithCode?: (code: string) => void;
}

export const OnlineAdmissionModal: React.FC<OnlineAdmissionModalProps> = ({
  isOpen,
  onClose,
  onOpenStatusWithCode,
}) => {
  const { programs, classes, submitApplication, activeSessionYear, settings } = useApp();

  const [formData, setFormData] = useState({
    programId: programs[0]?.id || 'prog-quran',
    appliedClassId: classes[0]?.id || 'cls-hifz',
    preferredShift: 'morning' as 'morning' | 'day',
    applicantNameBn: '',
    applicantNameEn: '',
    gender: 'male' as 'male' | 'female',
    dateOfBirth: '2016-01-01',
    bloodGroup: 'B+',
    fatherNameBn: '',
    fatherNameEn: '',
    fatherPhone: '',
    fatherOccupation: '',
    motherNameBn: '',
    motherNameEn: '',
    guardianAddress: '',
    previousInstitute: '',
    hifzCurrentPara: 0,
  });

  const [submittedTrackingCode, setSubmittedTrackingCode] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicantNameBn.trim()) {
      setFormError('শিক্ষার্থীর বাংলা নাম লিখুন।');
      return;
    }
    if (!formData.fatherNameBn.trim()) {
      setFormError('পিতার নাম লিখুন।');
      return;
    }
    if (!formData.fatherPhone.trim()) {
      setFormError('অভিভাবকের মোবাইল নম্বর আবশ্যক।');
      return;
    }
    if (!formData.guardianAddress.trim()) {
      setFormError('বর্তমান ঠিকানা লিখুন।');
      return;
    }

    setFormError('');
    const trackingCode = submitApplication({
      sessionYear: activeSessionYear,
      ...formData,
    });
    setSubmittedTrackingCode(trackingCode);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#2E2017] hover:bg-[#E9D4B3] transition-colors cursor-pointer no-print"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedTrackingCode ? (
          /* Confirmation & Printable Slip Screen */
          <div className="space-y-6 printable-area">
            <div className="text-center space-y-2 pb-4 border-b border-[#E9D4B3]">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
                ভর্তি আবেদন সফলভাবে গৃহীত হয়েছে!
              </h3>
              <p className="text-xs text-[#2E2017]/70">
                দারুস সুন্নাহ একাডেমি · শিক্ষাবর্ষ {settings.activeSessionYear}
              </p>
            </div>

            <div className="bg-[#FCF8EF] p-5 rounded-xl border border-[#E9D4B3] space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-[#E9D4B3]/60">
                <span className="text-xs font-semibold text-[#534231]">আবেদন ট্র্যাকিং নম্বর:</span>
                <span className="text-base font-extrabold text-[#984710] tracking-wider select-all">
                  {submittedTrackingCode}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#534231]">শিক্ষার্থীর নাম:</span>{' '}
                  <span className="font-bold text-[#2E2017]">{formData.applicantNameBn}</span>
                </div>
                <div>
                  <span className="text-[#534231]">আবেদনকৃত শ্রেণি:</span>{' '}
                  <span className="font-bold text-[#2E2017]">
                    {classes.find((c) => c.id === formData.appliedClassId)?.nameBn}
                  </span>
                </div>
                <div>
                  <span className="text-[#534231]">পিতার নাম:</span>{' '}
                  <span className="font-bold text-[#2E2017]">{formData.fatherNameBn}</span>
                </div>
                <div>
                  <span className="text-[#534231]">মোবাইল:</span>{' '}
                  <span className="font-bold text-[#2E2017] tabular-nums">{formData.fatherPhone}</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-900 leading-relaxed">
              <p className="font-bold mb-1">পরবর্তী করণীয় নির্দেশিকা:</p>
              <p>
                অনুগ্রহ করে আপনার ট্র্যাকিং নম্বরটি সংরক্ষণ করুন। আগামী ৩ কার্যদিবসের মধ্যে আপনার মোবাইলে ভাইভা বা মূল্যায়নের তারিখ ও সময় এসএমএসের মাধ্যমে জানানো হবে। ভাইভার দিন প্রয়োজনীয় মূল কাগজপত্র সঙ্গে আনতে হবে।
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E9D4B3] no-print">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-[#2E2017] text-white text-xs font-semibold rounded-full flex items-center gap-2 cursor-pointer hover:bg-black"
              >
                <Printer className="w-4 h-4 text-[#E9D4B3]" />
                <span>আবেদনপত্র প্রিন্ট করুন</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenStatusWithCode) onOpenStatusWithCode(submittedTrackingCode);
                }}
                className="px-5 py-2.5 bg-[#984710] text-white text-xs font-semibold rounded-full cursor-pointer hover:bg-[#7e3a0c]"
              >
                স্ট্যাটাস ট্র্যাকিং দেখুন
              </button>
            </div>
          </div>
        ) : (
          /* Application Input Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-[#E9D4B3] pb-3">
              <span className="text-xs font-bold text-[#984710]">অনলাইন ভর্তি আবেদন</span>
              <h3 className="text-xl font-bold text-[#2E2017]">
                {settings.academyNameBn} · শিক্ষাবর্ষ {settings.activeSessionYear}
              </h3>
              <p className="text-xs text-[#2E2017]/70 mt-1">
                সকল তথ্য নির্ভুলভাবে বাংলায় অথবা ইংরেজিতে পূরণ করুন।
              </p>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Program & Class selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2E2017] mb-1">শিক্ষাধারা *</label>
                  <select
                    value={formData.programId}
                    onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017] focus:outline-hidden focus:border-[#984710]"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>{p.nameBn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2E2017] mb-1">শ্রেণি / বিভাগ *</label>
                  <select
                    value={formData.appliedClassId}
                    onChange={(e) => setFormData({ ...formData, appliedClassId: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017] focus:outline-hidden focus:border-[#984710]"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nameBn}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2E2017] mb-1">শিফট *</label>
                  <select
                    value={formData.preferredShift}
                    onChange={(e) => setFormData({ ...formData, preferredShift: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017] focus:outline-hidden focus:border-[#984710]"
                  >
                    <option value="morning">প্রভাতী শিফট</option>
                    <option value="day">দিবা শিফট</option>
                  </select>
                </div>
              </div>

              {/* Student Personal Info */}
              <div className="pt-2 border-t border-[#E9D4B3]/60">
                <h4 className="text-xs font-bold text-[#984710] mb-2.5">শিক্ষার্থীর তথ্য</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#2E2017] mb-1">শিক্ষার্থীর নাম (বাংলায়) *</label>
                    <input
                      type="text"
                      required
                      value={formData.applicantNameBn}
                      onChange={(e) => setFormData({ ...formData, applicantNameBn: e.target.value })}
                      placeholder="যেমন: মুহাম্মদ আব্দুল্লাহ"
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017] focus:outline-hidden focus:border-[#984710]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2E2017] mb-1">Student Name (English)</label>
                    <input
                      type="text"
                      value={formData.applicantNameEn}
                      onChange={(e) => setFormData({ ...formData, applicantNameEn: e.target.value })}
                      placeholder="e.g. Muhammad Abdullah"
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017] focus:outline-hidden focus:border-[#984710]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2E2017] mb-1">জন্ম তারিখ *</label>
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017] focus:outline-hidden focus:border-[#984710]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-[#2E2017] mb-1">লিঙ্গ *</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017]"
                      >
                        <option value="male">ছাত্র</option>
                        <option value="female">ছাত্রী</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#2E2017] mb-1">রক্তের গ্রুপ</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017]"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guardian Info */}
              <div className="pt-2 border-t border-[#E9D4B3]/60">
                <h4 className="text-xs font-bold text-[#984710] mb-2.5">অভিভাবকের তথ্য</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#2E2017] mb-1">পিতার নাম (বাংলায়) *</label>
                    <input
                      type="text"
                      required
                      value={formData.fatherNameBn}
                      onChange={(e) => setFormData({ ...formData, fatherNameBn: e.target.value })}
                      placeholder="পিতার নাম"
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017] focus:outline-hidden focus:border-[#984710]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2E2017] mb-1">অভিভাবকের মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      value={formData.fatherPhone}
                      onChange={(e) => setFormData({ ...formData, fatherPhone: e.target.value })}
                      placeholder="যেমন: ০১৭XXXXXXXX"
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017] focus:outline-hidden focus:border-[#984710]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2E2017] mb-1">পিতার পেশা</label>
                    <input
                      type="text"
                      value={formData.fatherOccupation}
                      onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                      placeholder="যেমন: ব্যবসা / চাকরি"
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2E2017] mb-1">মাতার নাম (বাংলায়)</label>
                    <input
                      type="text"
                      value={formData.motherNameBn}
                      onChange={(e) => setFormData({ ...formData, motherNameBn: e.target.value })}
                      placeholder="মাতার নাম"
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-[#2E2017] mb-1">বর্তমান ঠিকানা *</label>
                    <input
                      type="text"
                      required
                      value={formData.guardianAddress}
                      onChange={(e) => setFormData({ ...formData, guardianAddress: e.target.value })}
                      placeholder="বাড়ি/ফ্ল্যাট, রোড, এলাকা, থানা ও জেলা"
                      className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017] focus:outline-hidden focus:border-[#984710]"
                    />
                  </div>
                </div>
              </div>

              {/* Previous Background (Optional) */}
              <div className="pt-2 border-t border-[#E9D4B3]/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#2E2017] mb-1">পূর্ববর্তী শিক্ষাপ্রতিষ্ঠান</label>
                  <input
                    type="text"
                    value={formData.previousInstitute}
                    onChange={(e) => setFormData({ ...formData, previousInstitute: e.target.value })}
                    placeholder="মাদ্রাসা বা স্কুলের নাম (যদি থাকে)"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2E2017] mb-1">হিফজ সম্পন্ন পারা সংখ্যা (প্রযোজ্য ক্ষেত্রে)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={formData.hifzCurrentPara}
                    onChange={(e) => setFormData({ ...formData, hifzCurrentPara: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9D4B3] flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#2E2017]/30 text-[#2E2017] text-xs font-medium rounded-full cursor-pointer hover:bg-[#E9D4B3]/30"
              >
                বাতিল করুন
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs font-semibold rounded-full shadow-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>আবেদন জমা দিন</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface StatusLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrackingCode?: string;
}

export const StatusLookupModal: React.FC<StatusLookupModalProps> = ({
  isOpen,
  onClose,
  initialTrackingCode = '',
}) => {
  const { applications, classes, programs, settings } = useApp();
  const [query, setQuery] = useState(initialTrackingCode);
  const [result, setResult] = useState<AdmissionApplication | null>(() => {
    if (initialTrackingCode) {
      return (
        applications.find(
          (a) => a.trackingNumber.toLowerCase() === initialTrackingCode.toLowerCase()
        ) || null
      );
    }
    return null;
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialTrackingCode));

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setHasSearched(true);
    const q = query.trim().toLowerCase();
    const app = applications.find(
      (a) =>
        a.trackingNumber.toLowerCase() === q ||
        a.fatherPhone.replace(/\s+/g, '') === q.replace(/\s+/g, '')
    );
    setResult(app || null);
  };

  const getStatusBadge = (status: AdmissionApplication['status']) => {
    switch (status) {
      case 'submitted':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded text-xs font-bold">আবেদন গৃহীত</span>;
      case 'under_review':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded text-xs font-bold">মূল্যায়ন / ভাইভা পর্যায়</span>;
      case 'correction_needed':
        return <span className="bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded text-xs font-bold">সংশোধন প্রয়োজন</span>;
      case 'approved':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-xs font-bold">ভর্তি অনুমোদিত</span>;
      case 'enrolled':
        return <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded text-xs font-bold">ভর্তি সম্পন্ন</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded text-xs font-bold">অনুমোদিত হয়নি</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded text-xs font-bold">ড্রাফট</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#2E2017] hover:bg-[#E9D4B3] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E9D4B3]">
          <Search className="w-5 h-5 text-[#984710]" />
          <h3 className="text-lg font-bold text-[#2E2017]">ভর্তি আবেদন ট্র্যাকিং</h3>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="আবেদন ট্র্যাকিং নম্বর (যেমন: DSA-2026-1041)..."
            className="flex-1 p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017] focus:outline-hidden focus:border-[#984710]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            খুঁজুন
          </button>
        </form>

        {hasSearched && (
          <div>
            {result ? (
              <div className="bg-[#FCF8EF] p-4 rounded-xl border border-[#E9D4B3] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E9D4B3]/70 pb-2">
                  <div>
                    <span className="text-[11px] text-[#534231]">ট্র্যাকিং নম্বর:</span>
                    <p className="text-sm font-extrabold text-[#984710]">{result.trackingNumber}</p>
                  </div>
                  <div>{getStatusBadge(result.status)}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#534231]">শিক্ষার্থী:</span>{' '}
                    <span className="font-bold text-[#2E2017]">{result.applicantNameBn}</span>
                  </div>
                  <div>
                    <span className="text-[#534231]">শ্রেণি:</span>{' '}
                    <span className="font-bold text-[#2E2017]">
                      {classes.find((c) => c.id === result.appliedClassId)?.nameBn}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#534231]">আবেদনের তারিখ:</span>{' '}
                    <span className="text-[#2E2017]">{result.submissionDate}</span>
                  </div>
                  <div>
                    <span className="text-[#534231]">ফি স্ট্যাটাস:</span>{' '}
                    <span className="font-semibold text-[#2E2017]">
                      {result.feeStatus === 'paid' ? 'পরিশোধিত' : 'অপেক্ষমান'}
                    </span>
                  </div>
                </div>

                {result.interviewRemarks && (
                  <div className="p-2.5 bg-white rounded-lg border border-[#E9D4B3] text-xs">
                    <span className="font-bold text-[#984710]">ভাইভা/মূল্যায়ন মন্তব্য:</span>{' '}
                    <span className="text-[#2E2017]">{result.interviewRemarks}</span>
                    {result.interviewScore !== undefined && (
                      <span className="block mt-1 font-semibold text-emerald-700">
                        মৌখিক স্কোর: {result.interviewScore} / ৫০
                      </span>
                    )}
                  </div>
                )}

                {result.enrolledStudentId && (
                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 font-bold">
                    ভর্তি নিশ্চিত! স্থায়ী শিক্ষার্থী আইডি: {result.enrolledStudentId}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-center">
                প্রদত্ত ট্র্যাকিং নম্বরে কোনো আবেদন পাওয়া যায়নি। অনুগ্রহ করে সঠিক নম্বর দিন অথবা একাডেমি অফিসে যোগাযোগ করুন।
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#2E2017] text-white text-xs font-semibold rounded-full cursor-pointer hover:bg-black"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProspectusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProspectusModal: React.FC<ProspectusModalProps> = ({ isOpen, onClose }) => {
  const { settings, programs, classes } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#2E2017] hover:bg-[#E9D4B3] transition-colors cursor-pointer no-print"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pb-4 border-b border-[#E9D4B3]">
          <h3 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            {settings.academyNameBn}
          </h3>
          <p className="text-xs text-[#984710] font-semibold">{settings.taglineBn}</p>
          <p className="text-[11px] text-[#2E2017]/70">
            শিক্ষাবর্ষ {settings.activeSessionYear} · একাডেমিক প্রসপেক্টাস ও ভর্তি নির্দেশিকা
          </p>
        </div>

        <div className="space-y-4 py-4 text-xs text-[#2E2017] max-h-[60vh] overflow-y-auto pr-1">
          <div className="bg-[#FCF8EF] p-3.5 rounded-xl border border-[#E9D4B3]">
            <h4 className="font-bold text-[#984710] text-sm mb-1.5">একাডেমির লক্ষ্য ও রূপরেখা</h4>
            <p className="leading-relaxed">
              দারুস সুন্নাহ একাডেমি একটি যুগোপযোগী সমন্বিত দ্বীনি শিক্ষাপ্রতিষ্ঠান। পবিত্র কুরআনের হাফেজ তৈরি, বিশুদ্ধ সুন্নাহর তারবিয়াহ প্রদান এবং আধুনিক জাতীয় শিক্ষাক্রমের মাধ্যমে দ্বীন ও দুনিয়ায় সফল আদর্শ প্রজন্ম গড়ে তোলাই আমাদের রূপকল্প।
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#2E2017] text-sm mb-2">অনুমোদিত বিভাগ ও মাসিক ফি কাঠামো</h4>
            <div className="border border-[#E9D4B3] rounded-xl overflow-hidden bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FCF8EF] text-[#2E2017] border-b border-[#E9D4B3]">
                  <tr>
                    <th className="p-2.5">শ্রেণি / বিভাগ</th>
                    <th className="p-2.5">ভর্তি ফি</th>
                    <th className="p-2.5">মাসিক বেতন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9D4B3]/50">
                  {classes.map((cls) => (
                    <tr key={cls.id}>
                      <td className="p-2.5 font-medium">{cls.nameBn}</td>
                      <td className="p-2.5 tabular-nums">{formatTaka(cls.admissionFee)}</td>
                      <td className="p-2.5 tabular-nums">{formatTaka(cls.monthlyFee)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#FCF8EF] p-3.5 rounded-xl border border-[#E9D4B3] space-y-1.5">
            <h4 className="font-bold text-[#984710] text-sm">ভর্তির সময় প্রয়োজনীয় কাগজপত্র:</h4>
            <ul className="list-disc list-inside space-y-1 text-[#2E2017]/85">
              <li>শিক্ষার্থীর অনলাইন জন্মনিবন্ধন সনদ (১ কপি)</li>
              <li>পিতা ও মাতার জাতীয় পরিচয়পত্র (NID) কপি</li>
              <li>শিক্ষার্থীর পাসপোর্ট সাইজের রঙিন ছবি (৪ কপি)</li>
              <li>পূর্ববর্তী মাদরাসা বা স্কুলের ছাড়পত্র ও মার্কশিট (প্রযোজ্য ক্ষেত্রে)</li>
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#E9D4B3] no-print">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#2E2017] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-black"
          >
            <Printer className="w-3.5 h-3.5 text-[#E9D4B3]" />
            <span>প্রিন্ট করুন</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#984710] text-white text-xs font-semibold rounded-full cursor-pointer hover:bg-[#7e3a0c]"
          >
            ঠিক আছে
          </button>
        </div>
      </div>
    </div>
  );
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const { submitContactMessage, settings } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    submitContactMessage({
      name,
      phone,
      email: email || 'N/A',
      subject: subject || 'সাধারণ অনুসন্ধান',
      message,
    });
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#2E2017] hover:bg-[#E9D4B3] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-[#2E2017]">আপনার বার্তাটি পৌঁছেছে!</h3>
            <p className="text-xs text-[#2E2017]/75">
              আমাদের অফিস কর্মকর্তা শীঘ্রই আপনার প্রদত্ত ফোন নম্বরে যোগাযোগ করবেন।
            </p>
            <button
              onClick={onClose}
              className="mt-3 px-5 py-2 bg-[#984710] text-white text-xs font-semibold rounded-full"
            >
              বন্ধ করুন
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-[#E9D4B3] pb-2">
              <h3 className="text-lg font-bold text-[#2E2017]">একাডেমি অফিসে বার্তা পাঠান</h3>
              <p className="text-xs text-[#2E2017]/70">
                যেকোনো জিজ্ঞাসা বা ভর্তি পরামর্শের জন্য নিচের ফর্মটি পূরণ করুন।
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#2E2017] mb-1">আপনার নাম *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="আপনার পূর্ণ নাম"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs focus:outline-hidden focus:border-[#984710]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#2E2017] mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১৭XXXXXXXX"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs focus:outline-hidden focus:border-[#984710]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#2E2017] mb-1">ইমেইল (ঐচ্ছিক)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs focus:outline-hidden focus:border-[#984710]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#2E2017] mb-1">বিষয়</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="যেমন: ভর্তি তথ্য / হোস্টেল ফি"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs focus:outline-hidden focus:border-[#984710]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#2E2017] mb-1">বার্তা / প্রশ্ন *</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="বিস্তারিত লিখুন..."
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs focus:outline-hidden focus:border-[#984710]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E9D4B3]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#2E2017]/30 text-[#2E2017] text-xs font-medium rounded-full cursor-pointer hover:bg-[#E9D4B3]/30"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#984710] text-white text-xs font-semibold rounded-full hover:bg-[#7e3a0c] cursor-pointer"
              >
                বার্তা পাঠান
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
