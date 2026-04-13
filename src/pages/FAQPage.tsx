import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "@/hooks/useTranslation";
import { faqPageCategoriesByLocale } from "@/lib/seo-content";
import { buildFAQPageStructuredData } from "@/lib/structured-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const { language } = useTranslation();
  const isItalian = language === "it";

  const faqCategories = faqPageCategoriesByLocale[language];

  const faqStructuredData = buildFAQPageStructuredData(
    faqCategories.flatMap((category) =>
      category.faqs.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      }))
    )
  );

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
