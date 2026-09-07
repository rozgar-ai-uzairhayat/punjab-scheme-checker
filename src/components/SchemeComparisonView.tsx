import React, { useState, useMemo } from 'react';
import { Language, Scheme } from '../types';
import { translations } from '../data/translations';

interface SchemeComparisonViewProps {
  selectedSchemes: Scheme[];
  availableSchemes: Scheme[];
  onToggleScheme: (scheme: Scheme) => void;
  onClear: () => void;
  onSelectSchemeDetail: (scheme: Scheme) => void;
  onBackToCards?: () => void;
  lang: Language;
}

export const SchemeComparisonView: React.FC<SchemeComparisonViewProps> = ({
  selectedSchemes,
  availableSchemes,
  onToggleScheme,
  onClear,
  onSelectSchemeDetail,
  onBackToCards,
  lang
}) => {
  const t = translations[lang];
  const isUrdu = lang === 'ur';

  const [highlightDiffs, setHighlightDiffs] = useState<boolean>(false);
  const [addDropdownOpen, setAddDropdownOpen] = useState<boolean>(false);

  // Unselected available schemes that can be added
  const remainingSchemes = useMemo(() => {
    const selectedIds = new Set(selectedSchemes.map((s) => s.id));
    return availableSchemes.filter((s) => !selectedIds.has(s.id));
  }, [selectedSchemes, availableSchemes]);

  // Helper to check if row values differ across selected schemes
  const checkDiff = (getter: (s: Scheme) => string | number | undefined): boolean => {
    if (selectedSchemes.length < 2) return false;
    const firstVal = getter(selectedSchemes[0]);
    return selectedSchemes.some((s) => getter(s) !== firstVal);
  };

  const diffBenefit = highlightDiffs && checkDiff((s) => s.benefitAmount);
  const diffStatus = highlightDiffs && checkDiff((s) => s.status);
  const diffIncome = highlightDiffs && checkDiff((s) => s.maxIncomeThreshold ?? 0);
  const diffApply = highlightDiffs && checkDiff((s) => s.whereToApplyLabel);

  // Quick Preset Actions
  const handleSelectTop3 = () => {
    onClear();
    const top = availableSchemes.slice(0, 3);
    top.forEach((s) => onToggleScheme(s));
  };

  const handleSelectDirectOnly = () => {
    onClear();
    const directs = availableSchemes.filter((s) => s.category === 'direct' && s.status === 'eligible').slice(0, 3);
    if (directs.length > 0) {
      directs.forEach((s) => onToggleScheme(s));
    } else {
      availableSchemes.slice(0, 2).forEach((s) => onToggleScheme(s));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="scheme-comparison-view-container"
      className="space-y-space-md"
      dir={isUrdu ? 'rtl' : 'ltr'}
    >
      {/* Header Bar */}
      <div className="bg-surface-container-lowest border border-[#E4E1D8] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <span className="material-symbols-outlined text-[24px]">compare_arrows</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-title-md text-title-md text-primary font-bold">
                  {t.compareSchemesTitle}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  {t.comparedCount.replace('{count}', selectedSchemes.length.toString())}
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-outline mt-0.5">
                {t.compareSchemesSubtitle}
              </p>
            </div>
          </div>

          {/* Top Actions: Back to Cards & Print */}
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-center">
            {onBackToCards && (
              <button
                type="button"
                id="back-to-cards-btn"
                onClick={onBackToCards}
                className="px-3.5 py-1.5 rounded-xl border border-[#E4E1D8] bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">view_agenda</span>
                <span>{t.backToCards}</span>
              </button>
            )}

            <button
              type="button"
              id="print-comparison-btn"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl border border-[#E4E1D8] bg-surface-container-lowest hover:bg-surface-container text-primary font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title={t.printComparison}
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span className="hidden sm:inline">{t.printComparison}</span>
            </button>
          </div>
        </div>

        {/* Comparison Control Toolbar */}
        <div className="pt-3 border-t border-[#E4E1D8]/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          {/* Presets & Add Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-on-surface-variant shrink-0">
              {isUrdu ? 'فوری موازنہ:' : 'Quick Presets:'}
            </span>

            <button
              type="button"
              id="preset-top-btn"
              onClick={handleSelectTop3}
              className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-medium transition-colors cursor-pointer"
            >
              {t.comparePresetTop}
            </button>

            <button
              type="button"
              id="preset-direct-btn"
              onClick={handleSelectDirectOnly}
              className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-medium transition-colors cursor-pointer"
            >
              {t.comparePresetDirect}
            </button>

            {selectedSchemes.length > 0 && (
              <button
                type="button"
                id="clear-compare-btn"
                onClick={onClear}
                className="px-2.5 py-1 rounded-lg text-rose-700 hover:bg-rose-50 font-medium transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
                <span>{t.clearCompare}</span>
              </button>
            )}
          </div>

          {/* Highlights & Add dropdown */}
          <div className="flex items-center gap-3 flex-wrap">
            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-on-surface-variant font-medium">
              <input
                type="checkbox"
                id="highlight-diffs-checkbox"
                checked={highlightDiffs}
                onChange={(e) => setHighlightDiffs(e.target.checked)}
                className="w-4 h-4 rounded text-primary border-[#E4E1D8] focus:ring-primary-container cursor-pointer"
              />
              <span>{t.highlightDifferences}</span>
            </label>

            {/* Add More Scheme Dropdown */}
            {selectedSchemes.length < 4 && remainingSchemes.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  id="add-scheme-dropdown-btn"
                  onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                  className="px-3 py-1 rounded-lg bg-primary-container text-on-primary font-semibold flex items-center gap-1 shadow-xs hover:bg-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>{t.compareAddMore}</span>
                  <span className="material-symbols-outlined text-[16px]">
                    {addDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                  </span>
                </button>

                {addDropdownOpen && (
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-1.5 w-64 max-h-60 overflow-y-auto bg-surface-container-lowest border border-[#E4E1D8] rounded-xl shadow-xl z-20 py-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-outline uppercase border-b border-[#E4E1D8]/60">
                      {t.compareSelectSchemePlaceholder}
                    </div>
                    {remainingSchemes.map((scheme) => (
                      <button
                        key={scheme.id}
                        type="button"
                        onClick={() => {
                          onToggleScheme(scheme);
                          setAddDropdownOpen(false);
                        }}
                        className="w-full text-left rtl:text-right px-3 py-2 text-xs hover:bg-surface-container-high transition-colors flex items-center gap-2 cursor-pointer border-b border-[#E4E1D8]/30 last:border-b-0"
                      >
                        <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">
                          {scheme.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-primary truncate">
                            {isUrdu ? scheme.titleUrdu : scheme.title}
                          </p>
                          <span className="text-[10px] text-outline block truncate">
                            {isUrdu ? scheme.benefitAmountUrdu : scheme.benefitAmount}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insufficient Schemes Notice / Selection Prompt */}
      {selectedSchemes.length < 2 ? (
        <div className="p-8 sm:p-12 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-[#E4E1D8] space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[32px]">balance</span>
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="font-title-md text-title-md text-primary font-bold">
              {t.compareSelectAtLeastTwo}
            </h4>
            <p className="font-body-sm text-body-sm text-outline">
              {t.compareMaxHint}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
            <button
              type="button"
              onClick={handleSelectTop3}
              className="px-4 py-2 rounded-xl bg-primary-container text-on-primary font-semibold text-xs shadow-sm hover:bg-primary transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              <span>{t.comparePresetTop}</span>
            </button>

            {onBackToCards && (
              <button
                type="button"
                onClick={onBackToCards}
                className="px-4 py-2 rounded-xl border border-[#E4E1D8] bg-surface-container-lowest hover:bg-surface-container text-on-surface font-semibold text-xs transition-colors cursor-pointer"
              >
                {t.backToCards}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Side-by-Side Comparison Matrix Table / Cards */
        <div className="bg-surface-container-lowest rounded-2xl border border-[#E4E1D8] shadow-sm overflow-hidden">
          {/* Scrollable Container for Wide Columns */}
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left rtl:text-right border-collapse min-w-[700px]">
              {/* Table Column Group */}
              <colgroup>
                <col className="w-[180px] sm:w-[220px] bg-surface-container-low/60" />
                {selectedSchemes.map((s) => (
                  <col
                    key={s.id}
                    className="min-w-[260px] border-l rtl:border-r rtl:border-l-0 border-[#E4E1D8]"
                  />
                ))}
                {selectedSchemes.length < 4 && (
                  <col className="w-[160px] border-l rtl:border-r rtl:border-l-0 border-[#E4E1D8]" />
                )}
              </colgroup>

              {/* Table Header: Scheme Identity Cards */}
              <thead>
                <tr className="border-b border-[#E4E1D8] bg-surface-container-low/40">
                  <th className="p-4 sm:p-5 align-top">
                    <span className="text-xs font-bold uppercase tracking-wider text-outline block">
                      {isUrdu ? 'خصوصیات و پیمانے' : 'Attributes & Criteria'}
                    </span>
                    <span className="text-[11px] text-outline/80 mt-1 block">
                      {isUrdu ? 'پنجاب حکومت سرکاری گزٹ' : 'Govt of Punjab Gazette'}
                    </span>
                  </th>

                  {selectedSchemes.map((scheme) => (
                    <th key={scheme.id} className="p-4 sm:p-5 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[18px]">
                              {scheme.icon}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                              {isUrdu ? scheme.tagUrdu : scheme.tag}
                            </span>
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${
                                scheme.category === 'direct'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : scheme.category === 'survey'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {isUrdu ? scheme.statusTextUrdu : scheme.statusText}
                            </span>
                          </div>
                        </div>

                        {/* Remove from compare button */}
                        <button
                          type="button"
                          id={`remove-compare-${scheme.id}`}
                          onClick={() => onToggleScheme(scheme)}
                          className="w-7 h-7 rounded-lg text-outline hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors"
                          title={t.removeFromCompare}
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>

                      <h4 className="font-title-sm text-title-sm text-primary font-bold mt-2.5 leading-snug">
                        {isUrdu ? scheme.titleUrdu : scheme.title}
                      </h4>
                      <p className="text-[11px] text-outline mt-0.5 leading-tight">
                        {isUrdu ? scheme.departmentUrdu : scheme.department}
                      </p>

                      <button
                        type="button"
                        onClick={() => onSelectSchemeDetail(scheme)}
                        className="mt-2.5 text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>{t.viewDetails}</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </th>
                  ))}

                  {/* Add More Scheme Column Placeholder */}
                  {selectedSchemes.length < 4 && (
                    <th className="p-4 align-middle text-center bg-surface-container-low/20">
                      <div className="flex flex-col items-center justify-center p-4 border border-dashed border-[#E4E1D8] rounded-xl text-outline">
                        <span className="material-symbols-outlined text-[24px] mb-1">add_circle</span>
                        <span className="text-xs font-semibold block">{t.compareAddMore}</span>
                        <button
                          type="button"
                          onClick={() => setAddDropdownOpen(true)}
                          className="mt-2 px-2.5 py-1 rounded-lg bg-primary-container text-on-primary text-[11px] font-semibold cursor-pointer"
                        >
                          {isUrdu ? 'منتخب کریں' : 'Choose Scheme'}
                        </button>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              {/* Table Rows */}
              <tbody className="divide-y divide-[#E4E1D8] text-xs">
                {/* Row 1: Benefit Amount & Value */}
                <tr className={diffBenefit ? 'bg-amber-50/60' : ''}>
                  <td className="p-3.5 sm:p-4 font-bold text-on-surface bg-surface-container-low/60 align-top">
                    <div className="flex items-center gap-1.5 text-secondary">
                      <span className="material-symbols-outlined text-[16px]">monetization_on</span>
                      <span>{t.compareRowBenefit}</span>
                    </div>
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-3.5 sm:p-4 align-top">
                      <div className="p-2.5 rounded-xl bg-secondary-container/30 border border-secondary/20">
                        <span className="font-bold text-sm text-secondary block">
                          {isUrdu ? s.benefitAmountUrdu : s.benefitAmount}
                        </span>
                        <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-snug">
                          {isUrdu ? s.descriptionUrdu : s.description}
                        </span>
                      </div>
                    </td>
                  ))}
                  {selectedSchemes.length < 4 && <td className="p-3.5" />}
                </tr>

                {/* Row 2: Eligibility Status & Profile Match Reason */}
                <tr className={diffStatus ? 'bg-amber-50/60' : ''}>
                  <td className="p-3.5 sm:p-4 font-bold text-on-surface bg-surface-container-low/60 align-top">
                    <div className="flex items-center gap-1.5 text-primary">
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>{t.compareRowMatchReason}</span>
                    </div>
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-3.5 sm:p-4 align-top">
                      <div
                        className={`p-2.5 rounded-xl text-xs flex items-start gap-2 border ${
                          s.category === 'direct'
                            ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                            : s.category === 'survey'
                            ? 'bg-blue-50 text-blue-950 border-blue-200'
                            : 'bg-amber-50 text-amber-950 border-amber-200'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                          {s.category === 'direct'
                            ? 'task_alt'
                            : s.category === 'survey'
                            ? 'biometrics'
                            : 'pending_actions'}
                        </span>
                        <div className="leading-snug">
                          <span className="font-bold block mb-0.5">
                            {s.category === 'pending'
                              ? t.prerequisiteLabel
                              : t.matchedReasonLabel}:
                          </span>
                          <span>{isUrdu ? s.matchReasonUrdu : s.matchReason}</span>
                        </div>
                      </div>
                    </td>
                  ))}
                  {selectedSchemes.length < 4 && <td className="p-3.5" />}
                </tr>

                {/* Row 3: Official Eligibility Criteria */}
                <tr>
                  <td className="p-3.5 sm:p-4 font-bold text-on-surface bg-surface-container-low/60 align-top">
                    <div className="flex items-center gap-1.5 text-outline">
                      <span className="material-symbols-outlined text-[16px]">rule</span>
                      <span>{t.compareRowCriteria}</span>
                    </div>
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-3.5 sm:p-4 align-top leading-relaxed text-on-surface">
                      {isUrdu ? s.officialCriteriaSummaryUrdu : s.officialCriteriaSummary}
                    </td>
                  ))}
                  {selectedSchemes.length < 4 && <td className="p-3.5" />}
                </tr>

                {/* Row 4: Maximum Income Ceiling */}
                <tr className={diffIncome ? 'bg-amber-50/60' : ''}>
                  <td className="p-3.5 sm:p-4 font-bold text-on-surface bg-surface-container-low/60 align-top">
                    <div className="flex items-center gap-1.5 text-outline">
                      <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                      <span>{t.compareRowIncomeLimit}</span>
                    </div>
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-3.5 sm:p-4 align-top">
                      {s.maxIncomeThreshold ? (
                        <span className="font-bold text-primary text-xs px-2 py-1 rounded bg-surface-container-high inline-block">
                          ₨ {new Intl.NumberFormat('en-PK').format(s.maxIncomeThreshold)} / {isUrdu ? 'ماہانہ' : 'month'}
                        </span>
                      ) : (
                        <span className="text-outline italic">
                          {t.noIncomeLimit}
                        </span>
                      )}
                    </td>
                  ))}
                  {selectedSchemes.length < 4 && <td className="p-3.5" />}
                </tr>

                {/* Row 5: Required Documents */}
                <tr>
                  <td className="p-3.5 sm:p-4 font-bold text-on-surface bg-surface-container-low/60 align-top">
                    <div className="flex items-center gap-1.5 text-outline">
                      <span className="material-symbols-outlined text-[16px]">description</span>
                      <span>{t.compareRowDocuments}</span>
                    </div>
                  </td>
                  {selectedSchemes.map((s) => {
                    const docs = isUrdu ? s.requiredDocumentsUrdu : s.requiredDocuments;
                    return (
                      <td key={s.id} className="p-3.5 sm:p-4 align-top">
                        <div className="space-y-1.5">
                          {docs.map((doc, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] leading-snug">
                              <span className="material-symbols-outlined text-[14px] text-primary shrink-0 mt-0.5">
                                check_small
                              </span>
                              <span>{doc}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                  {selectedSchemes.length < 4 && <td className="p-3.5" />}
                </tr>

                {/* Row 6: Where & How to Apply */}
                <tr className={diffApply ? 'bg-amber-50/60' : ''}>
                  <td className="p-3.5 sm:p-4 font-bold text-on-surface bg-surface-container-low/60 align-top">
                    <div className="flex items-center gap-1.5 text-outline">
                      <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                      <span>{t.compareRowWhereToApply}</span>
                    </div>
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-3.5 sm:p-4 align-top">
                      <div className="p-2.5 rounded-xl bg-surface-container-low border border-[#E4E1D8]/60 leading-snug">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block mb-1">
                          {isUrdu ? s.whereToApplyLabelUrdu : s.whereToApplyLabel}
                        </span>
                        <span>{isUrdu ? s.whereToApplyUrdu : s.whereToApply}</span>
                      </div>
                    </td>
                  ))}
                  {selectedSchemes.length < 4 && <td className="p-3.5" />}
                </tr>

                {/* Row 7: Official Helpline & Portal */}
                <tr>
                  <td className="p-3.5 sm:p-4 font-bold text-on-surface bg-surface-container-low/60 align-top">
                    <div className="flex items-center gap-1.5 text-outline">
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      <span>{t.compareRowHelpline} / {t.compareRowPortal}</span>
                    </div>
                  </td>
                  {selectedSchemes.map((s) => (
                    <td key={s.id} className="p-3.5 sm:p-4 align-top">
                      <div className="space-y-2">
                        {s.helpline && (
                          <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                            <span className="material-symbols-outlined text-[16px] text-secondary">
                              phone_in_talk
                            </span>
                            <span>{s.helpline}</span>
                          </div>
                        )}

                        {s.portalUrl && (
                          <a
                            href={s.portalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-container/10 hover:bg-primary-container text-primary hover:text-on-primary text-xs font-semibold transition-all cursor-pointer"
                          >
                            <span>{t.applyOnline}</span>
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          </a>
                        )}
                      </div>
                    </td>
                  ))}
                  {selectedSchemes.length < 4 && <td className="p-3.5" />}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Disclaimer */}
          <div className="p-3.5 bg-surface-container-low/50 border-t border-[#E4E1D8] flex items-center gap-2 text-[11px] text-outline">
            <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">
              policy
            </span>
            <span>{t.compareDisclaimer}</span>
          </div>
        </div>
      )}
    </div>
  );
};
