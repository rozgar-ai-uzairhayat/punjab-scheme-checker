import React, { useState, useEffect } from 'react';
import { CitizenData, Language } from '../types';
import { translations } from '../data/translations';
import {
  checkNotificationStatus,
  requestSchemeNotificationPermission,
  setStoredNotificationPreference,
  triggerSchemeAlert,
  NotificationStatus
} from '../utils/notifications';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CitizenData;
  onReset: () => void;
  lang: Language;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  data,
  onReset,
  lang
}) => {
  const t = translations[lang];
  const isUrdu = lang === 'ur';

  const [notifStatus, setNotifStatus] = useState<NotificationStatus>({
    supported: true,
    permission: 'default',
    enabled: false
  });
  const [isRequesting, setIsRequesting] = useState(false);
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);

  // Sync notification status on open
  useEffect(() => {
    if (isOpen) {
      setNotifStatus(checkNotificationStatus());
      setTestSentMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleNotification = async () => {
    if (notifStatus.enabled) {
      // User is turning notifications OFF
      setStoredNotificationPreference(false);
      setNotifStatus((prev) => ({ ...prev, enabled: false }));
      setTestSentMessage(null);
      return;
    }

    // User is turning notifications ON
    setIsRequesting(true);
    setTestSentMessage(null);

    const res = await requestSchemeNotificationPermission();
    setIsRequesting(false);

    if (res.granted) {
      setNotifStatus({
        supported: true,
        permission: 'granted',
        enabled: true
      });
      // Fire welcome alert for their matching profile
      triggerSchemeAlert(
        data,
        lang,
        isUrdu
          ? 'حکومت پنجاب: نئے اسکیم الرٹس فعال ہو گئے'
          : 'Govt of Punjab: Matching Scheme Alerts Enabled',
        isUrdu
          ? 'آپ کے منتخب کردہ کوائف کے مطابق نئی حکومتی اسکیمیں اور فیزز شامل ہونے پر الرٹ ملے گا۔'
          : 'You will receive browser alerts whenever new welfare schemes matching your profile are gazetted.'
      );
      setTestSentMessage(t.testNotificationSuccess);
    } else {
      setNotifStatus(checkNotificationStatus());
    }
  };

  const handleSendTestAlert = () => {
    triggerSchemeAlert(data, lang);
    setTestSentMessage(t.testNotificationSuccess);
    setTimeout(() => {
      setTestSentMessage(null);
    }, 6000);
  };

  // Compile active matching categories to display to user
  const matchingCriteriaList = [];
  if (data.isStudent) {
    matchingCriteriaList.push(isUrdu ? 'ہونہار اسکالرشپ' : 'Honhaar Scholarships');
  }
  if (data.ownsAgriLand) {
    matchingCriteriaList.push(isUrdu ? 'کسان کارڈ و زرعی ریلیف' : 'Kisan Card & Agri Subsidies');
  }
  if (data.ownsSmallPlot) {
    matchingCriteriaList.push(isUrdu ? 'اپنی چھت اپنا گھر' : 'Apni Chhat Apna Ghar Housing');
  }
  if (data.hasDisability) {
    matchingCriteriaList.push(isUrdu ? 'ہمت کارڈ و خصوصی افراد فنڈ' : 'Himmat Card & Disability Quotas');
  }
  if (data.electricityUnits === 'under_200') {
    matchingCriteriaList.push(isUrdu ? 'روشن گھرانہ سولر' : 'Roshan Gharana Solar Packages');
  }
  if (data.isBispRegistered) {
    matchingCriteriaList.push(isUrdu ? 'بینظیر و راشن پروگرام' : 'BISP & Ration Cards');
  }
  if (data.hasDaughterMarriage) {
    matchingCriteriaList.push(isUrdu ? 'دھی رانی پروگرام' : 'Dhee Rani Marriage Grants');
  }
  if (matchingCriteriaList.length === 0) {
    matchingCriteriaList.push(isUrdu ? 'تمام عمومی پنجاب پیکیجز' : 'General Punjab Social Packages');
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-[#E4E1D8] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E4E1D8] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <div>
              <h3 className="font-title-md text-primary font-bold">
                {isUrdu ? 'شہری سیشن کوائف' : 'Citizen Session Profile'}
              </h3>
              <p className="font-label-sm text-outline">
                {isUrdu ? 'عارضی سیشن (ڈیوائس پر محفوظ)' : 'Confidential anonymous session'}
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

        {/* Current Data Overview */}
        <div className="space-y-2.5 bg-surface-container-low rounded-xl p-4 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">
              {t.monthlyIncomeLabel}:
            </span>
            <span className="font-bold text-primary">
              ₨ {new Intl.NumberFormat('en-PK').format(data.monthlyIncome)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">
              {t.householdSizeLabel}:
            </span>
            <span className="font-bold text-primary">
              {data.householdSize} {t.members}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">
              {t.residentialAreaLabel}:
            </span>
            <span className="font-bold text-primary capitalize">
              {data.areaType === 'urban' ? t.urbanSetting : t.ruralSetting}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">
              {t.electricityLabel}:
            </span>
            <span className="font-bold text-primary">
              {data.electricityUnits === 'under_200'
                ? t.electricityUnder200
                : data.electricityUnits === '200_500'
                ? t.electricity200To500
                : t.electricityAbove500}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">
              {t.ageLabel}:
            </span>
            <span className="font-bold text-primary">
              {data.age} {t.years}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">
              {t.genderLabel}:
            </span>
            <span className="font-bold text-primary capitalize">
              {data.gender === 'female' ? t.femaleTitle : data.gender === 'male' ? t.maleTitle : t.transgenderTitle}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">
              {t.maritalStatusLabel}:
            </span>
            <span className="font-bold text-primary capitalize">
              {data.maritalStatus === 'single' ? t.singleTitle : data.maritalStatus === 'married' ? t.marriedTitle : t.widowedDivorcedTitle}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">
              {t.employmentLabel}:
            </span>
            <span className="font-bold text-primary capitalize">
              {data.employmentStatus.replace('_', ' ')}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">
              {t.punjabDomicileLabel}:
            </span>
            <span className="font-bold text-primary">
              {data.isPunjabResident ? (isUrdu ? 'پنجاب رہائشی' : 'Punjab Resident') : (isUrdu ? 'دیگر صوبہ' : 'Other')}
            </span>
          </div>

          {/* Active Tags */}
          <div className="pt-2 border-t border-surface-container-high flex flex-wrap gap-1.5">
            {data.ownsSmallPlot && (
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-medium text-xs">
                {isUrdu ? 'چھوٹا پلاٹ' : 'Small Plot'}
              </span>
            )}
            {data.ownsAgriLand && (
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-medium text-xs">
                {isUrdu ? 'زرعی زمین' : 'Agri Land'}
              </span>
            )}
            {data.isStudent && (
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-medium text-xs">
                {isUrdu ? 'طالب علم' : 'Student'}
              </span>
            )}
            {data.hasLearnerPermit && (
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-medium text-xs">
                {isUrdu ? 'لرنر پرمٹ' : 'Learner Permit'}
              </span>
            )}
            {data.hasDisability && (
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-medium text-xs">
                {isUrdu ? 'معذور افراد' : 'PWD'}
              </span>
            )}
            {data.isBispRegistered && (
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-medium text-xs">
                {isUrdu ? 'بی آئی ایس پی رجسٹرڈ' : 'BISP'}
              </span>
            )}
            {data.hasPregnantOrInfant && (
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-medium text-xs">
                {isUrdu ? 'ماں اور بچہ' : 'Maternal/Infant'}
              </span>
            )}
            {data.hasDaughterMarriage && (
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-medium text-xs">
                {isUrdu ? 'بیٹی کی شادی' : 'Daughter Marriage'}
              </span>
            )}
            {data.isYouthEntrepreneur && (
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-medium text-xs">
                {isUrdu ? 'یوتھ کاروبار' : 'Youth Enterprise'}
              </span>
            )}
          </div>
        </div>

        {/* Browser Scheme Notification Card */}
        <div
          id="scheme-notification-settings-card"
          className="bg-surface-container-lowest border border-[#E4E1D8] rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  notifStatus.enabled
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'bg-surface-container-high text-outline'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {notifStatus.enabled ? 'notifications_active' : 'notifications'}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-title-sm text-primary font-bold">
                    {t.notificationsHeader}
                  </h4>
                  {notifStatus.enabled ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      {t.notificationsActive}
                    </span>
                  ) : notifStatus.permission === 'denied' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      <span className="material-symbols-outlined text-[12px]">block</span>
                      {t.notificationsBlocked}
                    </span>
                  ) : !notifStatus.supported ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-container text-outline">
                      {t.notificationsUnsupported}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-surface-container-high text-outline">
                      {t.notificationsDisabled}
                    </span>
                  )}
                </div>
                <p className="font-body-xs text-body-xs text-on-surface-variant mt-1 leading-relaxed">
                  {t.notificationsSubtitle}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              id="toggle-scheme-notifications-btn"
              role="switch"
              aria-checked={notifStatus.enabled}
              disabled={isRequesting || !notifStatus.supported}
              onClick={handleToggleNotification}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed ${
                notifStatus.enabled ? 'bg-primary-container' : 'bg-surface-container-highest'
              }`}
            >
              <span className="sr-only">{t.enableNotifications}</span>
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  notifStatus.enabled
                    ? isUrdu
                      ? '-translate-x-5'
                      : 'translate-x-5'
                    : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Blocked Permission Warning Notice */}
          {notifStatus.permission === 'denied' && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2 text-xs text-rose-800">
              <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0 mt-0.5">
                error
              </span>
              <p className="leading-snug">{t.notificationsBlockedHint}</p>
            </div>
          )}

          {/* Matched Profile Criteria Preview */}
          <div className="pt-2 border-t border-[#E4E1D8]/60 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-outline">
              <span className="font-semibold text-on-surface-variant">
                {isUrdu ? 'آپ کے کوائف کے مطابق مطابقت رکھنے والے شعبہ جات:' : 'Targeted welfare categories for your profile:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchingCriteriaList.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-secondary-container/40 text-secondary text-[11px] font-semibold border border-secondary/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Test Notification Trigger & Feedback */}
          <div className="pt-2 border-t border-[#E4E1D8]/60 flex items-center justify-between gap-2 flex-wrap">
            <button
              type="button"
              id="test-scheme-alert-btn"
              onClick={handleSendTestAlert}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">send_time_extension</span>
              <span>{t.testNotificationBtn}</span>
            </button>

            <span className="text-[10px] text-outline flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">lock</span>
              {t.notificationPrivacyNote}
            </span>
          </div>

          {/* Test Alert Success Confirmation Banner */}
          {testSentMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs text-emerald-800 animate-in fade-in">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">
                  check_circle
                </span>
                <span className="font-medium">{testSentMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setTestSentMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 cursor-pointer p-0.5"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          )}
        </div>

        <div className="pt-2 flex gap-2">
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl border border-rose-300 text-rose-700 font-label-md hover:bg-rose-50 transition-colors cursor-pointer"
          >
            {isUrdu ? 'ڈیٹا ری سیٹ کریں' : 'Reset All Answers'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-primary-container text-on-primary font-label-md hover:bg-primary transition-colors cursor-pointer"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
