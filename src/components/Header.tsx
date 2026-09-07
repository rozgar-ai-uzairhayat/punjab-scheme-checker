import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { ValidationReport } from '../utils/validation';

interface HeaderProps {
  currentStep: number; // 1, 2, 3, 4 (4 = results)
  onBack: () => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenProfile: () => void;
  onOpenValidation?: () => void;
  validationReport?: ValidationReport;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  onBack,
  lang,
  onToggleLang,
  onOpenProfile,
  onOpenValidation,
  validationReport
}) => {
  const t = translations[lang];

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return t.step1Title;
      case 2:
        return t.step2Title;
      case 3:
        return t.step3Title;
      case 4:
      default:
        return t.resultsTitle;
    }
  };

  const hasErrors = validationReport && validationReport.errorCount > 0;
  const hasWarnings = validationReport && validationReport.warningCount > 0 && !hasErrors;

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f9f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(34,52,74,0.06)] pt-safe">
      <div className="h-16 px-gutter-mobile flex items-center justify-between max-w-container-max-w mx-auto w-full">
        {/* Left: Back button + Emblem + Title */}
        <div className="flex items-center gap-space-xs">
          <button
            aria-label="Go back"
            className={`min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center text-primary rounded-lg hover:bg-surface-container-high transition-colors ${
              currentStep === 1 ? 'opacity-40 cursor-default' : 'active:scale-95'
            }`}
            onClick={currentStep > 1 ? onBack : undefined}
            disabled={currentStep === 1}
          >
            <span className="material-symbols-outlined text-[24px]">
              {lang === 'ur' ? 'arrow_forward' : 'arrow_back'}
            </span>
          </button>

          <img
            alt="Punjab Scheme Checker Emblem"
            className="h-8 w-auto object-contain cursor-pointer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDximTDNd8M0KwxawwfjiszgUjagw0Mc1ZK45LZBYbqXxcBKOnC7301CED05typy7IffCLkX6UK9IygGbsVr-3pKXE1EDB8bNYp6aw0VAEJoC3_rUSaFYkc9i4x4A18Femgv7dtQrfYPtVFhwxa5tJIyXfvkJ_htvEGHRwcyDLe3YGpBOQDX4i2W-IkKMneegd4FOVECDiuLrFw_BsM-6R9EX8b6gpa0pmSiCitgICu8xvlUUiC_h3wQQ"
            onClick={() => onBack()}
          />

          <div className="flex flex-col">
            <h1 className="font-title-md text-title-md text-primary font-bold leading-tight tracking-tight truncate max-w-[130px] sm:max-w-[240px]">
              {getStepTitle()}
            </h1>
            <span className="font-label-sm text-label-sm text-secondary font-medium leading-tight truncate max-w-[130px] sm:max-w-[240px]">
              {t.portalName}
            </span>
          </div>
        </div>

        {/* Right: Validation Tool trigger + Language toggle + Profile button */}
        <div className="flex items-center gap-1.5 sm:gap-space-xs">
          {onOpenValidation && validationReport && (
            <button
              type="button"
              onClick={onOpenValidation}
              title={t.validationTool}
              className={`h-9 px-2.5 rounded-lg border flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer shadow-sm active:scale-95 ${
                hasErrors
                  ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                  : hasWarnings
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {hasErrors ? 'error' : hasWarnings ? 'warning' : 'fact_check'}
              </span>
              <span className="hidden md:inline">
                {hasErrors
                  ? t.validationAuditErrors
                  : hasWarnings
                  ? `${validationReport.warningCount} ${t.validationIssuesFound}`
                  : `${validationReport.score}% ${t.validationAuditPassed}`}
              </span>
              <span className="md:hidden text-[11px]">
                {validationReport.score}%
              </span>
            </button>
          )}

          <button
            aria-label={lang === 'en' ? 'اردو میں تبدیل کریں' : 'Switch to English'}
            onClick={onToggleLang}
            className="min-h-[44px] px-1.5 sm:px-space-xs flex items-center justify-center font-label-md text-label-md font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <span className="px-2 py-0.5 rounded bg-secondary-container/60 text-on-secondary-container hover:bg-secondary-container transition-all text-xs sm:text-sm">
              {lang === 'en' ? 'اردو' : 'English'}
            </span>
          </button>

          <button
            aria-label="Citizen Profile"
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
