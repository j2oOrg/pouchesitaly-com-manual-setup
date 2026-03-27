import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowRight, Leaf, Check } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "@/hooks/useTranslation";

export default function TobaccoFreePage() {
  const { language } = useTranslation();
  const isItalian = language === "it";

  const benefits = isItalian
    ? [
        "Nessuna foglia di tabacco nel prodotto finale",
        "Nessuna combustione, fumo o catrame",
        "Esperienza più pulita e discreta",
        "Aromi moderni come menta, agrumi, frutta e caffè",
        "Utilizzabili con praticità durante la giornata",
        "Ampia scelta di intensità e gusti",
      ]
    : [
        "No tobacco staining on teeth",
        "No tobacco breath or odor",
        "No spitting required",
        "Cleaner, more discreet experience",
        "Can be used anywhere",
        "Consistent nicotine delivery",
      ];

  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead
        defaultTitle={isItalian ? "Nicotine Pouches Tobacco-Free — Senza Tabacco | Pouchesitaly" : "Tobacco-Free Products | Pouchesitaly"}
        defaultDescription={isItalian ? "Le nicotine pouches di Pouchesitaly non contengono tabacco. Scopri perché sono più sicure dello snus e cosa contengono. Guida completa aggiornata 2026." : "All our products are 100% tobacco-free. Experience clean nicotine satisfaction."}
      />
      <PageHeader />

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LocalizedLink to="/" className="hover:text-foreground transition-colors">Home</LocalizedLink>
          <span>/</span>
          <span className="text-foreground font-medium">{isItalian ? "Senza tabacco" : "Tobacco-Free Products"}</span>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            {isItalian ? "Nicotine Pouches Senza Tabacco: Cosa le Rende Diverse" : "100% Tobacco-Free Nicotine Pouches"}
          </h1>

          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              {isItalian
                ? "Tutte le nicotine pouches vendute su Pouchesitaly sono tobacco-free: non contengono foglie di tabacco, estratti di tabacco, né componenti derivati dalla pianta del tabacco."
                : "All products sold at Pouchesitaly are completely tobacco-free. Experience nicotine satisfaction without the drawbacks of traditional tobacco products."}
            </p>

            <div className="bg-muted rounded-xl p-8 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Leaf className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-foreground m-0">
                  {isItalian ? "Perché conta davvero" : "Benefits of Tobacco-Free"}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {isItalian ? (
              <>
                <section className="mb-12">
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Cosa Significa “Senza Tabacco”</h2>
                  <p className="text-muted-foreground mb-4">
                    Questo distingue le nicotine pouches da sigarette, sigari, snus tradizionale e tabacco da masticare. Le pouches contengono nicotina purificata aggiunta a una base di fibre vegetali.
                  </p>
                </section>

                <section className="mb-12">
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Cosa Contengono le Nicotine Pouches</h2>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Nicotina in forma salina, estratta e purificata</li>
                    <li>Cellulosa vegetale come supporto fisico della bustina</li>
                    <li>Aromi come menta, agrumi, frutta e caffè</li>
                    <li>Umidificatori come glicerolo e acqua</li>
                    <li>Dolcificanti come eritritolo e acesulfame K</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    <strong>Non contengono:</strong> foglie di tabacco, catrame, monossido di carbonio, nitrosammine specifiche del tabacco.
                  </p>
                </section>

                <section className="mb-12">
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Perché è Importante per la Salute</h2>
                  <p className="text-muted-foreground mb-4">
                    La combustione del tabacco produce oltre 7.000 sostanze chimiche, molte delle quali dannose. Le nicotine pouches eliminano la combustione completamente.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    <strong>Importante:</strong> le nicotine pouches non sono prive di rischi. La nicotina crea dipendenza, ma rispetto alle sigarette il profilo di rischio è significativamente ridotto.
                  </p>
                </section>

                <section className="mb-12">
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Perché Scegliere Pouchesitaly</h2>
                  <p className="text-muted-foreground mb-4">
                    Tutti i prodotti nel nostro catalogo sono verificati tobacco-free: ZYN, VELO, CUBA e gli altri marchi che vendiamo non contengono tabacco. Spediamo in tutta Italia con consegna in 2–4 giorni lavorativi.
                  </p>
                  <p className="text-muted-foreground">
                    Hai domande? Consulta la nostra <LocalizedLink to="/strengths-guide" className="underline font-semibold">guida alle resistenze</LocalizedLink> o la sezione <LocalizedLink to="/faq" className="underline font-semibold">FAQ</LocalizedLink>.
                  </p>
                </section>
              </>
            ) : (
              <>
                <section className="mb-12">
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-4">What Are Tobacco-Free Nicotine Pouches?</h2>
                  <p className="text-muted-foreground mb-4">
                    Tobacco-free nicotine pouches contain purified nicotine, plant fibers, flavorings, and other food-grade ingredients, but no tobacco leaf material.
                  </p>
                </section>
                <section className="mb-12">
                  <h2 className="text-3xl font-heading font-bold text-foreground mb-4">How to Use</h2>
                  <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                    <li>Take a single pouch from the container</li>
                    <li>Place it between your upper lip and gum</li>
                    <li>Leave it in place for 20-60 minutes</li>
                    <li>Dispose of the used pouch responsibly</li>
                  </ol>
                </section>
              </>
            )}
          </div>

          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              {isItalian ? "Scopri i Prodotti Tobacco-Free" : "Make the Switch Today"}
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              {isItalian ? "Esplora la selezione disponibile su Pouchesitaly" : "Experience tobacco-free nicotine satisfaction"}
            </p>
            <LocalizedLink to="/#products" className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors">
              {isItalian ? "Acquista Ora" : "Shop Tobacco-Free Products"}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
          </div>
        </div>
      </main>

      <QuickFAQ />
      <Footer />
    </div>
  );
}
