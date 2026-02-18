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
    lastUpdated: "Last updated: September 1, 2025",
    sectionTitle: "Your Data & Privacy",
    sections: [
      {
        heading: "1. Information We Collect",
        items: [
          "Contact details you provide when contacting support or placing an order (name, email, phone, address).",
          "Order and payment-related information to process delivery and invoices.",
          "Usage data, device details, and cookies for website analytics and security.",
        ],
      },
      {
        heading: "2. How We Use Your Information",
        items: [
          "To fulfill orders and provide customer support.",
          "To send shipping notifications and legal service emails.",
          "To improve website experience, performance, and security.",
          "To comply with legal obligations and prevent fraud.",
        ],
      },
      {
        heading: "3. Legal Basis & Retention",
        items: [
          "We process data based on contract necessity, legitimate interests, consent, and legal requirements.",
          "We keep order-related records as required by commercial and tax regulations.",
          "You may request deletion or correction of personal data, unless we are required by law to retain it.",
        ],
      },
      {
        heading: "4. Third-Party Services",
        items: [
          "We use secure payment and logistics providers only for order fulfillment.",
          "These providers handle limited data necessary to complete their service.",
          "They are required to maintain confidentiality and security standards.",
        ],
      },
      {
        heading: "5. Cookies & Analytics",
        items: [
          "We may use cookies for essential site functionality and analytics.",
          "You can manage cookie preferences through your browser settings.",
          "Disabling some cookies can impact certain features of the site.",
        ],
      },
      {
        heading: "6. Your Rights",
        items: [
          "Access, update, or correct your data.",
          "Request deletion or objection where applicable.",
          "Withdraw consent for optional communications at any time.",
          "Contact our support team for a privacy request.",
        ],
      },
    ],
    contact: "If you have questions about this policy, contact us at:",
  },
  it: {
    title: "Informativa sulla Privacy",
    subtitle:
      "Proteggiamo la tua privacy e ci impegniamo a tutelare i tuoi dati personali.",
    lastUpdated: "Ultimo aggiornamento: 1 settembre 2025",
    sectionTitle: "Dati personali e privacy",
    sections: [
      {
        heading: "1. Dati che raccogliamo",
        items: [
          "Dati di contatto che fornisci durante supporto o ordini (nome, email, telefono, indirizzo).",
          "Informazioni su ordini e pagamento necessarie per la gestione della spedizione e della fatturazione.",
          "Dati di utilizzo del sito, dispositivo e cookie per analisi e sicurezza.",
        ],
      },
      {
        heading: "2. Come utilizziamo i dati",
        items: [
          "Per evadere gli ordini e fornirti assistenza clienti.",
          "Per inviare conferme, notifiche di spedizione e comunicazioni di servizio.",
          "Per migliorare performance, esperienza utente e sicurezza del sito.",
          "Per adempiere obblighi legali e prevenire frodi.",
        ],
      },
      {
        heading: "3. Base giuridica e conservazione",
        items: [
          "Trattiamo i dati per l’esecuzione del contratto, interessi legittimi, consenso e obblighi di legge.",
          "Conserviamo i dati relativi agli ordini secondo le normative fiscali e commerciali.",
          "Puoi richiedere la cancellazione o la correzione dei tuoi dati, salvo obblighi normativi contrari.",
        ],
      },
      {
        heading: "4. Servizi di terze parti",
        items: [
          "Utilizziamo fornitori di pagamento e spedizione per completare gli ordini.",
          "Essi trattano solo i dati necessari al loro servizio.",
          "Devono rispettare standard di sicurezza e riservatezza.",
        ],
      },
      {
        heading: "5. Cookie e analytics",
        items: [
          "Possiamo utilizzare cookie per funzioni essenziali e analisi statistiche.",
          "Puoi gestire le preferenze cookie dalle impostazioni del browser.",
          "La disattivazione di alcuni cookie può limitare alcune funzionalità.",
        ],
      },
      {
        heading: "6. I tuoi diritti",
        items: [
          "Accedere, aggiornare o correggere i tuoi dati.",
          "Richiedere cancellazione o opposizione quando applicabile.",
          "Revocare il consenso alle comunicazioni non essenziali in qualsiasi momento.",
          "Scrivere al supporto per qualsiasi richiesta privacy.",
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
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-3">
            {copy.title}
          </h1>
          <p className="text-sm text-muted-foreground mb-3">{copy.subtitle}</p>
          <p className="text-sm text-muted-foreground mb-8">{copy.lastUpdated}</p>

          <p className="text-muted-foreground mb-10">
            {language === "it"
              ? "La presente informativa descrive come raccogliamo, utilizziamo e proteggiamo i tuoi dati quando acquisti sul sito Pouchesitaly."
              : "This policy explains how we collect, use, and protect your data when you shop on Pouchesitaly."}
          </p>

          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">{copy.sectionTitle}</h2>

          <div className="space-y-6">
            {copy.sections.map((section) => (
              <section key={section.heading} className="bg-muted/55 rounded-xl p-6 border border-border/70">
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                  {section.heading}
                </h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className="mt-10 text-muted-foreground">
            {copy.contact} <a href="mailto:legal@pouchesitaly.com" className="text-primary underline hover:opacity-80">legal@pouchesitaly.com</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}


