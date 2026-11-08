import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { PublicHeader } from './components/public/PublicHeader';
import { HeroSection } from './components/public/HeroSection';
import { EducationPathways } from './components/public/EducationPathways';
import { StatisticsBand } from './components/public/StatisticsBand';
import { AcademicMethodology } from './components/public/AcademicMethodology';
import { AdmissionStepsSection } from './components/public/AdmissionStepsSection';
import { NoticesAndGallerySection } from './components/public/NoticesAndGallerySection';
import { PublicFooter } from './components/public/PublicFooter';
import {
  OnlineAdmissionModal,
  StatusLookupModal,
  ProspectusModal,
  ContactModal,
} from './components/public/PublicModals';

import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdmissionsView } from './components/admin/AdmissionsView';
import { StudentsView } from './components/admin/StudentsView';
import { AttendanceView } from './components/admin/AttendanceView';
import { FeesAccountingView } from './components/admin/FeesAccountingView';
import { QuranHifzView } from './components/admin/QuranHifzView';
import { ExamsResultsView } from './components/admin/ExamsResultsView';
import { TimetableView } from './components/admin/TimetableView';
import { StaffView } from './components/admin/StaffView';
import { BulkOperationsView } from './components/admin/BulkOperationsView';
import { AcademicSetupView } from './components/admin/AcademicSetupView';
import { CommunicationSMSView } from './components/admin/CommunicationSMSView';
import { CMSView } from './components/admin/CMSView';
import { ExtensionsView } from './components/admin/ExtensionsView';
import { ReportsView } from './components/admin/ReportsView';
import { TeacherPortalView } from './components/portal/TeacherPortalView';
import { GuardianPortalView } from './components/portal/GuardianPortalView';

function MainApp() {
  const [viewMode, setViewMode] = useState<'public' | 'admin'>('public');
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');
  const [activeNav, setActiveNav] = useState('home');

  // Public Modals State
  const [admissionModalOpen, setAdmissionModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [prospectusModalOpen, setProspectusModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [statusTrackingCode, setStatusTrackingCode] = useState('');

  const handleOpenStatusWithCode = (code: string) => {
    setStatusTrackingCode(code);
    setStatusModalOpen(true);
  };

  const handleOpenPortal = (targetTab: AdminTab = 'overview') => {
    setAdminTab(targetTab);
    setViewMode('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (viewMode === 'admin') {
    return (
      <AdminLayout
        currentTab={adminTab}
        setCurrentTab={setAdminTab}
        onExitToPublic={() => {
          setViewMode('public');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        {adminTab === 'overview' && <AdminDashboard onNavigateTab={setAdminTab} />}
        {adminTab === 'admissions' && <AdmissionsView />}
        {adminTab === 'students' && <StudentsView />}
        {adminTab === 'attendance' && <AttendanceView />}
        {adminTab === 'fees' && <FeesAccountingView />}
        {adminTab === 'quran' && <QuranHifzView />}
        {adminTab === 'exams' && <ExamsResultsView />}
        {adminTab === 'routine' && <TimetableView />}
        {adminTab === 'staff' && <StaffView />}
        {adminTab === 'bulk_ops' && <BulkOperationsView />}
        {adminTab === 'academic_setup' && <AcademicSetupView />}
        {adminTab === 'sms' && <CommunicationSMSView />}
        {adminTab === 'cms' && <CMSView />}
        {adminTab === 'extensions' && <ExtensionsView />}
        {adminTab === 'reports' && <ReportsView />}
        {adminTab === 'teacher_portal' && <TeacherPortalView onNavigateTab={setAdminTab} />}
        {adminTab === 'guardian_portal' && <GuardianPortalView />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4ECDD] text-[#2E2017] flex flex-col justify-between selection:bg-[#984710] selection:text-white">
      {/* 1. Public Header */}
      <PublicHeader
        onOpenAdmissionModal={() => setAdmissionModalOpen(true)}
        onOpenStatusModal={() => {
          setStatusTrackingCode('');
          setStatusModalOpen(true);
        }}
        onOpenProspectusModal={() => setProspectusModalOpen(true)}
        onOpenPortal={() => handleOpenPortal('overview')}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* 2. Main Page Content */}
      <main className="flex-1">
        <HeroSection
          onOpenAdmissionModal={() => setAdmissionModalOpen(true)}
          onOpenProspectusModal={() => setProspectusModalOpen(true)}
          onOpenStatusModal={() => {
            setStatusTrackingCode('');
            setStatusModalOpen(true);
          }}
        />

        <EducationPathways onOpenAdmissionModal={() => setAdmissionModalOpen(true)} />

        <StatisticsBand />

        <AcademicMethodology />

        <AdmissionStepsSection
          onOpenAdmissionModal={() => setAdmissionModalOpen(true)}
          onOpenProspectusModal={() => setProspectusModalOpen(true)}
        />

        <NoticesAndGallerySection />
      </main>

      {/* 3. Public Footer */}
      <PublicFooter
        onOpenContactModal={() => setContactModalOpen(true)}
        onOpenAdmissionModal={() => setAdmissionModalOpen(true)}
        onOpenPortal={() => handleOpenPortal('overview')}
        setActiveNav={setActiveNav}
      />

      {/* Public Interactive Modals */}
      <OnlineAdmissionModal
        isOpen={admissionModalOpen}
        onClose={() => setAdmissionModalOpen(false)}
        onOpenStatusWithCode={handleOpenStatusWithCode}
      />

      <StatusLookupModal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        initialTrackingCode={statusTrackingCode}
      />

      <ProspectusModal
        isOpen={prospectusModalOpen}
        onClose={() => setProspectusModalOpen(false)}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      {/* Quick Portal Switcher Floating Dock */}
      <div className="fixed bottom-4 right-4 z-40 no-print flex items-center gap-2 bg-[#2E2017]/95 text-white backdrop-blur-md px-3.5 py-2 rounded-full border border-[#E9D4B3]/50 shadow-xl">
        <span className="text-[11px] font-semibold text-[#E9D4B3] hidden sm:inline">
          পোর্টাল ডেমো এক্সেস:
        </span>
        <button
          onClick={() => handleOpenPortal('overview')}
          className="px-2.5 py-1 bg-[#984710] hover:bg-[#7e3a0c] text-white text-[11px] font-semibold rounded-full cursor-pointer transition-colors"
        >
          অফিস অ্যাডমিন
        </button>
        <button
          onClick={() => handleOpenPortal('teacher_portal')}
          className="px-2.5 py-1 bg-[#3B2B20] hover:bg-[#534231] text-[#E9D4B3] text-[11px] font-semibold rounded-full cursor-pointer transition-colors"
        >
          শিক্ষক
        </button>
        <button
          onClick={() => handleOpenPortal('guardian_portal')}
          className="px-2.5 py-1 bg-[#3B2B20] hover:bg-[#534231] text-[#E9D4B3] text-[11px] font-semibold rounded-full cursor-pointer transition-colors"
        >
          অভিভাবক
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
