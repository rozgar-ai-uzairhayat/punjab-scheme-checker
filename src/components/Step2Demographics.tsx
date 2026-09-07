import React from 'react';
import { CitizenData, EmploymentStatus, Gender, Language, MaritalStatus } from '../types';
import { translations } from '../data/translations';

interface Step2Props {
  data: CitizenData;
  onChange: (updates: Partial<CitizenData>) => void;
  onNext: () => void;
  onBack: () => void;
  onOpenValidation?: () => void;
  lang: Language;
}

export const Step2Demographics: React.FC<Step2Props> = ({
  data,
  onChange,
  onNext,
  onBack,
  onOpenValidation,
  lang
}) => {
  const t = translations[lang];
  const isUrdu = lang === 'ur';
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleValidatedNext = () => {
    if (!data.age || data.age < 16) {
      setErrorMessage(
        isUrdu
          ? 'درخواست گزار کی عمر کم از کم 16 سال ہونی چاہیے (شناختی کارڈ کی قانونی حد)'
          : 'Applicant must be at least 16 years old to register (legal Smart Card/CNIC threshold)'
      );
      return;
    }
    if (data.age > 110) {
      setErrorMessage(
        isUrdu ? 'براہ کرم درست عمر درج کریں' : 'Please enter a valid age'
      );
      return;
    }
    setErrorMessage(null);
    onNext();
  };

  const genderOptions: { id: Gender; title: string; desc: string; icon: string }[] = [
    { id: 'female', title: t.femaleTitle, desc: t.femaleDesc, icon: 'female' },
    { id: 'male', title: t.maleTitle, desc: t.maleDesc, icon: 'male' },
    { id: 'other', title: t.transgenderTitle, desc: t.transgenderDesc, icon: 'transgender' }
  ];

  const maritalOptions: { id: MaritalStatus; title: string; tag?: string }[] = [
    { id: 'single', title: t.singleTitle },
    { id: 'married', title: t.marriedTitle },
    { id: 'widowed_divorced', title: t.widowedDivorcedTitle, tag: t.widowedDivorcedTag }
  ];

  const employmentOptions: {
    id: EmploymentStatus;
    title: string;
    desc: string;
    icon: string;
    tag?: string;
  }[] = [
    {
      id: 'daily_wage',
      title: t.dailyWageTitle,
      desc: t.dailyWageDesc,
      icon: 'engineering'
    },
    {
      id: 'farmer',
      title: t.farmerTitle,
      desc: t.farmerDesc,
      icon: 'agriculture',
      tag: t.farmerTag
    },
    {
      id: 'salaried',
      title: t.salariedTitle,
      desc: t.salariedDesc,
      icon: 'badge'
    },
    {
      id: 'self_employed',
      title: t.selfEmployedTitle,
      desc: t.selfEmployedDesc,
      icon: 'storefront'
    },
    {
      id: 'unemployed',
      title: t.unemployedTitle,
      desc: t.unemployedDesc,
      icon: 'person_search'
    },
    {
      id: 'govt_employee',
      title: t.govtEmployeeTitle,
      desc: t.govtEmployeeDesc,
      icon: 'account_balance'
    }
  ];

  return (
    <div className="flex flex-col w-full space-y-space-lg pb-space-xl">
      {/* Progress Section */}
      <div className="flex flex-col gap-space-xs pt-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-outline">
            {isUrdu ? 'مرحلہ 2 از 3' : 'Step 2 of 3'}
          </span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold">
            {t.step2Tag}
          </span>
        </div>
        {/* 3-Segment Civic Progress Bar */}
        <div className="grid grid-cols-3 gap-1.5 w-full h-1.5">
          <div className="h-full rounded-full bg-primary-container"></div>
          <div className="h-full rounded-full bg-primary-container"></div>
          <div className="h-full rounded-full bg-surface-container-high"></div>
        </div>
      </div>

      {/* Header Editorial Text */}
      <div className="flex flex-col gap-space-xxs">
        <div className="flex items-center gap-space-xs mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm flex items-center gap-1 font-semibold">
            <span className="material-symbols-outlined text-[14px]">person</span>
            {t.step2Badge}
          </span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight font-semibold">
          {t.step2Headline}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
          {t.step2Subtitle}
        </p>
      </div>

      {/* Form Content Card */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-[#E4E1D8] space-y-space-lg">
        {/* Input 1: Age */}
        <div className="flex flex-col gap-space-xxs">
          <label
            htmlFor="citizen-age"
            className="font-label-lg text-label-lg text-on-surface font-semibold"
          >
            {t.ageLabel}
          </label>
          <div className={`relative flex items-center border rounded-lg bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary-container ${
            errorMessage ? 'border-rose-400 ring-1 ring-rose-300' : 'border-[#E4E1D8]'
          }`}>
            <input
              id="citizen-age"
              type="number"
              min="16"
              max="110"
              placeholder="e.g. 28"
              value={data.age || ''}
              onChange={(e) => {
                setErrorMessage(null);
                onChange({ age: parseInt(e.target.value, 10) || 0 });
              }}
              className="w-full h-12 px-space-md bg-transparent text-on-surface font-body-md text-body-md rounded-lg placeholder:text-outline focus:outline-none transition-all"
            />
            <span className="absolute right-3.5 font-label-md text-label-md text-outline pointer-events-none">
              {t.years}
            </span>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5 animate-in fade-in mt-1">
              <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0">
                error
              </span>
              <span>{errorMessage}</span>
            </div>
          )}
          <div className="flex items-start gap-1.5 mt-1">
            <span className="material-symbols-outlined text-secondary text-[16px] mt-0.5 shrink-0">
              info
            </span>
            <p className="font-body-sm text-body-sm text-outline">
              {t.ageHint}
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-surface-container-high"></div>

        {/* Input 2: Gender (Critical for BISP & Pink Schemes) */}
        <div className="flex flex-col gap-space-xxs">
          <label className="font-label-lg text-label-lg text-on-surface font-semibold">
            {t.genderLabel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
            {genderOptions.map((g) => {
              const isSelected = data.gender === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onChange({ gender: g.id })}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container text-on-primary border-primary-container font-semibold shadow-sm'
                      : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] shrink-0">
                      {g.icon}
                    </span>
                    <span className="text-label-md font-semibold">{g.title}</span>
                  </div>
                  <span
                    className={`text-[11px] leading-tight ${
                      isSelected ? 'text-white/85' : 'text-outline'
                    }`}
                  >
                    {g.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-px bg-surface-container-high"></div>

        {/* Input 3: Marital Status */}
        <div className="flex flex-col gap-space-xxs">
          <label className="font-label-lg text-label-lg text-on-surface font-semibold">
            {t.maritalStatusLabel}
          </label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {maritalOptions.map((m) => {
              const isSelected = data.maritalStatus === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChange({ maritalStatus: m.id })}
                  className={`p-2.5 rounded-lg border text-center flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container text-on-primary border-primary-container font-semibold shadow-sm'
                      : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container'
                  }`}
                >
                  <span className="text-label-md font-medium">{m.title}</span>
                  {m.tag && (
                    <span
                      className={`text-[9px] px-1 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-secondary-container text-on-secondary-container'
                      }`}
                    >
                      {m.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-px bg-surface-container-high"></div>

        {/* Input 4: Employment Status */}
        <div className="flex flex-col gap-space-xs">
          <div className="flex justify-between items-baseline">
            <label className="font-label-lg text-label-lg text-on-surface font-semibold">
              {t.employmentLabel}
            </label>
            <span className="font-label-sm text-label-sm text-outline">
              {t.selectOne}
            </span>
          </div>

          <div
            className="space-y-space-xs"
            role="radiogroup"
            aria-label="Employment status"
          >
            {employmentOptions.map((opt) => {
              const isSelected = data.employmentStatus === opt.id;
              return (
                <label
                  key={opt.id}
                  onClick={() => onChange({ employmentStatus: opt.id })}
                  className={`group flex items-center justify-between p-3.5 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary-container text-on-primary shadow-md'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <input
                    type="radio"
                    name="employment_status"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => onChange({ employmentStatus: opt.id })}
                    className="sr-only"
                  />

                  <div className="flex items-center gap-space-sm">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-surface-container-lowest/20 text-on-primary'
                          : 'bg-surface-container text-primary group-hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {opt.icon}
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-label-md text-label-md ${
                            isSelected
                              ? 'font-semibold text-on-primary'
                              : 'font-medium text-on-surface'
                          }`}
                        >
                          {opt.title}
                        </span>
                        {opt.tag && (
                          <span
                            className={`px-1.5 py-0.5 rounded font-label-sm text-[10px] ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-secondary-container text-on-secondary-container'
                            }`}
                          >
                            {opt.tag}
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-body-sm text-body-sm ${
                          isSelected
                            ? 'text-on-primary-container'
                            : 'text-outline'
                        }`}
                      >
                        {opt.desc}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'bg-on-primary text-primary-container'
                        : 'bg-surface-container text-on-primary'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[14px] ${
                        isSelected ? 'opacity-100 font-bold' : 'opacity-0'
                      }`}
                    >
                      check
                    </span>
                  </div>
                </label>
              );
            })}
          </div>

          {data.employmentStatus === 'govt_employee' && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-1.5 mt-1">
              <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0 mt-0.5">
                policy
              </span>
              <span>{t.govtEmployeeNote}</span>
            </div>
          )}
        </div>

        <div className="w-full h-px bg-surface-container-high"></div>

        {/* Input 5: Punjab Domicile / Permanent Residence */}
        <div className="flex flex-col gap-space-xxs">
          <label className="font-label-lg text-label-lg text-on-surface font-semibold">
            {t.punjabDomicileLabel}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            <button
              type="button"
              onClick={() => onChange({ isPunjabResident: true })}
              className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                data.isPunjabResident
                  ? 'bg-primary-container text-on-primary border-primary-container font-semibold shadow-sm'
                  : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">
                verified
              </span>
              <span className="text-label-sm">{t.punjabDomicileYes}</span>
            </button>

            <button
              type="button"
              onClick={() => onChange({ isPunjabResident: false })}
              className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                !data.isPunjabResident
                  ? 'bg-primary-container text-on-primary border-primary-container font-semibold shadow-sm'
                  : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">
                public
              </span>
              <span className="text-label-sm">{t.punjabDomicileNo}</span>
            </button>
          </div>
          <p className="font-body-sm text-body-sm text-outline mt-1">
            {t.punjabDomicileNote}
          </p>
        </div>
      </div>

      {/* Informational Trust Banner & Validation Shortcut */}
      <div className="bg-secondary-container/40 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-space-xs">
          <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5 shrink-0">
            verified_user
          </span>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-secondary-container font-semibold">
              {t.nadraProtectionTitle}
            </span>
            <p className="font-body-sm text-body-sm text-on-secondary-container/80 mt-0.5">
              {t.nadraProtectionDesc}
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

      {/* Navigation Action Buttons */}
      <div className="flex items-center gap-space-sm pt-space-xs">
        <button
          type="button"
          onClick={onBack}
          className="h-12 px-space-lg flex items-center justify-center gap-1.5 rounded-[11px] bg-surface-container font-label-lg text-label-lg text-primary hover:bg-surface-container-high transition-colors shrink-0 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isUrdu ? 'arrow_forward' : 'arrow_back'}
          </span>
          <span>{t.back}</span>
        </button>

        <button
          type="button"
          id="continue-btn"
          onClick={handleValidatedNext}
          className="flex-1 h-12 px-space-lg flex items-center justify-center gap-space-xs rounded-[11px] bg-primary-container text-on-primary font-label-lg text-label-lg shadow-[0_4px_14px_rgba(34,52,74,0.18)] hover:bg-primary transition-all active:scale-[0.99] cursor-pointer"
        >
          <span>{t.continueToStep3}</span>
          <span className="material-symbols-outlined text-[18px]">
            {isUrdu ? 'arrow_backward' : 'arrow_forward'}
          </span>
        </button>
      </div>
    </div>
  );
};
