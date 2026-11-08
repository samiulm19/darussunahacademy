import React, { useState } from 'react';
import {
  Globe,
  Save,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Plus,
  Trash2,
  Eye,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NoticeItem, GalleryPhoto } from '../../types';

export const CMSView: React.FC = () => {
  const {
    settings,
    updateSettings,
    notices,
    addNotice,
    deleteNotice,
    gallery,
    addGalleryPhoto,
  } = useApp();

  const [activeCmsTab, setActiveCmsTab] = useState<'hero' | 'contact' | 'notices' | 'gallery'>('hero');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form states
  const [heroHeadline, setHeroHeadline] = useState(settings.heroHeadline);
  const [heroHighlight, setHeroHighlight] = useState(settings.heroHighlight);
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle);
  const [taglineBn, setTaglineBn] = useState(settings.taglineBn);
  const [admissionDeadline, setAdmissionDeadline] = useState(settings.admissionDeadline);

  // Contact Form
  const [phone1, setPhone1] = useState(settings.phone1);
  const [phone2, setPhone2] = useState(settings.phone2);
  const [email, setEmail] = useState(settings.email);
  const [addressBn, setAddressBn] = useState(settings.addressBn);
  const [officeHoursBn, setOfficeHoursBn] = useState(settings.officeHoursBn);

  // Notice Creator Form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<NoticeItem['category']>('একাডেমিক');
  const [noticeContent, setNoticeContent] = useState('');

  // Gallery Creator Form
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');

  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      heroHeadline,
      heroHighlight,
      heroSubtitle,
      taglineBn,
      admissionDeadline,
    });
    setFeedback('হোমপেজ ও ব্যানার কন্টেন্ট সফলভাবে হালনাগাদ করা হয়েছে!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      phone1,
      phone2,
      email,
      addressBn,
      officeHoursBn,
    });
    setFeedback('যোগাযোগ ও ক্যাম্পাস তথ্য সফলভাবে হালনাগাদ করা হয়েছে!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    addNotice({
      id: `not-${Date.now()}`,
      title: noticeTitle,
      category: noticeCategory,
      content: noticeContent,
      publishDate: new Date().toISOString().split('T')[0],
      isPublic: true,
    });

    setNoticeTitle('');
    setNoticeContent('');
    setFeedback('নতুন নোটিশ সফলভাবে ওয়েবসাইটে প্রকাশিত হয়েছে!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim()) return;

    addGalleryPhoto({
      id: `gal-${Date.now()}`,
      title: photoTitle,
      category: 'ক্যাম্পাস',
      imageUrl: photoUrl || settings.heroImage1,
      caption: photoCaption,
      date: new Date().toISOString().split('T')[0],
    });

    setPhotoTitle('');
    setPhotoCaption('');
    setPhotoUrl('');
    setFeedback('গ্যালারিতে নতুন ছবি সফলভাবে যুক্ত হয়েছে!');
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2E2017]">
            পাবলিক ওয়েবসাইট কনটেন্ট ম্যানেজমেন্ট (CMS)
          </h2>
          <p className="text-xs text-[#2E2017]/70">
            হোমপেজ ব্যানার, পরিচিতি, নোটিশ বোর্ড, গ্যালারি ও ভর্তি নীতি সম্পাদনা
          </p>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* CMS Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E9D4B3] pb-1 text-xs">
        <button
          onClick={() => setActiveCmsTab('hero')}
          className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
            activeCmsTab === 'hero'
              ? 'border-[#984710] text-[#984710]'
              : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
          }`}
        >
          হোমপেজ ব্যানার ও টেক্সট
        </button>
        <button
          onClick={() => setActiveCmsTab('contact')}
          className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
            activeCmsTab === 'contact'
              ? 'border-[#984710] text-[#984710]'
              : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
          }`}
        >
          যোগাযোগ ও ঠিকানা
        </button>
        <button
          onClick={() => setActiveCmsTab('notices')}
          className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
            activeCmsTab === 'notices'
              ? 'border-[#984710] text-[#984710]'
              : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
          }`}
        >
          নোটিশ বোর্ড ও প্রকাশনা
        </button>
        <button
          onClick={() => setActiveCmsTab('gallery')}
          className={`px-3 py-1.5 font-bold transition-colors cursor-pointer border-b-2 ${
            activeCmsTab === 'gallery'
              ? 'border-[#984710] text-[#984710]'
              : 'border-transparent text-[#2E2017]/70 hover:text-[#2E2017]'
          }`}
        >
          ছবি গ্যালারি অ্যালবাম
        </button>
      </div>

      {/* Tab 1: Hero Settings */}
      {activeCmsTab === 'hero' && (
        <form onSubmit={handleSaveHero} className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-6 shadow-xs max-w-2xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-[#2E2017] border-b border-[#E9D4B3] pb-2">
            মূলপাতার হিরো ব্যানার ও শিরোনাম
          </h3>

          <div>
            <label className="block font-semibold mb-1">একাডেমির ট্যাগলাইন *</label>
            <input
              type="text"
              value={taglineBn}
              onChange={(e) => setTaglineBn(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">ব্যানার মূল শিরোনাম (অংশ ১) *</label>
              <input
                type="text"
                value={heroHeadline}
                onChange={(e) => setHeroHeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">হাইলাইট শব্দ (রঙিন টেক্সট) *</label>
              <input
                type="text"
                value={heroHighlight}
                onChange={(e) => setHeroHighlight(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] text-[#984710] font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">ব্যানার সাব-টাইটেল বিবরণ *</label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3] leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">ভর্তি আবেদনের ডেডলাইন টেক্সট</label>
            <input
              type="text"
              value={admissionDeadline}
              onChange={(e) => setAdmissionDeadline(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Contact Info */}
      {activeCmsTab === 'contact' && (
        <form onSubmit={handleSaveContact} className="bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-6 shadow-xs max-w-2xl space-y-4 text-xs">
          <h3 className="text-sm font-bold text-[#2E2017] border-b border-[#E9D4B3] pb-2">
            ক্যাম্পাস ঠিকানা ও অফিস যোগাযোগের তথ্য
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">ফোন নম্বর ১ *</label>
              <input
                type="text"
                value={phone1}
                onChange={(e) => setPhone1(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">ফোন নম্বর ২</label>
              <input
                type="text"
                value={phone2}
                onChange={(e) => setPhone2(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">অফিসিয়াল ইমেইল *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">অফিস সময়সূচি *</label>
              <input
                type="text"
                value={officeHoursBn}
                onChange={(e) => setOfficeHoursBn(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">ক্যাম্পাসের পূর্ণাঙ্গ ঠিকানা *</label>
            <input
              type="text"
              value={addressBn}
              onChange={(e) => setAddressBn(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-white border border-[#E9D4B3]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>যোগাযোগ তথ্য সংরক্ষণ করুন</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Notices Management */}
      {activeCmsTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          {/* New Notice Form (5 cols) */}
          <div className="lg:col-span-5 bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-[#2E2017] text-sm border-b border-[#E9D4B3] pb-2">
              নতুন নোটিশ প্রকাশ করুন
            </h3>
            <form onSubmit={handleAddNotice} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">নোটিশের শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="যেমন: রমজান উপলক্ষে বিশেষ সময়সূচি..."
                  className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">বিভাগ *</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value as any)}
                  className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                >
                  <option value="একাডেমিক">একাডেমিক</option>
                  <option value="ভর্তি">ভর্তি</option>
                  <option value="পরীক্ষা">পরীক্ষা</option>
                  <option value="ছুটি">ছুটি</option>
                  <option value="সাধারণ">সাধারণ</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">বিস্তারিত বিবরণ *</label>
                <textarea
                  required
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="পূর্ণাঙ্গ নোটিশের ভাষা লিখুন..."
                  className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full cursor-pointer"
              >
                নোটিশ প্রকাশ করুন
              </button>
            </form>
          </div>

          {/* Published Notices List (7 cols) */}
          <div className="lg:col-span-7 bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-[#2E2017] text-sm border-b border-[#E9D4B3] pb-2">
              বর্তমানে প্রকাশিত নোটিশসমূহ ({notices.length}টি)
            </h3>
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {notices.map((n) => (
                <div key={n.id} className="p-3 bg-[#FCF8EF] rounded-xl border border-[#E9D4B3] flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <span className="bg-[#984710] text-white text-[10px] px-2 py-0.5 rounded font-bold">
                      {n.category}
                    </span>
                    <h4 className="font-bold text-[#2E2017]">{n.title}</h4>
                    <p className="text-[#534231] line-clamp-2">{n.content}</p>
                    <span className="text-[10px] text-[#534231] block font-mono">{n.publishDate}</span>
                  </div>
                  <button
                    onClick={() => deleteNotice(n.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Photo Gallery Albums */}
      {activeCmsTab === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-5 bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-[#2E2017] text-sm border-b border-[#E9D4B3] pb-2">
              গ্যালারিতে নতুন ছবি যোগ করুন
            </h3>
            <form onSubmit={handleAddPhoto} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">ছবির শিরোনাম *</label>
                <input
                  type="text"
                  required
                  value={photoTitle}
                  onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="যেমন: কিরাত প্রতিযোগিতা ২০২৬"
                  className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">ক্যাপশন</label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="ছবির সংক্ষিপ্ত বর্ণনা"
                  className="w-full p-2 rounded-xl bg-white border border-[#E9D4B3]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white font-semibold rounded-full cursor-pointer"
              >
                ছবি সংরক্ষণ করুন
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-[#FFFBF3] rounded-2xl border border-[#E9D4B3] p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-[#2E2017] text-sm border-b border-[#E9D4B3] pb-2">
              গ্যালারির বর্তমান ছবি ({gallery.length}টি)
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {gallery.map((g) => (
                <div key={g.id} className="rounded-xl border border-[#E9D4B3] overflow-hidden bg-white">
                  <img
                    src={g.imageUrl}
                    alt={g.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2">
                    <p className="font-bold truncate text-[11px]">{g.title}</p>
                    <p className="text-[10px] text-[#534231] truncate">{g.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
