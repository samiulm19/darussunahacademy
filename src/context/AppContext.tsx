import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AcademySettings,
  AcademicSession,
  AcademicProgram,
  AcademicClass,
  SubjectItem,
  StaffMember,
  AdmissionApplication,
  StudentRecord,
  AttendanceSheet,
  TimetableSlot,
  FeeHead,
  FeeBill,
  FeePaymentReceipt,
  ExamTerm,
  ExamMarkItem,
  QuranProgressLog,
  NoticeItem,
  GalleryPhoto,
  CommitteeMember,
  UserAccount,
  UserRole,
  ContactMessage,
} from '../types';
import {
  initialSettings,
  initialSessions,
  initialPrograms,
  initialClasses,
  initialSubjects,
  initialStaff,
  initialStudents,
  initialApplications,
  initialAttendance,
  initialRoutine,
  initialFeeHeads,
  initialBills,
  initialReceipts,
  initialExamTerms,
  initialExamMarks,
  initialQuranLogs,
  initialNotices,
  initialGallery,
  initialCommittee,
  initialUsers,
  initialContactMessages,
} from '../data/mockData';

// Helper to normalize digits for search (converts Bengali digits to English)
export function normalizeDigits(str: string): string {
  const bnToEnMap: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9',
  };
  return str.replace(/[০-৯]/g, (match) => bnToEnMap[match] || match).toLowerCase();
}

// Convert English numbers to Bengali numbers
export function toBnDigits(num: number | string): string {
  const enToBnMap: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };
  return String(num).replace(/[0-9]/g, (match) => enToBnMap[match] || match);
}

// Format Currency in Taka
export function formatTaka(amount: number): string {
  return `৳${toBnDigits(amount.toLocaleString('en-US'))}`;
}

interface AppContextType {
  settings: AcademySettings;
  updateSettings: (newSettings: Partial<AcademySettings>) => void;
  sessions: AcademicSession[];
  activeSessionYear: string;
  setActiveSessionYear: (year: string) => void;
  programs: AcademicProgram[];
  updateProgram: (program: AcademicProgram) => void;
  classes: AcademicClass[];
  addClass: (cls: AcademicClass) => void;
  updateClass: (cls: AcademicClass) => void;
  subjects: SubjectItem[];
  staff: StaffMember[];
  addStaff: (member: StaffMember) => void;
  updateStaff: (member: StaffMember) => void;
  students: StudentRecord[];
  addStudent: (student: StudentRecord) => void;
  updateStudent: (student: StudentRecord) => void;
  deleteStudent: (studentId: string) => void;
  applications: AdmissionApplication[];
  submitApplication: (appData: Omit<AdmissionApplication, 'id' | 'trackingNumber' | 'submissionDate' | 'status' | 'feeStatus'>) => string;
  updateApplicationStatus: (appId: string, status: AdmissionApplication['status'], notes?: string, score?: number) => void;
  enrollApplicant: (appId: string) => { success: boolean; message: string; studentId?: string };
  attendanceSheets: AttendanceSheet[];
  saveAttendanceSheet: (sheet: AttendanceSheet) => void;
  routine: TimetableSlot[];
  saveRoutineSlot: (slot: TimetableSlot) => { success: boolean; conflictMessage?: string };
  deleteRoutineSlot: (slotId: string) => void;
  feeHeads: FeeHead[];
  bills: FeeBill[];
  generateBulkBills: (sessionYear: string, monthName: string, classId?: string) => { createdCount: number; skippedCount: number };
  receipts: FeePaymentReceipt[];
  collectFeePayment: (receiptData: Omit<FeePaymentReceipt, 'id' | 'receiptNumber'>) => FeePaymentReceipt;
  examTerms: ExamTerm[];
  examMarks: ExamMarkItem[];
  saveExamMarks: (marks: ExamMarkItem[]) => void;
  publishExamTerm: (termId: string, publish: boolean) => void;
  quranLogs: QuranProgressLog[];
  addQuranLog: (log: QuranProgressLog) => void;
  notices: NoticeItem[];
  addNotice: (notice: NoticeItem) => void;
  updateNotice: (notice: NoticeItem) => void;
  deleteNotice: (noticeId: string) => void;
  gallery: GalleryPhoto[];
  addGalleryPhoto: (photo: GalleryPhoto) => void;
  committee: CommitteeMember[];
  contactMessages: ContactMessage[];
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => void;
  updateMessageStatus: (id: string, status: ContactMessage['status'], notes?: string) => void;
  currentUser: UserAccount;
  setCurrentUserRole: (role: UserRole) => void;
  users: UserAccount[];
  resetToDemoData: () => void;
  exportDatabaseJson: () => void;
  importDatabaseJson: (jsonString: string) => boolean;
  selectedChildId: string;
  setSelectedChildId: (id: string) => void;
}

const STORAGE_KEY = 'dsa_academy_state_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or defaults
  const [settings, setSettings] = useState<AcademySettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [sessions] = useState<AcademicSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_sessions`);
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [activeSessionYear, setActiveSessionYear] = useState<string>(() => {
    return settings.activeSessionYear || '2026';
  });

  const [programs, setPrograms] = useState<AcademicProgram[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_programs`);
    return saved ? JSON.parse(saved) : initialPrograms;
  });

  const [classes, setClasses] = useState<AcademicClass[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_classes`);
    return saved ? JSON.parse(saved) : initialClasses;
  });

  const [subjects] = useState<SubjectItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_subjects`);
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_staff`);
    return saved ? JSON.parse(saved) : initialStaff;
  });

  const [students, setStudents] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [applications, setApplications] = useState<AdmissionApplication[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_applications`);
    return saved ? JSON.parse(saved) : initialApplications;
  });

  const [attendanceSheets, setAttendanceSheets] = useState<AttendanceSheet[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_attendance`);
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [routine, setRoutine] = useState<TimetableSlot[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_routine`);
    return saved ? JSON.parse(saved) : initialRoutine;
  });

  const [feeHeads] = useState<FeeHead[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_feeHeads`);
    return saved ? JSON.parse(saved) : initialFeeHeads;
  });

  const [bills, setBills] = useState<FeeBill[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_bills`);
    return saved ? JSON.parse(saved) : initialBills;
  });

  const [receipts, setReceipts] = useState<FeePaymentReceipt[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_receipts`);
    return saved ? JSON.parse(saved) : initialReceipts;
  });

  const [examTerms, setExamTerms] = useState<ExamTerm[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_examTerms`);
    return saved ? JSON.parse(saved) : initialExamTerms;
  });

  const [examMarks, setExamMarks] = useState<ExamMarkItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_examMarks`);
    return saved ? JSON.parse(saved) : initialExamMarks;
  });

  const [quranLogs, setQuranLogs] = useState<QuranProgressLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_quranLogs`);
    return saved ? JSON.parse(saved) : initialQuranLogs;
  });

  const [notices, setNotices] = useState<NoticeItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notices`);
    return saved ? JSON.parse(saved) : initialNotices;
  });

  const [gallery, setGallery] = useState<GalleryPhoto[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_gallery`);
    return saved ? JSON.parse(saved) : initialGallery;
  });

  const [committee] = useState<CommitteeMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_committee`);
    return saved ? JSON.parse(saved) : initialCommittee;
  });

  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_contactMessages`);
    return saved ? JSON.parse(saved) : initialContactMessages;
  });

  const [users] = useState<UserAccount[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<UserAccount>(initialUsers[0]); // default Super Admin

  // Guardian Child Switcher default to first linked child
  const [selectedChildId, setSelectedChildId] = useState<string>('DSA-ST-2026001');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_programs`, JSON.stringify(programs));
  }, [programs]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
  }, [classes]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(staff));
  }, [staff]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
  }, [students]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_applications`, JSON.stringify(applications));
  }, [applications]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_attendance`, JSON.stringify(attendanceSheets));
  }, [attendanceSheets]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_routine`, JSON.stringify(routine));
  }, [routine]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bills`, JSON.stringify(bills));
  }, [bills]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_receipts`, JSON.stringify(receipts));
  }, [receipts]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_examTerms`, JSON.stringify(examTerms));
  }, [examTerms]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_examMarks`, JSON.stringify(examMarks));
  }, [examMarks]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_quranLogs`, JSON.stringify(quranLogs));
  }, [quranLogs]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notices`, JSON.stringify(notices));
  }, [notices]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_gallery`, JSON.stringify(gallery));
  }, [gallery]);
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_contactMessages`, JSON.stringify(contactMessages));
  }, [contactMessages]);

  const updateSettings = (newSettings: Partial<AcademySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateProgram = (prog: AcademicProgram) => {
    setPrograms((prev) => prev.map((p) => (p.id === prog.id ? prog : p)));
  };

  const addClass = (cls: AcademicClass) => {
    setClasses((prev) => [...prev, cls]);
  };

  const updateClass = (cls: AcademicClass) => {
    setClasses((prev) => prev.map((c) => (c.id === cls.id ? cls : c)));
  };

  const addStaff = (member: StaffMember) => {
    setStaff((prev) => [...prev, member]);
  };

  const updateStaff = (member: StaffMember) => {
    setStaff((prev) => prev.map((s) => (s.id === member.id ? member : s)));
  };

  const addStudent = (student: StudentRecord) => {
    setStudents((prev) => [...prev, student]);
  };

  const updateStudent = (student: StudentRecord) => {
    setStudents((prev) => prev.map((s) => (s.id === student.id ? student : s)));
  };

  const deleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  // Submit new admission application
  const submitApplication = (
    appData: Omit<AdmissionApplication, 'id' | 'trackingNumber' | 'submissionDate' | 'status' | 'feeStatus'>
  ): string => {
    const nextSeq = applications.length + 1044;
    const tracking = `DSA-${activeSessionYear}-${nextSeq}`;
    const newApp: AdmissionApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      trackingNumber: tracking,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'submitted',
      feeStatus: 'unpaid',
    };
    setApplications((prev) => [newApp, ...prev]);
    return tracking;
  };

  const updateApplicationStatus = (
    appId: string,
    status: AdmissionApplication['status'],
    notes?: string,
    score?: number
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        return {
          ...app,
          status,
          reviewNotes: notes !== undefined ? notes : app.reviewNotes,
          interviewScore: score !== undefined ? score : app.interviewScore,
          reviewDate: new Date().toISOString().split('T')[0],
          reviewedBy: currentUser.nameBn,
        };
      })
    );
  };

  // Enroll an applicant - checks for duplicate enrollment
  const enrollApplicant = (appId: string): { success: boolean; message: string; studentId?: string } => {
    const app = applications.find((a) => a.id === appId);
    if (!app) return { success: false, message: 'আবেদন খুঁজে পাওয়া যায়নি।' };

    // Duplicate check: verify if already enrolled
    if (app.status === 'enrolled' && app.enrolledStudentId) {
      return {
        success: false,
        message: `এই শিক্ষার্থী ইতিমধ্যে অন্তর্ভুক্ত আছেন (আইডি: ${app.enrolledStudentId})। পুনরায় এনরোল করা যাবে না।`,
        studentId: app.enrolledStudentId,
      };
    }

    // Check if student with same phone & name already exists in this session
    const existing = students.find(
      (s) =>
        s.sessionYear === app.sessionYear &&
        s.nameBn === app.applicantNameBn &&
        s.guardianPhone === app.fatherPhone
    );
    if (existing) {
      return {
        success: false,
        message: `সতর্কতা: একই সেশনে ${app.applicantNameBn} নামে শিক্ষার্থী ইতিমধ্যে নিবন্ধিত (রোল: ${existing.rollNo})।`,
        studentId: existing.id,
      };
    }

    // Generate new student ID & roll
    const classStudents = students.filter(
      (s) => s.classId === app.appliedClassId && s.sessionYear === app.sessionYear
    );
    const nextRoll = classStudents.length + 1;
    const rollBn = toBnDigits(nextRoll.toString().padStart(2, '0'));
    const nextIdNum = students.length + 1;
    const studentId = `DSA-ST-${app.sessionYear}${String(nextIdNum).padStart(3, '0')}`;

    const newStudent: StudentRecord = {
      id: studentId,
      rollNo: rollBn,
      nameBn: app.applicantNameBn,
      nameEn: app.applicantNameEn || app.applicantNameBn,
      sessionYear: app.sessionYear,
      classId: app.appliedClassId,
      section: 'ক',
      shift: app.preferredShift,
      gender: app.gender,
      bloodGroup: app.bloodGroup || 'O+',
      dateOfBirth: app.dateOfBirth,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'active',
      guardianNameBn: app.fatherNameBn,
      guardianPhone: app.fatherPhone,
      guardianRelation: 'পিতা',
      address: app.guardianAddress,
      waiverPercent: 0,
      hifzGroupId: app.programId === 'prog-quran' ? 'hifz-grp-1' : undefined,
    };

    setStudents((prev) => [...prev, newStudent]);

    // Mark application as enrolled
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              status: 'enrolled',
              enrolledStudentId: studentId,
              feeStatus: 'paid',
            }
          : a
      )
    );

    return {
      success: true,
      message: `${newStudent.nameBn} সফলভাবে ভর্তি সম্পন্ন হয়েছে। শিক্ষার্থী আইডি: ${studentId}`,
      studentId,
    };
  };

  const saveAttendanceSheet = (sheet: AttendanceSheet) => {
    setAttendanceSheets((prev) => {
      const idx = prev.findIndex(
        (s) =>
          s.date === sheet.date &&
          s.classId === sheet.classId &&
          s.section === sheet.section &&
          s.shift === sheet.shift
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = sheet;
        return copy;
      }
      return [sheet, ...prev];
    });
  };

  // Routine slot conflict detector
  const saveRoutineSlot = (slot: TimetableSlot): { success: boolean; conflictMessage?: string } => {
    // Check conflicts:
    // 1. Same teacher at same day and period
    const teacherConflict = routine.find(
      (r) =>
        r.id !== slot.id &&
        r.dayOfWeek === slot.dayOfWeek &&
        r.periodNumber === slot.periodNumber &&
        r.teacherId === slot.teacherId
    );
    if (teacherConflict) {
      return {
        success: false,
        conflictMessage: `শিক্ষক সংঘাত: এই শিক্ষক একই দিনে ও একই পিরিয়ডে অন্য ক্লাসে নিয়োজিত আছেন।`,
      };
    }

    // 2. Same room at same day and period
    const roomConflict = routine.find(
      (r) =>
        r.id !== slot.id &&
        r.dayOfWeek === slot.dayOfWeek &&
        r.periodNumber === slot.periodNumber &&
        r.roomNo === slot.roomNo
    );
    if (roomConflict) {
      return {
        success: false,
        conflictMessage: `কক্ষ সংঘাত: রুম নং ${slot.roomNo} এ সময়ে অন্য শ্রেণির জন্য ব্যবহৃত হচ্ছে।`,
      };
    }

    // 3. Same class & section at same day and period
    const classConflict = routine.find(
      (r) =>
        r.id !== slot.id &&
        r.dayOfWeek === slot.dayOfWeek &&
        r.periodNumber === slot.periodNumber &&
        r.classId === slot.classId &&
        r.section === slot.section
    );
    if (classConflict) {
      return {
        success: false,
        conflictMessage: `শ্রেণি সংঘাত: এই শ্রেণির সেকশন ${slot.section}-এ ইতিমধ্যে একটি পিরিয়ড বরাদ্দ আছে।`,
      };
    }

    setRoutine((prev) => {
      const idx = prev.findIndex((r) => r.id === slot.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = slot;
        return copy;
      }
      return [...prev, slot];
    });

    return { success: true };
  };

  const deleteRoutineSlot = (slotId: string) => {
    setRoutine((prev) => prev.filter((r) => r.id !== slotId));
  };

  // Generate bulk bills with duplicate prevention
  const generateBulkBills = (
    sessionYear: string,
    monthName: string,
    classId?: string
  ): { createdCount: number; skippedCount: number } => {
    let targetStudents = students.filter(
      (s) => s.sessionYear === sessionYear && s.status === 'active'
    );
    if (classId) {
      targetStudents = targetStudents.filter((s) => s.classId === classId);
    }

    let createdCount = 0;
    let skippedCount = 0;
    const newBills: FeeBill[] = [];

    for (const student of targetStudents) {
      // Check if bill for this student and month already exists
      const existing = bills.find(
        (b) => b.studentId === student.id && b.month === monthName && b.sessionYear === sessionYear
      );
      if (existing) {
        skippedCount++;
        continue;
      }

      const cls = classes.find((c) => c.id === student.classId);
      const tuition = cls ? cls.monthlyFee : 2200;
      const waiver = (tuition * (student.waiverPercent || 0)) / 100;
      const net = tuition - waiver;

      const newBill: FeeBill = {
        id: `BILL-${sessionYear}-${String(bills.length + createdCount + 1).padStart(3, '0')}`,
        studentId: student.id,
        sessionYear,
        month: monthName,
        feeHeadIds: ['fee-tuition'],
        totalAmount: tuition,
        waiverAmount: waiver,
        netPayable: net,
        paidAmount: 0,
        dueAmount: net,
        dueDate: `${sessionYear}-02-28`,
        status: 'unpaid',
      };
      newBills.push(newBill);
      createdCount++;
    }

    if (newBills.length > 0) {
      setBills((prev) => [...prev, ...newBills]);
    }

    return { createdCount, skippedCount };
  };

  // Collect fee payment with unique receipt generation
  const collectFeePayment = (
    receiptData: Omit<FeePaymentReceipt, 'id' | 'receiptNumber'>
  ): FeePaymentReceipt => {
    const receiptNum = `DSA-RCT-${8820 + receipts.length + 1}`;
    const newReceipt: FeePaymentReceipt = {
      ...receiptData,
      id: `rcpt-${Date.now()}`,
      receiptNumber: receiptNum,
    };

    setReceipts((prev) => [newReceipt, ...prev]);

    // Update the bill
    setBills((prev) =>
      prev.map((bill) => {
        if (bill.id !== receiptData.billId) return bill;
        const newPaid = bill.paidAmount + receiptData.amount;
        const newDue = Math.max(0, bill.netPayable - newPaid);
        const status = newDue === 0 ? 'paid' : newPaid > 0 ? 'partial' : 'unpaid';
        return {
          ...bill,
          paidAmount: newPaid,
          dueAmount: newDue,
          status,
        };
      })
    );

    return newReceipt;
  };

  const saveExamMarks = (marksList: ExamMarkItem[]) => {
    setExamMarks((prev) => {
      const copy = [...prev];
      for (const item of marksList) {
        const idx = copy.findIndex(
          (m) =>
            m.studentId === item.studentId &&
            m.subjectId === item.subjectId &&
            m.examTermId === item.examTermId
        );
        if (idx >= 0) {
          copy[idx] = item;
        } else {
          copy.push(item);
        }
      }
      return copy;
    });
  };

  const publishExamTerm = (termId: string, publish: boolean) => {
    setExamTerms((prev) =>
      prev.map((t) => (t.id === termId ? { ...t, isPublished: publish } : t))
    );
  };

  const addQuranLog = (log: QuranProgressLog) => {
    setQuranLogs((prev) => [log, ...prev]);
  };

  const addNotice = (notice: NoticeItem) => {
    setNotices((prev) => [notice, ...prev]);
  };

  const updateNotice = (notice: NoticeItem) => {
    setNotices((prev) => prev.map((n) => (n.id === notice.id ? notice : n)));
  };

  const deleteNotice = (noticeId: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== noticeId));
  };

  const addGalleryPhoto = (photo: GalleryPhoto) => {
    setGallery((prev) => [photo, ...prev]);
  };

  const submitContactMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    setContactMessages((prev) => [newMsg, ...prev]);
  };

  const updateMessageStatus = (id: string, status: ContactMessage['status'], notes?: string) => {
    setContactMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status, internalNotes: notes || m.internalNotes } : m
      )
    );
  };

  const setCurrentUserRole = (role: UserRole) => {
    const userForRole = users.find((u) => u.roles.includes(role)) || {
      id: `usr-${role}`,
      name: role,
      nameBn:
        role === 'super_admin'
          ? 'মাওলানা মুফতি এনামুল হক (সুপার অ্যাডমিন)'
          : role === 'office_admission'
          ? 'মোঃ সাজ্জাদ হোসেন (অফিস ও ভর্তি শাখা)'
          : role === 'accounts'
          ? 'হিসাব কর্মকর্তা'
          : role === 'academic_exam'
          ? 'পরীক্ষা নিয়ন্ত্রক'
          : role === 'teacher'
          ? 'হাফেজ ক্বারী আব্দুর রহমান (শিক্ষক)'
          : role === 'content_editor'
          ? 'কনটেন্ট এডিটর'
          : 'হাফেজ জহিরুল ইসলাম (অভিভাবক)',
      email: `${role}@darussunnah.edu.bd`,
      phone: '০১৭০১০০১১২২',
      role,
      roles: [role],
      teacherId: role === 'teacher' ? 'stf-002' : undefined,
    };
    setCurrentUser(userForRole);
  };

  const resetToDemoData = () => {
    setSettings(initialSettings);
    setPrograms(initialPrograms);
    setClasses(initialClasses);
    setStaff(initialStaff);
    setStudents(initialStudents);
    setApplications(initialApplications);
    setAttendanceSheets(initialAttendance);
    setRoutine(initialRoutine);
    setBills(initialBills);
    setReceipts(initialReceipts);
    setExamTerms(initialExamTerms);
    setExamMarks(initialExamMarks);
    setQuranLogs(initialQuranLogs);
    setNotices(initialNotices);
    setGallery(initialGallery);
    setContactMessages(initialContactMessages);
    localStorage.clear();
  };

  const exportDatabaseJson = () => {
    const payload = {
      settings,
      programs,
      classes,
      staff,
      students,
      applications,
      attendanceSheets,
      routine,
      bills,
      receipts,
      examTerms,
      examMarks,
      quranLogs,
      notices,
      gallery,
      contactMessages,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `darus-sunnah-database-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDatabaseJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.settings) setSettings(data.settings);
      if (data.programs) setPrograms(data.programs);
      if (data.classes) setClasses(data.classes);
      if (data.staff) setStaff(data.staff);
      if (data.students) setStudents(data.students);
      if (data.applications) setApplications(data.applications);
      if (data.attendanceSheets) setAttendanceSheets(data.attendanceSheets);
      if (data.routine) setRoutine(data.routine);
      if (data.bills) setBills(data.bills);
      if (data.receipts) setReceipts(data.receipts);
      if (data.examTerms) setExamTerms(data.examTerms);
      if (data.examMarks) setExamMarks(data.examMarks);
      if (data.quranLogs) setQuranLogs(data.quranLogs);
      if (data.notices) setNotices(data.notices);
      if (data.gallery) setGallery(data.gallery);
      if (data.contactMessages) setContactMessages(data.contactMessages);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        updateSettings,
        sessions,
        activeSessionYear,
        setActiveSessionYear,
        programs,
        updateProgram,
        classes,
        addClass,
        updateClass,
        subjects,
        staff,
        addStaff,
        updateStaff,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        applications,
        submitApplication,
        updateApplicationStatus,
        enrollApplicant,
        attendanceSheets,
        saveAttendanceSheet,
        routine,
        saveRoutineSlot,
        deleteRoutineSlot,
        feeHeads,
        bills,
        generateBulkBills,
        receipts,
        collectFeePayment,
        examTerms,
        examMarks,
        saveExamMarks,
        publishExamTerm,
        quranLogs,
        addQuranLog,
        notices,
        addNotice,
        updateNotice,
        deleteNotice,
        gallery,
        addGalleryPhoto,
        committee,
        contactMessages,
        submitContactMessage,
        updateMessageStatus,
        currentUser,
        setCurrentUserRole,
        users,
        resetToDemoData,
        exportDatabaseJson,
        importDatabaseJson,
        selectedChildId,
        setSelectedChildId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
