import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const t = translations[lang];

  return (
    <footer className="w-full pt-space-xl pb-space-lg text-center mt-auto">
      <p className="font-body-sm text-body-sm text-outline px-4">
        {t.footerText}
      </p>
    </footer>
  );
};
