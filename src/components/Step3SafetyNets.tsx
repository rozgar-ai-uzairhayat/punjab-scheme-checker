import React from 'react';
import { CitizenData, Language } from '../types';
import { translations } from '../data/translations';

interface Step3Props {
  data: CitizenData;
  onChange: (updates: Partial<CitizenData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  onOpenValidation?: () => void;
  isCalculating: boolean;
  lang: Language;
}

export const Step3SafetyNets: React.FC<Step3Props> = ({
  data,
  onChange,
  onSubmit,
  onBack,
  onOpenValidation,
  isCalculating,
  lang
}) => {
  const t = translations[lang];
  const isUrdu = lang === 'ur';

  const criteriaOptions: {
    key: keyof CitizenData;
    title: string;
    tag: string;
    desc: string;
    icon: string;
    accentColor: string;
  }[] = [
    {
      key: 'isStudent',
      title: t.studentOptionTitle,
      tag: t.studentOptionTag,
      desc: t.studentOptionDesc,
      icon: 'school',
      accentColor: 'border-blue-200'
    },
    {
      key: 'hasLearnerPermit',
      title: t.learnerOptionTitle,
      tag: t.learnerOptionTag,
      desc: t.learnerOptionDesc,
      icon: 'two_wheeler',
      accentColor: 'border-indigo-200'
    },
    {
      key: 'hasDisability',
      title: t.disabilityOptionTitle,
      tag: t.disabilityOptionTag,
      desc: t.disabilityOptionDesc,
      icon: 'accessible',
      accentColor: 'border-emerald-200'
    },
    {
      key: 'isBispRegistered',
      title: t.bispOptionTitle,
      tag: t.bispOptionTag,
      desc: t.bispOptionDesc,
      icon: 'account_balance_wallet',
      accentColor: 'border-amber-200'
    },
    {
      key: 'hasPregnantOrInfant',
      title: t.maternalOptionTitle,
      tag: t.maternalOptionTag,
      desc: t.maternalOptionDesc,
      icon: 'child_care',
      accentColor: 'border-pink-200'
    },
    {
      key: 'hasDaughterMarriage',
      title: t.marriageOptionTitle,
      tag: t.marriageOptionTag,
      desc: t.marriageOptionDesc,
      icon: 'favorite',
      accentColor: 'border-rose-200'
    },
    {
      key: 'isYouthEntrepreneur',
      title: t.entrepreneurOptionTitle,
      tag: t.entrepreneurOptionTag,
      desc: t.entrepreneurOptionDesc,
      icon: 'storefront',
      accentColor: 'border-teal-200'
    }
  ];

  return (
    <div className="flex flex-col w-full space-y-space-lg pb-space-xl">
      {/* Progress Section */}
      <div className="flex flex-col gap-space-xs pt-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-outline">
            {isUrdu ? 'مرحلہ 3 از 3' : 'Step 3 of 3'}
          </span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">
            {t.step3Tag}
          </span>
        </div>
        {/* 3-Segment Progress Bar (Complete) */}
        <div className="grid grid-cols-3 gap-1.5 w-full h-1.5">
          <div className="h-full rounded-full bg-primary-container"></div>
          <div className="h-full rounded-full bg-primary-container"></div>
          <div className="h-full rounded-full bg-primary-container"></div>
        </div>
      </div>

      {/* Editorial Headline Section */}
      <div className="flex flex-col gap-space-xxs">
        <div className="flex items-center gap-space-xs mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">
              verified
            </span>
            {t.step3Badge}
          </span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-semibold">
          {t.step3Headline}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          {t.step3Subtitle}
        </p>
      </div>

      {/* Interactive Selection Checkcards */}
      <div className="space-y-space-sm">
        {criteriaOptions.map((opt) => {
          const isSelected = Boolean(data[opt.key]);
          return (
            <div
              key={opt.key}
              onClick={() => onChange({ [opt.key]: !isSelected })}
              className={`p-space-md rounded-xl border transition-all cursor-pointer flex items-start gap-space-sm select-none ${
                isSelected
                  ? 'bg-surface-container-lowest border-primary-container ring-1 ring-primary-container shadow-md'
                  : 'bg-surface-container-low border-transparent hover:bg-surface-container'
              }`}
            >
              {/* Checkbox Icon */}
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  isSelected
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'border-2 border-outline/50 bg-white'
                }`}
              >
                {isSelected && (
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                )}
              </div>

              {/* Text content */}
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-label-md text-label-md ${
                      isSelected
                        ? 'text-primary font-bold'
                        : 'text-on-surface font-semibold'
                    }`}
                  >
                    {opt.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-surface-container-high text-secondary">
                    {opt.tag}
                  </span>
                </div>

                <p className="font-body-sm text-body-sm text-outline mt-1 leading-relaxed">
                  {opt.desc}
                </p>
              </div>

              {/* Visual Icon */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-primary-container/10 text-primary-container'
                    : 'bg-surface-container text-outline'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {opt.icon}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* None Prompt */}
      <div className="text-center py-1">
        <span className="font-body-sm text-body-sm text-outline">
          {t.nonePrompt}
        </span>
      </div>

      {/* Official Matching Banner & Audit Tool Shortcut */}
      <div className="bg-secondary-container/40 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-secondary-container">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-secondary text-[22px] shrink-0 mt-0.5">
            balance
          </span>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-secondary-container font-semibold">
              {t.crossCheckTitle}
            </span>
            <p className="font-body-sm text-body-sm text-on-secondary-container/85 mt-0.5 leading-relaxed">
              {t.crossCheckDesc}
            </p>
          </div>
        </div>

        {onOpenValidation && (
          <button
            type="button"
            onClick={onOpenValidation}
            className="self-start sm:self-center px-3 py-1.5 rounded-lg border border-secondary-container bg-white text-xs font-semibold text-primary hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">
              fact_check
            </span>
            <span>{t.validateInputsBtn}</span>
          </button>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-space-sm pt-space-xs">
        <button
          type="button"
          onClick={onBack}
          disabled={isCalculating}
          className="h-12 px-space-lg flex items-center justify-center gap-1.5 rounded-[11px] bg-surface-container font-label-lg text-label-lg text-primary hover:bg-surface-container-high transition-colors shrink-0 shadow-sm cursor-pointer disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isUrdu ? 'arrow_forward' : 'arrow_back'}
          </span>
          <span>{t.back}</span>
        </button>

        <button
          type="button"
          id="submit-step-3"
          onClick={onSubmit}
          disabled={isCalculating}
          className="flex-1 h-12 px-space-lg flex items-center justify-center gap-space-xs rounded-[11px] bg-primary-container text-on-primary font-label-lg text-label-lg shadow-[0_4px_14px_rgba(34,52,74,0.18)] hover:bg-primary transition-all active:scale-[0.99] cursor-pointer disabled:opacity-75"
        >
          {isCalculating ? (
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{t.calculating}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>{t.checkEligibility}</span>
              <span className="material-symbols-outlined text-[20px]">
                {isUrdu ? 'arrow_backward' : 'arrow_forward'}
              </span>
            </div>
          )}
        </button>
      </div>

      <div className="text-center">
        <span className="font-label-sm text-label-sm text-outline flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          {t.privacyNote}
        </span>
      </div>
    </div>
  );
};
