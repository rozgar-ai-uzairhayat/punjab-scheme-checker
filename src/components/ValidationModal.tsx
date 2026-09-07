import React, { useState } from 'react';
import { CitizenData, Language } from '../types';
import { validateCitizenData, ValidationItem } from '../utils/validation';

interface ValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CitizenData;
  onApplyFix: (updates: Partial<CitizenData>) => void;
  lang: Language;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  onClose,
  data,
  onApplyFix,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'issues' | 'passed'>('all');

  if (!isOpen) return null;

  const isUrdu = lang === 'ur';
  const report = validateCitizenData(data, lang);

  const filteredItems = report.items.filter((item) => {
    if (activeTab === 'issues') return item.severity === 'error' || item.severity === 'warning';
    if (activeTab === 'passed') return item.severity === 'pass';
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-600';
    if (score >= 70) return 'bg-amber-500';
    return 'bg-rose-600';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl space-y-4 border border-[#E4E1D8] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span className="material-symbols-outlined text-[22px]">fact_check</span>
            </div>
            <div>
              <h3 className="font-title-md text-primary font-bold">
                {isUrdu ? 'ڈیٹا کی تصدیق اور جانچ کا ٹول' : 'Citizen Data Validation Tool'}
              </h3>
              <p className="font-label-sm text-outline">
                {isUrdu ? 'حکومتی معیارات اور قانونی تقاضوں کے مطابق خودکار جانچ' : 'Automated integrity audit against official criteria'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Score & Summary Banner */}
        <div className={`p-4 rounded-xl border flex flex-col gap-2 shrink-0 ${getScoreColor(report.score)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px]">
                {report.score >= 90 ? 'verified' : report.score >= 70 ? 'warning' : 'error'}
              </span>
              <span className="font-label-lg font-bold">
                {report.score >= 90
                  ? isUrdu
                    ? 'کوائف مکمل اور مصدقہ ہیں'
                    : 'High Data Quality & Compliance'
                  : report.score >= 70
                  ? isUrdu
                    ? 'کچھ کوائف میں توجہ درکار ہے'
                    : 'Advisory Notices Detected'
                  : isUrdu
                  ? 'لازمی معلومات میں غلطی موجود ہے'
                  : 'Action Required: Fix Blocking Errors'}
              </span>
            </div>
            <span className="text-lg font-extrabold">{report.score}%</span>
          </div>

          {/* Progress gauge bar */}
          <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getScoreBarColor(report.score)}`}
              style={{ width: `${report.score}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs font-medium pt-1 opacity-90">
            <span>
              {isUrdu ? `کل پاس شدہ اصول: ${report.passCount}` : `Rules Passed: ${report.passCount}`}
            </span>
            <span>
              {isUrdu
                ? `نوٹسز: ${report.warningCount} | غلطیاں: ${report.errorCount}`
                : `Warnings: ${report.warningCount} | Errors: ${report.errorCount}`}
            </span>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {isUrdu ? `تمام اصول (${report.items.length})` : `All Checks (${report.items.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('issues')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'issues'
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {isUrdu
              ? `مسائل و تجاویز (${report.errorCount + report.warningCount})`
              : `Issues & Suggestions (${report.errorCount + report.warningCount})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('passed')}
            className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'passed'
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            {isUrdu ? `پاس شدہ (${report.passCount})` : `Passed (${report.passCount})`}
          </button>
        </div>

        {/* Scrollable Audit List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-outline text-sm">
              <span className="material-symbols-outlined text-[32px] text-emerald-600 block mb-1">
                check_circle
              </span>
              {isUrdu ? 'کوئی مسئلہ نہیں ملا۔ تمام اصول پاس ہیں!' : 'No issues found. All rules passed!'}
            </div>
          ) : (
            filteredItems.map((item) => {
              const isError = item.severity === 'error';
              const isWarning = item.severity === 'warning';
              const isPass = item.severity === 'pass';

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isError
                      ? 'bg-rose-50/70 border-rose-200'
                      : isWarning
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-surface-container-lowest border-[#E4E1D8]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${
                        isError
                          ? 'text-rose-600'
                          : isWarning
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {isError ? 'cancel' : isWarning ? 'warning' : 'check_circle'}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4
                          className={`font-label-md font-bold ${
                            isError
                              ? 'text-rose-900'
                              : isWarning
                              ? 'text-amber-900'
                              : 'text-primary'
                          }`}
                        >
                          {isUrdu ? item.titleUr : item.titleEn}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-surface-container-high text-outline">
                          {isUrdu ? `مرحلہ ${item.step}` : `Step ${item.step}`}
                        </span>
                      </div>

                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        {isUrdu ? item.messageUr : item.messageEn}
                      </p>

                      {/* Scheme Impact Note */}
                      {(item.impactEn || item.impactUr) && (
                        <div className="mt-2 p-2 rounded-lg bg-black/5 text-[11px] text-outline flex items-start gap-1.5">
                          <span className="material-symbols-outlined text-[14px] shrink-0 mt-0.5">
                            account_tree
                          </span>
                          <span>
                            <strong>{isUrdu ? 'اسکیموں پر اثر: ' : 'Impact: '}</strong>
                            {isUrdu ? item.impactUr : item.impactEn}
                          </span>
                        </div>
                      )}

                      {/* Quick Fix Button */}
                      {item.suggestedFix && (
                        <div className="mt-2.5 pt-2 border-t border-black/5 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.suggestedFix) {
                                onApplyFix(item.suggestedFix.action);
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold flex items-center gap-1.5 hover:bg-primary/90 active:scale-95 transition-all cursor-pointer shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              auto_fix_high
                            </span>
                            <span>
                              {isUrdu ? item.suggestedFix.labelUr : item.suggestedFix.labelEn}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-[#E4E1D8] flex items-center justify-between shrink-0">
          <span className="text-xs text-outline">
            {isUrdu ? 'پنجاب سوشل پروٹیکشن اتھارٹی اور نادرا قواعد' : 'Compliant with PSPA & Punjab Govt Policies'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary-container text-on-primary text-xs font-semibold hover:bg-primary transition-all cursor-pointer"
          >
            {isUrdu ? 'بند کریں' : 'Done / Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
