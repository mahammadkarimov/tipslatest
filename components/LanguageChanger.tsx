// components/LanguageSwitcher.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

const locales = [
  { code: 'en', label: 'English' },
  { code: 'az', label: 'Azərbaycan' },
  { code: 'ru', label: 'Русский' },
];

export default function LanguageChanger() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    const pathWithoutLocale = pathname.replace(/^\/(en|az|ru)/, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    startTransition(() => {
      router.push(newPath);
    });
  };

  return (
    <select
      onChange={(e) => handleChange(e.target.value)}
      value={currentLocale}
      className="p-2 rounded border bg-white"
    >
      {locales.map((loc) => (
        <option key={loc.code} value={loc.code}>
          {loc.label}
        </option>
      ))}
    </select>
  );
}
