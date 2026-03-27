import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "@/hooks/useTranslation";

export default function StrengthsGuidePage() {
  const { language } = useTranslation();
  const isItalian = language === "it";

  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead
        defaultTitle={
          isItalian
            ? "Guida alle Resistenze — Quale Forza Scegliere | Pouchesitaly"
            : "Nicotine Strength Guide Italy | Choose the Right mg | Pouchesitaly"
        }
        defaultDescription={
          isItalian
            ? "Come scegliere la resistenza giusta per le nicotine pouches: da 2mg a 14mg. Tabella di confronto e consigli per fumatori leggeri, moderati e pesanti."
            : "Understand nicotine pouch strengths from light to extra strong. Find the best level for your needs in Italy."
        }
      />
      <PageHeader />

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LocalizedLink to="/" className="hover:text-foreground transition-colors">Home</LocalizedLink>
          <span>/</span>
          <span className="text-foreground font-medium">
            {isItalian ? "Guida alle resistenze" : "Nicotine Strengths Guide"}
          </span>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            {isItalian ? "Guida alle Resistenze delle Nicotine Pouches" : "Nicotine Strengths Guide"}
          </h1>

          {isItalian ? (
            <div className="prose max-w-none">
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-8 max-w-3xl">
                La scelta della resistenza è il fattore più importante quando inizi con le nicotine pouches. Troppo debole e non senti nulla. Troppo forte e senti capogiri e nausea.
              </p>

              <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-8 max-w-3xl">
                Le nicotine pouches sono disponibili in diverse forze, misurate in milligrammi (mg) di nicotina per bustina.
              </p>

              <section className="mb-12">
                <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Le Resistenze Disponibili</h2>
                <div className="space-y-6">
                  <div className="p-6 bg-primary/12 border border-primary/30 rounded-xl">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">Leggera (2–4 mg)</h3>
                    <p className="text-muted-foreground">
                      Ideale per chi fuma occasionalmente o meno di 5 sigarette al giorno. Effetto discreto, perfetto per iniziare. Marchi: ZYN 3mg, ON! 2mg, VELO 4mg.
                    </p>
                  </div>
                  <div className="p-6 bg-accent/12 border border-accent/30 rounded-xl">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">Moderata (6–7 mg)</h3>
                    <p className="text-muted-foreground">
                      Il punto di partenza per la maggior parte dei fumatori moderati (10–15 sigarette al giorno). Copre il craving senza effetti collaterali. La scelta più popolare. Marchi: ZYN 6mg, VELO 7mg.
                    </p>
                  </div>
                  <div className="p-6 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">Forte (9–11 mg)</h3>
                    <p className="text-muted-foreground">
                      Per fumatori regolari (15–20 sigarette al giorno). Effetto intenso e duraturo. Consigliata solo a chi ha già esperienza con le pouches. Marchi: ZYN 9mg, ZYN 11mg.
                    </p>
                  </div>
                  <div className="p-6 bg-destructive/12 border border-destructive/30 rounded-xl">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">Molto Forte (14–20 mg)</h3>
                    <p className="text-muted-foreground">
                      Per fumatori pesanti o utenti esperti. Alta concentrazione di nicotina. Non adatta ai principianti. Marchi: VELO 14mg, Nordic Spirit 16mg, White Fox 16mg.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Tabella di Riferimento Rapido</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-muted text-left">
                        <th className="p-4 font-heading">Il tuo consumo</th>
                        <th className="p-4 font-heading">Resistenza consigliata</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["Non fumatore / curiosità", "2–3 mg"],
                        ["< 10 sigarette/giorno", "3–6 mg"],
                        ["10–15 sigarette/giorno", "6 mg"],
                        ["15–20 sigarette/giorno", "9 mg"],
                        ["> 20 sigarette/giorno", "11–14 mg"],
                        ["Fumatore molto pesante", "14–20 mg"],
                      ].map(([usage, strength]) => (
                        <tr key={usage} className="border-b border-border">
                          <td className="p-4 text-muted-foreground">{usage}</td>
                          <td className="p-4 text-foreground font-medium">{strength}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Consigli Pratici</h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li><strong>Inizia sempre basso.</strong> Anche se fumi molto, inizia con una resistenza inferiore a quella che pensi ti serva.</li>
                  <li><strong>Sintomi da resistenza troppo alta:</strong> vertigini, nausea, mal di testa, palpitazioni.</li>
                  <li><strong>Puoi ridurre nel tempo.</strong> Molti utenti usano le pouches per ridurre gradualmente la dipendenza da nicotina, scendendo di livello ogni 4–6 settimane.</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Quali Prodotti Trovi su Pouchesitaly</h2>
                <p className="text-muted-foreground">
                  Nel nostro assortimento trovi nicotine pouches in tutte le resistenze principali, dai 4mg ai 14mg. Spedizione rapida in tutta Italia, ordini consegnati in 2–4 giorni lavorativi.
                </p>
              </section>
            </div>
          ) : (
            <div className="prose max-w-none">
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-8 max-w-3xl">
                Choosing the right nicotine strength is essential for a satisfying experience. This guide will help you find the perfect level for your needs.
              </p>
              <section className="mb-12">
                <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Understanding Nicotine Levels</h2>
                <div className="space-y-6">
                  <div className="p-6 bg-primary/12 border border-primary/30 rounded-xl">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">Regular (3-6mg) - Light</h3>
                    <p className="text-muted-foreground mb-3">Perfect for beginners or those who prefer a gentle nicotine experience.</p>
                  </div>
                  <div className="p-6 bg-accent/12 border border-accent/30 rounded-xl">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">Strong (8-11mg) - Medium</h3>
                    <p className="text-muted-foreground mb-3">The most popular choice for regular users with a noticeable nicotine kick.</p>
                  </div>
                  <div className="p-6 bg-destructive/12 border border-destructive/30 rounded-xl">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">Extra Strong (12-15mg+) - Intense</h3>
                    <p className="text-muted-foreground mb-3">For experienced users seeking maximum nicotine delivery.</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              {isItalian ? "Trova la Resistenza Giusta" : "Find Your Perfect Strength"}
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              {isItalian ? "Esplora i prodotti disponibili" : "Browse our products sorted by nicotine content"}
            </p>
            <LocalizedLink to="/#products" className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors">
              {isItalian ? "Acquista per Intensità" : "Shop by Strength"}
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
