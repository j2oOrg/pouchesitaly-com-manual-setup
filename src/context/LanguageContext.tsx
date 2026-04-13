import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
    freeShipping: 'Fast Shipping',
    freeShippingDesc: 'Free from €100 in Italy',
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
    backToProducts: 'Back to Products',
    inStock: 'In Stock & Ready to Ship',
    discreetPackagingSimple: 'Discreet Packaging',
    productSpecifications: 'Product Specifications',
    format: 'Format',
    flavorProfile: 'Flavor Profile',
    ingredients: 'Ingredients',
    totalPrice: 'Total Price',
    youSave: 'You Save',
    bestPrice: 'Best Price',
    originalProduct: '100% Original',
    fastShippingBadge: 'Fast Shipping',
    exclusiveDiscount: 'Exclusive Discount',
    standardPack: 'Standard Pack',
    popular: 'Popular',
    bestValue: 'Best Value',
    saveOnEveryCan: 'Save on every can',
    onEveryCan: 'on every can',
    today: 'Today',

    // Pack Options
    cans: 'cans',
    perCan: 'per can',
    selectedPack: 'Selected pack',
    was: 'Was',
    save: 'SAVE',
    selectPackSize: 'Select Pack Size',

    // Delivery
    deliveryTimeframes: 'Delivery Timeframes',
    europe: 'Northern Italy',
    europeDays: '1-2 days',
    europeDesc: 'Fast delivery across Northern Italy',
    northAmerica: 'Central Italy',
    northAmericaDays: '1-3 days',
    northAmericaDesc: 'Reliable shipping to Central Italy',
    asiaOceania: 'Southern Italy',
    asiaOceaniaDays: '2-4 days',
    asiaOceaniaDesc: 'Shipping to Southern regions',
    restOfWorld: 'Islands (Sicily & Sardinia)',
    restOfWorldDays: '3-5 days',
    restOfWorldDesc: 'Coverage to all Italian islands',
    deliveryDisclaimer: '*Delivery times may vary depending on local postal services and weather conditions.',

    // Learn More
    learnMore: 'Learn More',
    premiumNicotineBrands: 'Premium Nicotine Brands',
    premiumNicotineBrandsDesc: 'Discover our selection of leading nicotine pouch brands including ZYN and VELO.',
    worldwideShippingInfo: 'Italy Shipping Info',
    worldwideShippingDesc: 'Fast and reliable delivery across all of Italy. Discreet shipping straight to your door.',
    whyChooseUs: 'Why Choose Pouchesitaly',    whyChooseUsDesc: 'No sign-up required. Fast checkout. Premium brands at competitive prices.',
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
    readyToShop: 'Ready to Shop?',
    browseSelection: 'Browse our complete selection of premium nicotine pouches',
    viewAllProducts: 'View All Products',
    
    // Why Choose Us Page
    whyChooseUsTitle: 'Why Choose Pouchesitaly',
    whyChooseUsIntro: 'At Pouchesitaly, we make buying nicotine pouches simple, fast, and hassle-free. Here\'s why thousands of customers choose us.',
    noSignUpTitle: 'No Sign-Up Required',
    noSignUpLong: 'Skip the account creation. Checkout as a guest in minutes without creating an account.',
    freeShippingLong: 'Free shipping is available in Italy for orders of €100 or more. Plain packaging for complete privacy.',
    authenticProductsTitle: 'Authentic Products',
    authenticProductsLong: '100% genuine products from trusted brands. No fakes, no knockoffs, guaranteed.',
    commitmentTitle: 'Our Commitment to Quality',
    commitmentDesc1: 'We source all our products directly from authorized distributors to ensure authenticity and freshness. Every product goes through our quality checks before being shipped to you.',
    commitmentDesc2: 'Our inventory is stored in climate-controlled facilities to maintain product quality, ensuring you receive the best possible experience with every order.',
    customerFirstTitle: 'Customer-First Approach',
    customerFirstDesc: 'We believe shopping should be easy. That\'s why we\'ve eliminated unnecessary friction like mandatory account creation, hidden fees, and complicated checkout processes.',
    supportBenefit: 'Fast, responsive customer support',
    returnsBenefit: 'Easy returns and refunds',
    pricingBenefit: 'Transparent pricing with no hidden costs',
    promoBenefit: 'Regular promotions and discounts',
    experienceDifference: 'Experience the Difference',
    joinThousands: 'Join thousands of satisfied customers across Italy',
    startShopping: 'Start Shopping',
    shippingInfoIntro: 'We deliver premium nicotine pouches across Italy with fast, discreet, and reliable shipping.',
    globalCoverage: 'Italy Coverage',
    globalCoverageDesc: 'We currently ship only within Italy, including islands and smaller locations.',
    discreetPackagingTitle: 'Discreet Packaging',
    discreetPackagingLong: 'All orders are shipped in plain, unmarked packaging with no indication of contents for your privacy.',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'Most orders are processed within 24 hours and shipped via reliable domestic couriers.',
    freeShippingTitle: 'Free Shipping',
    deliveryTimeframesTitle: 'Delivery Timeframes',
    region: 'Region',
    estimatedDelivery: 'Estimated Delivery',
    businessDays: 'business days',
    trackingTitle: 'Tracking Your Order',
    trackingDesc: 'Once your order ships, you\'ll receive a tracking number via email. You can use this number to monitor your shipment\'s progress on the carrier\'s website.',
    readyToOrder: 'Ready to Order?',
    shopNowCta: 'Shop now with free shipping from €100 in Italy',
    
    // Quick FAQ
    faqQuestion1: 'How do nicotine pouches work?',
    faqAnswer1: 'Nicotine pouches are placed between your lip and gum. The nicotine is absorbed through the gum tissue, providing a smoke-free, spit-free nicotine experience.',
    faqQuestion2: 'How long does shipping take?',
    faqAnswer2: 'Delivery times in Italy are typically: North 1-2 days, Central 1-3 days, South 2-4 days, and Islands 3-5 days.',
    faqQuestion3: 'Is shipping really free?',
    faqAnswer3: 'Free shipping is available in Italy for orders of €100 or more. For lower totals, shipping is calculated at checkout. Orders are always shipped in discreet, unmarked packaging.',
    viewAllFaqs: 'View all FAQs',
    
    // UI Elements
    readMore: 'Read More',
    viewBrands: 'View Brands',
    shopNow: 'Shop Now',
    loadingProducts: 'Loading products...',
    noProductsFound: 'No products found',
    noProductsFoundDesc: 'We couldn\'t find any products matching your current filters. Try adjusting them or clearing all filters.',
    information: 'Information',
    about: 'About',
    guide: 'Guide',
    productInfo: 'Product Info',
    support: 'Support',
    delivery: 'Delivery',
    elevateExperience: 'Nicotine Pouches Italy, Buy Online with Fast Shipping',
    heroDesc: 'Shop trusted nicotine pouch brands with fast, discreet delivery across Italy. Clear strengths, premium formats, and quick online ordering.',
    shipWorldwide: 'We ship across Italy. Check below for estimated delivery times to your region.',
    learnMoreDesc: 'Everything you need to know about our products, shipping, and more.',
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
    checkoutError: 'Checkout error',
    orderConfirmation: 'Thank you for your order. You will receive a confirmation email shortly.',
    creatingCheckout: 'Creating secure checkout...',
    checkoutLoading: 'Loading secure payment form...',
    checkoutSnippetMissing: 'Secure checkout snippet could not be loaded.',
    paymentProcessing: 'Complete your payment below, then confirm.',
    paymentChecking: 'Checking payment status...',
    paymentPending: 'Payment is still pending. Please complete checkout and try again.',
    paymentConfirmed: 'Payment confirmed. Your order is now being processed.',
    confirmPayment: 'I have completed payment',
    openCheckoutInNewTab: 'Open checkout in a new tab',
    retry: 'Retry',
    back: 'Back',
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
    freeShipping: 'Spedizione Veloce',
    freeShippingDesc: 'Gratis da €100 in Italia',
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
    backToProducts: 'Torna ai Prodotti',
    inStock: 'In magazzino e pronto per la spedizione',
    discreetPackagingSimple: 'Imballaggio Discreto',
    productSpecifications: 'Specifiche del Prodotto',
    format: 'Formato',
    flavorProfile: 'Profilo del Gusto',
    ingredients: 'Ingredienti',
    totalPrice: 'Prezzo Totale',
    youSave: 'Risparmi',
    bestPrice: 'Miglior Prezzo',
    originalProduct: '100% Originale',
    fastShippingBadge: 'Spedizione Veloce',
    exclusiveDiscount: 'Sconto Esclusivo',
    standardPack: 'Pack Standard',
    popular: 'Popolare',
    bestValue: 'Miglior Valore',
    saveOnEveryCan: 'Risparmia su ogni lattina',
    onEveryCan: 'su ogni lattina',
    today: 'Oggi',
    
    // Pack Options
    cans: 'lattine',
    perCan: 'a lattina',
    selectedPack: 'Confezione selezionata',
    was: 'Prima',
    save: 'RISPARMIA',
    selectPackSize: 'Seleziona Formato Pack',
    
    // Delivery
    deliveryTimeframes: 'Tempi di Consegna',
    europe: 'Nord Italia',
    europeDays: '1-2 giorni',
    europeDesc: 'Consegna rapida in tutto il Nord Italia',
    northAmerica: 'Centro Italia',
    northAmericaDays: '1-3 giorni',
    northAmericaDesc: 'Spedizione affidabile nel Centro Italia',
    asiaOceania: 'Sud Italia',
    asiaOceaniaDays: '2-4 giorni',
    asiaOceaniaDesc: 'Spedizione nelle regioni del Sud',
    restOfWorld: 'Isole (Sicilia e Sardegna)',
    restOfWorldDays: '3-5 giorni',
    restOfWorldDesc: 'Copertura in tutte le isole italiane',
    deliveryDisclaimer: '*I tempi di consegna possono variare a seconda dei servizi postali locali e delle condizioni meteorologiche.',
    
    // Why Choose Us Page
    whyChooseUsTitle: 'Perché Scegliere Pouchesitaly',
    whyChooseUsIntro: 'Su Pouchesitaly, rendiamo l\'acquisto di nicotine pouches semplice, veloce e senza problemi. Ecco perché migliaia di clienti ci scelgono.',
    noSignUpTitle: 'Nessuna Registrazione Richiesta',
    noSignUpLong: 'Salta la creazione dell\'account. Fai il checkout come ospite in pochi minuti senza creare un account.',
    authenticProductsTitle: 'Prodotti Autentici',
    authenticProductsLong: 'Prodotti genuini al 100% da marchi affidabili. Niente falsi, niente imitazioni, garantito.',
    commitmentTitle: 'Il Nostro Impegno per la Qualità',
    commitmentDesc1: 'Riforniamo tutti i nostri prodotti direttamente dai distributori autorizzati per garantire autenticità e freschezza. Ogni prodotto passa attraverso i nostri controlli di qualità prima di essere spedito.',
    commitmentDesc2: 'Il nostro inventario è conservato in strutture a temperatura controllata per mantenere la qualità del prodotto, assicurandoti la migliore esperienza possibile con ogni ordine.',
    customerFirstTitle: 'Approccio Orientato al Cliente',
    customerFirstDesc: 'Crediamo che fare acquisti debba essere facile. Per questo abbiamo eliminato inutili complicazioni come la creazione obbligatoria dell\'account, costi nascosti e processi di checkout complicati.',
    supportBenefit: 'Supporto clienti veloce e reattivo',
    returnsBenefit: 'Resi e rimborsi facili',
    pricingBenefit: 'Prezzi trasparenti senza costi nascosti',
    promoBenefit: 'Promozioni e sconti regolari',
    experienceDifference: 'Sperimenta la Differenza',
    joinThousands: 'Unisciti a migliaia di clienti soddisfatti in tutta Italia',
    startShopping: 'Inizia a Comprare',
    
    // Learn More
    learnMore: 'Scopri di Più',
    premiumNicotineBrands: 'Marchi Premium di Nicotina',
    premiumNicotineBrandsDesc: 'Scopri la nostra selezione dei principali marchi di nicotine pouches tra cui ZYN e VELO.',
    worldwideShippingInfo: 'Info Spedizione Italia',
    worldwideShippingDesc: 'Consegna veloce e affidabile in tutta Italia. Spedizione discreta direttamente a casa tua.',
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
    readyToShop: 'Pronto per Acquistare?',
    browseSelection: 'Sfoglia la nostra selezione completa di nicotine pouches premium',
    viewAllProducts: 'Vedi Tutti i Prodotti',
    
    // Shipping Info Page
    shippingInfoTitle: 'Informazioni sulla Spedizione in Italia',
    shippingInfoIntro: 'Consegniamo nicotine pouches premium in tutta Italia con spedizione veloce, discreta e affidabile.',
    globalCoverage: 'Copertura in Italia',
    globalCoverageDesc: 'Spediamo esclusivamente in Italia, incluse isole e località minori.',
    discreetPackagingTitle: 'Imballaggio Discreto',
    discreetPackagingLong: 'Tutti gli ordini vengono spediti in imballaggi anonimi senza indicazione del contenuto per la tua privacy.',
    fastDelivery: 'Consegna Veloce',
    fastDeliveryDesc: 'La maggior parte degli ordini viene elaborata entro 24 ore e spedita tramite corrieri nazionali affidabili.',
    freeShippingTitle: 'Spedizione Gratuita',
    freeShippingLong: 'La spedizione gratuita si applica in Italia per ordini pari o superiori a €100.',
    deliveryTimeframesTitle: 'Tempi di Consegna',
    region: 'Regione',
    estimatedDelivery: 'Consegna Stimata',
    businessDays: 'giorni lavorativi',
    trackingTitle: 'Tracciamento del Tuo Ordine',
    trackingDesc: 'Una volta spedito il tuo ordine, riceverai un numero di tracciamento via email. Puoi usare questo numero per monitorare l\'avanzamento della spedizione sul sito del corriere.',
    readyToOrder: 'Pronto per Ordinare?',
    shopNowCta: 'Acquista ora con spedizione gratuita da €100 in Italia',
    
    // Quick FAQ
    faqQuestion1: 'Come funzionano le nicotine pouches?',
    faqAnswer1: 'Le nicotine pouches si posizionano tra il labbro e la gengiva. La nicotina viene assorbita attraverso il tessuto gengivale, offrendo un\'esperienza di nicotina senza fumo e senza sputo.',
    faqQuestion2: 'Quanto tempo richiede la spedizione?',
    faqAnswer2: 'I tempi di consegna in Italia sono in genere: Nord 1-2 giorni, Centro 1-3 giorni, Sud 2-4 giorni, Isole 3-5 giorni.',
    faqQuestion3: 'La spedizione è davvero gratuita?',
    faqAnswer3: 'La spedizione gratuita è disponibile in Italia per ordini pari o superiori a €100. Per importi inferiori, il costo viene calcolato al checkout. Il tuo ordine viene sempre spedito in imballaggio discreto e anonimo.',
    viewAllFaqs: 'Vedi tutte le FAQ',
    
    // UI Elements
    readMore: 'Scopri di Più',
    viewBrands: 'Vedi i Marchi',
    shopNow: 'Acquista Ora',
    loadingProducts: 'Caricamento prodotti...',
    noProductsFound: 'Nessun prodotto trovato',
    noProductsFoundDesc: 'Non abbiamo trovato alcun prodotto corrispondente ai tuoi filtri. Prova a modificarli o cancellarli.',
    information: 'Informazioni',
    about: 'Chi Siamo',
    guide: 'Guida',
    productInfo: 'Info Prodotto',
    support: 'Supporto',
    delivery: 'Consegna',
    elevateExperience: 'Nicotine Pouches Italia, Acquisto Online e Spedizione Veloce',
    heroDesc: 'Acquista online nicotine pouches dei migliori brand con spedizione veloce e discreta in tutta Italia. Intensità chiare, formati premium e ordine rapido.',
    shipWorldwide: 'Spediamo in tutta Italia. Controlla qui sotto i tempi di consegna stimati per la tua regione.',
    learnMoreDesc: 'Tutto quello che devi sapere sui nostri prodotti, la spedizione e altro ancora.',
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
    checkoutError: 'Errore nel checkout',
    orderConfirmation: 'Grazie per il tuo ordine. Riceverai a breve un\'email di conferma.',
    creatingCheckout: 'Creazione del checkout sicuro...',
    checkoutLoading: 'Caricamento modulo di pagamento sicuro...',
    checkoutSnippetMissing: 'Impossibile caricare il modulo di checkout sicuro.',
    paymentProcessing: 'Completa il pagamento qui sotto, poi conferma.',
    paymentChecking: 'Verifica stato del pagamento...',
    paymentPending: 'Il pagamento è ancora in sospeso. Completa il checkout e riprova.',
    paymentConfirmed: 'Pagamento confermato. Il tuo ordine è ora in elaborazione.',
    confirmPayment: 'Ho completato il pagamento',
    openCheckoutInNewTab: 'Apri il checkout in una nuova scheda',
    retry: 'Riprova',
    back: 'Indietro',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('it');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

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
