export type UserRole =
  | 'super_admin'
  | 'office_admission'
  | 'accounts'
  | 'academic_exam'
  | 'teacher'
  | 'content_editor'
  | 'guardian';

export interface UserAccount {
  id: string;
  name: string;
  nameBn: string;
  email: string;
  phone: string;
  role: UserRole;
  roles: UserRole[];
  teacherId?: string;
  guardianId?: string;
  avatarUrl?: string;
}

export interface AcademicSession {
  id: string;
  year: string; // '2026', '2025'
  yearBn: string; // '২০২৬', '২০২৫'
  name: string; // 'শিক্ষাবর্ষ ২০২৬'
  startDate: string;
  endDate: string;
  isActive: boolean; // active current intake
}

export type ProgramType = 'quran' | 'islamic_studies' | 'integrated';

export interface AcademicProgram {
  id: string;
  nameBn: string;
  nameEn: string;
  type: ProgramType;
  tagline: string;
  description: string;
  targetAudience: string;
  levels: string[];
  curriculumSummary: string;
  eligibility: string;
  isPublished: boolean;
  order: number;
}

export interface AcademicClass {
  id: string;
  nameBn: string;
  nameEn: string;
  code: string;
  programId: string;
  sections: string[]; // e.g. ['ক', 'খ']
  shifts: ('morning' | 'day')[]; // 'প্রভাতী', 'দিবা'
  groups?: string[]; // 'জেনারেল', 'বিজ্ঞান', 'মানবিক'
  monthlyFee: number;
  admissionFee: number;
}

export interface SubjectItem {
  id: string;
  code: string;
  nameBn: string;
  nameEn: string;
  totalMarks: number;
  passMarks: number;
  isOptional?: boolean;
}

export interface ClassSubjectMapping {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  sessionYear: string;
}

export interface StaffMember {
  id: string;
  code: string; // e.g. 'DSA-T-101'
  nameBn: string;
  nameEn: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  joiningDate: string;
  bloodGroup: string;
  status: 'active' | 'on_leave' | 'resigned';
  monthlySalary: number;
  qualification: string;
  assignedClasses: string[];
  assignedSubjects: string[];
  photoUrl?: string;
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'correction_needed'
  | 'approved'
  | 'rejected'
  | 'enrolled';

export interface AdmissionApplication {
  id: string;
  trackingNumber: string; // 'DSA-2026-1042'
  sessionYear: string;
  programId: string;
  appliedClassId: string;
  preferredShift: 'morning' | 'day';
  applicantNameBn: string;
  applicantNameEn: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  bloodGroup: string;
  fatherNameBn: string;
  fatherNameEn: string;
  fatherPhone: string;
  fatherOccupation: string;
  motherNameBn: string;
  motherNameEn: string;
  motherPhone?: string;
  guardianAddress: string;
  previousInstitute?: string;
  hifzCurrentPara?: number;
  status: ApplicationStatus;
  reviewNotes?: string;
  interviewScore?: number; // out of 50
  interviewRemarks?: string;
  submissionDate: string;
  reviewDate?: string;
  reviewedBy?: string;
  enrolledStudentId?: string;
  feeStatus: 'unpaid' | 'paid';
}

export interface StudentRecord {
  id: string; // 'DSA-ST-2026001'
  rollNo: string;
  nameBn: string;
  nameEn: string;
  photoUrl?: string;
  sessionYear: string;
  classId: string;
  section: string;
  shift: 'morning' | 'day';
  group?: string;
  gender: 'male' | 'female';
  bloodGroup: string;
  dateOfBirth: string;
  admissionDate: string;
  status: 'active' | 'promoted' | 'transferred' | 'withdrawn';
  guardianNameBn: string;
  guardianPhone: string;
  guardianRelation: string;
  address: string;
  waiverPercent: number; // e.g. 0, 25, 50, 100
  hifzGroupId?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface AttendanceRecordItem {
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceSheet {
  id: string;
  date: string; // YYYY-MM-DD
  sessionYear: string;
  classId: string;
  section: string;
  shift: 'morning' | 'day';
  records: AttendanceRecordItem[];
  submittedBy: string;
  submittedAt: string;
  isDraft: boolean;
  correctionReason?: string;
}

export interface TimetableSlot {
  id: string;
  dayOfWeek: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  periodNumber: number;
  startTime: string;
  endTime: string;
  classId: string;
  section: string;
  subjectId: string;
  teacherId: string;
  roomNo: string;
}

export interface FeeHead {
  id: string;
  nameBn: string;
  nameEn: string;
  defaultAmount: number;
  isRecurringMonthly: boolean;
}

export interface FeeBill {
  id: string; // 'BILL-2026-001'
  studentId: string;
  sessionYear: string;
  month: string; // 'জানুয়ারি ২০২৬', etc.
  feeHeadIds: string[];
  totalAmount: number;
  waiverAmount: number;
  netPayable: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'unpaid' | 'overdue';
}

export interface FeePaymentReceipt {
  id: string; // 'DSA-RCT-8821'
  receiptNumber: string;
  studentId: string;
  billId: string;
  date: string;
  amount: number;
  paymentMethod: 'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank';
  transactionRef?: string;
  receivedBy: string;
  notes?: string;
}

export interface ExamTerm {
  id: string;
  nameBn: string; // 'প্রথম সাময়িক পরীক্ষা ২০২৬'
  sessionYear: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  isLocked: boolean;
}

export interface ExamMarkItem {
  studentId: string;
  subjectId: string;
  examTermId: string;
  writtenMarks: number;
  vivaMarks: number;
  practicalMarks?: number;
  totalMarks: number;
  grade: string; // 'A+', 'A', 'A-', 'B', 'C', 'F'
  gradePoint: number; // 5.0, 4.0, etc.
  isAbsent?: boolean;
}

export interface QuranProgressLog {
  id: string;
  studentId: string;
  date: string;
  sabaqSurah: string;
  sabaqAyat: string;
  sabaqPages: number;
  sabqiPara: string;
  manzilPara: string;
  tajweedQuality: 'উত্তম' | 'সন্তোষজনক' | 'উন্নতি প্রয়োজন';
  memorizationPace: 'দ্রুত' | 'স্বাভাবিক' | 'ধীরগতি';
  tarbiyahNotes: string;
  teacherId: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  category: 'একাডেমিক' | 'ভর্তি' | 'পরীক্ষা' | 'ছুটি' | 'সাধারণ';
  content: string;
  publishDate: string;
  isPublic: boolean;
  fileAttachment?: string;
  fileName?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'ক্যাম্পাস' | 'ক্লাসরুম' | 'অনুষ্ঠান' | 'হিফজ প্রতিযোগিতা';
  imageUrl: string;
  caption: string;
  date: string;
}

export interface CommitteeMember {
  id: string;
  nameBn: string;
  designation: string;
  occupation: string;
  phone: string;
  order: number;
  isPublic: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'new' | 'reviewed' | 'resolved';
  internalNotes?: string;
}

export interface AcademySettings {
  academyNameBn: string;
  academyNameEn: string;
  taglineBn: string;
  addressBn: string;
  phone1: string;
  phone2: string;
  email: string;
  officeHoursBn: string;
  heroHeadline: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImage1: string;
  heroImage2: string;
  heroImage3: string;
  logoUrl: string;
  activeSessionYear: string;
  onlineAdmissionOpen: boolean;
  admissionDeadline: string;
  smsBalance: number;
  onlinePaymentSandbox: boolean;
  libraryEnabled: boolean;
  inventoryEnabled: boolean;
  residentialEnabled: boolean;
  aiAssistantEnabled: boolean;
}
