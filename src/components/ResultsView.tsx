import React, { useState, useMemo } from 'react';
import { CitizenData, EvaluationResult, Language, Scheme, SchemeCategory, SchemeDomain } from '../types';
import { translations } from '../data/translations';
import { SchemeDetailModal } from './SchemeDetailModal';
import { LatestUpdates } from './LatestUpdates';
import { SchemeComparisonView } from './SchemeComparisonView';

interface ResultsViewProps {
  results: EvaluationResult;
  citizenData: CitizenData;
  onStartOver: () => void;
  onEditAnswers: () => void;
  onOpenValidation?: () => void;
  lang: Language;
}

type FilterTab = 'all' | 'direct' | 'pending' | 'social' | 'health' | 'education' | 'agri';

export const ResultsView: React.FC<ResultsViewProps> = ({
  results,
  citizenData,
  onStartOver,
  onEditAnswers,
  onOpenValidation,
  lang
}) => {
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'compare'>('cards');
  const [compareList, setCompareList] = useState<Scheme[]>([]);
  const [compareToast, setCompareToast] = useState<string | null>(null);
  const t = translations[lang];
  const isUrdu = lang === 'ur';

  // All available matching schemes
  const allMatchingSchemes = useMemo(() => {
    return [...results.eligibleDirect, ...results.surveyCheck, ...results.pendingReq];
  }, [results]);

  const handleToggleCompare = (scheme: Scheme) => {
    setCompareList((prev) => {
      const exists = prev.some((s) => s.id === scheme.id);
      if (exists) {
        return prev.filter((s) => s.id !== scheme.id);
      }
      if (prev.length >= 4) {
        setCompareToast(t.compareMaxHint);
        setTimeout(() => setCompareToast(null), 3000);
        return prev;
      }
      return [...prev, scheme];
    });
  };

  const handleClearCompare = () => {
    setCompareList([]);
  };

  const handleOpenCompareMode = () => {
    if (compareList.length < 2) {
      // Pre-populate with top 2 or 3 matching schemes so user immediately gets a rich side-by-side view
      const defaults = allMatchingSchemes.slice(0, Math.min(3, allMatchingSchemes.length));
      setCompareList(defaults);
    }
    setViewMode('compare');
  };

  const handleShare = () => {
    const directTitles = results.eligibleDirect
      .map((s) => (isUrdu ? s.titleUrdu : s.title))
      .join(', ');
    const pendingTitles = results.pendingReq
      .map((s) => (isUrdu ? s.titleUrdu : s.title))
      .join(', ');

    const shareText = isUrdu
      ? `حکومت پنجاب سٹیزن پورٹل کے تحت میرے نتائج:\nبراہ راست اہل: ${directTitles || 'کوئی نہیں'}\nزیر التواء شرط: ${pendingTitles || 'کوئی نہیں'}\n\nاہلیت چیک کریں: ${window.location.href}`
      : `My Punjab Citizen Portal Scheme Evaluation:\nDirectly Eligible: ${directTitles || 'None'}\nPending Prerequisites: ${pendingTitles || 'None'}\n\nCheck yours here: ${window.location.href}`;

    navigator.clipboard.writeText(shareText).then(() => {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    });
  };

  const formattedIncome = new Intl.NumberFormat('en-PK').format(
    citizenData.monthlyIncome
  );

  // Filter schemes based on activeTab
  const filterList = (schemes: Scheme[]): Scheme[] => {
    if (activeTab === 'all') return schemes;
    if (activeTab === 'direct') return schemes.filter((s) => s.category === 'direct' && s.status === 'eligible');
    if (activeTab === 'pending') return schemes.filter((s) => s.status === 'not_eligible_yet' || s.category === 'pending');
    if (activeTab === 'social') return schemes.filter((s) => s.domain === 'social_safety' || s.domain === 'special_welfare');
    if (activeTab === 'health') return schemes.filter((s) => s.domain === 'healthcare' || s.domain === 'housing');
    if (activeTab === 'education') return schemes.filter((s) => s.domain === 'education' || s.domain === 'youth_employment');
    if (activeTab === 'agri') return schemes.filter((s) => s.domain === 'agriculture' || s.domain === 'energy');
    return schemes;
  };

  const filteredDirect = filterList(results.eligibleDirect);
  const filteredSurvey = filterList(results.surveyCheck);
  const filteredPending = filterList(results.pendingReq);

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: t.filterAll, count: results.totalReviewed },
    { id: 'direct', label: t.filterDirect, count: results.eligibleDirect.length },
    { id: 'pending', label: t.filterPending, count: results.pendingReq.length },
    {
      id: 'social',
      label: t.filterSocial,
      count: [...results.eligibleDirect, ...results.surveyCheck, ...results.pendingReq].filter(
        (s) => s.domain === 'social_safety' || s.domain === 'special_welfare'
      ).length
    },
    {
      id: 'health',
      label: t.filterHealth,
      count: [...results.eligibleDirect, ...results.surveyCheck, ...results.pendingReq].filter(
        (s) => s.domain === 'healthcare' || s.domain === 'housing'
      ).length
    },
    {
      id: 'education',
      label: t.filterEducation,
      count: [...results.eligibleDirect, ...results.surveyCheck, ...results.pendingReq].filter(
        (s) => s.domain === 'education' || s.domain === 'youth_employment'
      ).length
    },
    {
      id: 'agri',
      label: t.filterAgri,
      count: [...results.eligibleDirect, ...results.surveyCheck, ...results.pendingReq].filter(
        (s) => s.domain === 'agriculture' || s.domain === 'energy'
      ).length
    }
  ];

  const renderSchemeCard = (scheme: Scheme, type: 'direct' | 'survey' | 'pending') => {
    const isCompared = compareList.some((s) => s.id === scheme.id);
    return (
      <div
        key={scheme.id}
        onClick={() => setSelectedScheme(scheme)}
        className={`bg-surface-container-lowest rounded-xl p-space-md shadow-sm border space-y-space-sm cursor-pointer hover:shadow-md transition-all group relative overflow-hidden ${
          isCompared ? 'border-primary ring-1 ring-primary/40' : 'border-[#E4E1D8]'
        }`}
      >
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-space-xs">
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-label-sm text-label-sm text-on-tertiary-container font-semibold">
                {isUrdu ? scheme.tagUrdu : scheme.tag}
              </span>
              <span className="font-label-sm text-label-sm px-2 py-0.5 bg-surface-container-high rounded text-primary font-medium">
                {isUrdu ? scheme.benefitAmountUrdu : scheme.benefitAmount}
              </span>
            </div>
            <h4 className="font-title-md text-title-md text-primary font-bold group-hover:text-primary-container transition-colors">
              {isUrdu ? scheme.titleUrdu : scheme.title}
            </h4>
            <span className="text-xs text-outline mt-0.5">
              {isUrdu ? scheme.departmentUrdu : scheme.department}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span
              className={`font-label-sm text-label-sm px-space-xs py-1 rounded-full whitespace-nowrap font-medium ${
                type === 'direct'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : type === 'survey'
                  ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {isUrdu ? scheme.statusTextUrdu : scheme.statusText}
            </span>

            {/* Compare Scheme Button */}
            <button
              type="button"
              id={`card-compare-btn-${scheme.id}`}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCompare(scheme);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border ${
                isCompared
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container hover:bg-surface-container-high text-primary border-[#E4E1D8]'
              }`}
              title={isCompared ? t.removeFromCompare : t.addToCompare}
            >
              <span className="material-symbols-outlined text-[15px]">
                {isCompared ? 'check_box' : 'compare_arrows'}
              </span>
              <span>{isCompared ? t.inCompare : t.addToCompare}</span>
            </button>
          </div>
        </div>

        {/* Scheme Description */}
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          {isUrdu ? scheme.descriptionUrdu : scheme.description}
        </p>

        {/* Criteria Match Explanation Box */}
        {scheme.matchReason && (
          <div className={`p-2.5 rounded-lg text-xs flex items-start gap-2 ${
            type === 'direct'
              ? 'bg-emerald-50/80 text-emerald-900 border border-emerald-200'
              : type === 'survey'
              ? 'bg-blue-50 text-blue-900 border border-blue-200'
              : 'bg-amber-50 text-amber-900 border border-amber-200'
          }`}>
            <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
              {type === 'direct' ? 'task_alt' : type === 'survey' ? 'biometrics' : 'pending_actions'}
            </span>
            <div className="flex flex-col">
              <span className="font-bold">
                {type === 'pending' ? t.prerequisiteLabel : t.matchedReasonLabel}:
              </span>
              <span className="leading-snug mt-0.5">
                {isUrdu ? scheme.matchReasonUrdu : scheme.matchReason}
              </span>
            </div>
          </div>
        )}

        {/* Action / Where to apply block */}
        <div className="bg-surface-container-low rounded-lg p-space-sm flex items-start justify-between gap-space-xs">
          <div className="flex items-start gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
              {scheme.icon}
            </span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wide">
                {isUrdu
                  ? scheme.whereToApplyLabelUrdu
                  : scheme.whereToApplyLabel}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface leading-snug">
                {isUrdu ? scheme.whereToApplyUrdu : scheme.whereToApply}
              </span>
            </div>
          </div>
          <span className="text-primary font-label-sm text-label-sm underline shrink-0 self-center hidden sm:inline font-medium">
            {t.viewDetails}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Top Banner: Schemes Found & Feedback */}
      <div className="bg-surface-container-low p-space-md border-b border-[#E4E1D8]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[18px]">
                check_circle
              </span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider block font-semibold">
                {isUrdu ? 'حتمی اہلیت' : 'Evaluation Complete'}
              </span>
              <h2 className="font-title-lg text-title-lg text-primary font-bold">
                {t.schemesWorthReviewing.replace(
                  '{count}',
                  results.totalReviewed.toString()
                )}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onEditAnswers}
            className="text-primary font-label-md text-label-md hover:underline cursor-pointer flex items-center gap-1 font-semibold px-2.5 py-1 rounded-lg hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>{t.editAnswers}</span>
          </button>
        </div>

        {/* Confirmed Citizen Profile Snapshot */}
        <div className="mt-space-sm p-space-sm bg-white rounded-xl border border-[#E4E1D8] shadow-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-surface-container-high">
            <span className="text-xs font-bold text-primary flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">fact_check</span>
              {t.confirmedProfileTitle}
            </span>
            <div className="flex items-center gap-2">
              {onOpenValidation && (
                <button
                  type="button"
                  onClick={onOpenValidation}
                  className="text-[11px] font-semibold text-secondary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  <span>{t.dataQualityBadge}</span>
                </button>
              )}
              <span className="text-[11px] text-outline">
                {citizenData.isPunjabResident
                  ? isUrdu ? 'پنجاب رہائشی' : 'Punjab Resident'
                  : isUrdu ? 'غیر پنجاب رہائشی' : 'Non-Punjab'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <div>
              <span className="text-outline block">{t.monthlyIncomeLabel}:</span>
              <span className="font-bold text-on-surface">₨ {formattedIncome}</span>
            </div>
            <div>
              <span className="text-outline block">{t.householdSizeLabel}:</span>
              <span className="font-bold text-on-surface">{citizenData.householdSize} {t.members}</span>
            </div>
            <div>
              <span className="text-outline block">{t.residentialAreaLabel}:</span>
              <span className="font-bold text-on-surface capitalize">
                {citizenData.areaType === 'urban' ? t.urbanSetting.split(' ')[0] : t.ruralSetting.split(' ')[0]}
              </span>
            </div>
            <div>
              <span className="text-outline block">{t.electricityLabel}:</span>
              <span className="font-bold text-on-surface">
                {citizenData.electricityUnits === 'under_200' ? '< 200 Units' : citizenData.electricityUnits === '200_500' ? '200-500 Units' : '500+ Units'}
              </span>
            </div>
          </div>

          {/* Active Specialized Badges */}
          <div className="flex items-center gap-1.5 flex-wrap pt-2 mt-1 border-t border-surface-container-high">
            {citizenData.ownsSmallPlot && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-900 font-medium">
                {isUrdu ? 'رہائشی پلاٹ' : 'Residential Plot'}
              </span>
            )}
            {citizenData.ownsAgriLand && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-green-100 text-green-900 font-medium">
                {isUrdu ? 'زرعی زمین' : 'Agri Land'}
              </span>
            )}
            {citizenData.isStudent && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-900 font-medium">
                {isUrdu ? 'طالب علم' : 'Student'}
              </span>
            )}
            {citizenData.hasLearnerPermit && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-purple-100 text-purple-900 font-medium">
                {isUrdu ? 'لرنر پرمٹ' : 'Learner Permit'}
              </span>
            )}
            {citizenData.hasDisability && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-900 font-medium">
                {isUrdu ? 'معذور افراد کوٹہ' : 'PWD Special'}
              </span>
            )}
            {citizenData.hasPregnantOrInfant && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-pink-100 text-pink-900 font-medium">
                {isUrdu ? 'ماں اور بچہ' : 'Maternal/Infant'}
              </span>
            )}
            {citizenData.hasDaughterMarriage && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-900 font-medium">
                {isUrdu ? 'بیٹی کی شادی' : 'Daughter Marriage'}
              </span>
            )}
            {citizenData.isYouthEntrepreneur && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-teal-100 text-teal-900 font-medium">
                {isUrdu ? 'یوتھ کاروبار' : 'Youth Business'}
              </span>
            )}
          </div>
        </div>

        {/* 3 Metric Stat Pillars */}
        <div className="grid grid-cols-3 gap-space-xs mt-space-sm">
          <div
            onClick={() => setActiveTab('direct')}
            className={`bg-surface-container-lowest p-2.5 rounded-lg border text-center cursor-pointer transition-all ${
              activeTab === 'direct' ? 'border-primary-container ring-1 ring-primary-container bg-emerald-50/50' : 'border-[#E4E1D8]'
            }`}
          >
            <span className="font-headline-sm text-headline-sm text-secondary font-bold block">
              {results.eligibleDirect.length}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight block mt-0.5">
              {t.eligibleDirectStat}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('all')}
            className={`bg-surface-container-lowest p-2.5 rounded-lg border text-center cursor-pointer transition-all ${
              activeTab === 'all' ? 'border-primary-container ring-1 ring-primary-container bg-blue-50/50' : 'border-[#E4E1D8]'
            }`}
          >
            <span className="font-headline-sm text-headline-sm text-on-tertiary-container font-bold block">
              {results.surveyCheck.length}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight block mt-0.5">
              {t.surveyCheckStat}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('pending')}
            className={`bg-surface-container-lowest p-2.5 rounded-lg border text-center cursor-pointer transition-all ${
              activeTab === 'pending' ? 'border-primary-container ring-1 ring-primary-container bg-amber-50/50' : 'border-[#E4E1D8]'
            }`}
          >
            <span className="font-headline-sm text-headline-sm text-amber-700 font-bold block">
              {results.pendingReq.length}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight block mt-0.5">
              {t.pendingReqStat}
            </span>
          </div>
        </div>
      </div>

      {/* View Switcher: Scheme Cards vs Side-by-Side Comparison */}
      <div className="px-space-md py-2.5 bg-surface-container-low/80 border-b border-[#E4E1D8] flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex rounded-xl p-1 bg-surface-container border border-[#E4E1D8] shadow-2xs">
          <button
            type="button"
            id="view-mode-cards-btn"
            onClick={() => setViewMode('cards')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">grid_view</span>
            <span>{t.cardsViewTab}</span>
          </button>

          <button
            type="button"
            id="view-mode-compare-btn"
            onClick={handleOpenCompareMode}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'compare'
                ? 'bg-white text-primary shadow-xs'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
            <span>{t.compareViewTab}</span>
            {compareList.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-primary-container text-on-primary text-[10px] font-bold">
                {compareList.length}
              </span>
            )}
          </button>
        </div>

        {/* Quick launch compare button if schemes selected in cards view */}
        {viewMode === 'cards' && compareList.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="top-bar-compare-btn"
              onClick={() => setViewMode('compare')}
              className="px-3 py-1.5 rounded-xl bg-primary-container text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">splitscreen</span>
              <span>{t.openCompareModal.replace('{count}', compareList.length.toString())}</span>
            </button>
            <button
              type="button"
              onClick={handleClearCompare}
              className="p-1.5 rounded-lg text-outline hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title={t.clearCompare}
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            </button>
          </div>
        )}
      </div>

      {/* Comparison Limit Notice Toast */}
      {compareToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-900 text-white px-4 py-2 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span>{compareToast}</span>
        </div>
      )}
      {/* Main View Area: Either Compare Matrix or Cards Grid */}
      {viewMode === 'compare' ? (
        <div className="p-space-md">
          <SchemeComparisonView
            selectedSchemes={compareList}
            availableSchemes={allMatchingSchemes}
            onToggleScheme={handleToggleCompare}
            onClear={handleClearCompare}
            onSelectSchemeDetail={(s) => setSelectedScheme(s)}
            onBackToCards={() => setViewMode('cards')}
            lang={lang}
          />
        </div>
      ) : (
        <>
          {/* Filter Tabs / Domain Pills */}
          <div className="p-space-sm bg-white border-b border-[#E4E1D8] overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 min-w-max">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-primary-container text-on-primary shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? 'bg-white/20 text-white' : 'bg-white text-outline'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-space-md space-y-space-lg">
            {/* Section 1: Directly Eligible Schemes */}
            {filteredDirect.length > 0 && (
              <section className="space-y-space-sm">
                <div className="flex items-start gap-space-xs">
                  <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-on-secondary-container text-[20px]">
                      task_alt
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-title-md text-title-md text-primary font-semibold">
                      {t.directSectionTitle}
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-0.5">
                      {t.directSectionDesc}
                    </p>
                  </div>
                </div>

                <div className="space-y-space-sm">
                  {filteredDirect.map((scheme) => renderSchemeCard(scheme, 'direct'))}
                </div>
              </section>
            )}

            {/* Section 2: Official Survey & NSER Verification */}
            {filteredSurvey.length > 0 && (
              <section className="bg-surface-container-high/40 rounded-xl p-space-md space-y-space-md border border-[#E4E1D8]">
                <div className="flex items-start gap-space-xs">
                  <div className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-on-tertiary-fixed text-[20px]">
                      verified_user
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-title-md text-title-md text-primary font-semibold">
                      {t.surveySectionTitle}
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-0.5">
                      {t.surveySectionDesc}
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-lg p-space-sm flex items-start gap-space-xs shadow-xs">
                  <span className="material-symbols-outlined text-on-tertiary-container text-[20px] shrink-0 mt-0.5">
                    info
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {t.surveyInfoBox}
                  </p>
                </div>

                <div className="space-y-space-sm">
                  {filteredSurvey.map((scheme) => renderSchemeCard(scheme, 'survey'))}
                </div>
              </section>
            )}

            {/* Section 3: Pending Prerequisites / Action Required */}
            {filteredPending.length > 0 && (
              <section className="space-y-space-sm">
                <div className="flex items-start gap-space-xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5 text-amber-800">
                    <span className="material-symbols-outlined text-[20px]">
                      pending_actions
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-title-md text-title-md text-primary font-semibold">
                      {t.pendingSectionTitle}
                    </h3>
                    <p className="font-body-sm text-body-sm text-outline mt-0.5">
                      {t.pendingSectionDesc}
                    </p>
                  </div>
                </div>

                <div className="space-y-space-sm">
                  {filteredPending.map((scheme) => renderSchemeCard(scheme, 'pending'))}
                </div>
              </section>
            )}
          </div>
        </>
      )}

      {/* Common Footer Actions & Updates */}
      <div className="p-space-md space-y-space-lg pt-0">
        {/* Disclaimer Callout */}
        <div className="bg-tertiary-fixed/30 rounded-xl p-space-md flex items-start gap-space-xs shadow-sm border border-amber-200/50">
          <span className="material-symbols-outlined text-on-tertiary-container text-[20px] shrink-0 mt-0.5">
            policy
          </span>
          <p className="font-body-sm text-body-sm text-on-tertiary-fixed-variant leading-relaxed">
            {t.disclaimer}
          </p>
        </div>

        {/* Action Controls */}
        <div className="space-y-space-sm pt-space-xs">
          <button
            type="button"
            id="share-btn"
            onClick={handleShare}
            className="w-full bg-primary-container text-on-primary font-label-lg text-label-lg py-space-sm px-space-lg rounded-xl shadow-md flex items-center justify-center gap-space-xs hover:bg-primary transition-colors active:scale-[0.99] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">share</span>
            <span>{t.saveShare}</span>
          </button>

          {showToast && (
            <div
              id="share-toast"
              className="text-center py-space-xs px-space-sm bg-secondary-container text-on-secondary-container rounded-lg font-label-sm text-label-sm transition-all duration-300 animate-in fade-in"
            >
              {t.shareToast}
            </div>
          )}

          <button
            type="button"
            onClick={onStartOver}
            className="w-full text-center block text-on-surface-variant font-label-md text-label-md py-space-xs hover:text-primary hover:underline cursor-pointer"
          >
            {t.startOver}
          </button>
        </div>

        {/* Latest Official Welfare Announcements Section */}
        <LatestUpdates lang={lang} />
      </div>

      {/* Floating Bottom Compare Dock (Visible in Cards mode when items selected) */}
      {viewMode === 'cards' && compareList.length > 0 && (
        <div
          id="floating-compare-dock"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[calc(100vw-2rem)] bg-primary-container text-on-primary p-3 sm:p-3.5 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-md flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200"
          dir={isUrdu ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs">
                  {t.comparedCount.replace('{count}', compareList.length.toString())}
                </span>
                <span className="text-[11px] text-white/80 hidden sm:inline">
                  ({t.compareMaxHint})
                </span>
              </div>
              {/* Selected scheme mini tags */}
              <div className="flex items-center gap-1.5 mt-1 overflow-x-auto no-scrollbar py-0.5">
                {compareList.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 text-[10px] font-semibold shrink-0"
                  >
                    <span className="truncate max-w-[90px]">
                      {isUrdu ? s.titleUrdu : s.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleCompare(s)}
                      className="hover:text-rose-300 p-0.5 cursor-pointer"
                      title={t.removeFromCompare}
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="dock-compare-btn"
              onClick={() => setViewMode('compare')}
              className="px-3.5 py-2 rounded-xl bg-white text-primary hover:bg-white/90 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">splitscreen</span>
              <span>
                {compareList.length < 2
                  ? t.compareSchemes
                  : t.openCompareModal.replace('{count}', compareList.length.toString())}
              </span>
            </button>

            <button
              type="button"
              onClick={handleClearCompare}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              title={t.clearCompare}
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            </button>
          </div>
        </div>
      )}

      {/* Scheme Detail Modal */}
      <SchemeDetailModal
        scheme={selectedScheme}
        onClose={() => setSelectedScheme(null)}
        lang={lang}
        isCompared={selectedScheme ? compareList.some((s) => s.id === selectedScheme.id) : false}
        onToggleCompare={handleToggleCompare}
      />
    </div>
  );
};
