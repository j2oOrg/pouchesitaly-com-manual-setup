import { LocalizedLink } from "@/components/LocalizedLink";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useLanguage } from "@/context/LanguageContext";

export default function ZynItalyPage() {
  const { language } = useLanguage();
  const isItalian = language === "it";

  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead
        defaultTitle={isItalian ? "ZYN Italia: Prezzi e Spedizione | Pouchesitaly" : "ZYN Italy: Prices & Fast Shipping | Pouchesitaly"}
        defaultDescription={
          isItalian
            ? "Acquista ZYN in Italia con consegna rapida e spedizione gratuita da €100. Confronta intensità e formati pack."
            : "Shop ZYN in Italy with fast delivery and free shipping from €100. Compare strengths and pack sizes."
        }
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
