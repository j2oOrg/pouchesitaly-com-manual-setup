import { useEffect, useState } from 'react';
import { LocalizedLink } from '@/components/LocalizedLink';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const COOKIE_CONSENT_KEY = 'cookie_consent_choice';

type ConsentChoice = 'accepted' | 'rejected';

export function CookieConsent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [ready, setReady] = useState(false);
  const { language } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentChoice | null;
    setChoice(saved);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!choice) return;

    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    document.documentElement.dataset.cookieConsent = choice;
  }, [choice]);

  if (!ready || choice) {
    return null;
  }

  const copy = language === 'it'
    ? {
        title: 'Preferenze cookie',
        body: 'Usiamo cookie essenziali per carrello, checkout e sicurezza. I cookie opzionali saranno usati solo dopo il tuo consenso.',
        accept: 'Accetta',
        reject: 'Rifiuta',
        learnMore: 'Privacy Policy',
      }
    : {
        title: 'Cookie preferences',
        body: 'We use essential cookies for cart, checkout, and security. Optional cookies are used only after your consent.',
        accept: 'Accept',
        reject: 'Reject',
        learnMore: 'Privacy Policy',
      };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-foreground">{copy.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {copy.body}{' '}
            <LocalizedLink to="/privacy" className="font-medium underline underline-offset-4">
              {copy.learnMore}
            </LocalizedLink>
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={() => setChoice('rejected')}>
            {copy.reject}
          </Button>
          <Button onClick={() => setChoice('accepted')}>
            {copy.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
