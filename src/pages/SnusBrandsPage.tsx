import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";

export default function SnusBrandsPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Marchi di Snus</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Marchi di Snus: ZYN e VELO
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Scopri i marchi di snus più popolari come ZYN e VELO, disponibili in diverse intensità di nicotina e gusti.
            </p>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                ZYN - Leader di Mercato
              </h2>
              <p className="text-muted-foreground mb-4">
                ZYN è uno dei marchi di bustine di nicotina più popolari al mondo. Conosciuto per la qualità costante e l'ampia varietà di gusti, ZYN offre prodotti in diversi livelli di intensità per soddisfare ogni preferenza. Dal rinfrescante mentolo al gusto audace del caffè, ZYN offre un'esperienza premium senza tabacco.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Disponibile nelle intensità di nicotina 3mg, 6mg e 9mg</li>
                <li>Oltre 15 profili di gusto unici</li>
                <li>Bustine slim e discrete per un comfort tutto il giorno</li>
                <li>Realizzato con ingredienti di grado farmaceutico</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                VELO - Innovazione e Varietà
              </h2>
              <p className="text-muted-foreground mb-4">
                VELO (precedentemente conosciuto come EPOK) è all'avanguardia nell'innovazione delle nicotine pouches. I loro prodotti presentano una formula unica che rilascia la nicotina in modo fluido e costante. VELO è noto per i gusti audaci e intensi che si distinguono dalla concorrenza.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Contenuto di nicotina da 4mg a 15mg</li>
                <li>Tecnologia "Freeze" innovativa per sensazioni rinfrescanti</li>
                <li>Ampia varietà tra cui menta, frutta e gusti speciali</li>
                <li>Ritenzione dell'umidità brevettata per bustine più durature</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                LYFT - Qualità Scandinava
              </h2>
              <p className="text-muted-foreground mb-4">
                LYFT porta l'autentica maestria scandinava nel mercato delle nicotine pouches. Con un focus su ingredienti naturali e produzione sostenibile, LYFT offre un'esperienza premium per chi apprezza qualità e responsabilità ambientale.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Disponibile nelle intensità 6mg, 10mg e 15mg</li>
                <li>Packaging eco-friendly e produzione sostenibile</li>
                <li>Profili di gusto puliti e naturali</li>
                <li>Bustine morbide e confortevoli per uso prolungato</li>
              </ul>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              Scopri la Nostra Selezione
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Tutti i migliori marchi in un unico posto
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
      </main>

      <QuickFAQ />
      <Footer />
    </div>
  );
}
