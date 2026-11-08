import React, { useState } from 'react';
import {
  CreditCard,
  PlusCircle,
  Printer,
  Search,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileText,
  DollarSign,
  TrendingDown,
  TrendingUp,
  X,
  Building,
} from 'lucide-react';
import { useApp, toBnDigits, formatTaka } from '../../context/AppContext';
import { FeeBill, FeePaymentReceipt } from '../../types';

export const FeesAccountingView: React.FC = () => {
  const {
    students,
    classes,
    feeHeads,
    bills,
    receipts,
    collectFeePayment,
    generateBulkBills,
    activeSessionYear,
    currentUser,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bills' | 'receipts' | 'bulk_generate' | 'expenses'>('bills');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState<FeeBill | null>(null);
  const [printableReceipt, setPrintableReceipt] = useState<FeePaymentReceipt | null>(null);

  // Payment Form
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'cash' | 'bkash' | 'nagad' | 'rocket' | 'bank'>('cash');
  const [payRef, setPayRef] = useState<string>('');
  const [payNotes, setPayNotes] = useState<string>('');

  // Bulk bill generation state
  const [bulkMonth, setBulkMonth] = useState<string>('মার্চ ২০২৬');
  const [bulkClassId, setBulkClassId] = useState<string>('all');
  const [bulkResult, setBulkResult] = useState<{ createdCount: number; skippedCount: number } | null>(null);

  const openPaymentModal = (bill: FeeBill) => {
    setShowPaymentModal(bill);
    setPayAmount(bill.dueAmount);
    setPayMethod('cash');
    setPayRef('');
    setPayNotes(`${bill.month} এর ফি পরিশোধ`);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPaymentModal || payAmount <= 0) return;

    const receipt = collectFeePayment({
      studentId: showPaymentModal.studentId,
      billId: showPaymentModal.id,
      date: new Date().toISOString().split('T')[0],
      amount: Number(payAmount),
      paymentMethod: payMethod,
      transactionRef: payRef || `TRX-${Date.now().toString().slice(-6)}`,
      receivedBy: currentUser.nameBn,
      notes: payNotes,
    });

    setShowPaymentModal(null);
    setPrintableReceipt(receipt);
  };

  const handleBulkGenerate = () => {
    const res = generateBulkBills(
      activeSessionYear,
      bulkMonth,
      bulkClassId === 'all' ? undefined : bulkClassId
    );
    setBulkResult(res);
  };

  // Metrics
  const totalBilled = bills.reduce((acc, b) => acc + b.netPayable, 0);
  const totalPaid = bills.reduce((acc, b) => acc + b.paidAmount, 0);
  const totalDue = bills.reduce((acc, b) => acc + b.dueAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            ফি আদায় ও হিসাবরক্ষণ শাখা
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            শিক্ষাবর্ষ {toBnDigits(activeSessionYear)} · টিউশন ফি, রসিদ ও বকেয়া ব্যবস্থাপনা
          </p>
        </div>

        <button
          onClick={() => setActiveTab('bulk_generate')}
          className="px-4 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>মাসিক বাল্ক বিল তৈরি</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs">
          <span className="text-xs text-[#534231] font-semibold block">মোট ধার্যকৃত বিল</span>
          <span className="text-2xl font-extrabold text-[#2E2017] tabular-nums mt-1 block">
            {formatTaka(totalBilled)}
          </span>
          <span className="text-[11px] text-[#534231] mt-0.5 block">{bills.length}টি প্রস্তুতকৃত ইনভয়েস</span>
        </div>

        <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs">
          <span className="text-xs text-emerald-700 font-semibold block">মোট আদায়কৃত ফি</span>
          <span className="text-2xl font-extrabold text-emerald-800 tabular-nums mt-1 block">
            {formatTaka(totalPaid)}
          </span>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">{receipts.length}টি পেমেন্ট প্রাপ্ত</span>
        </div>

        <div className="bg-[#FFFBF3] p-4 rounded-2xl border border-[#E9D4B3] shadow-xs">
          <span className="text-xs text-red-700 font-semibold block">অবশিষ্ট বকেয়া (Arrears)</span>
          <span className="text-2xl font-extrabold text-red-700 tabular-nums mt-1 block">
            {formatTaka(totalDue)}
          </span>
          <span className="text-[11px] text-red-600 mt-0.5 block">তাগাদা এসএমএস পাঠানোর উপযোগী</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E9D4B3] pb-1 text-xs">
        <button
          onClick={() => setActiveTab('bills')}
          className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'bills'
              ? 'border-[#984710] text-[#984710]'
              : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
          }`}
        >
          বিল ও বকেয়া তালিকা
        </button>
        <button
          onClick={() => setActiveTab('receipts')}
          className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'receipts'
              ? 'border-[#984710] text-[#984710]'
              : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
          }`}
        >
          আদায়কৃত রসিদ ইতিহাস
        </button>
        <button
          onClick={() => setActiveTab('bulk_generate')}
          className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
            activeTab === 'bulk_generate'
              ? 'border-[#984710] text-[#984710]'
              : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
          }`}
        >
          বাল্ক বিল জেনারেশন
        </button>
      </div>

      {/* Tab 1: Bills & Invoices List */}
      {activeTab === 'bills' && (
        <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FCF8EF] text-[#2E2017] border-b border-[#E9D4B3] font-semibold">
                <tr>
                  <th className="p-3.5">বিল নং</th>
                  <th className="p-3.5">শিক্ষার্থী</th>
                  <th className="p-3.5">মাস/পিরিয়ড</th>
                  <th className="p-3.5">মোট ফি</th>
                  <th className="p-3.5">ছাড়</th>
                  <th className="p-3.5">পরিশোধযোগ্য</th>
                  <th className="p-3.5">আদায়</th>
                  <th className="p-3.5">বকেয়া</th>
                  <th className="p-3.5">স্ট্যাটাস</th>
                  <th className="p-3.5 text-right">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9D4B3]/50">
                {bills.map((bill) => {
                  const student = students.find((s) => s.id === bill.studentId);
                  return (
                    <tr key={bill.id} className="hover:bg-[#FCF8EF]/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#984710]">{bill.id}</td>
                      <td className="p-3.5 font-bold text-[#2E2017]">
                        {student?.nameBn || bill.studentId}
                        <span className="block text-[11px] font-normal text-[#534231]">
                          আইডি: {bill.studentId}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium text-[#2E2017]">{bill.month}</td>
                      <td className="p-3.5 tabular-nums">{formatTaka(bill.totalAmount)}</td>
                      <td className="p-3.5 tabular-nums text-emerald-700">
                        {bill.waiverAmount > 0 ? `-${formatTaka(bill.waiverAmount)}` : '০'}
                      </td>
                      <td className="p-3.5 font-bold tabular-nums text-[#2E2017]">
                        {formatTaka(bill.netPayable)}
                      </td>
                      <td className="p-3.5 tabular-nums text-emerald-800 font-semibold">
                        {formatTaka(bill.paidAmount)}
                      </td>
                      <td className="p-3.5 tabular-nums text-red-700 font-bold">
                        {formatTaka(bill.dueAmount)}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            bill.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : bill.status === 'partial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {bill.status === 'paid'
                            ? 'পরিশোধিত'
                            : bill.status === 'partial'
                            ? 'আংশিক'
                            : 'বকেয়া'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {bill.dueAmount > 0 ? (
                          <button
                            onClick={() => openPaymentModal(bill)}
                            className="px-3 py-1 bg-[#984710] hover:bg-[#7e3a0c] text-white font-medium rounded-lg cursor-pointer"
                          >
                            ফি আদায়
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-semibold text-xs">সম্পূর্ণ পরিশোধ</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Receipts List */}
      {activeTab === 'receipts' && (
        <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FCF8EF] text-[#2E2017] border-b border-[#E9D4B3] font-semibold">
                <tr>
                  <th className="p-3.5">রসিদ নম্বর</th>
                  <th className="p-3.5">তারিখ</th>
                  <th className="p-3.5">শিক্ষার্থী</th>
                  <th className="p-3.5">বিল রেফারেন্স</th>
                  <th className="p-3.5">আদায়ের পরিমাণ</th>
                  <th className="p-3.5">পদ্ধতি ও ট্রানজেকশন</th>
                  <th className="p-3.5">গ্রহণকারী</th>
                  <th className="p-3.5 text-right">রসিদ প্রিন্ট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9D4B3]/50">
                {receipts.map((rcpt) => {
                  const student = students.find((s) => s.id === rcpt.studentId);
                  return (
                    <tr key={rcpt.id} className="hover:bg-[#FCF8EF]/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-[#984710]">{rcpt.receiptNumber}</td>
                      <td className="p-3.5 text-[#534231] tabular-nums">{rcpt.date}</td>
                      <td className="p-3.5 font-bold text-[#2E2017]">
                        {student?.nameBn || rcpt.studentId}
                      </td>
                      <td className="p-3.5 font-mono text-xs">{rcpt.billId}</td>
                      <td className="p-3.5 font-extrabold text-emerald-800 tabular-nums text-sm">
                        {formatTaka(rcpt.amount)}
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold uppercase text-[#2E2017]">{rcpt.paymentMethod}</span>
                        {rcpt.transactionRef && (
                          <span className="block text-[10px] text-[#534231] font-mono">
                            {rcpt.transactionRef}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-[#534231]">{rcpt.receivedBy}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setPrintableReceipt(rcpt)}
                          className="px-2.5 py-1 bg-[#2E2017] hover:bg-black text-white text-[11px] font-medium rounded-lg cursor-pointer flex items-center gap-1 ml-auto"
                        >
                          <Printer className="w-3 h-3 text-[#E9D4B3]" />
                          <span>রসিদ</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Bulk Bill Generation with duplicate protection */}
      {activeTab === 'bulk_generate' && (
        <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-6 shadow-xs max-w-xl space-y-4 text-xs">
          <div className="border-b border-[#E9D4B3] pb-3">
            <h3 className="text-base font-bold text-[#2E2017]">
              মাসিক টিউশন ফি বিল স্বয়ংক্রিয়ভাবে তৈরি (Bulk Generation)
            </h3>
            <p className="text-xs text-[#2E2017]/70 mt-1">
              এক ক্লিকে সকল শিক্ষার্থীর জন্য নির্ধারিত শ্রেণিভিত্তিক মাসিক বেতন এবং মওকুফ হিসেব করে ইনভয়েস প্রস্তুত হবে।
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold mb-1">বিলের মাস ও বছর *</label>
              <input
                type="text"
                value={bulkMonth}
                onChange={(e) => setBulkMonth(e.target.value)}
                placeholder="যেমন: মার্চ ২০২৬"
                className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">শ্রেণি নির্বাচন</label>
              <select
                value={bulkClassId}
                onChange={(e) => setBulkClassId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-xs font-medium"
              >
                <option value="all">সকল শ্রেণির শিক্ষার্থী</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nameBn}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-900 leading-relaxed">
            <p className="font-bold mb-0.5">দ্বৈত বিলিং প্রতিরোধ (Duplicate Prevention):</p>
            <p>
              যেসব শিক্ষার্থীর জন্য এই মাসের বিল ইতিমধ্যে প্রস্তুত আছে, সিস্টেম স্বয়ংক্রিয়ভাবে তাদের বাদ দিয়ে কেবল নতুন শিক্ষার্থীদের বিল তৈরি করবে।
            </p>
          </div>

          {bulkResult && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl">
              <p className="font-bold">বিল তৈরির ফলাফল:</p>
              <p>নতুন বিল তৈরি হয়েছে: {toBnDigits(bulkResult.createdCount)} টি</p>
              <p>ইতিমধ্যে বিদ্যমান থাকায় স্কিপ হয়েছে: {toBnDigits(bulkResult.skippedCount)} টি</p>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleBulkGenerate}
              className="px-6 py-2.5 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full shadow-xs cursor-pointer"
            >
              বাল্ক বিল তৈরি ও প্রয়োগ করুন
            </button>
          </div>
        </div>
      )}

      {/* Manual Fee Collection Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPaymentModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#2E2017] hover:bg-[#E9D4B3]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#2E2017] mb-1">ফি আদায় ও রসিদ তৈরি</h3>
            <p className="text-xs text-[#534231] mb-4">বিল আইডি: {showPaymentModal.id}</p>

            <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
              <div className="bg-[#FCF8EF] p-3 rounded-xl border border-[#E9D4B3] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#534231]">শিক্ষার্থী:</span>
                  <span className="font-bold text-[#2E2017]">
                    {students.find((s) => s.id === showPaymentModal.studentId)?.nameBn}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#534231]">বিলের মাস:</span>
                  <span className="font-bold text-[#2E2017]">{showPaymentModal.month}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#534231]">অবশিষ্ট বকেয়া:</span>
                  <span className="font-bold text-red-700 tabular-nums">
                    {formatTaka(showPaymentModal.dueAmount)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">আদায়ের পরিমাণ (টাকা) *</label>
                <input
                  type="number"
                  min="1"
                  max={showPaymentModal.dueAmount}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseInt(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-sm font-bold text-[#984710]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">পেমেন্ট মাধ্যম *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] font-semibold"
                >
                  <option value="cash">নগদ (Cash)</option>
                  <option value="bkash">বিকাশ (bKash)</option>
                  <option value="nagad">নগদ (Nagad)</option>
                  <option value="rocket">রকেট (Rocket)</option>
                  <option value="bank">ব্যাংক ডিপোজিট</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">ট্রানজেকশন রেফারেন্স নং</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="যেমন: bKash TrxID / ক্যাশ স্লিপ নং"
                  className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E9D4B3]">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(null)}
                  className="px-4 py-2 border border-[#2E2017]/30 text-[#2E2017] rounded-full"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#984710] text-white font-semibold rounded-full hover:bg-[#7e3a0c]"
                >
                  পেমেন্ট গ্রহণ ও রসিদ তৈরি
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Money Receipt Modal */}
      {printableReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-neutral-300 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 printable-area">
            <button
              onClick={() => setPrintableReceipt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 no-print cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center space-y-1 border-b-2 border-[#984710] pb-3 mb-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 object-contain"
                />
                <h3 className="text-xl font-extrabold text-[#2E2017]">
                  {settings.academyNameBn}
                </h3>
              </div>
              <p className="text-xs text-[#984710] font-semibold">টাকা জমার অফিসিয়াল মানি রসিদ (Money Receipt)</p>
              <p className="text-[10px] text-neutral-500">{settings.addressBn} · ফোন: {settings.phone1}</p>
            </div>

            {/* Receipt Meta */}
            <div className="flex justify-between items-center text-xs pb-3 border-b border-neutral-200">
              <div>
                <span className="text-neutral-500">রসিদ নং:</span>{' '}
                <span className="font-mono font-extrabold text-[#984710]">{printableReceipt.receiptNumber}</span>
              </div>
              <div>
                <span className="text-neutral-500">তারিখ:</span>{' '}
                <span className="font-mono font-bold text-neutral-800">{printableReceipt.date}</span>
              </div>
            </div>

            {/* Student & Bill Details */}
            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-[#FCF8EF] p-3 rounded-xl border border-[#E9D4B3]">
                <div>
                  <span className="text-neutral-500 block">শিক্ষার্থীর নাম:</span>
                  <span className="font-bold text-[#2E2017]">
                    {students.find((s) => s.id === printableReceipt.studentId)?.nameBn}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">শিক্ষার্থী আইডি:</span>
                  <span className="font-mono font-bold text-[#2E2017]">{printableReceipt.studentId}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">পেমেন্ট মাধ্যম:</span>
                  <span className="font-semibold uppercase text-[#2E2017]">{printableReceipt.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">ট্রানজেকশন আইডি:</span>
                  <span className="font-mono text-[#2E2017]">{printableReceipt.transactionRef || 'N/A'}</span>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 border-b border-neutral-200">
                    <tr>
                      <th className="p-2.5">বিবরণ / খাত</th>
                      <th className="p-2.5 text-right">আদায়কৃত টাকার পরিমাণ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2.5 font-medium">{printableReceipt.notes || 'মাসিক টিউশন ফি'}</td>
                      <td className="p-2.5 text-right font-extrabold text-[#984710] text-sm tabular-nums">
                        {formatTaka(printableReceipt.amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-10 flex justify-between items-end text-xs text-neutral-700">
              <div className="text-center">
                <p className="border-t border-neutral-400 pt-1">শিক্ষার্থী / অভিভাবকের স্বাক্ষর</p>
              </div>
              <div className="text-center">
                <p className="font-serif italic font-bold text-xs text-[#984710]">{printableReceipt.receivedBy}</p>
                <p className="border-t border-neutral-400 pt-1 font-bold">আদায়কারী কর্মকর্তার স্বাক্ষর</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-6 border-t border-neutral-200 no-print mt-6">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#984710] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 hover:bg-[#7e3a0c] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>রসিদ প্রিন্ট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
