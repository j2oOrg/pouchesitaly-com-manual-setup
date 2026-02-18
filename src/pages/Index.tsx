import { useState } from "react";
import { Truck, Package, Zap, MapPin, ChevronDown, ArrowRight, Loader2, SlidersHorizontal } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { ProductCardRounded } from "@/components/ProductCardRounded";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutFlow } from "@/components/CheckoutFlow";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "@/hooks/useTranslation";
import { useProducts, toFrontendProduct } from "@/hooks/useProducts";
import { trackCartEvent } from "@/hooks/useAnalyticsTracking";
import type { Product, CartItem } from "@/types/product";
import productImage from "@/assets/product-can.png";
import heroBackground from "../../herobackground.jpg";

const packOptions = [
  { size: 5, discount: 0.05 },
  { size: 10, discount: 0.12 },
  { size: 20, discount: 0.20 },
];

export default function HomePage() {
  const { data: dbProducts, isLoading: productsLoading } = useProducts();
  const { t, language } = useTranslation();
  
  // Convert database products to frontend format with fallback image and localized description
  const products: Product[] = dbProducts?.map(p => ({
    ...toFrontendProduct(p, language as 'en' | 'it'),
    image: p.image || productImage,
  })) || [];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStrengths, setSelectedStrengths] = useState<number[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const strengthMatch = selectedStrengths.length === 0 || selectedStrengths.includes(product.strengthMg);
    const flavorMatch = selectedFlavors.length === 0 || selectedFlavors.includes(product.flavor);
    return brandMatch && strengthMatch && flavorMatch;
  });

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleStrength = (strength: number) => {
    setSelectedStrengths((prev) =>
      prev.includes(strength) ? prev.filter((s) => s !== strength) : [...prev, strength]
    );
  };

  const toggleFlavor = (flavor: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor) ? prev.filter((f) => f !== flavor) : [...prev, flavor]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedStrengths([]);
    setSelectedFlavors([]);
  };

  const hasActiveFilters =
    selectedBrands.length > 0 || selectedStrengths.length > 0 || selectedFlavors.length > 0;

  const handleAddToCart = (product: Product, packSize: number) => {
    const option = packOptions.find((opt) => opt.size === packSize);
    const discount = option?.discount || 0;
    const calculatedPrice = parseFloat((product.price * packSize * (1 - discount)).toFixed(2));

    // Track cart add event
    trackCartEvent('add', String(product.id), packSize);

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.packSize === packSize
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id && item.packSize === packSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, price: calculatedPrice, quantity: 1, packSize }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string | number, packSize: number, quantity: number) => {
    if (quantity === 0) {
      // Track remove event
      trackCartEvent('remove', String(id), packSize);
      setCart((prevCart) =>
        prevCart.filter((item) => !(item.id === id && item.packSize === packSize))
      );
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id && item.packSize === packSize ? { ...item, quantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (id: string | number, packSize: number) => {
    // Track remove event
    trackCartEvent('remove', String(id), packSize);
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.packSize === packSize))
    );
  };

  const handleCheckoutStart = () => {
    trackCartEvent('checkout_start');
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    trackCartEvent('checkout_complete');
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const learnMoreCards = [
    {
      to: "/premium-brands",
      category: "Information",
      title: t("premiumNicotineBrands"),
      description: t("premiumNicotineBrandsDesc"),
    },
    {
      to: "/shipping-info",
      category: "Delivery",
      title: t("worldwideShippingInfo"),
      description: t("worldwideShippingDesc"),
    },
    {
      to: "/why-choose-us",
      category: "About",
      title: t("whyChooseUs"),
      description: t("whyChooseUsDesc"),
    },
    {
      to: "/strengths-guide",
      category: "Guide",
      title: t("strengthsGuide"),
      description: t("strengthsGuideDesc"),
    },
    {
      to: "/tobacco-free",
      category: "Product Info",
      title: t("tobaccoFree"),
      description: t("tobaccoFreeDesc"),
    },
    {
      to: "/faq",
      category: "Support",
      title: t("faqTitle"),
      description: t("faqDesc"),
    },
    // Italian SEO Pages
    {
      to: "/snus-brands",
      category: "Marchi",
      title: "Marchi di Snus: ZYN e VELO",
      description: "Scopri i marchi di snus più popolari come ZYN e VELO, disponibili in diverse intensità.",
    },
    {
      to: "/snus-cose",
      category: "Informazioni",
      title: "Snus: cos'è",
      description: "Lo snus è un prodotto a base di nicotina che si utilizza posizionando una piccola pouch sotto il labbro.",
    },
    {
      to: "/spedizione-snus",
      category: "Consegna",
      title: "Spedizione Snus",
      description: "Offriamo spedizione internazionale di snus verso l'Italia e molti altri paesi.",
    },
    {
      to: "/perche-scegliere-pouchesitaly",
      category: "Chi Siamo",
      title: "Perché scegliere Pouchesitaly",
      description: "Su Pouchesitaly puoi acquistare snus online in modo semplice e sicuro.",
    },
    {
      to: "/guida-intensita-gusti",
      category: "Guida",
      title: "Guida alle intensità e ai gusti",
      description: "Lo snus è disponibile in diverse intensità di nicotina, da opzioni leggere a varianti più forti.",
    },
    {
      to: "/snus-vs-nicotine-pouches",
      category: "Confronto",
      title: "Snus vs Nicotine Pouches",
      description: "Lo snus tradizionale contiene tabacco, mentre le nicotine pouches non contengono tabacco.",
    },
    {
      to: "/domande-frequenti-snus",
      category: "Supporto",
      title: "Domande frequenti sullo Snus",
      description: "Qui trovi le risposte alle domande più comuni sullo snus.",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead />
      <PageHeader cart={cart} onCartClick={() => setIsCartOpen(true)} />

      {/* Hero Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div
            className="relative overflow-hidden rounded-2xl bg-hero-bg bg-cover bg-center bg-no-repeat min-h-[320px] md:min-h-[420px]"
            style={{
              backgroundImage: `linear-gradient(180deg, hsl(0 0% 0% / 0.20), hsl(0 0% 0% / 0.18)), url(${heroBackground})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/10" />
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-primary-foreground">{t("freeShipping")}</h3>
                  <p className="text-sm text-primary-foreground/70">{t("freeShippingDesc")}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-primary-foreground">{t("discreetPackaging")}</h3>
                  <p className="text-sm text-primary-foreground/70">{t("discreetPackagingDesc")}</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-primary-foreground">{t("noSignUp")}</h3>
                  <p className="text-sm text-primary-foreground/70">{t("noSignUpDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="pt-14 pb-10 md:pt-16 md:pb-14">
        <div className="container mx-auto px-4">
          <div className="rounded-[2rem] border border-border/75 bg-card/90 p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Pouchesitaly selection
                </p>
                <h2 className="mt-2 text-3xl md:text-4xl font-heading font-bold text-foreground">
                  {t("allProducts")}
                </h2>
              </div>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                >
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <span>{t("filters")}</span>
                  {hasActiveFilters && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                      {selectedBrands.length + selectedStrengths.length + selectedFlavors.length}
                    </span>
                  )}
                  <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-80 rounded-2xl border border-border bg-card p-6 shadow-xl">
                    {/* Brand Filter */}
                    <div className="mb-5">
                      <h4 className="font-heading mb-3 text-sm font-bold text-foreground">{t("brand")}</h4>
                      <div className="space-y-1.5">
                        {["ZYN", "LYFT", "VELO"].map((brand) => (
                          <label
                            key={brand}
                            className="flex cursor-pointer items-center gap-2 rounded-xl p-2 text-sm hover:bg-muted"
                          >
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => toggleBrand(brand)}
                              className="h-4 w-4 accent-primary"
                            />
                            <span>{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Strength Filter */}
                    <div className="mb-5">
                      <h4 className="font-heading mb-3 text-sm font-bold text-foreground">{t("strength")}</h4>
                      <div className="space-y-1.5">
                        {[6, 10, 15].map((strength) => (
                          <label
                            key={strength}
                            className="flex cursor-pointer items-center gap-2 rounded-xl p-2 text-sm hover:bg-muted"
                          >
                            <input
                              type="checkbox"
                              checked={selectedStrengths.includes(strength)}
                              onChange={() => toggleStrength(strength)}
                              className="h-4 w-4 accent-primary"
                            />
                            <span>{strength}mg</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Flavor Filter */}
                    <div className="mb-5">
                      <h4 className="font-heading mb-3 text-sm font-bold text-foreground">{t("flavor")}</h4>
                      <div className="space-y-1.5">
                        {["Mint", "Citrus", "Berry", "Coffee", "Fruit"].map((flavor) => (
                          <label
                            key={flavor}
                            className="flex cursor-pointer items-center gap-2 rounded-xl p-2 text-sm hover:bg-muted"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFlavors.includes(flavor)}
                              onChange={() => toggleFlavor(flavor)}
                              className="h-4 w-4 accent-primary"
                            />
                            <span>{flavor}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="w-full rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
                      >
                        {t("clearFilters")}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-6 flex flex-wrap gap-2">
                {selectedBrands.map((brand) => (
                  <span
                    key={`brand-${brand}`}
                    className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {t("brand")}: {brand}
                  </span>
                ))}
                {selectedStrengths.map((strength) => (
                  <span
                    key={`strength-${strength}`}
                    className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {t("strength")}: {strength}mg
                  </span>
                ))}
                {selectedFlavors.map((flavor) => (
                  <span
                    key={`flavor-${flavor}`}
                    className="inline-flex items-center rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary"
                  >
                    {t("flavor")}: {flavor}
                  </span>
                ))}
              </div>
            )}

            {productsLoading ? (
              <div className="flex items-center justify-center py-14">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-border/70 bg-muted/30 p-10 text-center">
                <p className="text-muted-foreground">{t("noProductsFound") || "No products match your filters."}</p>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCardRounded
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Delivery Section */}
      <section className="pt-12 pb-16 md:pt-16 md:pb-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-12">
            {t("deliveryTimeframes")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { region: t("europe"), days: t("europeDays"), desc: t("europeDesc") },
              { region: t("northAmerica"), days: t("northAmericaDays"), desc: t("northAmericaDesc") },
              { region: t("asiaOceania"), days: t("asiaOceaniaDays"), desc: t("asiaOceaniaDesc") },
              { region: t("restOfWorld"), days: t("restOfWorldDays"), desc: t("restOfWorldDesc") },
            ].map((item) => (
              <div key={item.region} className="flex items-start gap-4 p-6 rounded-xl bg-card">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-8 h-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-foreground text-xl mb-1">
                    {item.region}
                  </h4>
                  <p className="text-3xl font-heading font-bold text-primary">{item.days}</p>
                  <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-8">{t("deliveryDisclaimer")}</p>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-12">
            {t("learnMore")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {learnMoreCards.map((card) => (
              <LocalizedLink
                key={card.to}
                to={card.to}
                className="bg-card rounded-xl p-6 text-left transition-all group block hover:shadow-lg border border-border"
              >
                <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wide font-normal">
                  {card.category}
                </p>
                <h3 className="text-2xl font-heading font-bold text-foreground mb-3">
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-base mb-12 font-normal">
                  {card.description}
                </p>
                <div className="flex items-center justify-end">
                  <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center group-hover:bg-primary transition-colors">
                    <ArrowRight className="w-6 h-6 text-background group-hover:text-primary-foreground transition-colors" />
                  </div>
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      <QuickFAQ />
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        onCheckout={() => {
          setIsCartOpen(false);
          handleCheckoutStart();
        }}
      />

      {/* Checkout Flow */}
      {isCheckoutOpen && (
        <CheckoutFlow
          cart={cart}
          onComplete={handleOrderComplete}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
}


