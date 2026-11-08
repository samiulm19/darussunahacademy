import React, { useState } from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  Award,
  BookOpen,
  MessageSquare,
  Settings,
  Globe,
  Sliders,
  FileSpreadsheet,
  ChevronDown,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  UserCheck,
  Shield,
  Layers,
  ArrowRightLeft,
  School,
  Database,
  Building,
  RotateCcw,
} from 'lucide-react';
import { useApp, normalizeDigits, toBnDigits } from '../../context/AppContext';
import { UserRole } from '../../types';

export type AdminTab =
  | 'overview'
  | 'admissions'
  | 'students'
  | 'academic_setup'
  | 'attendance'
  | 'routine'
  | 'fees'
  | 'exams'
  | 'quran'
  | 'staff'
  | 'sms'
  | 'bulk_ops'
  | 'cms'
  | 'extensions'
  | 'reports'
  | 'teacher_portal'
  | 'guardian_portal';

interface AdminLayoutProps {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  onExitToPublic: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  onExitToPublic,
  children,
}) => {
  const {
    settings,
    currentUser,
    setCurrentUserRole,
    sessions,
    activeSessionYear,
    setActiveSessionYear,
    students,
    applications,
    resetToDemoData,
    exportDatabaseJson,
  } = useApp();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Navigation Items
  const navGroups = [
    {
      group: 'প্রধান ড্যাশবোর্ড',
      roles: ['super_admin', 'office_admission', 'accounts', 'academic_exam', 'content_editor'],
      items: [
        { id: 'overview' as AdminTab, label: 'সার্বিক তথ্য ও ড্যাশবোর্ড', icon: LayoutDashboard },
        { id: 'admissions' as AdminTab, label: 'ভর্তি ব্যবস্থাপনা', icon: GraduationCap, badge: applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length },
        { id: 'students' as AdminTab, label: 'শিক্ষার্থী তথ্যভাণ্ডার', icon: Users },
      ],
    },
    {
      group: 'দৈনন্দিন একাডেমিক কাজ',
      roles: ['super_admin', 'office_admission', 'academic_exam', 'teacher'],
      items: [
        { id: 'attendance' as AdminTab, label: 'দৈনিক হাজিরা', icon: CalendarCheck },
        { id: 'quran' as AdminTab, label: 'তাহফিজুল কুরআন ডায়েরি', icon: BookOpen },
        { id: 'routine' as AdminTab, label: 'ক্লাস রুটিন ও সিডিউল', icon: CalendarDays },
        { id: 'exams' as AdminTab, label: 'পরীক্ষা ও ফলাফল', icon: Award },
      ],
    },
    {
      group: 'হিসাব ও প্রশাসন',
      roles: ['super_admin', 'accounts', 'office_admission'],
      items: [
        { id: 'fees' as AdminTab, label: 'ফি আদায় ও হিসাব', icon: CreditCard },
        { id: 'staff' as AdminTab, label: 'শিক্ষক ও কর্মচারী', icon: UserCheck },
        { id: 'sms' as AdminTab, label: 'এসএমএস ও নোটিশ', icon: MessageSquare },
        { id: 'bulk_ops' as AdminTab, label: 'বাল্ক ডেটা ইমপোর্ট/এক্সপোর্ট', icon: FileSpreadsheet },
        { id: 'reports' as AdminTab, label: 'একাডেমিক রিপোর্ট', icon: Layers },
      ],
    },
    {
      group: 'সেটআপ ও কনফিগারেশন',
      roles: ['super_admin', 'content_editor'],
      items: [
        { id: 'academic_setup' as AdminTab, label: 'একাডেমিক কাঠামো', icon: School },
        { id: 'cms' as AdminTab, label: 'পাবলিক ওয়েবসাইট CMS', icon: Globe },
        { id: 'extensions' as AdminTab, label: 'মডিউল এক্সটেনশনস', icon: Sliders },
      ],
    },
    {
      group: 'ব্যক্তিগত পোর্টাল ভিউ',
      roles: ['super_admin', 'teacher', 'guardian'],
      items: [
        { id: 'teacher_portal' as AdminTab, label: 'শিক্ষক পোর্টাল', icon: Award },
        { id: 'guardian_portal' as AdminTab, label: 'অভিভাবক পোর্টাল', icon: Users },
      ],
    },
  ];

  // Role labels in Bengali
  const roleNames: Record<UserRole, string> = {
    super_admin: 'সুপার অ্যাডমিন (Super Admin)',
    office_admission: 'অফিস ও ভর্তি শাখা (Admission)',
    accounts: 'হিসাব কর্মকর্তা (Accounts)',
    academic_exam: 'পরীক্ষা নিয়ন্ত্রক (Exam)',
    teacher: 'সহকারী শিক্ষক (Teacher)',
    content_editor: 'কনটেন্ট এডিটর (Editor)',
    guardian: 'অভিভাবক (Guardian)',
  };

  const handleGlobalSearch = (val: string) => {
    setGlobalSearch(val);
    if (!val.trim()) {
      setSearchResults([]);
      return;
    }
    const q = normalizeDigits(val);
    const matches = students
      .filter(
        (s) =>
          normalizeDigits(s.nameBn).includes(q) ||
          normalizeDigits(s.nameEn).includes(q) ||
          normalizeDigits(s.id).includes(q) ||
          normalizeDigits(s.rollNo).includes(q)
      )
      .slice(0, 5);
    setSearchResults(matches);
  };

  return (
    <div className="min-h-screen flex bg-[#F4ECDD] text-[#2E2017]">
      {/* 1. Dark Sidebar (#2E2017) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2E2017] text-[#FFFBF3] border-r border-[#534231] flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Academy Brand Lockup in Sidebar */}
          <div className="p-4 border-b border-[#534231] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={settings.logoUrl}
                alt="Logo"
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full border border-[#E9D4B3] bg-white p-0.5 object-contain"
              />
              <div className="overflow-hidden">
                <h2 className="text-sm font-bold text-white leading-tight truncate">
                  {settings.academyNameBn}
                </h2>
                <span className="text-[10px] text-[#E9D4B3] block truncate">
                  ম্যানেজমেন্ট পোর্টাল
                </span>
              </div>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-[#E9D4B3] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Session & Role Pill in Sidebar */}
          <div className="p-3 bg-[#231710] border-b border-[#534231] space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#E9D4B3]/70">সেশন নির্বাচন:</span>
              <select
                value={activeSessionYear}
                onChange={(e) => setActiveSessionYear(e.target.value)}
                className="bg-[#3B2B20] text-[#FFFBF3] border border-[#534231] rounded-md px-2 py-0.5 text-xs font-semibold focus:outline-hidden"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.year}>
                    {s.yearBn} {s.isActive ? '(চলমান)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Links Scroll Container */}
          <nav className="p-3 space-y-4 max-h-[calc(100vh-230px)] overflow-y-auto">
            {navGroups.map((grp, gIdx) => (
              <div key={gIdx} className="space-y-1">
                <p className="text-[10px] font-bold text-[#E9D4B3]/60 px-2 uppercase tracking-wider">
                  {grp.group}
                </p>
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#984710] text-white shadow-xs font-semibold'
                          : 'text-[#FFFBF3]/80 hover:bg-[#3B2B20] hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#E9D4B3]'}`} />
                        <span>{item.label}</span>
                      </span>
                      {Boolean(item.badge) && item.badge! > 0 && (
                        <span className="bg-[#984710] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-3 border-t border-[#534231] bg-[#231710] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <button
              onClick={exportDatabaseJson}
              title="সম্পূর্ণ ডেটাবেজ ব্যাকআপ ডাউনলোড করুন"
              className="flex items-center gap-1.5 text-[11px] text-[#E9D4B3] hover:text-white cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>ব্যাকআপ নিন</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('আপনি কি সব ডেটা রিসেট করে প্রাথমিক ডেমো অবস্থায় ফিরতে চান?')) {
                  resetToDemoData();
                  alert('ডেটাবেজ সফলভাবে রিসেট হয়েছে!');
                }
              }}
              title="ডেমো ডেটায় ফেরত যান"
              className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-100 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট</span>
            </button>
          </div>

          <button
            onClick={onExitToPublic}
            className="w-full flex items-center justify-center gap-2 py-1.5 bg-[#3B2B20] hover:bg-[#534231] text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#E9D4B3]" />
            <span>পাবলিক ওয়েবসাইটে ফিরুন</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (offset by 256px on desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* 2. Ivory Header Surface (#FCF8EF) */}
        <header className="sticky top-0 z-30 bg-[#FCF8EF] border-b border-[#E9D4B3] px-4 sm:px-6 py-2.5 shadow-xs">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Hamburger + Page Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 text-[#2E2017] hover:bg-[#E9D4B3]/50 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:block">
                <span className="text-[11px] font-semibold text-[#984710]">
                  দারুস সুন্নাহ একাডেমি · {activeSessionYear} সেশন
                </span>
                <h2 className="text-base font-bold text-[#2E2017] leading-tight">
                  {navGroups
                    .flatMap((g) => g.items)
                    .find((i) => i.id === currentTab)?.label || 'অফিস ড্যাশবোর্ড'}
                </h2>
              </div>
            </div>

            {/* Global Search Bar (supports English and Bengali digits) */}
            <div className="relative flex-1 max-w-xs sm:max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#534231]" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => handleGlobalSearch(e.target.value)}
                placeholder="শিক্ষার্থীর নাম, রোল বা আইডি দিয়ে খুঁজুন..."
                className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white border border-[#E9D4B3] text-xs text-[#2E2017] placeholder-[#534231]/60 focus:outline-hidden focus:border-[#984710]"
              />

              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-9 bg-[#FFFBF3] border border-[#E9D4B3] rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-[#E9D4B3]/60 text-xs">
                  {searchResults.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setCurrentTab('students');
                        setSearchResults([]);
                        setGlobalSearch('');
                      }}
                      className="p-2.5 hover:bg-[#FCF8EF] cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold text-[#2E2017]">{s.nameBn}</p>
                        <p className="text-[10px] text-[#534231]">
                          আইডি: {s.id} | রোল: {s.rollNo}
                        </p>
                      </div>
                      <span className="text-[10px] bg-[#E9D4B3] px-2 py-0.5 rounded font-semibold text-[#2E2017]">
                        {s.section} শাখা
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Tools: Notification & Role Switcher */}
            <div className="flex items-center gap-2.5">
              {/* Role Switcher Button */}
              <div className="relative">
                <button
                  onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                  className="flex items-center gap-1.5 bg-[#FFFBF3] border border-[#E9D4B3] hover:border-[#984710] px-3 py-1.5 rounded-full text-xs font-semibold text-[#2E2017] shadow-xs cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-[#984710]" />
                  <span className="hidden md:inline truncate max-w-[130px]">
                    {roleNames[currentUser.role]}
                  </span>
                  <span className="md:hidden">রোল পরিবর্তন</span>
                  <ChevronDown className="w-3 h-3 text-[#534231]" />
                </button>

                {roleMenuOpen && (
                  <div className="absolute right-0 top-10 w-60 bg-[#FFFBF3] border border-[#E9D4B3] rounded-xl shadow-xl z-50 p-2 space-y-1 text-xs">
                    <p className="px-2 py-1 text-[10px] font-bold text-[#534231] uppercase">
                      টেস্ট ও পারসোনা সুইচ করুন:
                    </p>
                    {Object.entries(roleNames).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setCurrentUserRole(key as UserRole);
                          setRoleMenuOpen(false);
                          if (key === 'teacher') setCurrentTab('teacher_portal');
                          if (key === 'guardian') setCurrentTab('guardian_portal');
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                          currentUser.role === key
                            ? 'bg-[#984710] text-white font-bold'
                            : 'text-[#2E2017] hover:bg-[#FCF8EF]'
                        }`}
                      >
                        <span className="truncate">{label}</span>
                        {currentUser.role === key && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Public Portal Exit Button */}
              <button
                onClick={onExitToPublic}
                title="পাবলিক ওয়েবসাইট"
                className="p-1.5 rounded-full bg-white border border-[#E9D4B3] hover:bg-[#FCF8EF] text-[#2E2017] cursor-pointer"
              >
                <Globe className="w-4 h-4 text-[#984710]" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Body Viewport */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
