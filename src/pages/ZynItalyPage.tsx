import { LocalizedLink } from "@/components/LocalizedLink";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/context/LanguageContext";

export default function ZynItalyPage() {
  const { language } = useLanguage();
  const isItalian = language === "it";

  const faqs = isItalian
    ? [
        {
          q: "Quale intensità ZYN scegliere se sono all'inizio?",
          a: "Se sei all'inizio, scegli una gradazione più bassa e aumenta gradualmente solo se necessario.",
        },
        {
          q: "ZYN è disponibile con spedizione in tutta Italia?",
          a: "Sì, spediamo in tutta Italia con tracking. Spedizione gratuita da €100.",
        },
        {
          q: "Quanto tempo impiega la consegna ZYN?",
          a: "In media 1-5 giorni lavorativi in base alla zona (Nord/Centro/Sud/Isole).",
        },
      ]
    : [
        {
          q: "Which ZYN strength is best for beginners?",
          a: "If you are new, start with a lower strength and only move up if needed.",
        },
        {
          q: "Is ZYN shipped across all of Italy?",
          a: "Yes, we ship across Italy with tracking. Free shipping from €100.",
        },
        {
          q: "How long does ZYN delivery take?",
          a: "Usually 1-5 business days depending on region (North/Central/South/Islands).",
        },
      ];

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead
        defaultTitle={isItalian ? "ZYN Italia — Compra ZYN Online | Pouchesitaly" : "ZYN Italy: Prices & Fast Shipping | Pouchesitaly"}
        defaultDescription={
          isItalian
            ? "Acquista ZYN nicotine pouches in Italia su Pouchesitaly. Tutti i gusti e le resistenze: Cool Mint, Espressino, Citrus, 3mg–11mg. Spedizione rapida."
            : "Shop ZYN in Italy with fast delivery and free shipping from €100. Compare strengths and pack sizes."
        }
        structuredData={faqStructuredData}
      />
      <PageHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
          {isItalian ? "ZYN Italia" : "ZYN in Italy"}
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          {isItalian
            ? "Selezione ZYN con diverse intensità e gusti. Spedizione in tutta Italia con tracking."
            : "Explore ZYN products across strengths and flavors. Italy-wide shipping with tracking included."}
        </p>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {isItalian ? "Perché scegliere ZYN" : "Why choose ZYN"}
          </h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>{isItalian ? "Ampia scelta di gusti e intensità" : "Wide range of flavors and strengths"}</li>
            <li>{isItalian ? "Formato discreto e pratico" : "Discreet and convenient format"}</li>
            <li>{isItalian ? "Spedizione veloce in Italia" : "Fast shipping in Italy"}</li>
          </ul>
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
            {isItalian ? "FAQ ZYN Italia" : "ZYN Italy FAQ"}
          </h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div key={item.q}>
                <h3 className="font-semibold text-foreground">{item.q}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <LocalizedLink to="/#products" className="rounded-full bg-primary px-5 py-2.5 text-primary-foreground font-bold">
            {isItalian ? "Vedi prodotti ZYN" : "View ZYN products"}
          </LocalizedLink>
          <LocalizedLink to="/shipping-info" className="rounded-full border border-border px-5 py-2.5 font-medium hover:bg-muted">
            {isItalian ? "Info spedizione" : "Shipping info"}
          </LocalizedLink>
          <LocalizedLink to="/faq" className="rounded-full border border-border px-5 py-2.5 font-medium hover:bg-muted">
            FAQ
          </LocalizedLink>
        </div>
      </main>

      <Footer />
    </div>
  );
}
