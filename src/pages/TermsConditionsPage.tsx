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
    lastUpdated: "Last updated: March 6, 2026",
    sectionTitle: "General Terms",
    sections: [
      {
        heading: "1. Seller Information",
        points: [
          "Pouchesitaly is the seller for all products offered on this website.",
          "For legal or support requests, contact: legal@pouchesitaly.com.",
          "These terms apply to sales delivered in Italy.",
        ],
      },
      {
        heading: "2. Age Restriction & Product Use",
        points: [
          "You must be 18 years or older to purchase nicotine products.",
          "By ordering, you confirm you are legally allowed to purchase nicotine products in your jurisdiction.",
          "Products contain nicotine, an addictive substance, and are intended for adult consumers only.",
        ],
      },
      {
        heading: "3. Products & Availability",
        points: [
          "Product descriptions, strengths, and images are provided in good faith and may be updated.",
          "Products are sold in original sealed packaging from suppliers.",
          "Availability may change without notice.",
        ],
      },
      {
        heading: "4. Pricing & Payment",
        points: [
          "Prices are shown in EUR.",
          "Shipping fees and any applicable charges are shown at checkout before payment.",
          "Payment is processed through secure third-party providers; we do not store full card details.",
        ],
      },
      {
        heading: "5. Shipping Policy (Italy)",
        points: [
          "We currently ship only to addresses in Italy.",
          "Shipping fee is €6.90 for orders below €100.",
          "Shipping is free for orders with subtotal of €100 or more.",
          "Delivery times are estimated and may vary due to carrier delays or force majeure.",
        ],
      },
      {
        heading: "6. Returns, Withdrawal & Refunds",
        points: [
          "Consumers may have statutory rights under applicable Italian/EU consumer law.",
          "Due to health and hygiene reasons, opened nicotine products may not be eligible for return unless required by law.",
          "If a package arrives damaged or incorrect, contact support promptly with order details.",
        ],
      },
      {
        heading: "7. Order Acceptance & Cancellation",
        points: [
          "Orders are accepted once payment is confirmed and processing begins.",
          "We may cancel orders in cases of fraud risk, stock errors, or compliance concerns.",
          "If an order is canceled by us, any paid amount will be refunded via the original payment method.",
        ],
      },
      {
        heading: "8. Liability",
        points: [
          "Nothing in these terms limits mandatory consumer rights under applicable law.",
          "To the extent permitted by law, we are not liable for indirect losses.",
          "You are responsible for lawful and safe use of products after delivery.",
        ],
      },
      {
        heading: "9. Intellectual Property",
        points: [
          "All site content, logos, text, and graphics are owned by Pouchesitaly or its licensors.",
          "Unauthorized reproduction, scraping, or commercial reuse is prohibited.",
        ],
      },
      {
        heading: "10. Governing Law & Disputes",
        points: [
          "These terms are governed by applicable Italian law, without prejudice to mandatory consumer protections.",
          "For disputes, contact us first so we can attempt to resolve the issue quickly.",
        ],
      },
      {
        heading: "11. Changes to Terms",
        points: [
          "We may update these terms from time to time.",
          "Updated terms become effective when published on this page.",
        ],
      },
    ],
    contact: "For support or legal requests regarding these terms:",
  },
  it: {
    title: "Termini e Condizioni",
    subtitle:
      "Accedendo e acquistando su questo sito, accetti i seguenti termini.",
    lastUpdated: "Ultimo aggiornamento: 6 marzo 2026",
    sectionTitle: "Termini Generali",
    sections: [
      {
        heading: "1. Informazioni sul venditore",
        points: [
          "Pouchesitaly è il venditore dei prodotti offerti su questo sito.",
          "Per richieste legali o di supporto: legal@pouchesitaly.com.",
          "I presenti termini si applicano alle vendite con consegna in Italia.",
        ],
      },
      {
        heading: "2. Limiti di età e uso del prodotto",
        points: [
          "Per acquistare prodotti contenenti nicotina devi avere almeno 18 anni.",
          "Effettuando un ordine dichiari di poter acquistare legalmente prodotti con nicotina.",
          "I prodotti contengono nicotina, sostanza che crea dipendenza, e sono destinati esclusivamente ad adulti.",
        ],
      },
      {
        heading: "3. Prodotti e disponibilità",
        points: [
          "Descrizioni, gradazioni e immagini prodotto sono fornite in buona fede e possono essere aggiornate.",
          "I prodotti sono venduti in confezione originale sigillata dei fornitori.",
          "La disponibilità può variare senza preavviso.",
        ],
      },
      {
        heading: "4. Prezzi e pagamento",
        points: [
          "I prezzi sono espressi in EUR.",
          "Spese di spedizione e altri eventuali costi sono mostrati al checkout prima del pagamento.",
          "I pagamenti sono elaborati da provider terzi sicuri; non memorizziamo i dati completi della carta.",
        ],
      },
      {
        heading: "5. Politica di spedizione (Italia)",
        points: [
          "Attualmente spediamo solo a indirizzi in Italia.",
          "Spedizione €6,90 per ordini sotto €100.",
          "Spedizione gratuita per ordini con subtotale pari o superiore a €100.",
          "I tempi di consegna sono indicativi e possono variare per ritardi del corriere o cause di forza maggiore.",
        ],
      },
      {
        heading: "6. Resi, recesso e rimborsi",
        points: [
          "Il consumatore mantiene i diritti previsti dalla normativa italiana/europea applicabile.",
          "Per motivi igienico-sanitari, i prodotti con nicotina aperti possono non essere idonei al reso salvo obblighi di legge.",
          "In caso di pacco danneggiato o ordine errato, contatta subito il supporto indicando i dettagli dell'ordine.",
        ],
      },
      {
        heading: "7. Accettazione e annullamento ordini",
        points: [
          "Gli ordini sono accettati dopo conferma pagamento e avvio elaborazione.",
          "Possiamo annullare ordini in caso di rischio frode, errori di stock o esigenze di conformità.",
          "In caso di annullamento da parte nostra, l'importo pagato viene rimborsato sul metodo originale.",
        ],
      },
      {
        heading: "8. Responsabilità",
        points: [
          "Nulla in questi termini limita i diritti inderogabili del consumatore previsti dalla legge.",
          "Nei limiti consentiti dalla legge, non rispondiamo di danni indiretti.",
          "L'uso corretto e conforme dei prodotti dopo la consegna è responsabilità dell'acquirente.",
        ],
      },
      {
        heading: "9. Proprietà intellettuale",
        points: [
          "Contenuti, loghi, testi e grafiche del sito sono di proprietà di Pouchesitaly o dei relativi licenzianti.",
          "È vietata la riproduzione, lo scraping o il riutilizzo commerciale senza autorizzazione.",
        ],
      },
      {
        heading: "10. Legge applicabile e controversie",
        points: [
          "I presenti termini sono regolati dalla legge italiana, fatti salvi i diritti inderogabili del consumatore.",
          "Per eventuali controversie, contattaci prima per tentare una risoluzione rapida.",
        ],
      },
      {
        heading: "11. Modifiche ai termini",
        points: [
          "Possiamo aggiornare i presenti termini periodicamente.",
          "Le modifiche hanno effetto dalla pubblicazione su questa pagina.",
        ],
      },
    ],
    contact: "Per supporto o richieste legali relative a questi termini:",
  },
};

export default function TermsConditionsPage() {
  const { language } = useLanguage();
  const copy = terms[language];

  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead
        defaultTitle="Termini e Condizioni — Pouchesitaly"
        defaultDescription="Termini e condizioni di acquisto su Pouchesitaly: ordini, pagamenti, resi, responsabilità e diritti del consumatore. Aggiornati marzo 2026."
      />
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

          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">{copy.sectionTitle}</h2>

          <div className="space-y-6">
            {copy.sections.map((section) => (
              <section key={section.heading} className="bg-muted/55 rounded-xl p-6 border border-border/70">
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">{section.heading}</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  {section.points.map((item) => (
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
