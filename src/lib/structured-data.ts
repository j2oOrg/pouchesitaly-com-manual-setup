const BASE_URL = "https://pouchesitaly.com";

export interface FAQStructuredDataEntry {
  question: string;
  answer: string;
}

interface StructuredDataOptions {
  withContext?: boolean;
}

interface ProductStructuredDataInput {
  name: string;
  description: string;
  image: string | string[];
  brand: string;
  offerPrices: number[];
  availability?: string;
  sku?: string;
  url?: string;
}

const withContext = (enabled?: boolean) =>
  enabled ? { "@context": "https://schema.org" } : {};

const formatPrice = (value: number) => value.toFixed(2);

export function buildOrganizationStructuredData(options: StructuredDataOptions = {}) {
  return {
    ...withContext(options.withContext),
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

export function buildFAQPageStructuredData(
  entries: FAQStructuredDataEntry[],
  options: StructuredDataOptions = {}
) {
  return {
    ...withContext(options.withContext),
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

export function buildProductStructuredData(
  input: ProductStructuredDataInput,
  options: StructuredDataOptions = {}
) {
  const normalizedPrices = input.offerPrices.filter((price) => Number.isFinite(price) && price > 0);
  const lowPrice = normalizedPrices.length > 0 ? Math.min(...normalizedPrices) : 0;
  const highPrice = normalizedPrices.length > 0 ? Math.max(...normalizedPrices) : 0;

  return {
    ...withContext(options.withContext),
    "@type": "Product",
    ...(input.sku ? { sku: input.sku } : {}),
    ...(input.url ? { url: input.url } : {}),
    name: input.name,
    description: input.description,
    image: input.image,
    brand: {
      "@type": "Brand",
      name: input.brand,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: formatPrice(lowPrice),
      highPrice: formatPrice(highPrice),
      offerCount: normalizedPrices.length,
      availability: input.availability || "https://schema.org/InStock",
    },
  };
}
