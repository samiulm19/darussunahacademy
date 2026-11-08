import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Printer,
  Eye,
  UserCheck,
  Calendar,
  Phone,
  BookOpen,
} from 'lucide-react';
import { useApp, toBnDigits } from '../../context/AppContext';
import { AdmissionApplication, ApplicationStatus } from '../../types';

export const AdmissionsView: React.FC = () => {
  const {
    applications,
    classes,
    programs,
    updateApplicationStatus,
    enrollApplicant,
    activeSessionYear,
    settings,
  } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeApp, setActiveApp] = useState<AdmissionApplication | null>(null);

  // Review modal state
  const [reviewNotes, setReviewNotes] = useState('');
  const [interviewScore, setInterviewScore] = useState<number>(40);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredApps = applications.filter((app) => {
    if (app.sessionYear !== activeSessionYear) return false;
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    if (selectedClass !== 'all' && app.appliedClassId !== selectedClass) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        app.applicantNameBn.toLowerCase().includes(q) ||
        app.applicantNameEn.toLowerCase().includes(q) ||
        app.trackingNumber.toLowerCase().includes(q) ||
        app.fatherPhone.includes(q);
      if (!match) return false;
    }
    return true;
  });

  const openReviewModal = (app: AdmissionApplication) => {
    setActiveApp(app);
    setReviewNotes(app.reviewNotes || '');
    setInterviewScore(app.interviewScore !== undefined ? app.interviewScore : 40);
    setActionFeedback(null);
  };

  const handleApprove = () => {
    if (!activeApp) return;
    updateApplicationStatus(activeApp.id, 'approved', reviewNotes, interviewScore);
    setActionFeedback({ type: 'success', message: 'আবেদনটি সফলভাবে অনুমোদিত হয়েছে।' });
    setActiveApp({ ...activeApp, status: 'approved', reviewNotes, interviewScore });
  };

  const handleCorrection = () => {
    if (!activeApp) return;
    updateApplicationStatus(activeApp.id, 'correction_needed', reviewNotes, interviewScore);
    setActionFeedback({ type: 'success', message: 'আবেদনে সংশোধনের অনুরোধ পাঠানো হয়েছে।' });
    setActiveApp({ ...activeApp, status: 'correction_needed', reviewNotes, interviewScore });
  };

  const handleReject = () => {
    if (!activeApp) return;
    updateApplicationStatus(activeApp.id, 'rejected', reviewNotes, interviewScore);
    setActionFeedback({ type: 'success', message: 'আবেদনটি বাতিল করা হয়েছে।' });
    setActiveApp({ ...activeApp, status: 'rejected', reviewNotes, interviewScore });
  };

  const handleEnroll = () => {
    if (!activeApp) return;
    const res = enrollApplicant(activeApp.id);
    if (res.success) {
      setActionFeedback({ type: 'success', message: res.message });
      setActiveApp({
        ...activeApp,
        status: 'enrolled',
        enrolledStudentId: res.studentId,
        feeStatus: 'paid',
      });
    } else {
      setActionFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">ভর্তি আবেদন ও নিবন্ধন শাখা</h2>
          <p className="text-xs text-[#2E2017]/70">
            শিক্ষাবর্ষ {toBnDigits(activeSessionYear)} · অনলাইন ও অফলাইন আবেদন পর্যালোচনা
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#FFFBF3] border border-[#E9D4B3] px-3 py-1.5 rounded-full font-semibold text-[#2E2017]">
            মোট আবেদন: {toBnDigits(filteredApps.length)} টি
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#FCF8EF] p-1 rounded-xl border border-[#E9D4B3]">
            {[
              { id: 'all', label: 'সকল' },
              { id: 'submitted', label: 'নতুন জমা' },
              { id: 'under_review', label: 'ভাইভা পর্যায়' },
              { id: 'approved', label: 'অনুমোদিত' },
              { id: 'enrolled', label: 'ভর্তি সম্পন্ন' },
              { id: 'rejected', label: 'বাতিল' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedStatus === tab.id
                    ? 'bg-[#984710] text-white font-bold'
                    : 'text-[#2E2017] hover:bg-[#E9D4B3]/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="p-1.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017]"
          >
            <option value="all">সকল শ্রেণি</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>{c.nameBn}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#534231]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, ফোন বা ট্র্যাকিং দিয়ে খুঁজুন..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#E9D4B3] text-xs text-[#2E2017] focus:outline-hidden focus:border-[#984710]"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FCF8EF] text-[#2E2017] border-b border-[#E9D4B3] font-semibold">
              <tr>
                <th className="p-3.5">ট্র্যাকিং নম্বর</th>
                <th className="p-3.5">শিক্ষার্থীর নাম</th>
                <th className="p-3.5">আবেদিত শ্রেণি</th>
                <th className="p-3.5">পিতা ও মোবাইল</th>
                <th className="p-3.5">আবেদনের তারিখ</th>
                <th className="p-3.5">ভাইভা স্কোর</th>
                <th className="p-3.5">অবস্থা</th>
                <th className="p-3.5 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9D4B3]/50">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#FCF8EF]/50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-[#984710]">
                      {app.trackingNumber}
                    </td>
                    <td className="p-3.5 font-bold text-[#2E2017]">
                      {app.applicantNameBn}
                      <span className="block text-[11px] font-normal text-[#534231]">
                        {app.gender === 'male' ? 'ছাত্র' : 'ছাত্রী'} · {app.dateOfBirth}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-[#2E2017]">
                        {classes.find((c) => c.id === app.appliedClassId)?.nameBn}
                      </span>
                      <span className="block text-[11px] text-[#534231]">
                        {app.preferredShift === 'morning' ? 'প্রভাতী' : 'দিবা'} শিফট
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[#2E2017] font-medium">{app.fatherNameBn}</span>
                      <span className="block text-[11px] text-[#534231] font-mono tabular-nums">
                        {app.fatherPhone}
                      </span>
                    </td>
                    <td className="p-3.5 text-[#534231] tabular-nums">
                      {app.submissionDate}
                    </td>
                    <td className="p-3.5">
                      {app.interviewScore !== undefined ? (
                        <span className="font-bold text-[#2E2017] tabular-nums">
                          {toBnDigits(app.interviewScore)} / ৫০
                        </span>
                      ) : (
                        <span className="text-neutral-400">মৌখিক বাকি</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          app.status === 'enrolled'
                            ? 'bg-emerald-600 text-white'
                            : app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'correction_needed'
                            ? 'bg-orange-100 text-orange-800'
                            : app.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status === 'enrolled'
                          ? 'ভর্তি সম্পন্ন'
                          : app.status === 'approved'
                          ? 'অনুমোদিত'
                          : app.status === 'correction_needed'
                          ? 'সংশোধন'
                          : app.status === 'rejected'
                          ? 'বাতিল'
                          : 'অপেক্ষমান'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openReviewModal(app)}
                        className="px-3 py-1 bg-[#2E2017] hover:bg-black text-[#FFFBF3] font-medium rounded-lg cursor-pointer transition-colors"
                      >
                        পর্যালোচনা
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#534231]">
                    কোনো আবেদন খুঁজে পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Review & Enrollment Modal */}
      {activeApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-2xl w-full p-6 shadow-2xl relative my-8 printable-area">
            <button
              onClick={() => setActiveApp(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#2E2017] hover:bg-[#E9D4B3] transition-colors cursor-pointer no-print"
            >
              <XCircle className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-[#E9D4B3] pb-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#984710]">
                    ভর্তি আবেদন যাচাই ও চূড়ান্ত অনুমোদন
                  </span>
                  <h3 className="text-xl font-bold text-[#2E2017]">
                    {activeApp.applicantNameBn} ({activeApp.trackingNumber})
                  </h3>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#FCF8EF] border border-[#E9D4B3] text-xs font-semibold rounded-lg flex items-center gap-1.5 no-print cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#984710]" />
                  <span>ফর্ম প্রিন্ট</span>
                </button>
              </div>
            </div>

            {/* Action Feedback alert */}
            {actionFeedback && (
              <div
                className={`p-3 rounded-xl mb-4 text-xs font-semibold flex items-center gap-2 no-print ${
                  actionFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{actionFeedback.message}</span>
              </div>
            )}

            {/* Applicant Details Grid */}
            <div className="bg-[#FCF8EF] p-4 rounded-xl border border-[#E9D4B3] space-y-3 text-xs mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-[#534231] block">আবেদিত শ্রেণি:</span>
                  <span className="font-bold text-[#2E2017]">
                    {classes.find((c) => c.id === activeApp.appliedClassId)?.nameBn} ({activeApp.preferredShift === 'morning' ? 'প্রভাতী' : 'দিবা'})
                  </span>
                </div>
                <div>
                  <span className="text-[#534231] block">জন্ম তারিখ:</span>
                  <span className="font-bold text-[#2E2017]">{activeApp.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-[#534231] block">রক্তের গ্রুপ:</span>
                  <span className="font-bold text-[#2E2017]">{activeApp.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-[#534231] block">পিতার নাম ও পেশা:</span>
                  <span className="font-bold text-[#2E2017]">{activeApp.fatherNameBn} ({activeApp.fatherOccupation || 'ব্যবসায়ী'})</span>
                </div>
                <div>
                  <span className="text-[#534231] block">যোগাযোগ মোবাইল:</span>
                  <span className="font-bold text-[#2E2017] tabular-nums">{activeApp.fatherPhone}</span>
                </div>
                <div>
                  <span className="text-[#534231] block">মাতার নাম:</span>
                  <span className="font-bold text-[#2E2017]">{activeApp.motherNameBn}</span>
                </div>
              </div>
              <div>
                <span className="text-[#534231] block">বর্তমান ঠিকানা:</span>
                <span className="font-medium text-[#2E2017]">{activeApp.guardianAddress}</span>
              </div>
            </div>

            {/* Viva Score & Review Controls */}
            <div className="space-y-3 mb-6 no-print">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-[#2E2017] mb-1">
                    মৌখিক মূল্যায়ন / ভাইভা স্কোর (৫০ এর মধ্যে)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={interviewScore}
                    onChange={(e) => setInterviewScore(parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3] text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#2E2017] mb-1">
                    পর্যালোচনা ও ভাইভা মন্তব্য
                  </label>
                  <input
                    type="text"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="যেমন: তাজবীদ ও মাখরাজ সুন্দর..."
                    className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3] text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Workflow Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E9D4B3] no-print">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCorrection}
                  className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  সংশোধন প্রয়োজন
                </button>
                <button
                  onClick={handleReject}
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  বাতিল করুন
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-full shadow-xs cursor-pointer"
                >
                  অনুমোদন দিন
                </button>

                {/* Enrollment button with duplicate protection */}
                <button
                  onClick={handleEnroll}
                  disabled={activeApp.status === 'enrolled'}
                  className={`px-4 py-2 text-xs font-bold rounded-full shadow-md flex items-center gap-1.5 cursor-pointer ${
                    activeApp.status === 'enrolled'
                      ? 'bg-neutral-300 text-neutral-600 cursor-not-allowed'
                      : 'bg-[#984710] hover:bg-[#7e3a0c] text-white'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {activeApp.status === 'enrolled' ? 'ইতিমধ্যে ভর্তি সম্পন্ন' : 'ভর্তি নিশ্চিত ও আইডি তৈরি'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
