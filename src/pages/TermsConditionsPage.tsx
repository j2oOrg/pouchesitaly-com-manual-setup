import { LocalizedLink } from "@/components/LocalizedLink";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/context/LanguageContext";

const terms = {
  en: {
    title: "Terms & Conditions",
    subtitle:
      "By accessing and placing an order on this website, you agree to the following terms.",
    lastUpdated: "Last updated: September 1, 2025",
    sectionTitle: "General Terms",
    sections: [
      {
        heading: "1. Eligibility",
        points: [
          "You must be 18 years or older to purchase nicotine products.",
          "You are responsible for ensuring all orders comply with local laws in your country.",
          "Do not use the website for unlawful purposes.",
        ],
      },
      {
        heading: "2. Products & Availability",
        points: [
          "We make every effort to keep product information up to date.",
          "All nicotine pouch products are sold as tobacco-free alternatives.",
          "Products are sold in original sealed packaging as provided by the manufacturer.",
        ],
      },
      {
        heading: "3. Pricing & Payment",
        points: [
          "Prices are shown in EUR and may change without notice.",
          "Taxes and shipping costs are calculated at checkout when applicable.",
          "Payment is processed through trusted payment providers; we do not store full card data on our platform.",
        ],
      },
      {
        heading: "4. Order Processing & Shipping",
        points: [
          "Orders are processed after payment confirmation.",
          "We offer worldwide shipping with standard tracking updates.",
          "Delivery timeframes are estimates and can vary due to customs, weather, and carrier delays.",
          "You are responsible for maintaining accurate shipping information.",
        ],
      },
      {
        heading: "5. Returns & Refunds",
        points: [
          "Please verify product details before completing your order.",
          "Returns are accepted where required by law or approved case by case.",
          "Returns of opened or used nicotine products may be restricted for health and safety reasons.",
        ],
      },
      {
        heading: "6. Discrete Packaging",
        points: [
          "Orders are shipped in plain packaging as part of our discretion policy.",
          "We do not guarantee a specific delivery date once the package leaves the carrier.",
          "Lost packages should be reported to the courier and then to our support team.",
        ],
      },
      {
        heading: "7. Limitation of Liability",
        points: [
          "Our liability is limited to the maximum extent allowed by law.",
          "We are not liable for indirect losses or damages caused by misuse of products.",
          "You are responsible for safe use of nicotine products and for following local regulations.",
        ],
      },
      {
        heading: "8. Intellectual Property",
        points: [
          "All site content, logos, and graphics are owned by Pouchesitaly or its licensors.",
          "Reproduction, scraping, or commercial reuse without written permission is prohibited.",
        ],
      },
      {
        heading: "9. Changes to Terms",
        points: [
          "We may update these terms from time to time.",
          "Continued use of the site after updates means you accept the revised terms.",
          "We will post the new effective date on this page.",
        ],
      },
    ],
    contact: "For support or disputes regarding these terms:",
  },
  it: {
    title: "Termini e Condizioni",
    subtitle:
      "Accedendo e acquistando su questo sito, accetti i seguenti termini.",
    lastUpdated: "Ultimo aggiornamento: 1 settembre 2025",
    sectionTitle: "Termini Generali",
    sections: [
      {
        heading: "1. Requisiti di utilizzo",
        points: [
          "È richiesto aver compiuto i 18 anni per acquistare prodotti contenenti nicotina.",
          "È tua responsabilità assicurarti che l'acquisto sia conforme alle leggi locali.",
          "Non utilizzare il sito per scopi illeciti.",
        ],
      },
      {
        heading: "2. Prodotti e disponibilità",
        points: [
          "Ci impegniamo a mantenere aggiornate le informazioni sui prodotti.",
          "I prodotti venduti sono pouches senza tabacco da nostro fornitore certificato.",
          "I prodotti sono venduti nella confezione originale sigillata del produttore.",
        ],
      },
      {
        heading: "3. Prezzi e pagamento",
        points: [
          "I prezzi sono espressi in EUR e possono essere aggiornati senza preavviso.",
          "Tasse e costi di spedizione sono calcolati al checkout, quando applicabili.",
          "I pagamenti sono elaborati da fornitori certificati; non conserviamo i dati completi delle carte di pagamento.",
        ],
      },
      {
        heading: "4. Ordini e spedizioni",
        points: [
          "Gli ordini vengono evasi dopo conferma del pagamento.",
          "Spediamo in tutto il mondo con aggiornamenti di tracciamento standard.",
          "I tempi di consegna sono indicativi e possono variare per dogana, meteo o ritardi del corriere.",
          "Sei responsabile di fornire un indirizzo di spedizione corretto e completo.",
        ],
      },
      {
        heading: "5. Resi e rimborsi",
        points: [
          "Verifica attentamente i dettagli dell'ordine prima di confermare.",
          "I resi sono gestiti nei limiti previsti dalla legge o su eccezionale valutazione caso per caso.",
          "I prodotti aperti o utilizzati possono essere non idonei al reso per motivi sanitari.",
        ],
      },
      {
        heading: "6. Imballaggio discreto",
        points: [
          "Gli ordini vengono spediti in confezioni anonime in accordo con la policy di discrezione.",
          "Non possiamo garantire una data di consegna certa dopo la partenza dal corriere.",
          "Segnala pacchi smarriti prima con il corriere, poi al nostro supporto.",
        ],
      },
      {
        heading: "7. Limitazione di responsabilità",
        points: [
          "La nostra responsabilità è limitata al massimo consentito dalla legge.",
          "Non siamo responsabili per danni indiretti o danni derivanti da uso improprio.",
          "L'uso sicuro dei prodotti nicotine è di tua responsabilità.",
        ],
      },
      {
        heading: "8. Proprietà intellettuale",
        points: [
          "Tutti i contenuti del sito, loghi e grafiche sono di proprietà di Pouchesitaly o licenziatari.",
          "È vietata la riproduzione, lo scraping o l'uso commerciale senza autorizzazione scritta.",
        ],
      },
      {
        heading: "9. Modifiche ai termini",
        points: [
          "Potremmo aggiornare questi termini in qualsiasi momento.",
          "L'uso continuato del sito dopo gli aggiornamenti implica accettazione dei nuovi termini.",
          "La nuova data di entrata in vigore sarà indicata in questa pagina.",
        ],
      },
    ],
    contact: "Per supporto o eventuali controversie sui termini:",
  },
};

export default function TermsConditionsPage() {
  const { language } = useLanguage();
  const copy = terms[language];

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

          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">{copy.sectionTitle}</h2>

          <div className="space-y-6">
            {copy.sections.map((section) => (
              <section key={section.heading} className="bg-muted/55 rounded-xl p-6 border border-border/70">
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                  {section.heading}
                </h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  {section.points.map((item) => (
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


