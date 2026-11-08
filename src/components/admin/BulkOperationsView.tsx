import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Filter,
} from 'lucide-react';
import { useApp, toBnDigits } from '../../context/AppContext';

export const BulkOperationsView: React.FC = () => {
  const { students, addStudent, activeSessionYear, classes } = useApp();
  const [csvContent, setCsvContent] = useState('');
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Sample CSV Template Download
  const downloadTemplate = () => {
    const header = 'NameBn,NameEn,ClassId,Section,Shift,Gender,BloodGroup,GuardianName,GuardianPhone,Address\n';
    const sample = 'মুহাম্মদ হাসান,Muhammad Hasan,cls-1,ক,morning,male,B+,মুহাম্মদ নুরুল ইসলাম,01711223344,মিরপুর-১২ ঢাকা\n';
    const blob = new Blob([header + sample], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'darus_sunnah_student_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleParseCsv = () => {
    if (!csvContent.trim()) return;
    const lines = csvContent.trim().split('\n');
    const rows = [];

    // Parse header and data
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts.length >= 5) {
        rows.push({
          nameBn: parts[0] || 'নামহীন শিক্ষার্থী',
          nameEn: parts[1] || parts[0],
          classId: parts[2] || 'cls-1',
          section: parts[3] || 'ক',
          shift: parts[4] || 'morning',
          gender: parts[5] || 'male',
          bloodGroup: parts[6] || 'O+',
          guardianNameBn: parts[7] || 'অভিভাবক',
          guardianPhone: parts[8] || '01700000000',
          address: parts[9] || 'ঢাকা',
          isValid: Boolean(parts[0] && parts[8]),
        });
      }
    }
    setPreviewRows(rows);
    setImportStatus(null);
  };

  const handleConfirmImport = () => {
    let count = 0;
    previewRows.forEach((row, idx) => {
      if (row.isValid) {
        const studentId = `DSA-ST-${activeSessionYear}${String(students.length + count + 1).padStart(3, '0')}`;
        addStudent({
          id: studentId,
          rollNo: toBnDigits((students.length + count + 1).toString().padStart(2, '0')),
          nameBn: row.nameBn,
          nameEn: row.nameEn,
          sessionYear: activeSessionYear,
          classId: row.classId,
          section: row.section,
          shift: row.shift,
          gender: row.gender as any,
          bloodGroup: row.bloodGroup,
          dateOfBirth: '2016-01-01',
          admissionDate: new Date().toISOString().split('T')[0],
          status: 'active',
          guardianNameBn: row.guardianNameBn,
          guardianPhone: row.guardianPhone,
          guardianRelation: 'পিতা',
          address: row.address,
          waiverPercent: 0,
        });
        count++;
      }
    });

    setImportStatus(`${count} জন শিক্ষার্থীর তথ্য সফলভাবে ডেটাবেজে অন্তর্ভুক্ত হয়েছে!`);
    setPreviewRows([]);
    setCsvContent('');
  };

  const exportFilteredStudentsCsv = () => {
    const sessionStudents = students.filter((s) => s.sessionYear === activeSessionYear);
    let csv = 'ID,Roll,NameBn,NameEn,Class,Section,Shift,Gender,GuardianPhone,Address\n';
    sessionStudents.forEach((s) => {
      const clsName = classes.find((c) => c.id === s.classId)?.nameBn || s.classId;
      csv += `"${s.id}","${s.rollNo}","${s.nameBn}","${s.nameEn}","${clsName}","${s.section}","${s.shift}","${s.gender}","${s.guardianPhone}","${s.address}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_session_${activeSessionYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            বাল্ক ডেটা অপারেশন (Import & Export)
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            শিক্ষার্থী ও স্টাফ তালিকা CSV/Excel থেকে একবারে অন্তর্ভুক্তকরণ ও এক্সপোর্ট
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadTemplate}
            className="px-3.5 py-2 bg-[#FCF8EF] border border-[#E9D4B3] text-[#2E2017] text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-[#E9D4B3]/40"
          >
            <Download className="w-3.5 h-3.5 text-[#984710]" />
            <span>নমুনা টেমপ্লেট ডাউনলোড (CSV)</span>
          </button>

          <button
            onClick={exportFilteredStudentsCsv}
            className="px-4 py-2 bg-[#2E2017] hover:bg-black text-white text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#E9D4B3]" />
            <span>বর্তমান সেশনের ডেটা এক্সপোর্ট</span>
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* CSV Input Card */}
      <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-6 shadow-xs space-y-4 text-xs">
        <div>
          <h3 className="text-sm font-bold text-[#2E2017] mb-1">
            CSV ফাইল বা টেক্সট পেস্ট করে শিক্ষার্থী ইমপোর্ট করুন
          </h3>
          <p className="text-xs text-[#534231]">
            কমা দিয়ে বিভক্ত (CSV) ফরম্যাটে শিক্ষার্থীদের তথ্য নিচে পেস্ট করুন এবং প্রিভিউ দেখুন।
          </p>
        </div>

        <textarea
          rows={5}
          value={csvContent}
          onChange={(e) => setCsvContent(e.target.value)}
          placeholder={`NameBn,NameEn,ClassId,Section,Shift,Gender,BloodGroup,GuardianName,GuardianPhone,Address\nমুহাম্মদ হাসান,Muhammad Hasan,cls-1,ক,morning,male,B+,নুরুল ইসলাম,01711223344,মিরপুর ঢাকা`}
          className="w-full p-3 rounded-xl bg-white border border-[#E9D4B3] font-mono text-xs focus:outline-hidden focus:border-[#984710]"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#534231]">
            সেশন: {toBnDigits(activeSessionYear)}-এর শিক্ষার্থীদের জন্য প্রযোজ্য
          </span>
          <button
            onClick={handleParseCsv}
            disabled={!csvContent.trim()}
            className="px-5 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full disabled:opacity-50 cursor-pointer"
          >
            ডেটা যাচাই ও প্রিভিউ দেখুন
          </button>
        </div>
      </div>

      {/* Preview Table */}
      {previewRows.length > 0 && (
        <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] shadow-xs overflow-hidden">
          <div className="p-3.5 bg-[#FCF8EF] border-b border-[#E9D4B3] flex items-center justify-between text-xs">
            <span className="font-bold text-[#2E2017]">
              ইমপোর্ট প্রিভিউ: {previewRows.length} টি সারি যাচাই সম্পন্ন
            </span>
            <button
              onClick={handleConfirmImport}
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg cursor-pointer"
            >
              ইমপোর্ট অনুমোদন করুন
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FCF8EF]/60 text-[#2E2017] border-b border-[#E9D4B3] font-semibold">
                <tr>
                  <th className="p-3">অবস্থা</th>
                  <th className="p-3">শিক্ষার্থীর নাম</th>
                  <th className="p-3">শ্রেণি কোড</th>
                  <th className="p-3">শাখা ও শিফট</th>
                  <th className="p-3">অভিভাবক ও ফোন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9D4B3]/50">
                {previewRows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-[#FCF8EF]/40">
                    <td className="p-3">
                      {r.isValid ? (
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          বৈধ
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold">
                          ত্রুটিযুক্ত
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-[#2E2017]">{r.nameBn}</td>
                    <td className="p-3 font-mono">{r.classId}</td>
                    <td className="p-3">{r.section} শাখা · {r.shift}</td>
                    <td className="p-3">{r.guardianNameBn} ({r.guardianPhone})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
