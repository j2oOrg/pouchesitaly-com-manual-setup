import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";

export default function GuidaIntensitaGustiPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LocalizedLink to="/" className="hover:text-foreground transition-colors">Home</LocalizedLink>
          <span>/</span>
          <span className="text-foreground font-medium">Guida alle intensità e ai gusti</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Guida alle intensità e ai gusti di Snus
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Lo snus è disponibile in diverse intensità di nicotina, da opzioni leggere a varianti più forti. La scelta dipende dall'esperienza personale e dal livello di tolleranza alla nicotina.
            </p>

            <p className="text-lg text-muted-foreground mb-8">
              Per quanto riguarda i gusti, puoi trovare snus alla menta, aromi fruttati e altre combinazioni popolari, pensate per offrire un'esperienza piacevole e personalizzata.
            </p>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Livelli di Intensità
              </h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-primary/12 border-l-4 border-primary rounded-r-xl">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    Regular (Leggero) - 3-6 mg di nicotina
                  </h3>
                  <p className="text-muted-foreground">
                    Ideale per chi è nuovo alle nicotine pouches o preferisce un'esperienza più delicata. Rilascio graduale e controllato di nicotina. Consigliato per principianti, uso quotidiano frequente, chi cerca un'esperienza morbida.
                  </p>
                </div>

                <div className="p-6 bg-accent/12 border-l-4 border-accent rounded-r-xl">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    Strong (Medio-Forte) - 8-11 mg di nicotina
                  </h3>
                  <p className="text-muted-foreground">
                    Per utenti con esperienza che cercano una soddisfazione più intensa. Effetto più marcato e duraturo rispetto al livello regular. Consigliato per utenti con esperienza, chi desidera un effetto più pronunciato.
                  </p>
                </div>

                <div className="p-6 bg-destructive/12 border-l-4 border-destructive rounded-r-xl">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    Extra Strong (Molto Forte) - 12-15+ mg di nicotina
                  </h3>
                  <p className="text-muted-foreground">
                    Per utenti esperti che cercano la massima intensità. Effetto potente e immediato. Consigliato solo per utenti con alta tolleranza alla nicotina.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Gusti Popolari
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-xl">
                  <h4 className="font-heading font-bold text-foreground mb-2">🌿 Menta</h4>
                  <p className="text-sm text-muted-foreground">
                    Il gusto più popolare. Fresco e rinfrescante, disponibile in varianti come menta piperita, spearmint e menta ghiacciata.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <h4 className="font-heading font-bold text-foreground mb-2">🍋 Agrumi</h4>
                  <p className="text-sm text-muted-foreground">
                    Note fresche di limone, lime o arancia per un'esperienza vivace e rinfrescante.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <h4 className="font-heading font-bold text-foreground mb-2">🫐 Frutti di Bosco</h4>
                  <p className="text-sm text-muted-foreground">
                    Mix di mirtillo, ribes e lampone per un gusto dolce e fruttato.
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-xl">
                  <h4 className="font-heading font-bold text-foreground mb-2">☕ Caffè</h4>
                  <p className="text-sm text-muted-foreground">
                    Aroma ricco di caffè tostato, perfetto per gli amanti del caffè.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Come Scegliere
              </h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Se sei nuovo alle nicotine pouches, inizia con un'intensità Regular</li>
                <li>Sperimenta diversi gusti per trovare il tuo preferito</li>
                <li>Aumenta gradualmente l'intensità se desideri un effetto più forte</li>
                <li>Considera il momento della giornata: intensità maggiori per la mattina, più leggere per la sera</li>
              </ul>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              Trova il Tuo Gusto Preferito
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Esplora la nostra selezione completa
            </p>
            <LocalizedLink
              to="/#products"
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors"
            >
              Vedi Tutti i Prodotti
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

