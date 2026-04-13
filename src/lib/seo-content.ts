export type SeoLocale = "en" | "it";

export interface FAQEntry {
  question: string;
  answer: string;
}

export interface FAQCategory {
  title: string;
  faqs: FAQEntry[];
}

export const homeFaqEntriesByLocale: Record<SeoLocale, FAQEntry[]> = {
  en: [
    {
      question: "How do nicotine pouches work?",
      answer:
        "Nicotine pouches are placed between your lip and gum. The nicotine is absorbed through the gum tissue, providing a smoke-free, spit-free nicotine experience.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Delivery times in Italy are typically: North 1-2 days, Central 1-3 days, South 2-4 days, and Islands 3-5 days.",
    },
    {
      question: "Is shipping really free?",
      answer:
        "Free shipping is available in Italy for orders of EUR100 or more. For lower totals, shipping is calculated at checkout. Orders are always shipped in discreet, unmarked packaging.",
    },
  ],
  it: [
    {
      question: "Come funzionano le nicotine pouches?",
      answer:
        "Le nicotine pouches si posizionano tra il labbro e la gengiva. La nicotina viene assorbita attraverso il tessuto gengivale, offrendo un'esperienza di nicotina senza fumo e senza sputo.",
    },
    {
      question: "Quanto tempo richiede la spedizione?",
      answer:
        "I tempi di consegna in Italia sono in genere: Nord 1-2 giorni, Centro 1-3 giorni, Sud 2-4 giorni, Isole 3-5 giorni.",
    },
    {
      question: "La spedizione è davvero gratuita?",
      answer:
        "La spedizione gratuita è disponibile in Italia per ordini pari o superiori a EUR100. Per importi inferiori, il costo viene calcolato al checkout. Il tuo ordine viene sempre spedito in imballaggio discreto e anonimo.",
    },
  ],
};

export const faqPageCategoriesByLocale: Record<SeoLocale, FAQCategory[]> = {
  en: [
    {
      title: "General Questions",
      faqs: [
        {
          question: "What are nicotine pouches?",
          answer:
            "Nicotine pouches are small, discreet pouches containing nicotine, plant fiber, and flavorings - but no tobacco.",
        },
        {
          question: "How do I use nicotine pouches?",
          answer:
            "Take one pouch from the container and place it between your upper lip and gum for 20-60 minutes.",
        },
        {
          question: "Are nicotine pouches safer than cigarettes?",
          answer:
            "They are tobacco-free and smoke-free, but still contain nicotine which is addictive.",
        },
      ],
    },
    {
      title: "Ordering & Payment",
      faqs: [
        {
          question: "Do I need to create an account to order?",
          answer: "No. You can complete your purchase as a guest in just a few minutes.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept major cards, PayPal, and local payment methods where available.",
        },
        {
          question: "Can I track my order?",
          answer:
            "Yes. You will receive an email with a tracking number once your order ships.",
        },
      ],
    },
  ],
  it: [
    {
      title: "Ordini e Spedizione",
      faqs: [
        {
          question: "Quanto tempo ci vuole per ricevere l'ordine?",
          answer:
            "Spediamo dalla nostra sede in 1-2 giorni lavorativi. La consegna in Italia richiede solitamente altri 1-2 giorni lavorativi. Tempo totale atteso: 2-4 giorni lavorativi.",
        },
        {
          question: "Spedite in tutta Italia?",
          answer:
            "Si. Spediamo su tutto il territorio italiano, incluse Sicilia, Sardegna e isole minori. Le spese di spedizione variano in base all'ordine.",
        },
        {
          question: "Come posso tracciare il mio ordine?",
          answer:
            "Dopo la spedizione riceverai un'email con il codice di tracciamento del corriere.",
        },
        {
          question: "Posso modificare o annullare un ordine?",
          answer:
            "Contattaci entro 1 ora dall'ordine. Dopo l'avvio della preparazione non e possibile intervenire.",
        },
      ],
    },
    {
      title: "Prodotti",
      faqs: [
        {
          question: "Le nicotine pouches sono legali in Italia?",
          answer:
            "Si. Le nicotine pouches senza tabacco sono legali in Italia. Non sono classificate come prodotti del tabacco e non rientrano nel divieto EU sullo snus.",
        },
        {
          question: "Qual e la differenza tra nicotine pouches e snus?",
          answer:
            "Lo snus contiene tabacco. Le nicotine pouches di Pouchesitaly sono tobacco-free: non contengono foglie di tabacco. Questo le rende legali in Italia (lo snus tradizionale e vietato nell'UE eccetto in Svezia).",
        },
        {
          question: "Quali marchi vendete?",
          answer:
            "ZYN (Swedish Match/PMI), VELO (British American Tobacco), CUBA e altri marchi selezionati. Tutti i prodotti sono tobacco-free e di provenienza verificata.",
        },
        {
          question: "Come scelgo la resistenza giusta?",
          answer:
            "Consulta la nostra guida alle resistenze per una guida dettagliata. In breve: se fumi meno di 10 sigarette al giorno, inizia con 6mg. Fumatori regolari: 9mg. Fumatori pesanti: 11-14mg.",
        },
      ],
    },
    {
      title: "Pagamenti",
      faqs: [
        {
          question: "Quali metodi di pagamento accettate?",
          answer:
            "Accettiamo le principali carte di credito e debito (Visa, Mastercard), PayPal e altri metodi di pagamento digitale. Tutti i pagamenti sono gestiti in modo sicuro.",
        },
        {
          question: "E sicuro pagare sul vostro sito?",
          answer:
            "Si. Il sito utilizza HTTPS con certificato SSL. I dati della tua carta non vengono conservati sui nostri server.",
        },
      ],
    },
    {
      title: "Resi e Rimborsi",
      faqs: [
        {
          question: "Posso restituire un prodotto?",
          answer:
            "Accettiamo resi entro 14 giorni dall'acquisto per prodotti non aperti e in condizioni originali. Contattaci prima di spedire qualsiasi reso.",
        },
        {
          question: "Cosa succede se ricevo un prodotto danneggiato?",
          answer:
            "Contattaci entro 48 ore con foto del prodotto danneggiato. Provvederemo a un rimborso o sostituzione senza costi aggiuntivi.",
        },
      ],
    },
    {
      title: "Altro",
      faqs: [
        {
          question: "Avete un programma fedelta o sconti?",
          answer:
            "Iscriviti alla nostra newsletter per ricevere offerte esclusive e notifiche sui nuovi prodotti.",
        },
        {
          question: "Come posso contattarvi?",
          answer:
            "Tramite il modulo di contatto sul sito o via email. Rispondiamo entro 24 ore nei giorni lavorativi.",
        },
      ],
    },
  ],
};
