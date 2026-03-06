import { LocalizedLink } from "@/components/LocalizedLink";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/context/LanguageContext";

export default function VeloItalyPage() {
  const { language } = useLanguage();
  const isItalian = language === "it";

  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead
        defaultTitle={isItalian ? "VELO Italia: Gusti, Intensità e Prezzi | Pouchesitaly" : "VELO Italy: Flavors, Strengths & Prices | Pouchesitaly"}
        defaultDescription={
          isItalian
            ? "Scopri VELO in Italia: gusti popolari, livelli di nicotina e spedizione rapida con tracking."
            : "Discover VELO in Italy: popular flavors, nicotine strengths, and fast tracked delivery."
        }
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
