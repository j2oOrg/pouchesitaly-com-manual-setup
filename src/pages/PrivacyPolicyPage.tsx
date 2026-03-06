import { LocalizedLink } from "@/components/LocalizedLink";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/context/LanguageContext";

const policy = {
  en: {
    title: "Privacy Policy",
    subtitle:
      "We value your privacy and are committed to protecting your personal information.",
    lastUpdated: "Last updated: March 6, 2026",
    sectionTitle: "Your Data & Privacy",
    sections: [
      {
        heading: "1. Data Controller & Contact",
        items: [
          "Pouchesitaly acts as data controller for personal data processed through this website.",
          "For privacy requests: legal@pouchesitaly.com.",
        ],
      },
      {
        heading: "2. Information We Collect",
        items: [
          "Identity and contact data (name, email, phone, shipping/billing address).",
          "Order data (products purchased, order value, delivery status).",
          "Payment-related metadata from payment providers (we do not store full card details).",
          "Technical and usage data (IP, browser, device information, and event analytics).",
        ],
      },
      {
        heading: "3. Why We Process Your Data",
        items: [
          "To process and deliver your orders.",
          "To provide customer support and send service communications.",
          "To detect fraud, secure our systems, and comply with legal obligations.",
          "To improve site performance and marketing effectiveness where lawful.",
        ],
      },
      {
        heading: "4. Legal Bases (GDPR)",
        items: [
          "Contract performance (order management and delivery).",
          "Legal obligation (tax, accounting, anti-fraud, and consumer law duties).",
          "Legitimate interest (service quality, security, fraud prevention).",
          "Consent (optional cookies/marketing where required).",
        ],
      },
      {
        heading: "5. Cookies, Tracking & Consent",
        items: [
          "Essential cookies are used for cart, checkout, and security.",
          "Optional analytics/marketing cookies are used only where consent is required and provided.",
          "You can manage cookie settings through the cookie banner and browser settings.",
        ],
      },
      {
        heading: "6. Third-Party Processors",
        items: [
          "We use payment, shipping, hosting, and analytics providers to operate our services.",
          "These providers only process data needed for their task and must apply appropriate safeguards.",
        ],
      },
      {
        heading: "7. Data Retention",
        items: [
          "Order and invoicing data are kept as required by applicable tax/accounting law.",
          "Support and operational data are retained only as long as reasonably necessary.",
          "Where possible, data are anonymized or deleted when no longer needed.",
        ],
      },
      {
        heading: "8. International Transfers",
        items: [
          "If data are transferred outside the EEA, we use appropriate safeguards (e.g., SCCs) where required.",
        ],
      },
      {
        heading: "9. Your Rights",
        items: [
          "Right of access, rectification, erasure, and restriction.",
          "Right to object to processing based on legitimate interests.",
          "Right to data portability where applicable.",
          "Right to withdraw consent at any time (without affecting prior lawful processing).",
          "Right to lodge a complaint with the competent supervisory authority.",
        ],
      },
      {
        heading: "10. Minors",
        items: [
          "Our products are for adults only (18+). We do not intentionally collect personal data from minors.",
        ],
      },
      {
        heading: "11. Policy Updates",
        items: [
          "We may update this policy periodically. The latest version is always published on this page.",
        ],
      },
    ],
    contact: "If you have questions about this policy, contact us at:",
  },
  it: {
    title: "Informativa sulla Privacy",
    subtitle:
      "Proteggiamo la tua privacy e ci impegniamo a tutelare i tuoi dati personali.",
    lastUpdated: "Ultimo aggiornamento: 6 marzo 2026",
    sectionTitle: "Dati personali e privacy",
    sections: [
      {
        heading: "1. Titolare del trattamento e contatti",
        items: [
          "Pouchesitaly agisce come titolare del trattamento dei dati personali raccolti tramite questo sito.",
          "Per richieste privacy: legal@pouchesitaly.com.",
        ],
      },
      {
        heading: "2. Dati che raccogliamo",
        items: [
          "Dati identificativi e di contatto (nome, email, telefono, indirizzo di spedizione/fatturazione).",
          "Dati d'ordine (prodotti acquistati, valore ordine, stato consegna).",
          "Metadati di pagamento dai provider di pagamento (non memorizziamo i dati completi della carta).",
          "Dati tecnici e di utilizzo (IP, browser, dispositivo, eventi analytics).",
        ],
      },
      {
        heading: "3. Finalità del trattamento",
        items: [
          "Gestire ordini, pagamenti e consegne.",
          "Fornire assistenza clienti e comunicazioni di servizio.",
          "Prevenire frodi, proteggere i sistemi e rispettare obblighi legali.",
          "Migliorare prestazioni del sito ed efficacia marketing, ove consentito.",
        ],
      },
      {
        heading: "4. Basi giuridiche (GDPR)",
        items: [
          "Esecuzione del contratto (gestione ordine e consegna).",
          "Obbligo legale (adempimenti fiscali, contabili, antifrode e consumer law).",
          "Legittimo interesse (qualità del servizio, sicurezza, prevenzione frodi).",
          "Consenso (cookie/marketing opzionali quando richiesto).",
        ],
      },
      {
        heading: "5. Cookie, tracciamento e consenso",
        items: [
          "I cookie essenziali sono usati per carrello, checkout e sicurezza.",
          "Cookie analytics/marketing opzionali sono usati solo quando richiesto e con consenso valido.",
          "Puoi gestire le preferenze dal banner cookie e dalle impostazioni del browser.",
        ],
      },
      {
        heading: "6. Responsabili esterni del trattamento",
        items: [
          "Utilizziamo provider terzi per pagamenti, spedizioni, hosting e analytics.",
          "Questi soggetti trattano solo i dati necessari al servizio e con adeguate misure di sicurezza.",
        ],
      },
      {
        heading: "7. Conservazione dei dati",
        items: [
          "I dati di ordine e fatturazione sono conservati secondo i termini previsti dalla normativa fiscale/contabile.",
          "I dati di supporto e operativi sono conservati solo per il tempo necessario alle finalità indicate.",
          "Quando possibile, i dati vengono anonimizzati o cancellati al termine del periodo utile.",
        ],
      },
      {
        heading: "8. Trasferimenti internazionali",
        items: [
          "Se i dati vengono trasferiti fuori dallo SEE, adottiamo garanzie adeguate (es. Clausole Contrattuali Standard), quando richiesto.",
        ],
      },
      {
        heading: "9. I tuoi diritti",
        items: [
          "Diritto di accesso, rettifica, cancellazione e limitazione.",
          "Diritto di opposizione ai trattamenti basati su legittimo interesse.",
          "Diritto alla portabilità dei dati, quando applicabile.",
          "Diritto di revocare il consenso in qualsiasi momento (senza pregiudicare la liceità precedente).",
          "Diritto di proporre reclamo all'Autorità Garante competente.",
        ],
      },
      {
        heading: "10. Minori",
        items: [
          "I prodotti sono destinati esclusivamente ad adulti (18+). Non raccogliamo intenzionalmente dati personali di minori.",
        ],
      },
      {
        heading: "11. Aggiornamenti dell'informativa",
        items: [
          "Possiamo aggiornare periodicamente questa informativa. La versione più recente è sempre disponibile su questa pagina.",
        ],
      },
    ],
    contact: "Per domande su questa informativa, contattaci all'indirizzo:",
  },
};

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const copy = policy[language];

  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead />
      <PageHeader />

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LocalizedLink to="/" className="hover:text-foreground transition-colors">
            Home
          </LocalizedLink>
          <span>/</span>
          <span className="text-foreground font-medium">{copy.title}</span>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-3">{copy.title}</h1>
          <p className="text-sm text-muted-foreground mb-3">{copy.subtitle}</p>
          <p className="text-sm text-muted-foreground mb-8">{copy.lastUpdated}</p>

          <p className="text-muted-foreground mb-10">
            {language === "it"
              ? "La presente informativa descrive come raccogliamo, utilizziamo e proteggiamo i dati personali durante l'uso del sito e l'acquisto dei prodotti."
              : "This policy explains how we collect, use, and protect personal data when you use our website and purchase products."}
          </p>

          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">{copy.sectionTitle}</h2>

          <div className="space-y-6">
            {copy.sections.map((section) => (
              <section key={section.heading} className="bg-muted/55 rounded-xl p-6 border border-border/70">
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">{section.heading}</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className="mt-10 text-muted-foreground">
            {copy.contact}{" "}
            <a href="mailto:legal@pouchesitaly.com" className="text-primary underline hover:opacity-80">
              legal@pouchesitaly.com
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
