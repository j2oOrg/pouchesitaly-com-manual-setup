import { LocalizedLink } from "@/components/LocalizedLink";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/context/LanguageContext";

export default function VeloItalyPage() {
  const { language } = useLanguage();
  const isItalian = language === "it";

  const faqs = isItalian
    ? [
        {
          q: "VELO è adatto a utenti nuovi?",
          a: "Sì, consigliamo di partire con livelli di nicotina più bassi e passare gradualmente a intensità superiori.",
        },
        {
          q: "Qual è la differenza tra VELO e ZYN?",
          a: "Entrambi sono marchi premium; variano soprattutto per gusti, sensazione e profilo di intensità disponibile.",
        },
        {
          q: "Quanto costa la spedizione per VELO in Italia?",
          a: "€6,90 sotto €100 e gratuita da €100 in su.",
        },
      ]
    : [
        {
          q: "Is VELO suitable for new users?",
          a: "Yes, we recommend starting with lower nicotine strengths and moving up only if needed.",
        },
        {
          q: "What is the difference between VELO and ZYN?",
          a: "Both are premium brands; differences are mainly flavor profiles, sensation, and available strength ranges.",
        },
        {
          q: "What is shipping cost for VELO in Italy?",
          a: "€6.90 below €100 and free from €100 and above.",
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
        defaultTitle={isItalian ? "VELO Italia — Compra VELO Online | Pouchesitaly" : "VELO Italy: Flavors, Strengths & Prices | Pouchesitaly"}
        defaultDescription={
          isItalian
            ? "Acquista VELO nicotine pouches in Italia su Pouchesitaly. Tutti i gusti e le resistenze: Ice Cool, Berry Frost, 4mg–14mg. Spedizione in 2–4 giorni."
            : "Discover VELO in Italy: popular flavors, nicotine strengths, and fast tracked delivery."
        }
        structuredData={faqStructuredData}
      />
      <PageHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
          {isItalian ? "VELO Italia" : "VELO in Italy"}
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          {isItalian
            ? "Confronta prodotti VELO per intensità e gusto. Ordina online con checkout veloce."
            : "Compare VELO products by strength and flavor. Order online with fast checkout."}
        </p>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {isItalian ? "Cosa offre VELO" : "What VELO offers"}
          </h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>{isItalian ? "Varianti mentolate e fruttate" : "Mint and fruit-forward variants"}</li>
            <li>{isItalian ? "Opzioni da uso quotidiano a più intense" : "Options from daily-use to stronger profiles"}</li>
            <li>{isItalian ? "Consegna rapida in Italia" : "Fast delivery across Italy"}</li>
          </ul>
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
            {isItalian ? "FAQ VELO Italia" : "VELO Italy FAQ"}
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
            {isItalian ? "Vedi prodotti VELO" : "View VELO products"}
          </LocalizedLink>
          <LocalizedLink to="/strengths-guide" className="rounded-full border border-border px-5 py-2.5 font-medium hover:bg-muted">
            {isItalian ? "Guida intensità" : "Strength guide"}
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
