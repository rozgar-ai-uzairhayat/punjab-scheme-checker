import React from 'react';
import { CitizenData, ElectricityBracket, Language, ResidentialArea } from '../types';
import { translations } from '../data/translations';

interface Step1Props {
  data: CitizenData;
  onChange: (updates: Partial<CitizenData>) => void;
  onNext: () => void;
  onOpenValidation?: () => void;
  lang: Language;
}

export const Step1Household: React.FC<Step1Props> = ({
  data,
  onChange,
  onNext,
  onOpenValidation,
  lang
}) => {
  const t = translations[lang];
  const isUrdu = lang === 'ur';
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const quickIncomePills = [
    { label: '25k', value: 25000 },
    { label: '45k', value: 45000 },
    { label: '60k', value: 60000 },
    { label: '100k', value: 100000 },
    { label: '150k', value: 150000 },
    { label: '300k', value: 300000 }
  ];

  const handleIncomeChange = (valStr: string) => {
    const rawNumber = parseInt(valStr.replace(/\D/g, ''), 10);
    setErrorMessage(null);
    onChange({ monthlyIncome: isNaN(rawNumber) ? 0 : rawNumber });
  };

  const handleValidatedNext = () => {
    if (!data.monthlyIncome || data.monthlyIncome <= 0) {
      setErrorMessage(
        isUrdu
          ? 'براہ کرم درست ماہانہ آمدنی درج کریں (کم از کم 1,000 روپے)'
          : 'Please enter a valid monthly household income (minimum Rs 1,000)'
      );
      return;
    }
    if (!data.householdSize || data.householdSize < 1) {
      setErrorMessage(
        isUrdu
          ? 'گھر کے افراد کی تعداد کم از کم 1 ہونی چاہیے'
          : 'Household size must be at least 1 person'
      );
      return;
    }
    setErrorMessage(null);
    onNext();
  };

  const formattedIncome = data.monthlyIncome
    ? new Intl.NumberFormat('en-PK').format(data.monthlyIncome)
    : '';

  const electricityOptions: { id: ElectricityBracket; label: string; icon: string; badge: string }[] = [
    { id: 'under_200', label: t.electricityUnder200, icon: 'bolt', badge: isUrdu ? '90% سبسڈی' : '90% Subsidy' },
    { id: '200_500', label: t.electricity200To500, icon: 'solar_power', badge: isUrdu ? 'سولر اہل' : 'Solar Eligible' },
    { id: 'above_500', label: t.electricityAbove500, icon: 'power', badge: isUrdu ? 'معیاری' : 'Standard' }
  ];

  const areaOptions: { id: ResidentialArea; label: string; icon: string }[] = [
    { id: 'urban', label: t.urbanSetting, icon: 'apartment' },
    { id: 'rural', label: t.ruralSetting, icon: 'cottage' }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Top Stepper Header */}
      <div className="pt-space-md pb-space-sm">
        <div className="flex items-center justify-between mb-space-xs">
          <span className="font-label-sm text-label-sm text-outline font-medium tracking-wide">
            {isUrdu ? 'مرحلہ 1 از 3' : 'Step 1 of 3'}
          </span>
          <span className="font-label-sm text-label-sm text-secondary font-semibold bg-secondary-container/40 px-2 py-0.5 rounded-full">
            {t.step1Tag}
          </span>
        </div>
        {/* 3-Segment Progress Bar */}
        <div className="grid grid-cols-3 gap-1.5 w-full">
          <div className="h-1.5 rounded-full bg-primary-container transition-all"></div>
          <div className="h-1.5 rounded-full bg-surface-container-high transition-all"></div>
          <div className="h-1.5 rounded-full bg-surface-container-high transition-all"></div>
        </div>
      </div>

      {/* Editorial Headline Section */}
      <div className="pt-space-sm pb-space-md">
        <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
          {t.step1Headline}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-space-xxs">
          {t.step1Subtitle}
        </p>
      </div>

      {/* Main Card Container */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-[0_4px_20px_-2px_rgba(34,52,74,0.08),0_2px_6px_-1px_rgba(34,52,74,0.04)] border border-[#E4E1D8] space-y-space-lg">
        {/* Input 1: Monthly Household Income */}
        <div className="space-y-space-xxs">
          <label
            htmlFor="monthly-income"
            className="font-label-lg text-label-lg text-on-surface font-semibold"
          >
            {t.monthlyIncomeLabel}
          </label>

          <div className={`relative flex items-center mt-1 border rounded-lg bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary-container focus-within:border-transparent transition-all shadow-sm ${
            errorMessage ? 'border-rose-400 ring-1 ring-rose-300' : 'border-[#E4E1D8]'
          }`}>
            <div className="absolute left-3.5 flex items-center pointer-events-none text-on-surface-variant font-label-lg text-label-lg">
              ₨
            </div>
            <input
              id="monthly-income"
              type="text"
              inputMode="numeric"
              value={formattedIncome}
              onChange={(e) => handleIncomeChange(e.target.value)}
              placeholder="45,000"
              className="w-full h-12 pl-9 pr-10 bg-transparent rounded-lg font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:outline-none transition-all"
            />
            <div className="absolute right-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                verified_user
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5 animate-in fade-in">
              <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0">
                error
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1.5 pt-1.5 pb-0.5 overflow-x-auto no-scrollbar">
            {quickIncomePills.map((pill) => {
              const isSelected = data.monthlyIncome === pill.value;
              return (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => onChange({ monthlyIncome: pill.value })}
                  className={`px-3 py-1 rounded-full text-label-sm transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container text-on-primary font-semibold border border-primary-container shadow-sm'
                      : 'border border-[#E4E1D8] text-on-surface-variant hover:bg-surface-container-high bg-white'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          <p className="font-body-sm text-body-sm text-outline flex items-center gap-1 pt-0.5">
            <span className="material-symbols-outlined text-[16px] text-outline shrink-0">
              info
            </span>
            {t.incomeHint}
          </p>
        </div>

        <div className="w-full h-px bg-surface-container-high"></div>

        {/* Input 2: Number of People in Household */}
        <div className="space-y-space-xxs">
          <label
            htmlFor="household-size-input"
            className="font-label-lg text-label-lg text-on-surface font-semibold"
          >
            {t.householdSizeLabel}
          </label>

          <div className="flex items-center justify-between bg-surface-container-low p-1.5 rounded-lg mt-1">
            <button
              type="button"
              id="btn-decrement"
              aria-label="Decrease household members"
              onClick={() =>
                onChange({
                  householdSize: Math.max(1, data.householdSize - 1)
                })
              }
              className="w-11 h-11 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center active:scale-95 transition-transform shadow-sm hover:bg-surface-container-high cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">
                remove
              </span>
            </button>

            <div className="flex items-baseline gap-1.5">
              <input
                id="household-size-input"
                type="number"
                min="1"
                max="25"
                value={data.householdSize}
                onChange={(e) =>
                  onChange({
                    householdSize: Math.max(
                      1,
                      Math.min(25, parseInt(e.target.value, 10) || 1)
                    )
                  })
                }
                className="w-12 text-center bg-transparent font-title-md text-title-md text-primary font-bold focus:outline-none"
              />
              <span className="font-label-md text-label-md text-outline">
                {t.members}
              </span>
            </div>

            <button
              type="button"
              id="btn-increment"
              aria-label="Increase household members"
              onClick={() =>
                onChange({
                  householdSize: Math.min(25, data.householdSize + 1)
                })
              }
              className="w-11 h-11 rounded-lg bg-surface-container-lowest text-primary flex items-center justify-center active:scale-95 transition-transform shadow-sm hover:bg-surface-container-high cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm pt-1 px-1">
            <span>{t.punjabAverage}</span>
            <span className="text-secondary font-medium">
              {t.bispGuideline}
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-surface-container-high"></div>

        {/* Input 3: Residential Setting (Urban vs Rural) */}
        <div className="space-y-space-xxs">
          <label className="font-label-lg text-label-lg text-on-surface font-semibold">
            {t.residentialAreaLabel}
          </label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {areaOptions.map((area) => {
              const isSelected = data.areaType === area.id;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => onChange({ areaType: area.id })}
                  className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container text-on-primary border-primary-container font-semibold shadow-sm'
                      : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] shrink-0">
                    {area.icon}
                  </span>
                  <span className="text-label-md truncate">{area.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-px bg-surface-container-high"></div>

        {/* Input 4: Monthly Electricity Consumption */}
        <div className="space-y-space-xxs">
          <div className="flex justify-between items-baseline">
            <label className="font-label-lg text-label-lg text-on-surface font-semibold">
              {t.electricityLabel}
            </label>
            <span className="font-label-sm text-secondary font-medium">
              Roshan Gharana & Nigahban
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1">
            {electricityOptions.map((option) => {
              const isSelected = data.electricityUnits === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onChange({ electricityUnits: option.id })}
                  className={`p-3 rounded-lg border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary-container text-on-primary border-primary-container font-semibold shadow-sm'
                      : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] shrink-0">
                      {option.icon}
                    </span>
                    <span className="text-label-sm font-semibold truncate">{option.label}</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded self-start ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-surface-container-high text-outline'
                    }`}
                  >
                    {option.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full h-px bg-surface-container-high"></div>

        {/* Input 5: Land & Property Assets (Housing & Farm Schemes) */}
        <div className="space-y-space-xs">
          <label className="font-label-lg text-label-lg text-on-surface font-semibold">
            {t.landAssetsLabel}
          </label>

          {/* Small Plot Toggle */}
          <div
            onClick={() => onChange({ ownsSmallPlot: !data.ownsSmallPlot })}
            className={`p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer select-none ${
              data.ownsSmallPlot
                ? 'bg-surface-container-lowest border-primary-container ring-1 ring-primary-container shadow-sm'
                : 'bg-surface-container-low border-transparent hover:bg-surface-container'
            }`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                data.ownsSmallPlot
                  ? 'bg-primary-container text-on-primary'
                  : 'border-2 border-outline bg-transparent'
              }`}
            >
              {data.ownsSmallPlot && (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                {t.plotOwnershipTitle}
              </span>
              <span className="font-body-sm text-body-sm text-outline mt-0.5">
                {t.plotOwnershipDesc}
              </span>
            </div>
          </div>

          {/* Agricultural Land Toggle */}
          <div
            onClick={() => onChange({ ownsAgriLand: !data.ownsAgriLand })}
            className={`p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer select-none ${
              data.ownsAgriLand
                ? 'bg-surface-container-lowest border-primary-container ring-1 ring-primary-container shadow-sm'
                : 'bg-surface-container-low border-transparent hover:bg-surface-container'
            }`}
          >
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                data.ownsAgriLand
                  ? 'bg-primary-container text-on-primary'
                  : 'border-2 border-outline bg-transparent'
              }`}
            >
              {data.ownsAgriLand && (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface font-semibold">
                {t.agriLandTitle}
              </span>
              <span className="font-body-sm text-body-sm text-outline mt-0.5">
                {t.agriLandDesc}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Callout Badge & Validation Tool Shortcut */}
      <div className="my-space-md p-space-sm rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-on-secondary-container text-[18px]">
              lock
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-on-surface font-semibold">
              {t.confidentialTitle}
            </span>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
              {t.confidentialDesc}
            </p>
          </div>
        </div>

        {onOpenValidation && (
          <button
            type="button"
            onClick={onOpenValidation}
            className="self-start sm:self-center px-3 py-1.5 rounded-lg border border-[#E4E1D8] bg-white text-xs font-semibold text-primary hover:bg-surface-container-high transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">
              fact_check
            </span>
            <span>{t.validateInputsBtn}</span>
          </button>
        )}
      </div>

      {/* Primary Action Section */}
      <div className="pt-space-xs pb-space-sm">
        <button
          type="button"
          id="submit-step-1"
          onClick={handleValidatedNext}
          className="w-full h-12 px-6 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(34,52,74,0.18)] hover:bg-primary active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>{t.continue}</span>
          <span className="material-symbols-outlined text-[20px]">
            {isUrdu ? 'arrow_backward' : 'arrow_forward'}
          </span>
        </button>

        <div className="text-center mt-3">
          <span className="font-label-sm text-label-sm text-outline">
            {t.nextDemographics}
          </span>
        </div>
      </div>
    </div>
  );
};
