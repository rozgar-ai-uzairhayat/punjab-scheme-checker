import React from 'react';
import { Language, Scheme } from '../types';
import { translations } from '../data/translations';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  onClose: () => void;
  lang: Language;
  isCompared?: boolean;
  onToggleCompare?: (scheme: Scheme) => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  onClose,
  lang,
  isCompared,
  onToggleCompare
}) => {
  if (!scheme) return null;
  const t = translations[lang];

  const title = lang === 'ur' ? scheme.titleUrdu : scheme.title;
  const department =
    lang === 'ur' ? scheme.departmentUrdu : scheme.department;
  const description =
    lang === 'ur' ? scheme.descriptionUrdu : scheme.description;
  const whereToApply =
    lang === 'ur' ? scheme.whereToApplyUrdu : scheme.whereToApply;
  const benefitAmount =
    lang === 'ur' ? scheme.benefitAmountUrdu : scheme.benefitAmount;
  const officialCriteria =
    lang === 'ur'
      ? scheme.officialCriteriaSummaryUrdu
      : scheme.officialCriteriaSummary;
  const documents =
    lang === 'ur' ? scheme.requiredDocumentsUrdu : scheme.requiredDocuments;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-[#E4E1D8] max-h-[90vh] flex flex-col overflow-hidden"
        dir={lang === 'ur' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-space-md border-b border-surface-container-high flex items-start justify-between bg-surface-container-low/50">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <span className="material-symbols-outlined text-[24px]">
                {scheme.icon}
              </span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider block">
                {lang === 'ur' ? scheme.tagUrdu : scheme.tag}
              </span>
              <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                {title}
              </h3>
              <p className="font-body-sm text-body-sm text-outline mt-0.5">
                {department}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-space-md overflow-y-auto space-y-space-md">
          {/* Benefit Badge */}
          <div className="p-3.5 rounded-xl bg-secondary-container/30 border border-secondary/20 flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary text-[24px]">
              monetization_on
            </span>
            <div>
              <span className="font-label-sm text-label-sm text-secondary font-bold block">
                {t.benefitValue}
              </span>
              <span className="font-title-sm text-title-sm text-on-surface font-semibold">
                {benefitAmount}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-1">
              {lang === 'ur' ? 'تفصیل' : 'Program Overview'}
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              {description}
            </p>
          </div>

          {/* Official Criteria */}
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container">
            <h4 className="font-label-lg text-label-lg text-on-surface mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">
                policy
              </span>
              <span>{t.officialCriteria}</span>
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {officialCriteria}
            </p>
          </div>

          {/* Required Documents Checklist */}
          <div>
            <h4 className="font-label-lg text-label-lg text-on-surface mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">
                checklist
              </span>
              <span>{t.requiredDocuments}</span>
            </h4>
            <ul className="space-y-1.5">
              {documents.map((doc, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-body-sm font-body-sm text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                    check_circle
                  </span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Verification & Portal Channels */}
          <div className="pt-2 border-t border-surface-container-high grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-lg bg-surface-container-low flex flex-col">
              <span className="font-label-sm text-label-sm text-outline">
                {t.helpline}
              </span>
              <a
                href={`tel:${scheme.helpline.replace(/[^0-9]/g, '')}`}
                className="font-title-sm text-title-sm text-primary font-bold hover:underline flex items-center gap-1.5 mt-0.5"
              >
                <span className="material-symbols-outlined text-[18px]">
                  call
                </span>
                <span>{scheme.helpline}</span>
              </a>
            </div>

            <div className="p-3 rounded-lg bg-surface-container-low flex flex-col">
              <span className="font-label-sm text-label-sm text-outline">
                {t.whereToApply}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface font-medium mt-0.5">
                {whereToApply}
              </span>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-space-md border-t border-surface-container-high bg-surface-container-low/50 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <a
            href={scheme.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 h-11 px-5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-sm"
          >
            <span>{t.applyOnline}</span>
            <span className="material-symbols-outlined text-[18px]">
              open_in_new
            </span>
          </a>

          {onToggleCompare && (
            <button
              type="button"
              id="detail-modal-compare-btn"
              onClick={() => onToggleCompare(scheme)}
              className={`w-full sm:w-auto h-11 px-4 rounded-lg font-label-md text-label-md font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                isCompared
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-container-lowest text-primary border-[#E4E1D8] hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isCompared ? 'check_box' : 'compare_arrows'}
              </span>
              <span>{isCompared ? t.inCompare : t.addToCompare}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-5 rounded-lg border border-[#E4E1D8] text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
