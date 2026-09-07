/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CitizenData, Language } from './types';
import { evaluateSchemes } from './utils/calculator';
import { validateCitizenData } from './utils/validation';
import { Header } from './components/Header';
import { Step1Household } from './components/Step1Household';
import { Step2Demographics } from './components/Step2Demographics';
import { Step3SafetyNets } from './components/Step3SafetyNets';
import { ResultsView } from './components/ResultsView';
import { ProfileModal } from './components/ProfileModal';
import { ValidationModal } from './components/ValidationModal';
import { Footer } from './components/Footer';

const INITIAL_DATA: CitizenData = {
  monthlyIncome: 45000,
  householdSize: 5,
  age: 28,
  gender: 'female',
  maritalStatus: 'married',
  employmentStatus: 'daily_wage',
  electricityUnits: 'under_200',
  areaType: 'rural',
  ownsSmallPlot: true,
  ownsAgriLand: false,
  isStudent: false,
  hasLearnerPermit: false,
  hasDisability: false,
  isBispRegistered: false,
  hasPregnantOrInfant: false,
  hasDaughterMarriage: false,
  isYouthEntrepreneur: false,
  isPunjabResident: true
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const saved = localStorage.getItem('punjab_scheme_step');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [direction, setDirection] = useState<1 | -1>(1);

  const [data, setData] = useState<CitizenData>(() => {
    const saved = localStorage.getItem('punjab_citizen_data');
    if (saved) {
      try {
        return { ...INITIAL_DATA, ...JSON.parse(saved) };
      } catch (e) {
        return INITIAL_DATA;
      }
    }
    return INITIAL_DATA;
  });

  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('punjab_lang');
    return (saved as Language) || 'en';
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [notificationToast, setNotificationToast] = useState<{
    title: string;
    body: string;
  } | null>(null);

  // Sync dir and language to html tag
  useEffect(() => {
    document.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('punjab_lang', lang);
  }, [lang]);

  // Listen for scheme notification events
  useEffect(() => {
    const handleNotificationEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ title: string; body: string }>;
      if (customEvent.detail) {
        setNotificationToast({
          title: customEvent.detail.title,
          body: customEvent.detail.body
        });
        const timer = setTimeout(() => {
          setNotificationToast(null);
        }, 7000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('punjab-scheme-notification', handleNotificationEvent);
    return () => {
      window.removeEventListener('punjab-scheme-notification', handleNotificationEvent);
    };
  }, []);

  // Persist state
  useEffect(() => {
    localStorage.setItem('punjab_citizen_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('punjab_scheme_step', currentStep.toString());
  }, [currentStep]);

  const updateData = (updates: Partial<CitizenData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentStep((prev) => Math.min(4, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep3Submit = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      setDirection(1);
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartOver = () => {
    setData(INITIAL_DATA);
    setDirection(-1);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetAnswers = () => {
    setData(INITIAL_DATA);
    setDirection(-1);
    setCurrentStep(1);
    localStorage.removeItem('punjab_citizen_data');
    localStorage.removeItem('punjab_scheme_step');
  };

  const results = evaluateSchemes(data);
  const validationReport = validateCitizenData(data, lang);
  const isUrdu = lang === 'ur';

  // Smooth slide and fade transitions designed for civic portal workflow
  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? (isUrdu ? -28 : 28) : (isUrdu ? 28 : -28),
      opacity: 0,
      scale: 0.995,
      filter: 'blur(2px)'
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring', stiffness: 380, damping: 32 },
        opacity: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
        scale: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
        filter: { duration: 0.2 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? (isUrdu ? 28 : -28) : (isUrdu ? -28 : 28),
      opacity: 0,
      scale: 0.995,
      filter: 'blur(2px)',
      transition: {
        duration: 0.18,
        ease: [0.4, 0, 1, 1]
      }
    })
  };

  return (
    <div
      className="bg-surface font-body-md text-body-md text-on-surface flex flex-col min-h-screen antialiased selection:bg-secondary-container selection:text-on-secondary-container overflow-x-hidden"
      dir={lang === 'ur' ? 'rtl' : 'ltr'}
    >
      {/* Civic Sticky Header */}
      <Header
        currentStep={currentStep}
        onBack={handleBack}
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'ur' : 'en'))}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenValidation={() => setIsValidationModalOpen(true)}
        validationReport={validationReport}
      />

      {/* Main Content Stage with Smooth AnimatePresence Navigation */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-safe bg-surface max-w-container-max-w mx-auto px-gutter-mobile overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex-1 flex flex-col"
            >
              <Step1Household
                data={data}
                onChange={updateData}
                onNext={handleNext}
                onOpenValidation={() => setIsValidationModalOpen(true)}
                lang={lang}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex-1 flex flex-col"
            >
              <Step2Demographics
                data={data}
                onChange={updateData}
                onNext={handleNext}
                onBack={handleBack}
                onOpenValidation={() => setIsValidationModalOpen(true)}
                lang={lang}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex-1 flex flex-col"
            >
              <Step3SafetyNets
                data={data}
                onChange={updateData}
                onSubmit={handleStep3Submit}
                onBack={handleBack}
                onOpenValidation={() => setIsValidationModalOpen(true)}
                isCalculating={isCalculating}
                lang={lang}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full flex-1 flex flex-col"
            >
              <ResultsView
                citizenData={data}
                results={results}
                onEditAnswers={() => {
                  setDirection(-1);
                  setCurrentStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onStartOver={handleStartOver}
                onOpenValidation={() => setIsValidationModalOpen(true)}
                lang={lang}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Civic Trust Footer */}
        <Footer lang={lang} />
      </main>

      {/* Citizen Session Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        data={data}
        onReset={handleResetAnswers}
        lang={lang}
      />

      {/* Data Validation & Compliance Tool Modal */}
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        data={data}
        onApplyFix={(updates) => {
          updateData(updates);
        }}
        lang={lang}
      />

      {/* Live Scheme Notification Floating Toast */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed top-18 right-4 rtl:right-auto rtl:left-4 z-50 max-w-sm w-[calc(100vw-2rem)] bg-primary-container text-on-primary p-4 rounded-2xl shadow-xl border border-primary/20 flex items-start gap-3 backdrop-blur-md"
            role="status"
            aria-live="polite"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[18px]">notifications_active</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="font-title-xs text-title-xs font-bold leading-tight">
                  {notificationToast.title}
                </p>
                <button
                  type="button"
                  onClick={() => setNotificationToast(null)}
                  className="text-white/80 hover:text-white p-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
              <p className="font-body-xs text-body-xs text-white/90 mt-1 leading-snug">
                {notificationToast.body}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
