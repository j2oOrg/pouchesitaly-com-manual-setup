import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "Ordini e Spedizione",
    faqs: [
      {
        question: "Quanto tempo ci vuole per ricevere il mio ordine?",
        answer:
          "I tempi di consegna variano in base alla destinazione. In Italia e in Europa, la consegna avviene generalmente in 7-10 giorni lavorativi. Per Nord America: 10-14 giorni, Asia e Oceania: 12-18 giorni, resto del mondo: 14-21 giorni. Tutti i tempi sono indicativi e possono variare in base allo sdoganamento.",
      },
      {
        question: "La spedizione è davvero gratuita?",
        answer:
          "Sì! Offriamo spedizione gratuita su tutti gli ordini in tutto il mondo, senza alcun acquisto minimo richiesto. Il tuo ordine verrà spedito in un imballaggio discreto e non contrassegnato.",
      },
      {
        question: "Posso tracciare il mio ordine?",
        answer:
          "Sì! Una volta spedito il tuo ordine, riceverai un'email con un numero di tracciamento che potrai utilizzare per monitorare lo stato della spedizione.",
      },
      {
        question: "L'imballaggio è discreto?",
        answer:
          "Assolutamente sì. Tutti gli ordini vengono spediti in imballaggi semplici e non contrassegnati, senza alcuna indicazione del contenuto. La tua privacy è importante per noi.",
      },
    ],
  },
  {
    title: "Pagamenti",
    faqs: [
      {
        question: "Quali metodi di pagamento accettate?",
        answer:
          "Accettiamo tutte le principali carte di credito (Visa, Mastercard, American Express), PayPal e vari metodi di pagamento locali a seconda del paese.",
      },
      {
        question: "Devo creare un account per acquistare?",
        answer:
          "No! Offriamo un processo di checkout veloce senza necessità di registrazione. Puoi completare il tuo acquisto come ospite in pochi minuti.",
      },
    ],
  },
  {
    title: "Prodotti",
    faqs: [
      {
        question: "Cosa sono le nicotine pouches?",
        answer:
          "Le nicotine pouches sono piccole bustine discrete contenenti nicotina, fibre vegetali e aromi - ma nessun tabacco. Si posizionano tra il labbro e la gengiva per un'esperienza di nicotina comoda e senza fumo.",
      },
      {
        question: "Come si usano le nicotine pouches?",
        answer:
          "Prendi una bustina dal contenitore e posizionala tra il labbro superiore e la gengiva. Lasciala lì per 20-60 minuti mentre la nicotina viene assorbita. Potresti sentire un leggero formicolio - è normale. Quando hai finito, getta la bustina usata.",
      },
      {
        question: "Come scelgo l'intensità giusta?",
        answer:
          "Se sei nuovo alle nicotine pouches, consigliamo di iniziare con l'intensità Regular (3-6mg). Gli utenti esperti possono preferire Strong (8-11mg) o Extra Strong (12-15mg+). Consulta la nostra Guida alle Intensità per maggiori dettagli.",
      },
      {
        question: "I prodotti sono autentici?",
        answer:
          "Sì, al 100%. Acquistiamo tutti i prodotti direttamente da distributori e produttori autorizzati. Ogni prodotto è autentico e conservato correttamente per garantire freschezza.",
      },
    ],
  },
  {
    title: "Conservazione",
    faqs: [
      {
        question: "Come devo conservare le nicotine pouches?",
        answer:
          "Conserva le bustine in un luogo fresco e asciutto, lontano dalla luce diretta del sole. Mantieni il contenitore chiuso quando non in uso. Le bustine conservate correttamente rimangono fresche per 6-12 mesi.",
      },
    ],
  },
];

export default function DomandeFrequentiSnusPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Domande frequenti sullo Snus</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Domande frequenti sullo Snus
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Qui trovi le risposte alle domande più comuni sullo snus: tempi di spedizione, metodi di pagamento, utilizzo, discrezione degli ordini e scelta dell'intensità di nicotina.
          </p>

          <p className="text-lg text-muted-foreground mb-12">
            Questa sezione è pensata per chiarire i dubbi più frequenti prima dell'acquisto.
          </p>

          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`${categoryIndex}-${faqIndex}`}
                    className="bg-muted border border-border rounded-xl px-6"
                  >
                    <AccordionTrigger className="text-left font-heading font-semibold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              Hai altre domande?
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Il nostro team di supporto è qui per aiutarti
            </p>
            <a
              href="mailto:support@nicoxpress.com"
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors"
            >
              Contatta il Supporto
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}