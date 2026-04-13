import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, "dist");
const SUPABASE_CLIENT_FILE = path.join(
  ROOT_DIR,
  "src",
  "integrations",
  "supabase",
  "client.ts",
);

const BASE_URL = "https://pouchesitaly.com";
const DEFAULT_IMAGE = `${BASE_URL}/socialshare.png`;
const DEFAULT_KEYWORDS =
  "pouchesitaly, nicotine pouches, italy, tobacco-free pouches, ZYN, VELO, CUBA, nicotine pouches italy";
const PACK_OPTIONS = [
  { size: 5, discount: 0.05 },
  { size: 10, discount: 0.12 },
  { size: 20, discount: 0.2 },
];

const SITE_DEFAULTS = {
  it: {
    title: "Bustine di Nicotina Italia — ZYN, VELO, CUBA | Pouchesitaly",
    description:
      "Acquista le migliori bustine di nicotina in Italia: ZYN, VELO, CUBA e altri marchi premium. Spedizione rapida 2-4 giorni.",
    ogTitle: "Pouchesitaly | Bustine di nicotina premium in Italia",
    ogDescription:
      "Spedizione rapida in Italia, prodotti autentici e checkout discreto per nicotine pouches premium.",
  },
  en: {
    title: "Nicotine Pouches Italy — ZYN, VELO, CUBA | Pouchesitaly",
    description:
      "Buy premium nicotine pouches in Italy: ZYN, VELO, CUBA and more. Fast shipping in 2-4 business days.",
    ogTitle: "Pouchesitaly | Premium nicotine pouches in Italy",
    ogDescription:
      "Fast shipping across Italy, authentic products, and discreet checkout for premium nicotine pouches.",
  },
};

const PUBLIC_STATIC_PATHS = [
  "/",
  "/premium-brands",
  "/shipping-info",
  "/why-choose-us",
  "/strengths-guide",
  "/tobacco-free",
  "/faq",
  "/zyn-italy",
  "/velo-italy",
  "/privacy",
  "/terms",
  "/snus-brands",
  "/snus-cose",
  "/spedizione-snus",
  "/perche-scegliere-pouchesitaly",
  "/guida-intensita-gusti",
  "/snus-vs-nicotine-pouches",
  "/domande-frequenti-snus",
];

const ROUTE_OVERRIDES = {
  "/": {
    it: {
      title: "Bustine di Nicotina Italia — ZYN, VELO, CUBA | Pouchesitaly",
      description:
        "Acquista le migliori bustine di nicotina in Italia: ZYN, VELO, CUBA e altri marchi premium. Spedizione rapida 2-4 giorni. Tobacco-free e legali in Italia.",
    },
    en: {
      title: "Nicotine Pouches Italy — ZYN, VELO, CUBA | Pouchesitaly",
      description:
        "Buy premium nicotine pouches in Italy: ZYN, VELO, CUBA and more. Fast shipping in 2-4 business days. Tobacco-free and legal in Italy.",
    },
    schemaKey: "homeFaq",
  },
  "/premium-brands": {
    it: {
      title: "Marchi Premium di Nicotina | Pouchesitaly",
      description:
        "Confronta i migliori marchi di nicotine pouches in Italia, inclusi ZYN e VELO, con spedizione rapida e checkout discreto.",
    },
    en: {
      title: "Premium Nicotine Brands | Pouchesitaly",
      description:
        "Compare premium nicotine pouch brands in Italy including ZYN and VELO. Fast shipping and discreet checkout.",
    },
  },
  "/shipping-info": {
    it: {
      title: "Spedizione in Italia | Pouchesitaly",
      description:
        "Spediamo esclusivamente in Italia con corrieri nazionali tracciati. Spedizione gratuita da EUR100, altrimenti tariffa fissa di EUR6,90.",
    },
    en: {
      title: "Shipping in Italy | Pouchesitaly",
      description:
        "We ship exclusively within Italy using tracked domestic couriers. Free shipping from EUR100, otherwise a flat EUR6.90 fee.",
    },
    schemaKey: "shippingFaq",
  },
  "/why-choose-us": {
    it: {
      title: "Perche Scegliere Pouchesitaly",
      description:
        "Scopri perche migliaia di clienti scelgono Pouchesitaly: prodotti premium tobacco-free, spedizione in 2-4 giorni, prezzi competitivi e assistenza clienti.",
    },
    en: {
      title: "Why Choose Pouchesitaly",
      description:
        "Discover why customers choose Pouchesitaly for premium nicotine pouches, fast shipping in Italy, competitive pricing, and helpful support.",
    },
  },
  "/strengths-guide": {
    it: {
      title: "Guida alle Resistenze | Pouchesitaly",
      description:
        "Come scegliere la resistenza giusta per le nicotine pouches: da 2mg a 14mg, con consigli per fumatori leggeri, moderati e pesanti.",
    },
    en: {
      title: "Nicotine Strength Guide | Pouchesitaly",
      description:
        "Understand nicotine pouch strengths from light to extra strong and find the best level for your needs in Italy.",
    },
  },
  "/tobacco-free": {
    it: {
      title: "Nicotine Pouches Senza Tabacco | Pouchesitaly",
      description:
        "Le nicotine pouches di Pouchesitaly non contengono tabacco. Scopri perche sono una scelta piu pulita rispetto allo snus.",
    },
    en: {
      title: "Tobacco-Free Products | Pouchesitaly",
      description:
        "All our nicotine pouches are 100% tobacco-free. Explore cleaner nicotine formats for Italy.",
    },
  },
  "/faq": {
    it: {
      title: "FAQ: Spedizioni, Prodotti, Pagamenti | Pouchesitaly",
      description:
        "Risposte alle domande piu frequenti su spedizione, pagamenti, prodotti, resistenze, legalita e resi.",
    },
    en: {
      title: "FAQ | Pouchesitaly",
      description:
        "Frequently asked questions about nicotine pouches, shipping in Italy, payment, and product use.",
    },
    schemaKey: "faqPage",
  },
  "/zyn-italy": {
    it: {
      title: "ZYN Italia — Compra ZYN Online | Pouchesitaly",
      description:
        "Acquista ZYN nicotine pouches in Italia su Pouchesitaly. Gusti e resistenze con spedizione rapida.",
    },
    en: {
      title: "ZYN Italy: Prices & Fast Shipping | Pouchesitaly",
      description:
        "Shop ZYN in Italy with fast delivery and free shipping from EUR100. Compare strengths and pack sizes.",
    },
    schemaKey: "zynFaq",
  },
  "/velo-italy": {
    it: {
      title: "VELO Italia — Compra VELO Online | Pouchesitaly",
      description:
        "Acquista VELO nicotine pouches in Italia su Pouchesitaly. Gusti, intensita e spedizione in 2-4 giorni.",
    },
    en: {
      title: "VELO Italy: Flavors, Strengths & Prices | Pouchesitaly",
      description:
        "Discover VELO in Italy: popular flavors, nicotine strengths, and fast tracked delivery.",
    },
    schemaKey: "veloFaq",
  },
  "/privacy": {
    it: {
      title: "Privacy Policy — Pouchesitaly",
      description:
        "Informativa sulla privacy di Pouchesitaly: come raccogliamo e utilizziamo i tuoi dati personali in conformita al GDPR italiano ed europeo.",
    },
    en: {
      title: "Privacy Policy | Pouchesitaly",
      description:
        "Read how Pouchesitaly collects and uses personal data in line with Italian and EU GDPR requirements.",
    },
  },
  "/terms": {
    it: {
      title: "Termini e Condizioni — Pouchesitaly",
      description:
        "Termini e condizioni di acquisto su Pouchesitaly: ordini, pagamenti, resi, responsabilita e diritti del consumatore.",
    },
    en: {
      title: "Terms & Conditions | Pouchesitaly",
      description:
        "Terms and conditions for purchases on Pouchesitaly, including orders, payments, returns, responsibilities, and consumer rights.",
    },
  },
  "/snus-brands": {
    it: {
      title: "Marchi Premium: ZYN, VELO, CUBA e Altri | Pouchesitaly",
      description:
        "Scopri i migliori marchi di nicotine pouches disponibili su Pouchesitaly: ZYN, VELO, CUBA e altri brand selezionati.",
    },
    en: {
      title: "Snus & Nicotine Pouch Brands in Italy | Pouchesitaly",
      description:
        "Discover leading nicotine pouch brands in Italy, including ZYN, VELO, CUBA, and other carefully selected options.",
    },
  },
  "/snus-cose": {
    it: {
      title: "Cosa Sono le Nicotine Pouches | Pouchesitaly",
      description:
        "Tutto quello che devi sapere sulle nicotine pouches: cosa sono, come funzionano e perche sempre piu italiani le scelgono.",
    },
    en: {
      title: "What Are Nicotine Pouches? | Pouchesitaly",
      description:
        "Learn what nicotine pouches are, how they work, and why tobacco-free formats are growing in Italy.",
    },
  },
  "/spedizione-snus": {
    it: {
      title: "Spedizione in Italia — Tempi e Costi | Pouchesitaly",
      description:
        "Spediamo le nicotine pouches in tutta Italia in 2-4 giorni lavorativi. Scopri costi di spedizione e tracciamento ordine.",
    },
    en: {
      title: "Shipping to Italy — Delivery Times & Costs | Pouchesitaly",
      description:
        "Learn shipping costs, delivery times, and order tracking for nicotine pouch orders across Italy.",
    },
  },
  "/perche-scegliere-pouchesitaly": {
    it: {
      title: "Perche Scegliere Pouchesitaly",
      description:
        "Scopri perche migliaia di clienti scelgono Pouchesitaly: prodotti premium tobacco-free, spedizione rapida e assistenza clienti.",
    },
    en: {
      title: "Why Choose Pouchesitaly",
      description:
        "Discover why customers choose Pouchesitaly for premium nicotine pouches, fast shipping in Italy, and competitive pricing.",
    },
  },
  "/guida-intensita-gusti": {
    it: {
      title: "Guida Intensita e Gusti | Pouchesitaly",
      description:
        "Trova l'intensita e il gusto perfetti per le tue esigenze con la nostra guida alle nicotine pouches.",
    },
    en: {
      title: "Strengths and Flavors Guide | Pouchesitaly",
      description:
        "Find the best nicotine strength and flavor profile for your preferences with our guide.",
    },
  },
  "/snus-vs-nicotine-pouches": {
    it: {
      title: "Snus vs Nicotine Pouches: Differenze | Pouchesitaly",
      description:
        "Qual e la differenza tra snus e nicotine pouches? Confronto su legalita, ingredienti e profili di rischio.",
    },
    en: {
      title: "Snus vs Nicotine Pouches | Pouchesitaly",
      description:
        "Compare traditional snus and modern nicotine pouches, including legality, ingredients, and risk profiles.",
    },
  },
  "/domande-frequenti-snus": {
    it: {
      title: "Domande Frequenti sullo Snus | Pouchesitaly",
      description:
        "Risposte alle domande piu comuni sullo snus e le bustine di nicotina.",
    },
    en: {
      title: "Snus FAQ | Pouchesitaly",
      description:
        "Answers to common questions about snus, nicotine pouches, legality, and shipping in Italy.",
    },
  },
};

const FAQ_ENTRIES = {
  homeFaq: {
    it: [
      ["Come funzionano le nicotine pouches?", "Le nicotine pouches si posizionano tra il labbro e la gengiva. La nicotina viene assorbita attraverso il tessuto gengivale."],
      ["Quanto tempo richiede la spedizione?", "I tempi di consegna in Italia sono in genere: Nord 1-2 giorni, Centro 1-3 giorni, Sud 2-4 giorni, Isole 3-5 giorni."],
      ["La spedizione e davvero gratuita?", "La spedizione gratuita e disponibile in Italia per ordini pari o superiori a EUR100. Per importi inferiori, il costo viene calcolato al checkout."],
    ],
    en: [
      ["How do nicotine pouches work?", "Nicotine pouches are placed between your lip and gum. The nicotine is absorbed through the gum tissue, providing a smoke-free nicotine experience."],
      ["How long does shipping take?", "Delivery times in Italy are typically: North 1-2 days, Central 1-3 days, South 2-4 days, and Islands 3-5 days."],
      ["Is shipping really free?", "Free shipping is available in Italy for orders of EUR100 or more. For lower totals, shipping is calculated at checkout."],
    ],
  },
  faqPage: {
    it: [
      ["Quanto tempo ci vuole per ricevere l'ordine?", "Spediamo dalla nostra sede in 1-2 giorni lavorativi. La consegna in Italia richiede solitamente altri 1-2 giorni lavorativi."],
      ["Spedite in tutta Italia?", "Si. Spediamo su tutto il territorio italiano, incluse Sicilia, Sardegna e isole minori."],
      ["Le nicotine pouches sono legali in Italia?", "Si. Le nicotine pouches senza tabacco sono legali in Italia."],
      ["Quali metodi di pagamento accettate?", "Accettiamo le principali carte di credito e debito, PayPal e altri metodi di pagamento digitale."],
    ],
    en: [
      ["What are nicotine pouches?", "Nicotine pouches are small, discreet pouches containing nicotine, plant fiber, and flavorings, but no tobacco."],
      ["How do I use nicotine pouches?", "Take one pouch from the container and place it between your upper lip and gum for 20-60 minutes."],
      ["Do I need to create an account to order?", "No. You can complete your purchase as a guest in just a few minutes."],
      ["Can I track my order?", "Yes. You will receive an email with a tracking number once your order ships."],
    ],
  },
  shippingFaq: {
    it: [
      ["Quando vengono elaborati gli ordini?", "Gli ordini vengono elaborati alle 09:00 dal lunedi al venerdi, esclusi i festivi aziendali."],
      ["Quanto costa la spedizione in Italia?", "EUR6,90 per ordini sotto EUR100. Da EUR100 in su la spedizione e gratuita."],
      ["In quanto tempo arriva il pacco?", "Generalmente 1-5 giorni lavorativi in base alla zona di consegna."],
    ],
    en: [
      ["When are orders processed?", "Orders are processed at 9:00 AM Monday to Friday, excluding company holidays."],
      ["How much is shipping in Italy?", "EUR6.90 for orders below EUR100. Shipping is free from EUR100 and above."],
      ["How long does delivery take?", "Usually 1-5 business days depending on delivery area."],
    ],
  },
  zynFaq: {
    it: [
      ["Quale intensita ZYN scegliere se sono all'inizio?", "Se sei all'inizio, scegli una gradazione piu bassa e aumenta gradualmente solo se necessario."],
      ["ZYN e disponibile con spedizione in tutta Italia?", "Si, spediamo in tutta Italia con tracking. Spedizione gratuita da EUR100."],
      ["Quanto tempo impiega la consegna ZYN?", "In media 1-5 giorni lavorativi in base alla zona."],
    ],
    en: [
      ["Which ZYN strength is best for beginners?", "If you are new, start with a lower strength and only move up if needed."],
      ["Is ZYN shipped across all of Italy?", "Yes, we ship across Italy with tracking. Free shipping from EUR100."],
      ["How long does ZYN delivery take?", "Usually 1-5 business days depending on region."],
    ],
  },
  veloFaq: {
    it: [
      ["VELO e adatto a utenti nuovi?", "Si, consigliamo di partire con livelli di nicotina piu bassi e passare gradualmente a intensita superiori."],
      ["Qual e la differenza tra VELO e ZYN?", "Entrambi sono marchi premium; variano soprattutto per gusti, sensazione e profilo di intensita disponibile."],
      ["Quanto costa la spedizione per VELO in Italia?", "EUR6,90 sotto EUR100 e gratuita da EUR100 in su."],
    ],
    en: [
      ["Is VELO suitable for new users?", "Yes, we recommend starting with lower nicotine strengths and moving up only if needed."],
      ["What is the difference between VELO and ZYN?", "Both are premium brands; differences are mainly flavor profiles, sensation, and available strength ranges."],
      ["What is shipping cost for VELO in Italy?", "EUR6.90 below EUR100 and free from EUR100 and above."],
    ],
  },
};

function normalizeBranding(value) {
  return value?.replace(/NicoXpress/gi, "Pouchesitaly") ?? null;
}

function canonicalPathFor(basePath, locale) {
  if (locale === "it") {
    return basePath;
  }

  return basePath === "/" ? "/en" : `/en${basePath}`;
}

function absoluteUrlForPath(pathname) {
  return `${BASE_URL}${pathname}`;
}

function humanizePath(pathname) {
  const lastSegment = pathname === "/" ? "home" : pathname.split("/").filter(Boolean).at(-1);
  return String(lastSegment)
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  return date.toISOString().slice(0, 10);
}

function formatPrice(value) {
  return Number(value).toFixed(2);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toJsonLd(value) {
  return JSON.stringify(value).replace(/<\//g, "<\\/");
}

function resolveImageUrl(value) {
  if (!value) {
    return DEFAULT_IMAGE;
  }
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `${BASE_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "PouchesItaly",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: "Negozio online di bustine di nicotina premium in Italia",
    address: {
      "@type": "PostalAddress",
      addressCountry: "SE",
      addressLocality: "Stockholm",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Italian", "English"],
    },
  };
}

function buildWebsiteSchema(locale) {
  return {
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Pouchesitaly",
    inLanguage: locale === "it" ? "it-IT" : "en-US",
    publisher: { "@id": `${BASE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function buildFaqPageSchema(entries) {
  return {
    "@type": "FAQPage",
    mainEntity: entries.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

function buildProductSchema({ product, description, image, canonicalUrl }) {
  const offerPrices = PACK_OPTIONS.map((option) =>
    Number(product.price) * option.size * (1 - option.discount),
  );

  return {
    "@type": "Product",
    sku: String(product.id),
    url: canonicalUrl,
    name: product.name,
    description,
    image,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: formatPrice(Math.min(...offerPrices)),
      highPrice: formatPrice(Math.max(...offerPrices)),
      offerCount: offerPrices.length,
      availability:
        Number(product.stock_count ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}

function buildBreadcrumbSchema({ product, locale, canonicalUrl }) {
  const localePrefix = locale === "en" ? "/en" : "";

  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrlForPath(locale === "en" ? "/en" : "/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.brand,
        item: absoluteUrlForPath(`${localePrefix}/premium-brands`),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: canonicalUrl,
      },
    ],
  };
}

function getStructuredDataForRoute(route) {
  if (route.type === "product") {
    return [
      buildProductSchema({
        product: route.product,
        description: route.description,
        image: route.image,
        canonicalUrl: route.canonicalUrl,
      }),
      buildBreadcrumbSchema({
        product: route.product,
        locale: route.locale,
        canonicalUrl: route.canonicalUrl,
      }),
    ];
  }

  const schemaKey = ROUTE_OVERRIDES[route.basePath]?.schemaKey;

  if (!schemaKey) {
    return [];
  }

  return [buildFaqPageSchema(FAQ_ENTRIES[schemaKey][route.locale])];
}

function getMetadataFallback(basePath, locale) {
  const override = ROUTE_OVERRIDES[basePath]?.[locale];

  if (override) {
    return override;
  }

  return {
    title: `${humanizePath(basePath)} | Pouchesitaly`,
    description: SITE_DEFAULTS[locale].description,
  };
}

function buildMetadataByKey(rows) {
  return new Map(
    rows.map((row) => [
      `${row.page_path}:${row.language}`,
      {
        title: normalizeBranding(row.title),
        description: normalizeBranding(row.meta_description),
        ogTitle: normalizeBranding(row.og_title),
        ogDescription: normalizeBranding(row.og_description),
        image: row.og_image || null,
        keywords: normalizeBranding(row.keywords),
      },
    ]),
  );
}

function getHeadContent({ route, metadataByKey }) {
  if (route.type === "product") {
    const productTitle = `${route.product.name} | ${route.product.brand} Nicotine Pouches | Pouchesitaly`;

    return {
      title: productTitle,
      description: route.description,
      ogTitle: productTitle,
      ogDescription: route.description,
      image: route.image || DEFAULT_IMAGE,
      keywords: DEFAULT_KEYWORDS,
    };
  }

  const fallback = getMetadataFallback(route.basePath, route.locale);
  const metadata = metadataByKey.get(`${route.basePath}:${route.locale}`);
  const defaults = SITE_DEFAULTS[route.locale];
  const title = fallback.title || metadata?.title || defaults.title;
  const description = fallback.description || metadata?.description || defaults.description;

  return {
    title,
    description,
    ogTitle: metadata?.ogTitle || title,
    ogDescription: metadata?.ogDescription || description,
    image: metadata?.image || route.image || DEFAULT_IMAGE,
    keywords: metadata?.keywords || DEFAULT_KEYWORDS,
  };
}

function extractPreservedHeadTags(templateHtml) {
  const headMatch = templateHtml.match(/<head>([\s\S]*?)<\/head>/i);

  if (!headMatch) {
    throw new Error("Unable to read built head markup.");
  }

  return (
    headMatch[1].match(
      /<link[^>]+href="[^"]*(?:\/assets\/|favicon\.ico|logo\.png|og-image\.png|socialshare\.png)[^"]*"[^>]*>|<script[^>]+src="[^"]*\/assets\/[^"]+"[^>]*><\/script>/gi,
    ) ?? []
  );
}

function buildHeadHtml({ route, metadataByKey, preservedHeadTags }) {
  const head = getHeadContent({ route, metadataByKey });
  const alternateItalian = absoluteUrlForPath(canonicalPathFor(route.basePath, "it"));
  const alternateEnglish = absoluteUrlForPath(canonicalPathFor(route.basePath, "en"));
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationSchema(),
      buildWebsiteSchema(route.locale),
      ...getStructuredDataForRoute(route),
    ],
  };

  return `  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(head.title)}</title>
    <meta name="description" content="${escapeHtml(head.description)}" />
    <meta name="author" content="Pouchesitaly" />
    <meta name="keywords" content="${escapeHtml(head.keywords)}" />
    <meta name="robots" content="index, follow" />
    <meta name="geo.region" content="IT" />
    <meta name="geo.placename" content="Italy" />
    <link rel="canonical" href="${escapeHtml(route.canonicalUrl)}" />
    <link rel="alternate" hreflang="it" href="${escapeHtml(alternateItalian)}" />
    <link rel="alternate" hreflang="en" href="${escapeHtml(alternateEnglish)}" />
    <link rel="alternate" hreflang="x-default" href="${escapeHtml(alternateItalian)}" />
    <meta property="og:title" content="${escapeHtml(head.ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(head.ogDescription)}" />
    <meta property="og:type" content="${route.type === "product" ? "product" : "website"}" />
    <meta property="og:url" content="${escapeHtml(route.canonicalUrl)}" />
    <meta property="og:image" content="${escapeHtml(head.image)}" />
    <meta property="og:site_name" content="Pouchesitaly" />
    <meta property="og:locale" content="${route.locale === "it" ? "it_IT" : "en_US"}" />
    <meta property="og:locale:alternate" content="${route.locale === "it" ? "en_US" : "it_IT"}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@Pouchesitaly" />
    <meta name="twitter:creator" content="@Pouchesitaly" />
    <meta name="twitter:title" content="${escapeHtml(head.ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(head.ogDescription)}" />
    <meta name="twitter:image" content="${escapeHtml(head.image)}" />
    <script type="application/ld+json" id="seo-structured-data">${toJsonLd(graph)}</script>
    ${preservedHeadTags.join("\n    ")}
  </head>`;
}

function renderHtml(templateHtml, { lang, headHtml }) {
  return templateHtml
    .replace(/<html[^>]*lang="[^"]*"[^>]*>/i, `<html lang="${lang}">`)
    .replace(/<head>[\s\S]*?<\/head>/i, headHtml);
}

function routeToFilePath(routePath) {
  if (routePath === "/") {
    return path.join(DIST_DIR, "index.html");
  }

  return path.join(DIST_DIR, ...routePath.split("/").filter(Boolean), "index.html");
}

async function writeRouteHtml(routePath, html) {
  const filePath = routeToFilePath(routePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, html, "utf8");
}

function buildSitemapXml(routes) {
  const items = routes
    .sort((a, b) => a.publicPath.localeCompare(b.publicPath))
    .map(
      (route) => `  <url>
    <loc>${escapeHtml(route.canonicalUrl)}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>
`;
}

function buildNotFoundHtml(preservedHeadTags) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>404 | Pouchesitaly</title>
    <meta name="description" content="The page you are looking for could not be found." />
    <meta name="robots" content="noindex, nofollow" />
    ${preservedHeadTags.join("\n    ")}
  </head>
  <body style="margin:0;font-family:system-ui,-apple-system,sans-serif;background:#f5f3ee;color:#19202b;">
    <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;">
      <section style="max-width:560px;text-align:center;background:#ffffff;border:1px solid rgba(25,32,43,0.08);border-radius:24px;padding:40px 32px;box-shadow:0 24px 60px -40px rgba(25,32,43,0.35);">
        <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#4f916d;">Pouchesitaly</p>
        <h1 style="margin:0 0 12px;font-size:40px;line-height:1.1;">404</h1>
        <p style="margin:0 0 24px;font-size:18px;line-height:1.6;color:#5d6677;">The page you requested does not exist or is no longer available.</p>
        <a href="/" style="display:inline-block;padding:14px 24px;border-radius:999px;background:#4f916d;color:#ffffff;font-weight:700;text-decoration:none;">Return to Home</a>
      </section>
    </main>
  </body>
</html>
`;
}

function isExcludedCmsPage(page) {
  return /test/i.test(page.slug) || /test/i.test(page.title || "");
}

async function loadSupabaseData() {
  const clientSource = await fs.readFile(SUPABASE_CLIENT_FILE, "utf8");
  const url = clientSource.match(/SUPABASE_URL = "([^"]+)"/)?.[1];
  const key = clientSource.match(/SUPABASE_PUBLISHABLE_KEY = "([^"]+)"/)?.[1];

  if (!url || !key) {
    throw new Error("Unable to read Supabase credentials from client.ts");
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const [{ data: metadata, error: metadataError }, { data: products, error: productsError }, { data: pages, error: pagesError }] =
    await Promise.all([
      supabase.from("page_metadata").select("*"),
      supabase.from("products").select("*").eq("is_active", true),
      supabase.from("pages").select("*").eq("status", "published"),
    ]);

  if (metadataError) throw metadataError;
  if (productsError) throw productsError;
  if (pagesError) throw pagesError;

  return {
    metadata: metadata ?? [],
    products: products ?? [],
    pages: pages ?? [],
  };
}

function buildStaticRoutes() {
  return PUBLIC_STATIC_PATHS.flatMap((basePath) =>
    ["it", "en"].map((locale) => ({
      type: "static",
      locale,
      basePath,
      publicPath: canonicalPathFor(basePath, locale),
      canonicalUrl: absoluteUrlForPath(canonicalPathFor(basePath, locale)),
      lastmod: formatDate(),
      changefreq: basePath === "/" ? "daily" : "monthly",
      priority: basePath === "/" ? 1.0 : 0.8,
      image: DEFAULT_IMAGE,
    })),
  );
}

function buildProductRoutes(products) {
  return products.flatMap((product) =>
    ["it", "en"].map((locale) => {
      const basePath = `/product/${product.id}`;
      const publicPath = canonicalPathFor(basePath, locale);
      const description =
        locale === "it"
          ? product.description_it ||
            `Acquista ${product.name} di ${product.brand}. Spedizione in Italia e packaging discreto.`
          : product.description ||
            `Buy ${product.name} by ${product.brand}. Fast shipping in Italy and discreet packaging.`;

      return {
        type: "product",
        locale,
        basePath,
        publicPath,
        canonicalUrl: absoluteUrlForPath(publicPath),
        lastmod: formatDate(product.updated_at),
        changefreq: "weekly",
        priority: 0.7,
        image: resolveImageUrl(product.image),
        description,
        product,
      };
    }),
  );
}

function buildCmsRoutes(pages) {
  return pages
    .filter((page) => !isExcludedCmsPage(page))
    .map((page) => {
      const locale = page.language === "en" ? "en" : "it";
      const basePath = `/p/${page.slug}`;
      const publicPath = canonicalPathFor(basePath, locale);

      return {
        type: "cms",
        locale,
        basePath,
        publicPath,
        canonicalUrl: absoluteUrlForPath(publicPath),
        lastmod: formatDate(page.updated_at),
        changefreq: "monthly",
        priority: 0.6,
        image: DEFAULT_IMAGE,
      };
    });
}

async function main() {
  const templateHtml = await fs.readFile(path.join(DIST_DIR, "index.html"), "utf8");
  const preservedHeadTags = extractPreservedHeadTags(templateHtml);
  const { metadata, products, pages } = await loadSupabaseData();
  const metadataByKey = buildMetadataByKey(metadata);
  const routes = [
    ...buildStaticRoutes(),
    ...buildProductRoutes(products),
    ...buildCmsRoutes(pages),
  ];

  for (const route of routes) {
    const headHtml = buildHeadHtml({ route, metadataByKey, preservedHeadTags });
    const html = renderHtml(templateHtml, {
      lang: route.locale === "it" ? "it" : "en",
      headHtml,
    });
    await writeRouteHtml(route.publicPath, html);
  }

  await fs.writeFile(path.join(DIST_DIR, "sitemap.xml"), buildSitemapXml(routes), "utf8");
  await fs.writeFile(path.join(DIST_DIR, "404.html"), buildNotFoundHtml(preservedHeadTags), "utf8");
  console.log(`SEO postbuild complete: wrote ${routes.length} routes, sitemap.xml, and 404.html`);
}

main().catch((error) => {
  console.error("SEO postbuild failed.");
  console.error(error);
  process.exit(1);
});
