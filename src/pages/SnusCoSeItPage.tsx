import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";

export default function SnusCoSeItPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Snus: cos'è</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Snus: cos'è
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Lo snus è un prodotto a base di nicotina che si utilizza posizionando una piccola pouch sotto il labbro superiore. In Italia, il termine snus viene comunemente usato per indicare le nicotine pouches, una versione moderna senza combustione.
            </p>

            <p className="text-lg text-muted-foreground mb-8">
              Non producono fumo né vapore e offrono un'esperienza discreta. Le nicotine pouches sono disponibili in diversi gusti e livelli di intensità, permettendo di scegliere l'opzione più adatta alle proprie preferenze.
            </p>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Come si Utilizza lo Snus
              </h2>
              <p className="text-muted-foreground mb-4">
                L'utilizzo delle nicotine pouches è semplice e discreto. Basta posizionare una bustina sotto il labbro superiore e lasciarla in posizione. La nicotina viene rilasciata gradualmente attraverso la mucosa orale, offrendo un'esperienza soddisfacente senza bisogno di fumare o svapare.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Posiziona la pouch sotto il labbro superiore</li>
                <li>Lasciala in posizione per 15-30 minuti</li>
                <li>Smaltisci la pouch usata in modo responsabile</li>
                <li>Utilizzabile ovunque, in modo discreto</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Vantaggi delle Nicotine Pouches
              </h2>
              <p className="text-muted-foreground mb-4">
                Le nicotine pouches moderne offrono numerosi vantaggi rispetto ai prodotti tradizionali a base di tabacco:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Senza fumo e senza vapore - completamente discreto</li>
                <li>Nessun odore fastidioso su vestiti o capelli</li>
                <li>Utilizzabile in luoghi chiusi dove il fumo è vietato</li>
                <li>Senza combustione - esperienza moderna e pulita</li>
                <li>Ampia scelta di gusti e intensità</li>
                <li>Porzione controllata di nicotina</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Differenze con i Prodotti Tradizionali
              </h2>
              <p className="text-muted-foreground mb-4">
                A differenza delle sigarette tradizionali, le nicotine pouches non richiedono combustione e non producono fumo. Questo le rende una scelta più discreta e moderna per chi cerca un'alternativa al fumo.
              </p>
              <p className="text-muted-foreground mb-4">
                Inoltre, non contengono tabacco (nella maggior parte dei casi moderni), riducendo l'esposizione a molte delle sostanze presenti nei prodotti tradizionali del tabacco.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              Prova le Nicotine Pouches
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Scopri la nostra selezione di prodotti premium
            </p>
            <Link
              to="/#products"
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors"
            >
              Acquista Ora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        <section className="mt-16 md:mt-24">
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-12">
            Articoli Correlati
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/snus-brands" className="bg-card rounded-xl p-6 text-left transition-all group block hover:shadow-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide font-normal">Marchi</p>
              <h4 className="text-2xl font-heading font-bold text-foreground mb-3">
                Marchi di Snus: ZYN e VELO
              </h4>
              <p className="text-muted-foreground text-sm mb-12 font-normal">
                Scopri i marchi più popolari di nicotine pouches.
              </p>
              <div className="flex items-center justify-end">
                <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowRight className="w-6 h-6 text-background group-hover:text-primary-foreground transition-colors" />
                </div>
              </div>
            </Link>

            <Link to="/guida-intensita-gusti" className="bg-card rounded-xl p-6 text-left transition-all group block hover:shadow-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide font-normal">Guida</p>
              <h4 className="text-2xl font-heading font-bold text-foreground mb-3">
                Guida alle intensità e ai gusti
              </h4>
              <p className="text-muted-foreground text-sm mb-12 font-normal">
                Scegli l'intensità giusta per le tue esigenze.
              </p>
              <div className="flex items-center justify-end">
                <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowRight className="w-6 h-6 text-background group-hover:text-primary-foreground transition-colors" />
                </div>
              </div>
            </Link>

            <Link to="/snus-vs-nicotine-pouches" className="bg-card rounded-xl p-6 text-left transition-all group block hover:shadow-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide font-normal">Confronto</p>
              <h4 className="text-2xl font-heading font-bold text-foreground mb-3">
                Snus vs Nicotine Pouches
              </h4>
              <p className="text-muted-foreground text-sm mb-12 font-normal">
                Differenze tra snus tradizionale e nicotine pouches.
              </p>
              <div className="flex items-center justify-end">
                <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowRight className="w-6 h-6 text-background group-hover:text-primary-foreground transition-colors" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
      <QuickFAQ />
      <Footer />
    </div>
  );
}
