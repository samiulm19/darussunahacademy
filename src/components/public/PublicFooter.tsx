import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUpRight,
  Shield,
  MessageSquare,
  Users,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PublicFooterProps {
  onOpenContactModal: () => void;
  onOpenAdmissionModal: () => void;
  onOpenPortal: () => void;
  setActiveNav: (nav: string) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onOpenContactModal,
  onOpenAdmissionModal,
  onOpenPortal,
  setActiveNav,
}) => {
  const { settings, committee } = useApp();

  return (
    <footer id="about" className="bg-[#2E2017] text-[#FFFBF3] pt-16 pb-10 border-t border-[#534231]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#534231]">
          {/* Col 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={settings.logoUrl}
                alt={settings.academyNameBn}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full border border-[#E9D4B3] bg-white p-0.5 object-contain"
              />
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">{settings.academyNameBn}</h3>
                <p className="text-xs text-[#E9D4B3]">{settings.academyNameEn}</p>
              </div>
            </div>

            <p className="text-xs text-[#E9D4B3]/80 leading-relaxed">
              পবিত্র কুরআনের হিফজ, বিশুদ্ধ সুন্নাহর তারবিয়াহ এবং আধুনিক জাতীয় শিক্ষাক্রমের মাধ্যমে আদর্শ নাগরিক ও আলিমে দ্বীন গড়ে তোলাই আমাদের লক্ষ্য।
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onOpenAdmissionModal}
                className="px-4 py-2 bg-[#984710] hover:bg-[#7e3a0c] text-white text-xs font-semibold rounded-full shadow-xs transition-colors cursor-pointer"
              >
                ভর্তি আবেদন ২০২৬
              </button>
              <button
                onClick={onOpenContactModal}
                className="px-4 py-2 border border-[#E9D4B3]/40 text-[#E9D4B3] hover:text-white hover:border-white text-xs font-medium rounded-full transition-colors cursor-pointer"
              >
                বার্তা পাঠান
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-[#E9D4B3] border-b border-[#534231] pb-1.5">
              দ্রুত লিঙ্ক
            </h4>
            <ul className="space-y-2 text-xs text-[#FFFBF3]/80">
              <li>
                <button
                  onClick={() => {
                    setActiveNav('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  মূলপাতা
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveNav('programs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  শিক্ষাধারা ও সিলেবাস
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveNav('admission')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ভর্তি নীতিমালা ও ফি
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveNav('notices')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  পরীক্ষার ফলাফল ও নোটিশ
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPortal}
                  className="hover:text-[#E9D4B3] font-semibold text-[#984710] transition-colors cursor-pointer"
                >
                  অফিস ও শিক্ষক পোর্টাল
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Leadership & Shura Committee (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-[#E9D4B3] border-b border-[#534231] pb-1.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#984710]" />
              <span>পরিচালনা পর্ষদ ও শুরা</span>
            </h4>
            <div className="space-y-2.5 text-xs">
              {committee.slice(0, 3).map((member) => (
                <div key={member.id} className="border-b border-[#534231]/40 pb-2">
                  <p className="font-semibold text-white">{member.nameBn}</p>
                  <p className="text-[11px] text-[#E9D4B3]">{member.designation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Campus & Office Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-[#E9D4B3] border-b border-[#534231] pb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#984710]" />
              <span>ক্যাম্পাস ও যোগাযোগ</span>
            </h4>
            <div className="space-y-2.5 text-[#FFFBF3]/90">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#984710] shrink-0 mt-0.5" />
                <span className="leading-tight">{settings.addressBn}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#984710] shrink-0" />
                <span className="tabular-nums">{settings.phone1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#984710] shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[#E9D4B3]">
                <Clock className="w-3.5 h-3.5 text-[#E9D4B3] shrink-0" />
                <span>{settings.officeHoursBn}</span>
              </div>
            </div>

            <button
              onClick={onOpenContactModal}
              className="mt-3 w-full py-2 bg-[#3B2B20] hover:bg-[#4a3629] text-[#FFFBF3] border border-[#534231] rounded-xl text-center text-xs font-medium cursor-pointer transition-colors"
            >
              যোগাযোগ ফর্ম ও অফিস ইনবক্স
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Accreditation */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E9D4B3]/70">
          <p>© {new Date().getFullYear()} {settings.academyNameBn}। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#984710]" />
              <span>নিরাপদ একাডেমি ম্যানেজমেন্ট সিস্টেম</span>
            </span>
            <span>·</span>
            <span>ঢাকা, বাংলাদেশ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
