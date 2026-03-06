import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";

export default function SpedizioneSnusPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LocalizedLink to="/" className="hover:text-foreground transition-colors">Home</LocalizedLink>
          <span>/</span>
          <span className="text-foreground font-medium">Spedizione Snus</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Spedizione Snus
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Spediamo esclusivamente in Italia. Gli ordini vengono preparati rapidamente e spediti in imballaggi discreti e non contrassegnati per garantire la privacy.
            </p>

            <p className="text-lg text-muted-foreground mb-8">
              Elaboriamo tutti gli ordini alle 09:00 dal lunedì al venerdì, esclusi i giorni festivi aziendali. I tempi di consegna variano in base all'area, ma in genere si attestano tra 1 e 5 giorni lavorativi.
            </p>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Tempi di Spedizione per Regione
              </h2>
              
              <p className="text-muted-foreground mb-3">
                <strong>Nord Italia:</strong> 1-2 giorni - Consegna rapida nelle principali aree del nord
              </p>
              
              <p className="text-muted-foreground mb-3">
                <strong>Centro Italia:</strong> 1-3 giorni - Spedizione affidabile nelle regioni centrali
              </p>
              
              <p className="text-muted-foreground mb-3">
                <strong>Sud Italia:</strong> 2-4 giorni - Tempi medi per le regioni del sud
              </p>
              
              <p className="text-muted-foreground mb-6">
                <strong>Isole (Sicilia e Sardegna):</strong> 3-5 giorni - Copertura completa per le isole
              </p>

              <p className="text-sm text-muted-foreground">
                *I tempi di consegna possono variare in base ai servizi postali locali e alle condizioni meteo.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Imballaggio Discreto
              </h2>
              <p className="text-muted-foreground mb-4">
                Rispettiamo la tua privacy. Tutti gli ordini vengono spediti in imballaggi semplici e non contrassegnati, senza indicazioni sul contenuto. La confezione esterna non rivela in alcun modo cosa c'è all'interno.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Scatole semplici senza loghi o marchi</li>
                <li>Nessuna descrizione del prodotto all'esterno</li>
                <li>Etichetta di spedizione neutra</li>
                <li>Protezione sicura del contenuto durante il trasporto</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Tracciamento dell'Ordine
              </h2>
              <p className="text-muted-foreground mb-4">
                Riceverai un numero di tracciamento via email non appena il tuo ordine viene spedito. Potrai monitorare il percorso del tuo pacco in tempo reale e sapere esattamente quando arriverà.
              </p>
              <p className="text-muted-foreground mb-3"><strong>Processo di Spedizione:</strong></p>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                <li>Il tuo ordine viene preparato entro 24-48 ore</li>
                <li>Ricevi il numero di tracciamento via email</li>
                <li>Il pacco viene consegnato al corriere nazionale</li>
                <li>Traccia il tuo ordine fino alla consegna finale</li>
              </ol>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Costi di Spedizione
              </h2>
              <p className="text-muted-foreground mb-2">
                Regola semplice per tutta Italia:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Ordini sotto €100: spedizione fissa €6,90</li>
                <li>Ordini da €100 in su: spedizione gratuita</li>
              </ul>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              Ordina Ora con Spedizione Gratuita da €100
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Consegna veloce e discreta in tutta Italia
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
            <LocalizedLink to="/perche-scegliere-pouchesitaly" className="bg-card rounded-xl p-6 text-left transition-all group block hover:shadow-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide font-normal">Chi Siamo</p>
              <h4 className="text-2xl font-heading font-bold text-foreground mb-3">
                Perché scegliere Pouchesitaly
              </h4>
              <p className="text-muted-foreground text-sm mb-12 font-normal">
                Scopri perché scegliere Pouchesitaly.
              </p>
              <div className="flex items-center justify-end">
                <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowRight className="w-6 h-6 text-background group-hover:text-primary-foreground transition-colors" />
                </div>
              </div>
            </LocalizedLink>

            <LocalizedLink to="/domande-frequenti-snus" className="bg-card rounded-xl p-6 text-left transition-all group block hover:shadow-lg border border-border">
              <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide font-normal">Supporto</p>
              <h4 className="text-2xl font-heading font-bold text-foreground mb-3">
                Domande frequenti
              </h4>
              <p className="text-muted-foreground text-sm mb-12 font-normal">
                Risposte alle domande più frequenti.
              </p>
              <div className="flex items-center justify-end">
                <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
                  <ArrowRight className="w-6 h-6 text-background group-hover:text-primary-foreground transition-colors" />
                </div>
              </div>
            </LocalizedLink>

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
          </div>
        </section>
      </main>
      <QuickFAQ />
      <Footer />
    </div>
  );
}


