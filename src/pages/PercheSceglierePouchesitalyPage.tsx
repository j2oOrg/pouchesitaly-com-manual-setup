import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowRight, Shield, Zap, Package } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";

export default function PercheSceglierePouchesitalyPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LocalizedLink to="/" className="hover:text-foreground transition-colors">Home</LocalizedLink>
          <span>/</span>
          <span className="text-foreground font-medium">Perché scegliere Pouchesitaly</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Perché scegliere Pouchesitaly
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Su Pouchesitaly puoi acquistare snus online in modo semplice e sicuro. Non è richiesta alcuna registrazione e il checkout è rapido.
            </p>

            <p className="text-lg text-muted-foreground mb-8">
              Proponiamo marchi di snus affidabili, prezzi competitivi e una selezione pensata per soddisfare diverse esigenze di gusto e intensità.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-muted rounded-xl">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">Checkout Rapido</h3>
                <p className="text-muted-foreground">
                  Nessuna registrazione necessaria. Completa il tuo ordine in pochi minuti senza dover creare un account.
                </p>
              </div>

              <div className="text-center p-6 bg-muted rounded-xl">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">Spedizione Gratuita</h3>
                <p className="text-muted-foreground">
                  Spediamo gratuitamente in tutto il mondo. Imballaggio discreto per garantire la tua privacy.
                </p>
              </div>

              <div className="text-center p-6 bg-muted rounded-xl">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">Marchi Affidabili</h3>
                <p className="text-muted-foreground">
                  Solo prodotti autentici dai migliori marchi come ZYN, VELO e LYFT.
                </p>
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                La Nostra Selezione
              </h2>
              <p className="text-muted-foreground mb-4">
                Offriamo una selezione curata di nicotine pouches dai migliori marchi internazionali. Ogni prodotto è autentico e conservato nelle migliori condizioni per garantire freschezza e qualità.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>ZYN - Leader mondiale nelle nicotine pouches</li>
                <li>VELO - Innovazione e varietà di gusti</li>
                <li>LYFT - Qualità scandinava premium</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Esperienza d'Acquisto Semplice
              </h2>
              <p className="text-muted-foreground mb-4">
                Crediamo che lo shopping online debba essere semplice e veloce. Per questo abbiamo eliminato le barriere inutili:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Nessun account richiesto</li>
                <li>Checkout in meno di 2 minuti</li>
                <li>Prezzi trasparenti senza costi nascosti</li>
                <li>Spedizione gratuita sempre inclusa</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Servizio Clienti
              </h2>
              <p className="text-muted-foreground mb-4">
                Il nostro team è sempre disponibile per rispondere alle tue domande. Che tu abbia bisogno di consigli sui prodotti o informazioni sulla spedizione, siamo qui per aiutarti.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              Inizia a Risparmiare Oggi
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Prezzi competitivi, spedizione gratuita, nessun account richiesto
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
      </main>

      <QuickFAQ />
      <Footer />
    </div>
  );
}


