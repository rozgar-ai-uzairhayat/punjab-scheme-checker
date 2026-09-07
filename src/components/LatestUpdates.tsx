import React, { useState, useMemo } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { OFFICIAL_ANNOUNCEMENTS, Announcement } from '../data/announcements';

interface LatestUpdatesProps {
  lang: Language;
}

export const LatestUpdates: React.FC<LatestUpdatesProps> = ({ lang }) => {
  const t = translations[lang];
  const isUrdu = lang === 'ur';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const categories = useMemo(() => [
    { id: 'all', labelEn: 'All Updates', labelUr: 'تمام اعلانات', icon: 'campaign' },
    { id: 'housing', labelEn: 'Housing', labelUr: 'رہائش و پلاٹ', icon: 'roofing' },
    { id: 'social', labelEn: 'Social Welfare', labelUr: 'سماجی بہبود', icon: 'accessible' },
    { id: 'agriculture', labelEn: 'Agriculture', labelUr: 'زراعت و کسان', icon: 'agriculture' },
    { id: 'education', labelEn: 'Higher Education', labelUr: 'اعلیٰ تعلیم', icon: 'school' },
    { id: 'energy', labelEn: 'Clean Energy', labelUr: 'سولر و توانائی', icon: 'solar_power' }
  ], []);

  const filteredAnnouncements = useMemo(() => {
    return OFFICIAL_ANNOUNCEMENTS.filter((announcement) => {
      if (selectedCategory !== 'all' && announcement.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitleEn = announcement.titleEn.toLowerCase().includes(query);
        const matchesTitleUr = announcement.titleUr.includes(query);
        const matchesSummaryEn = announcement.summaryEn.toLowerCase().includes(query);
        const matchesSummaryUr = announcement.summaryUr.includes(query);
        const matchesDeptEn = announcement.departmentEn.toLowerCase().includes(query);
        const matchesDeptUr = announcement.departmentUr.includes(query);
        return matchesTitleEn || matchesTitleUr || matchesSummaryEn || matchesSummaryUr || matchesDeptEn || matchesDeptUr;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="latest-updates-section"
      className="mt-space-lg pt-space-lg border-t border-[#E4E1D8] space-y-space-md"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">campaign</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-title-md text-title-md text-primary font-bold">
                {t.latestUpdatesTitle}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                {t.verifiedGazette}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-outline mt-0.5">
              {t.latestUpdatesSubtitle}
            </p>
          </div>
        </div>

        {/* Live Source Attribution Badge */}
        <div className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high border border-[#E4E1D8] text-xs font-semibold text-secondary shrink-0">
          <span className="material-symbols-outlined text-[16px] text-primary">
            verified
          </span>
          <span>punjab.gov.pk</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-2.5">
        {/* Search Input */}
        <div className="relative flex items-center border border-[#E4E1D8] rounded-xl bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary-container transition-all">
          <span className="absolute left-3.5 rtl:right-3.5 rtl:left-auto material-symbols-outlined text-outline text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            id="search-announcements-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchAnnouncementsPlaceholder}
            className="w-full h-11 pl-10 pr-4 rtl:pr-10 rtl:pl-4 bg-transparent text-on-surface font-body-sm text-body-sm rounded-xl focus:outline-none placeholder:text-outline"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 rtl:left-3 rtl:right-auto text-outline hover:text-primary cursor-pointer p-1"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                id={`filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`h-9 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary-container text-on-primary shadow-sm font-bold'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high border border-transparent hover:border-[#E4E1D8]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {cat.icon}
                </span>
                <span className="whitespace-nowrap">
                  {isUrdu ? cat.labelUr : cat.labelEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3.5">
        {filteredAnnouncements.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest rounded-2xl border border-[#E4E1D8] text-outline text-sm">
            <span className="material-symbols-outlined text-[36px] text-outline/60 block mb-2">
              search_off
            </span>
            <p className="font-semibold text-on-surface-variant">{t.noUpdatesFound}</p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const isExpanded = expandedCardId === announcement.id;
            return (
              <div
                key={announcement.id}
                id={`announcement-${announcement.id}`}
                className="bg-surface-container-lowest rounded-2xl border border-[#E4E1D8] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Header Row: Department, Badge & Date */}
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-[#E4E1D8]/60 text-xs">
                    <div className="flex items-center gap-1.5 text-secondary font-medium">
                      <span className="material-symbols-outlined text-[16px]">
                        account_balance
                      </span>
                      <span>
                        {isUrdu ? announcement.departmentUr : announcement.departmentEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${announcement.badgeColor}`}
                      >
                        {isUrdu ? announcement.badgeUr : announcement.badgeEn}
                      </span>
                      <span className="text-[11px] text-outline font-medium">
                        {isUrdu ? announcement.dateUr : announcement.dateEn}
                      </span>
                    </div>
                  </div>

                  {/* Main Title */}
                  <div className="mt-3 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">
                        {announcement.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-title-sm text-title-sm text-primary font-bold leading-snug">
                        {isUrdu ? announcement.titleUr : announcement.titleEn}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                        {isUrdu ? announcement.summaryUr : announcement.summaryEn}
                      </p>
                    </div>
                  </div>

                  {/* Key Highlights Bullet Points */}
                  <div className="mt-3 pt-3 border-t border-[#E4E1D8]/60 space-y-1.5 bg-surface-container-lowest rounded-xl">
                    {(isUrdu ? announcement.bulletsUr : announcement.bulletsEn).map(
                      (bullet, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-on-surface">
                          <span className="material-symbols-outlined text-[15px] text-emerald-600 shrink-0 mt-0.5">
                            check_circle
                          </span>
                          <span className="leading-relaxed">{bullet}</span>
                        </div>
                      )
                    )}
                  </div>

                  {/* Card Bottom Meta & Official Link */}
                  <div className="mt-4 pt-3 border-t border-[#E4E1D8] flex items-center justify-between gap-3 flex-wrap text-xs">
                    <div className="flex items-center gap-1 text-outline">
                      <span className="material-symbols-outlined text-[14px]">language</span>
                      <span className="font-semibold text-on-surface-variant">
                        {t.officialSourceLabel}:
                      </span>
                      <span className="font-mono text-[11px] bg-surface-container-high px-1.5 py-0.5 rounded text-primary">
                        {announcement.sourceName}
                      </span>
                    </div>

                    <a
                      href={announcement.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-primary-container/10 text-primary hover:bg-primary-container hover:text-on-primary font-semibold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
                    >
                      <span>{t.viewOfficialPortal}</span>
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
