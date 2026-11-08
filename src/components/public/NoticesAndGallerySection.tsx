import React, { useState } from 'react';
import { Bell, Calendar, Download, Image as ImageIcon, Search, CheckCircle, Eye, ArrowUpRight, Award } from 'lucide-react';
import { useApp, toBnDigits } from '../../context/AppContext';
import { NoticeItem, GalleryPhoto } from '../../types';

export const NoticesAndGallerySection: React.FC = () => {
  const { notices, gallery, students, examMarks, examTerms, subjects } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('সকল');
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState<GalleryPhoto | null>(null);

  // Result Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedStudentResult, setSearchedStudentResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const categories = ['সকল', 'ভর্তি', 'একাডেমিক', 'পরীক্ষা', 'ছুটি'];

  const filteredNotices = notices.filter((n) => {
    if (selectedCategory === 'সকল') return n.isPublic;
    return n.isPublic && n.category === selectedCategory;
  });

  const handleResultSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setHasSearched(true);

    const query = searchQuery.trim().toLowerCase();
    const student = students.find(
      (s) =>
        s.id.toLowerCase() === query ||
        s.rollNo === query ||
        s.rollNo === toBnDigits(query)
    );

    if (student) {
      // Find latest published exam marks
      const studentMarks = examMarks.filter((m) => m.studentId === student.id);
      setSearchedStudentResult({
        student,
        marks: studentMarks,
      });
    } else {
      setSearchedStudentResult(null);
    }
  };

  return (
    <section id="notices" className="py-16 sm:py-20 bg-[#F4ECDD] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section 1: Notices and Result Lookup Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column: Notices Board (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-6 sm:p-7 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[#E9D4B3]">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#984710]" />
                <h3 className="text-xl font-bold text-[#2E2017]">সর্বশেষ নোটিশ বোর্ড</h3>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#984710] text-white font-semibold'
                        : 'text-[#2E2017]/70 hover:bg-[#E9D4B3]/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Notices List */}
            <div className="space-y-3">
              {filteredNotices.slice(0, 4).map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => setSelectedNotice(notice)}
                  className="p-3.5 rounded-xl bg-[#FCF8EF] border border-[#E9D4B3]/70 hover:border-[#984710] transition-colors cursor-pointer group flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#984710]">
                      <span className="font-semibold">{notice.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-[#2E2017]/60">
                        <Calendar className="w-3 h-3" />
                        <span>{notice.publishDate}</span>
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#2E2017] group-hover:text-[#984710] transition-colors line-clamp-1">
                      {notice.title}
                    </h4>
                    <p className="text-xs text-[#2E2017]/75 line-clamp-2 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>

                  <div className="shrink-0 pt-1">
                    <span className="text-xs font-semibold text-[#984710] flex items-center gap-0.5 group-hover:underline">
                      <span>দেখুন</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Public Result Announcement & Lookup (5 cols) */}
          <div className="lg:col-span-5 bg-[#2E2017] text-[#FFFBF3] rounded-2xl border border-[#534231] p-6 sm:p-7 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#534231]">
                <Award className="w-5 h-5 text-[#E9D4B3]" />
                <h3 className="text-lg font-bold text-white">পাবলিক ফলাফল অনুসন্ধান</h3>
              </div>
              <p className="text-xs text-[#E9D4B3]/80 leading-relaxed mb-4">
                শিক্ষার্থীর আইডি (যেমন: DSA-ST-2026001) অথবা শ্রেণি রোল নম্বর দিয়ে সাম্প্রতিক পরীক্ষার প্রকাশিত ফলাফল দেখুন।
              </p>

              {/* Search Form */}
              <form onSubmit={handleResultSearch} className="space-y-3 mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="শিক্ষার্থী আইডি বা রোল নম্বর লিখুন..."
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#3B2B20] border border-[#534231] text-xs text-white placeholder-[#E9D4B3]/50 focus:outline-hidden focus:border-[#984710]"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 p-1.5 rounded-lg bg-[#984710] text-white hover:bg-[#7e3a0c] cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Search Result Box */}
              {hasSearched && (
                <div className="bg-[#3B2B20] p-3.5 rounded-xl border border-[#534231] text-xs space-y-2">
                  {searchedStudentResult ? (
                    <div>
                      <div className="flex items-center justify-between border-b border-[#534231] pb-2 mb-2">
                        <div>
                          <p className="font-bold text-white text-sm">
                            {searchedStudentResult.student.nameBn}
                          </p>
                          <p className="text-[11px] text-[#E9D4B3]">
                            আইডি: {searchedStudentResult.student.id} | রোল: {searchedStudentResult.student.rollNo}
                          </p>
                        </div>
                        <span className="bg-[#16A34A] text-white px-2 py-0.5 rounded text-[10px] font-bold">
                          উত্তীর্ণ
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <p className="text-[#E9D4B3]">প্রথম সাময়িক মূল্যায়ন ২০২৬:</p>
                        {searchedStudentResult.marks.length > 0 ? (
                          searchedStudentResult.marks.map((m: any, i: number) => {
                            const sub = subjects.find((s) => s.id === m.subjectId);
                            return (
                              <div key={i} className="flex justify-between text-white/90">
                                <span>{sub ? sub.nameBn : m.subjectId}:</span>
                                <span className="font-bold text-[#E9D4B3]">
                                  {m.totalMarks} ({m.grade})
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-neutral-400">বিষয়ভিত্তিক নম্বর এন্ট্রি প্রক্রিয়াধীন।</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-amber-300 text-center py-2">
                      প্রদত্ত তথ্যের কোনো শিক্ষার্থীর ফলাফল খুঁজে পাওয়া যায়নি।
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#534231] text-[11px] text-[#E9D4B3]/70">
              অভিভাবক পোর্টালে বিস্তারিত প্রগ্রেস রিপোর্ট ও মার্কশিট ডাউনলোড করা যাবে।
            </div>
          </div>
        </div>

        {/* Section 2: Photo Gallery Showcase */}
        <div id="gallery" className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#984710] bg-[#FFFBF3] border border-[#E9D4B3] px-3 py-0.5 rounded-full mb-2">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>ছবিতে দারুস সুন্নাহ একাডেমি</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2E2017]">
              আমাদের ক্যাম্পাস ও শিক্ষা কার্যক্রমের মুহূর্ত
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {gallery.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedGalleryPhoto(photo)}
                className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group hover:border-[#984710]/40"
              >
                <div className="h-48 sm:h-52 overflow-hidden relative">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2 bg-white/90 rounded-full text-[#2E2017]">
                      <Eye className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[#984710]">
                    <span className="font-semibold">{photo.category}</span>
                    <span className="text-[#2E2017]/60">{photo.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#2E2017] group-hover:text-[#984710] transition-colors">
                    {photo.title}
                  </h4>
                  <p className="text-xs text-[#2E2017]/70 line-clamp-1">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notice Viewer Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#E9D4B3] pb-3 mb-4">
              <span className="text-xs font-bold text-[#984710] bg-[#FCF8EF] px-2.5 py-1 rounded-full border border-[#E9D4B3]">
                {selectedNotice.category}
              </span>
              <span className="text-xs text-[#2E2017]/60">{selectedNotice.publishDate}</span>
            </div>

            <h3 className="text-lg font-bold text-[#2E2017] mb-3 leading-snug">
              {selectedNotice.title}
            </h3>

            <p className="text-sm text-[#2E2017]/90 leading-relaxed whitespace-pre-line mb-6">
              {selectedNotice.content}
            </p>

            {selectedNotice.fileName && (
              <div className="bg-[#FCF8EF] p-3 rounded-xl border border-[#E9D4B3] flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-[#2E2017] truncate">
                  সংযুক্তি: {selectedNotice.fileName}
                </span>
                <button
                  onClick={() => alert(`ডাউনলোড হচ্ছে: ${selectedNotice.fileName}`)}
                  className="px-3 py-1 bg-[#984710] text-white text-xs font-semibold rounded-full flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>ডাউনলোড</span>
                </button>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-5 py-2 bg-[#2E2017] text-white text-xs font-semibold rounded-full cursor-pointer hover:bg-black"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Zoom Modal */}
      {selectedGalleryPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="max-w-3xl w-full bg-[#FFFBF3] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={selectedGalleryPhoto.imageUrl}
              alt={selectedGalleryPhoto.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[70vh] object-contain bg-black"
            />
            <div className="p-5 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#2E2017]">{selectedGalleryPhoto.title}</h4>
                <p className="text-xs text-[#2E2017]/70 mt-0.5">{selectedGalleryPhoto.caption}</p>
              </div>
              <button
                onClick={() => setSelectedGalleryPhoto(null)}
                className="px-4 py-1.5 bg-[#2E2017] text-white text-xs font-semibold rounded-full cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
