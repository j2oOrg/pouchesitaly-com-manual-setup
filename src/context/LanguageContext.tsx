import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'it';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    home: 'Home',
    products: 'Products',
    brands: 'Brands',
    shipping: 'Shipping',
    faq: 'FAQ',
    cart: 'Cart',
    
    // Hero
    qualityBrands: 'QUALITY BRANDS.',
    competitivePrices: 'COMPETITIVE PRICES.',
    fastCheckout: 'FAST CHECKOUT. NO SIGN-UP REQUIRED.',
    
    // Info Banner
    freeShipping: 'Free Shipping',
    freeShippingDesc: 'On all orders worldwide',
    discreetPackaging: 'Discreet Packaging',
    discreetPackagingDesc: 'Plain unmarked boxes',
    noSignUp: 'No Sign-Up Required',
    noSignUpDesc: 'Fast checkout process',
    
    // Products
    allProducts: 'All Products',
    filters: 'Filters',
    brand: 'Brand',
    strength: 'Strength',
    flavor: 'Flavor',
    clearFilters: 'Clear All Filters',
    addToCart: 'Add to Cart',
    
    // Pack Options
    cans: 'cans',
    save: 'SAVE',
    
    // Delivery
    deliveryTimeframes: 'Delivery Timeframes',
    europe: 'Europe',
    europeDays: '7-10 days',
    europeDesc: 'Fast delivery across all EU countries',
    northAmerica: 'North America',
    northAmericaDays: '10-14 days',
    northAmericaDesc: 'Reliable shipping to USA & Canada',
    asiaOceania: 'Asia & Oceania',
    asiaOceaniaDays: '12-18 days',
    asiaOceaniaDesc: 'Shipping to Australia, Japan & more',
    restOfWorld: 'Rest of World',
    restOfWorldDays: '14-21 days',
    restOfWorldDesc: 'Global coverage to all other regions',
    deliveryDisclaimer: '*Delivery times may vary depending on customs clearance and local postal services.',
    
    // Learn More
    learnMore: 'Learn More',
    premiumNicotineBrands: 'Premium Nicotine Brands',
    premiumNicotineBrandsDesc: 'Discover our selection of leading nicotine pouch brands including ZYN, VELO, and LYFT.',
    worldwideShippingInfo: 'Worldwide Shipping Info',
    worldwideShippingDesc: 'Free worldwide delivery on all orders. Fast, discreet shipping to your door.',
    whyChooseUs: 'Why Choose Pouchesitaly',
    whyChooseUsDesc: 'No sign-up required. Fast checkout. Premium brands at competitive prices.',
    strengthsGuide: 'Nicotine Strengths Guide',
    strengthsGuideDesc: 'From regular to extra strong - find the perfect nicotine level for you.',
    tobaccoFree: 'Tobacco-Free Products',
    tobaccoFreeDesc: 'All our nicotine pouches are 100% tobacco-free for a cleaner experience.',
    faqTitle: 'Frequently Asked Questions',
    faqDesc: 'Get answers to common questions about ordering, shipping, and products.',
    
    // Premium Brands Page
    premiumBrandsTitle: 'Premium Nicotine Brands',
    premiumBrandsIntro: 'Discover our carefully curated selection of the world\'s leading nicotine pouch brands. We stock only the highest quality products from trusted manufacturers.',
    zynTitle: 'ZYN - The Market Leader',
    zynDesc: 'ZYN is one of the most popular nicotine pouch brands globally. Known for their consistent quality and wide variety of flavors, ZYN offers products in multiple strength levels to suit every preference. From refreshing mint to bold coffee flavors, ZYN delivers a premium tobacco-free experience.',
    zynFeature1: 'Available in 3mg, 6mg, and 9mg nicotine strengths',
    zynFeature2: 'Over 15 unique flavor profiles',
    zynFeature3: 'Slim, discreet pouches for comfortable all-day use',
    zynFeature4: 'Made with pharmaceutical-grade ingredients',
    veloTitle: 'VELO - Innovation & Variety',
    veloDesc: 'VELO, formerly known as EPOK, is at the forefront of nicotine pouch innovation. Their products feature a unique formula that delivers nicotine smoothly and consistently. VELO is known for bold, intense flavors that stand out from competitors.',
    veloFeature1: 'Ranges from 4mg to 15mg nicotine content',
    veloFeature2: 'Innovative "Freeze" technology for cooling sensations',
    veloFeature3: 'Wide variety including mint, fruit, and specialty flavors',
    veloFeature4: 'Patented moisture retention for longer-lasting pouches',
    lyftTitle: 'LYFT - Scandinavian Quality',
    lyftDesc: 'LYFT brings authentic Scandinavian craftsmanship to the nicotine pouch market. With a focus on natural ingredients and sustainable production, LYFT offers a premium experience for those who value quality and environmental responsibility.',
    lyftFeature1: 'Available in 6mg, 10mg, and 15mg strengths',
    lyftFeature2: 'Eco-friendly packaging and sustainable production',
    lyftFeature3: 'Clean, natural flavor profiles',
    lyftFeature4: 'Soft, comfortable pouches for extended wear',
    readyToShop: 'Ready to Shop?',
    browseSelection: 'Browse our complete selection of premium nicotine pouches',
    viewAllProducts: 'View All Products',
    
    // Shipping Info Page
    shippingInfoTitle: 'Worldwide Shipping Information',
    shippingInfoIntro: 'We deliver premium nicotine pouches to customers worldwide with fast, discreet, and reliable shipping.',
    globalCoverage: 'Global Coverage',
    globalCoverageDesc: 'We ship to over 100 countries worldwide, including all of Europe, North America, Asia, and Australia.',
    discreetPackagingTitle: 'Discreet Packaging',
    discreetPackagingLong: 'All orders are shipped in plain, unmarked packaging with no indication of contents for your privacy.',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'Most orders are processed within 24 hours and shipped via reliable international carriers.',
    freeShippingTitle: 'Free Shipping',
    freeShippingLong: 'Enjoy free shipping on all orders worldwide - no minimum purchase required.',
    deliveryTimeframesTitle: 'Delivery Timeframes',
    region: 'Region',
    estimatedDelivery: 'Estimated Delivery',
    businessDays: 'business days',
    trackingTitle: 'Tracking Your Order',
    trackingDesc: 'Once your order ships, you\'ll receive a tracking number via email. You can use this number to monitor your shipment\'s progress on the carrier\'s website.',
    readyToOrder: 'Ready to Order?',
    shopNowCta: 'Shop now and enjoy free worldwide shipping',
    shopNow: 'Shop Now',
    
    // Quick FAQ
    faqQuestion1: 'How do nicotine pouches work?',
    faqAnswer1: 'Nicotine pouches are placed between your lip and gum. The nicotine is absorbed through the gum tissue, providing a smoke-free, spit-free nicotine experience.',
    faqQuestion2: 'How long does shipping take?',
    faqAnswer2: 'Shipping times vary by location: Europe 7-10 days, North America 10-14 days, Asia & Oceania 12-18 days, Rest of World 14-21 days.',
    faqQuestion3: 'Is shipping really free?',
    faqAnswer3: 'Yes! We offer free worldwide shipping on all orders with no minimum purchase required. Your order will be shipped in discreet, unmarked packaging.',
    viewAllFaqs: 'View all FAQs',
    
    // Footer
    aboutUs: 'About Us',
    aboutUsDesc: 'Pouchesitaly is your trusted source for premium nicotine pouches from leading brands worldwide.',
    quickLinks: 'Quick Links',
    customerService: 'Customer Service',
    contactUs: 'Contact Us',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    legal: 'Legal',
    ageDisclaimer: 'Must be 18+ to purchase. Products contain nicotine.',
    returns: 'Returns',
    allRightsReserved: 'All rights reserved.',
    
    // Cart
    yourCart: 'Your Cart',
    emptyCart: 'Your cart is empty',
    total: 'Total',
    checkout: 'Checkout',
    remove: 'Remove',
    
    // Checkout
    shippingDetails: 'Shipping Details',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    postalCode: 'Postal Code',
    country: 'Country',
    placeOrder: 'Place Order',
    orderComplete: 'Order Complete!',
    orderConfirmation: 'Thank you for your order. You will receive a confirmation email shortly.',
  },
  it: {
    // Header
    home: 'Home',
    products: 'Prodotti',
    brands: 'Marchi',
    shipping: 'Spedizione',
    faq: 'FAQ',
    cart: 'Carrello',
    
    // Hero
    qualityBrands: 'MARCHI DI QUALITÀ.',
    competitivePrices: 'PREZZI COMPETITIVI.',
    fastCheckout: 'CHECKOUT VELOCE. NESSUNA REGISTRAZIONE.',
    
    // Info Banner
    freeShipping: 'Spedizione Gratuita',
    freeShippingDesc: 'Su tutti gli ordini nel mondo',
    discreetPackaging: 'Imballaggio Discreto',
    discreetPackagingDesc: 'Scatole anonime',
    noSignUp: 'Nessuna Registrazione',
    noSignUpDesc: 'Checkout rapido',
    
    // Products
    allProducts: 'Tutti i Prodotti',
    filters: 'Filtri',
    brand: 'Marchio',
    strength: 'Intensità',
    flavor: 'Gusto',
    clearFilters: 'Cancella Filtri',
    addToCart: 'Aggiungi al Carrello',
    
    // Pack Options
    cans: 'lattine',
    save: 'RISPARMIA',
    
    // Delivery
    deliveryTimeframes: 'Tempi di Consegna',
    europe: 'Europa',
    europeDays: '7-10 giorni',
    europeDesc: 'Consegna rapida in tutti i paesi UE',
    northAmerica: 'Nord America',
    northAmericaDays: '10-14 giorni',
    northAmericaDesc: 'Spedizione affidabile in USA e Canada',
    asiaOceania: 'Asia e Oceania',
    asiaOceaniaDays: '12-18 giorni',
    asiaOceaniaDesc: 'Spedizione in Australia, Giappone e altro',
    restOfWorld: 'Resto del Mondo',
    restOfWorldDays: '14-21 giorni',
    restOfWorldDesc: 'Copertura globale in tutte le altre regioni',
    deliveryDisclaimer: '*I tempi di consegna possono variare a seconda dello sdoganamento e dei servizi postali locali.',
    
    // Learn More
    learnMore: 'Scopri di Più',
    premiumNicotineBrands: 'Marchi Premium di Nicotina',
    premiumNicotineBrandsDesc: 'Scopri la nostra selezione dei principali marchi di nicotine pouches tra cui ZYN, VELO e LYFT.',
    worldwideShippingInfo: 'Info Spedizione Mondiale',
    worldwideShippingDesc: 'Consegna gratuita in tutto il mondo su tutti gli ordini. Spedizione veloce e discreta.',
    whyChooseUs: 'Perché Scegliere Pouchesitaly',
    whyChooseUsDesc: 'Nessuna registrazione richiesta. Checkout veloce. Marchi premium a prezzi competitivi.',
    strengthsGuide: 'Guida alle Intensità',
    strengthsGuideDesc: 'Da regular a extra strong - trova il livello di nicotina perfetto per te.',
    tobaccoFree: 'Prodotti Senza Tabacco',
    tobaccoFreeDesc: 'Tutte le nostre nicotine pouches sono 100% senza tabacco per un\'esperienza più pulita.',
    faqTitle: 'Domande Frequenti',
    faqDesc: 'Risposte alle domande comuni su ordini, spedizione e prodotti.',
    
    // Premium Brands Page
    premiumBrandsTitle: 'Marchi Premium di Nicotina',
    premiumBrandsIntro: 'Scopri la nostra selezione accuratamente curata dei principali marchi mondiali di nicotine pouches. Offriamo solo prodotti di altissima qualità da produttori affidabili.',
    zynTitle: 'ZYN - Il Leader del Mercato',
    zynDesc: 'ZYN è uno dei marchi di nicotine pouches più popolari al mondo. Conosciuto per la qualità costante e l\'ampia varietà di gusti, ZYN offre prodotti in diversi livelli di intensità per soddisfare ogni preferenza. Dalla menta rinfrescante ai gusti intensi di caffè, ZYN offre un\'esperienza premium senza tabacco.',
    zynFeature1: 'Disponibile in intensità di 3mg, 6mg e 9mg',
    zynFeature2: 'Oltre 15 profili di gusto unici',
    zynFeature3: 'Bustine slim e discrete per un comfort tutto il giorno',
    zynFeature4: 'Realizzato con ingredienti di grado farmaceutico',
    veloTitle: 'VELO - Innovazione e Varietà',
    veloDesc: 'VELO, precedentemente noto come EPOK, è all\'avanguardia nell\'innovazione delle nicotine pouches. I loro prodotti presentano una formula unica che rilascia la nicotina in modo fluido e costante. VELO è noto per i gusti audaci e intensi che si distinguono dalla concorrenza.',
    veloFeature1: 'Da 4mg a 15mg di contenuto di nicotina',
    veloFeature2: 'Tecnologia innovativa "Freeze" per sensazioni rinfrescanti',
    veloFeature3: 'Ampia varietà tra cui menta, frutta e gusti speciali',
    veloFeature4: 'Ritenzione brevettata dell\'umidità per bustine più durature',
    lyftTitle: 'LYFT - Qualità Scandinava',
    lyftDesc: 'LYFT porta l\'autentica maestria scandinava nel mercato delle nicotine pouches. Con un focus su ingredienti naturali e produzione sostenibile, LYFT offre un\'esperienza premium per chi apprezza qualità e responsabilità ambientale.',
    lyftFeature1: 'Disponibile in intensità di 6mg, 10mg e 15mg',
    lyftFeature2: 'Packaging eco-friendly e produzione sostenibile',
    lyftFeature3: 'Profili di gusto puliti e naturali',
    lyftFeature4: 'Bustine morbide e confortevoli per un uso prolungato',
    readyToShop: 'Pronto per Acquistare?',
    browseSelection: 'Sfoglia la nostra selezione completa di nicotine pouches premium',
    viewAllProducts: 'Vedi Tutti i Prodotti',
    
    // Shipping Info Page
    shippingInfoTitle: 'Informazioni sulla Spedizione Mondiale',
    shippingInfoIntro: 'Consegniamo nicotine pouches premium a clienti in tutto il mondo con spedizione veloce, discreta e affidabile.',
    globalCoverage: 'Copertura Globale',
    globalCoverageDesc: 'Spediamo in oltre 100 paesi in tutto il mondo, inclusi tutta Europa, Nord America, Asia e Australia.',
    discreetPackagingTitle: 'Imballaggio Discreto',
    discreetPackagingLong: 'Tutti gli ordini vengono spediti in imballaggi anonimi senza indicazione del contenuto per la tua privacy.',
    fastDelivery: 'Consegna Veloce',
    fastDeliveryDesc: 'La maggior parte degli ordini viene elaborata entro 24 ore e spedita tramite corrieri internazionali affidabili.',
    freeShippingTitle: 'Spedizione Gratuita',
    freeShippingLong: 'Goditi la spedizione gratuita su tutti gli ordini in tutto il mondo - nessun acquisto minimo richiesto.',
    deliveryTimeframesTitle: 'Tempi di Consegna',
    region: 'Regione',
    estimatedDelivery: 'Consegna Stimata',
    businessDays: 'giorni lavorativi',
    trackingTitle: 'Tracciamento del Tuo Ordine',
    trackingDesc: 'Una volta spedito il tuo ordine, riceverai un numero di tracciamento via email. Puoi usare questo numero per monitorare l\'avanzamento della spedizione sul sito del corriere.',
    readyToOrder: 'Pronto per Ordinare?',
    shopNowCta: 'Acquista ora e goditi la spedizione gratuita in tutto il mondo',
    shopNow: 'Acquista Ora',
    
    // Quick FAQ
    faqQuestion1: 'Come funzionano le nicotine pouches?',
    faqAnswer1: 'Le nicotine pouches si posizionano tra il labbro e la gengiva. La nicotina viene assorbita attraverso il tessuto gengivale, offrendo un\'esperienza di nicotina senza fumo e senza sputo.',
    faqQuestion2: 'Quanto tempo richiede la spedizione?',
    faqAnswer2: 'I tempi di spedizione variano in base alla località: Europa 7-10 giorni, Nord America 10-14 giorni, Asia e Oceania 12-18 giorni, Resto del Mondo 14-21 giorni.',
    faqQuestion3: 'La spedizione è davvero gratuita?',
    faqAnswer3: 'Sì! Offriamo spedizione gratuita in tutto il mondo su tutti gli ordini senza un acquisto minimo richiesto. Il tuo ordine verrà spedito in un imballaggio discreto e anonimo.',
    viewAllFaqs: 'Vedi tutte le FAQ',
    
    // Footer
    aboutUs: 'Chi Siamo',
    aboutUsDesc: 'Pouchesitaly è la tua fonte affidabile per nicotine pouches premium dai principali marchi mondiali.',
    quickLinks: 'Link Rapidi',
    customerService: 'Servizio Clienti',
    legal: 'Legale',
    ageDisclaimer: 'Devi avere 18+ anni per acquistare. I prodotti contengono nicotina.',
    contactUs: 'Contattaci',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Termini e Condizioni',
    returns: 'Resi',
    allRightsReserved: 'Tutti i diritti riservati.',
    
    // Cart
    yourCart: 'Il Tuo Carrello',
    emptyCart: 'Il carrello è vuoto',
    total: 'Totale',
    checkout: 'Checkout',
    remove: 'Rimuovi',
    
    // Checkout
    shippingDetails: 'Dettagli Spedizione',
    firstName: 'Nome',
    lastName: 'Cognome',
    email: 'Email',
    phone: 'Telefono',
    address: 'Indirizzo',
    city: 'Città',
    postalCode: 'CAP',
    country: 'Paese',
    placeOrder: 'Effettua Ordine',
    orderComplete: 'Ordine Completato!',
    orderConfirmation: 'Grazie per il tuo ordine. Riceverai a breve un\'email di conferma.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
