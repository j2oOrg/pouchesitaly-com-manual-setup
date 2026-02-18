import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const AGE_GATE_KEY = 'age_verified';

export function AgeGate() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const { language } = useTranslation();

  useEffect(() => {
    const verified = localStorage.getItem(AGE_GATE_KEY);
    setIsVerified(verified === 'true');
  }, []);

  const handleConfirm = () => {
    localStorage.setItem(AGE_GATE_KEY, 'true');
    setIsVerified(true);
  };

  const handleDeny = () => {
    window.location.href = 'https://www.google.com';
  };

  // Don't render anything until we've checked localStorage
  if (isVerified === null) {
    return null;
  }

  // User already verified
  if (isVerified) {
    return null;
  }

  const content = {
    en: {
      title: 'Age Verification Required',
      subtitle: 'This website contains products intended for adults only.',
      question: 'Are you 18 years of age or older?',
      confirm: 'Yes, I am 18+',
      deny: 'No, I am under 18',
      disclaimer: 'By entering this site, you agree to our Terms of Service and Privacy Policy.',
    },
    it: {
      title: 'Verifica dell\'età richiesta',
      subtitle: 'Questo sito contiene prodotti destinati solo agli adulti.',
      question: 'Hai 18 anni o più?',
      confirm: 'Sì, ho 18+ anni',
      deny: 'No, ho meno di 18 anni',
      disclaimer: 'Entrando in questo sito, accetti i nostri Termini di Servizio e la Privacy Policy.',
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-xl border bg-card p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <span className="text-3xl font-bold text-primary">18+</span>
          </div>
          
          <h1 className="mb-2 text-2xl font-bold text-foreground">
            {t.title}
          </h1>
          
          <p className="mb-6 text-muted-foreground">
            {t.subtitle}
          </p>
          
          <p className="mb-8 text-lg font-medium text-foreground">
            {t.question}
          </p>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={handleConfirm}
              size="lg"
              className="w-full sm:w-auto"
            >
              {t.confirm}
            </Button>
            <Button
              onClick={handleDeny}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              {t.deny}
            </Button>
          </div>
          
          <p className="mt-6 text-xs text-muted-foreground">
            {t.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
