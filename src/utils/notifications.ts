import { CitizenData, Language } from '../types';

export interface NotificationStatus {
  supported: boolean;
  permission: NotificationPermission | 'unsupported';
  enabled: boolean;
}

const STORAGE_KEY = 'punjab_scheme_notifications_enabled';

export function getStoredNotificationPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setStoredNotificationPreference(enabled: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    // Ignore localStorage errors
  }
}

export function checkNotificationStatus(): NotificationStatus {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return {
      supported: false,
      permission: 'unsupported',
      enabled: false
    };
  }

  const permission = Notification.permission;
  const storedPref = getStoredNotificationPreference();

  return {
    supported: true,
    permission,
    enabled: storedPref && permission === 'granted'
  };
}

export async function requestSchemeNotificationPermission(): Promise<{
  granted: boolean;
  status: NotificationPermission | 'unsupported';
}> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { granted: false, status: 'unsupported' };
  }

  try {
    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    setStoredNotificationPreference(granted);
    return { granted, status: permission };
  } catch (err) {
    console.warn('Error requesting notification permission:', err);
    return { granted: false, status: Notification.permission };
  }
}

export function triggerSchemeAlert(
  data: CitizenData,
  lang: Language,
  customTitle?: string,
  customBody?: string
): boolean {
  const isUrdu = lang === 'ur';

  // Determine profile matching highlights
  let matchedFocus = isUrdu ? 'پنجاب ویلفیئر اسکیمیں' : 'Punjab Welfare Schemes';
  if (data.isStudent) {
    matchedFocus = isUrdu ? 'ہونہار اسکالرشپ اور ہائر ایجوکیشن' : 'Honhaar Scholarship & Higher Education';
  } else if (data.ownsAgriLand) {
    matchedFocus = isUrdu ? 'کسان کارڈ اور زرعی ریلیف' : 'Kisan Card & Agricultural Relief';
  } else if (data.hasDisability) {
    matchedFocus = isUrdu ? 'ہمت کارڈ اور سوشل ویلفیئر فنڈ' : 'Himmat Card & Disability Support';
  } else if (data.ownsSmallPlot) {
    matchedFocus = isUrdu ? 'اپنی چھت اپنا گھر اور بلا سود قرضے' : 'Apni Chhat Apna Ghar Housing Support';
  } else if (data.electricityUnits === 'under_200') {
    matchedFocus = isUrdu ? 'روشن گھرانہ سولر اسکیم' : 'Roshan Gharana Solar Subsidy';
  }

  const title =
    customTitle ||
    (isUrdu
      ? 'حکومت پنجاب: نئے اسکیم الرٹس فعال ہیں'
      : 'Govt of Punjab: Matched Scheme Alert Active');

  const body =
    customBody ||
    (isUrdu
      ? `آپ کے کوائف (${matchedFocus}) کے مطابق نئی اسکیمیں اور کوٹہ اپ ڈیٹس شامل ہونے پر فوری مطلع کیا جائے گا۔`
      : `Alerts active for your profile (${matchedFocus}). You will be instantly notified when new matching welfare programs are gazetted.`);

  let browserDelivered = false;

  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'punjab-welfare-alert',
        dir: isUrdu ? 'rtl' : 'ltr',
        lang: isUrdu ? 'ur' : 'en'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      browserDelivered = true;
    } catch (e) {
      console.warn('Could not launch system notification (likely iframe sandbox):', e);
    }
  }

  // Also dispatch a custom event for in-app alert visibility (crucial in sandboxed iframes)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('punjab-scheme-notification', {
        detail: { title, body, browserDelivered }
      })
    );
  }

  return browserDelivered;
}
