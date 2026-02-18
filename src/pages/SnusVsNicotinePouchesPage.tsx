import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";

export default function SnusVsNicotinePouchesPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LocalizedLink to="/" className="hover:text-foreground transition-colors">Home</LocalizedLink>
          <span>/</span>
          <span className="text-foreground font-medium">Snus vs Nicotine Pouches</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Snus vs Nicotine Pouches
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Lo snus tradizionale contiene tabacco, mentre le nicotine pouches non contengono tabacco ma solo nicotina, aromi e ingredienti di supporto.
            </p>

            <p className="text-lg text-muted-foreground mb-8">
              In Italia, quando si parla di snus, spesso ci si riferisce alle nicotine pouches. La differenza principale sta quindi nella composizione, mentre l'utilizzo e l'esperienza restano simili.
            </p>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Confronto Diretto
              </h2>
              
              <p className="text-muted-foreground mb-4"><strong>Snus Tradizionale:</strong></p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>Contiene tabacco</li>
                <li>Origine scandinava</li>
                <li>Esperienza tradizionale</li>
                <li>Può macchiare i denti</li>
                <li>Odore di tabacco</li>
              </ul>
              
              <p className="text-muted-foreground mb-4"><strong>Nicotine Pouches (Consigliato):</strong></p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Senza tabacco</li>
                <li>Moderna alternativa</li>
                <li>Esperienza pulita</li>
                <li>Non macchia i denti</li>
                <li>Solo aromi piacevoli</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Cosa Sono le Nicotine Pouches
              </h2>
              <p className="text-muted-foreground mb-4">
                Le nicotine pouches sono la versione moderna e tobacco-free dello snus tradizionale. Contengono nicotina purificata, cellulosa vegetale, aromi e altri ingredienti approvati, ma nessuna foglia di tabacco.
              </p>
              <p className="text-muted-foreground mb-3"><strong>Composizione delle Nicotine Pouches:</strong></p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Nicotina farmaceutica purificata</li>
                <li>Fibra vegetale (cellulosa) per la struttura</li>
                <li>Aromi naturali e artificiali</li>
                <li>Regolatori di pH e umidità</li>
                <li>Dolcificanti (in alcuni prodotti)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Vantaggi delle Nicotine Pouches
              </h2>
              <p className="text-muted-foreground mb-4">
                Le nicotine pouches moderne offrono diversi vantaggi rispetto allo snus tradizionale:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Senza Tabacco:</strong> Nessuna esposizione alle sostanze presenti nel tabacco</li>
                <li><strong>Denti Bianchi:</strong> Non macchia i denti come il tabacco</li>
                <li><strong>Nessun Odore:</strong> Solo aromi freschi, niente odore di tabacco</li>
                <li><strong>Varietà di Gusti:</strong> Ampia scelta di aromi moderni e innovativi</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Utilizzo Identico
              </h2>
              <p className="text-muted-foreground mb-4">
                Nonostante le differenze nella composizione, snus tradizionale e nicotine pouches si utilizzano nello stesso modo:
              </p>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                <li>Posiziona la pouch sotto il labbro superiore</li>
                <li>Lasciala in posizione per 15-30 minuti</li>
                <li>La nicotina viene rilasciata gradualmente</li>
                <li>Rimuovi e smaltisci la pouch usata</li>
              </ol>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Perché Scegliere le Nicotine Pouches
              </h2>
              <p className="text-muted-foreground mb-4">
                Le nicotine pouches rappresentano l'evoluzione moderna dello snus, mantenendo i vantaggi dell'esperienza tradizionale ma eliminando il tabacco e i suoi aspetti negativi.
              </p>
              <p className="text-muted-foreground mb-4">
                Su Pouchesitaly offriamo solo nicotine pouches moderne dei migliori marchi come ZYN, VELO e LYFT - prodotti tobacco-free di alta qualità per un'esperienza pulita e soddisfacente.
              </p>
            </section>

            <div className="bg-primary/20 rounded-lg p-6 mt-8">
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">Scopri le Nicotine Pouches</h3>
              <p className="text-foreground">
                Esplora la nostra selezione di <LocalizedLink to="/snus-brands" className="underline font-semibold">nicotine pouches premium</LocalizedLink> e trova il prodotto perfetto per te. Consulta anche la nostra <LocalizedLink to="/tobacco-free" className="underline font-semibold">guida tobacco-free</LocalizedLink>.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              Scegli le Nicotine Pouches
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              L'alternativa moderna e tobacco-free
            </p>
            <LocalizedLink
              to="/#products"
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors"
            >
              Acquista Ora
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
          </div>
        </div>

        {/* Related Articles */}
        <section className="mt-16 md:mt-24">
          <h3 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-12">
            Articoli Correlati
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <LocalizedLink to="/snus-cose" className="bg-card rounded-xl p-6 text-left transition-all group block hover:shadow-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide font-normal">Informazioni</p>
              <h4 className="text-2xl font-heading font-bold text-foreground mb-3">
                Snus: cos'è
              </h4>
              <p className="text-muted-foreground text-sm mb-12 font-normal">
                Scopri cosa sono le nicotine pouches.
              </p>
              <div className="flex items-center justify-end">
                <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowRight className="w-6 h-6 text-background group-hover:text-primary-foreground transition-colors" />
                </div>
              </div>
            </LocalizedLink>

            <LocalizedLink to="/snus-brands" className="bg-card rounded-xl p-6 text-left transition-all group block hover:shadow-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide font-normal">Marchi</p>
              <h4 className="text-2xl font-heading font-bold text-foreground mb-3">
                Marchi di Snus: ZYN e VELO
              </h4>
              <p className="text-muted-foreground text-sm mb-12 font-normal">
                I migliori marchi di nicotine pouches.
              </p>
              <div className="flex items-center justify-end">
                <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowRight className="w-6 h-6 text-background group-hover:text-primary-foreground transition-colors" />
                </div>
              </div>
            </LocalizedLink>

            <LocalizedLink to="/guida-intensita-gusti" className="bg-card rounded-xl p-6 text-left transition-all group block hover:shadow-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide font-normal">Guida</p>
              <h4 className="text-2xl font-heading font-bold text-foreground mb-3">
                Guida alle intensità e ai gusti
              </h4>
              <p className="text-muted-foreground text-sm mb-12 font-normal">
                Scegli l'intensità perfetta per te.
              </p>
              <div className="flex items-center justify-end">
                <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowRight className="w-6 h-6 text-background group-hover:text-primary-foreground transition-colors" />
                </div>
              </div>
            </LocalizedLink>
          </div>
        </section>
      </main>
      <QuickFAQ />
      <Footer />
    </div>
  );
}


