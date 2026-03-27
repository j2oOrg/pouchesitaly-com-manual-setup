import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const { language } = useTranslation();
  const isItalian = language === "it";

  const faqCategories = isItalian
    ? [
        {
          title: "Ordini e Spedizione",
          faqs: [
            { question: "Quanto tempo ci vuole per ricevere l'ordine?", answer: "Spediamo dalla nostra sede in 1–2 giorni lavorativi. La consegna in Italia richiede solitamente altri 1–2 giorni lavorativi. Tempo totale atteso: 2–4 giorni lavorativi." },
            { question: "Spedite in tutta Italia?", answer: "Sì. Spediamo su tutto il territorio italiano, incluse Sicilia, Sardegna e isole minori. Le spese di spedizione variano in base all'ordine." },
            { question: "Come posso tracciare il mio ordine?", answer: "Dopo la spedizione riceverai un'email con il codice di tracciamento del corriere." },
            { question: "Posso modificare o annullare un ordine?", answer: "Contattaci entro 1 ora dall'ordine. Dopo l'avvio della preparazione non è possibile intervenire." },
          ],
        },
        {
          title: "Prodotti",
          faqs: [
            { question: "Le nicotine pouches sono legali in Italia?", answer: "Sì. Le nicotine pouches senza tabacco sono legali in Italia. Non sono classificate come prodotti del tabacco e non rientrano nel divieto EU sullo snus." },
            { question: "Qual è la differenza tra nicotine pouches e snus?", answer: "Lo snus contiene tabacco. Le nicotine pouches di Pouchesitaly sono tobacco-free: non contengono foglie di tabacco. Questo le rende legali in Italia (lo snus tradizionale è vietato nell'UE eccetto in Svezia)." },
            { question: "Quali marchi vendete?", answer: "ZYN (Swedish Match/PMI), VELO (British American Tobacco), CUBA e altri marchi selezionati. Tutti i prodotti sono tobacco-free e di provenienza verificata." },
            { question: "Come scelgo la resistenza giusta?", answer: "Consulta la nostra guida alle resistenze per una guida dettagliata. In breve: se fumi meno di 10 sigarette al giorno, inizia con 6mg. Fumatori regolari: 9mg. Fumatori pesanti: 11–14mg." },
          ],
        },
        {
          title: "Pagamenti",
          faqs: [
            { question: "Quali metodi di pagamento accettate?", answer: "Accettiamo le principali carte di credito e debito (Visa, Mastercard), PayPal e altri metodi di pagamento digitale. Tutti i pagamenti sono gestiti in modo sicuro." },
            { question: "È sicuro pagare sul vostro sito?", answer: "Sì. Il sito utilizza HTTPS con certificato SSL. I dati della tua carta non vengono conservati sui nostri server." },
          ],
        },
        {
          title: "Resi e Rimborsi",
          faqs: [
            { question: "Posso restituire un prodotto?", answer: "Accettiamo resi entro 14 giorni dall'acquisto per prodotti non aperti e in condizioni originali. Contattaci prima di spedire qualsiasi reso." },
            { question: "Cosa succede se ricevo un prodotto danneggiato?", answer: "Contattaci entro 48 ore con foto del prodotto danneggiato. Provvederemo a un rimborso o sostituzione senza costi aggiuntivi." },
          ],
        },
        {
          title: "Altro",
          faqs: [
            { question: "Avete un programma fedeltà o sconti?", answer: "Iscriviti alla nostra newsletter per ricevere offerte esclusive e notifiche sui nuovi prodotti." },
            { question: "Come posso contattarvi?", answer: "Tramite il modulo di contatto sul sito o via email. Rispondiamo entro 24 ore nei giorni lavorativi." },
          ],
        },
      ]
    : [
        {
          title: "General Questions",
          faqs: [
            { question: "What are nicotine pouches?", answer: "Nicotine pouches are small, discreet pouches containing nicotine, plant fiber, and flavorings - but no tobacco." },
            { question: "How do I use nicotine pouches?", answer: "Take one pouch from the container and place it between your upper lip and gum for 20-60 minutes." },
            { question: "Are nicotine pouches safer than cigarettes?", answer: "They are tobacco-free and smoke-free, but still contain nicotine which is addictive." },
          ],
        },
        {
          title: "Ordering & Payment",
          faqs: [
            { question: "Do I need to create an account to order?", answer: "No. You can complete your purchase as a guest in just a few minutes." },
            { question: "What payment methods do you accept?", answer: "We accept major cards, PayPal, and local payment methods where available." },
            { question: "Can I track my order?", answer: "Yes. You will receive an email with a tracking number once your order ships." },
          ],
        },
      ];

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqCategories.flatMap((category) =>
      category.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      }))
    ),
  };

  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead
        defaultTitle={isItalian ? "FAQ: Spedizioni, Prodotti, Pagamenti | Pouchesitaly" : "FAQ | Pouchesitaly"}
        defaultDescription={isItalian ? "Risposte alle domande più frequenti: tempi di spedizione, metodi di pagamento, prodotti disponibili, resistenze, legalità e resi. Tutto su Pouchesitaly." : "Frequently asked questions about nicotine pouches, shipping in Italy, payment, and product use."}
        structuredData={faqStructuredData}
      />
      <PageHeader />

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LocalizedLink to="/" className="hover:text-foreground transition-colors">Home</LocalizedLink>
          <span>/</span>
          <span className="text-foreground font-medium">FAQ</span>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            {isItalian ? "Domande Frequenti — Pouchesitaly" : "Frequently Asked Questions"}
          </h1>

          <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-12 max-w-3xl">
            {isItalian ? "Risposte alle domande più frequenti su spedizione, pagamenti, prodotti, resistenze, legalità e altro." : "Find answers to common questions about nicotine pouches, ordering, shipping, and more."}
          </p>

          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">{category.title}</h2>
              <Accordion type="single" collapsible className="space-y-3">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`} className="bg-muted border border-border rounded-xl px-6">
                    <AccordionTrigger className="text-left font-heading font-semibold hover:no-underline">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {isItalian && (
            <p className="mt-10 text-sm text-muted-foreground">
              Le nicotine pouches contengono nicotina, una sostanza che crea dipendenza. Prodotto destinato esclusivamente ad adulti (18+).
            </p>
          )}

          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              {isItalian ? "Hai altre domande?" : "Still Have Questions?"}
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              {isItalian ? "Il nostro team di supporto è qui per aiutarti" : "Our customer support team is here to help"}
            </p>
            <a href="mailto:support@pouchesitaly.com" className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors">
              {isItalian ? "Contatta il Supporto" : "Contact Support"}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
