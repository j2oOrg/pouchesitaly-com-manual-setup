import { useLanguage } from '@/context/LanguageContext';

export function useTranslation() {
  const { language, setLanguage, t } = useLanguage();
  
  return {
    language,
    setLanguage,
    t,
  };
}