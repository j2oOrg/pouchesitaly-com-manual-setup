import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Package, MapPin, ArrowRight, Loader2, ShieldCheck, Clock } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ, getQuickFaqEntries } from "@/components/QuickFAQ";
import { ProductCardRounded } from "@/components/ProductCardRounded";
import { CartDrawer } from "@/components/CartDrawer";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "@/hooks/useTranslation";
import { useProducts, toFrontendProduct } from "@/hooks/useProducts";
import { trackCartEvent } from "@/hooks/useAnalyticsTracking";
import { buildFAQPageStructuredData } from "@/lib/structured-data";
import { cn } from "@/lib/utils";
import type { Product, CartItem } from "@/types/product";
import productImage from "@/assets/product-can.png";

const packOptions = [
  { size: 5, discount: 0.05 },
  { size: 10, discount: 0.12 },
  { size: 20, discount: 0.20 },
];
const CHECKOUT_CART_STORAGE_KEY = "checkout_cart_v1";

export default function HomePage() {
  const navigate = useNavigate();
  const { data: dbProducts, isLoading: productsLoading } = useProducts();
  const { t, language } = useTranslation();
  
  // Convert database products to frontend format with fallback image and localized description
  const products: Product[] = dbProducts?.map(p => ({
    ...toFrontendProduct(p, language as 'en' | 'it'),
    image: p.image || productImage,
  })) || [];
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStrengths, setSelectedStrengths] = useState<number[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const FREE_SHIPPING_THRESHOLD = 100;
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const freeShippingProgress = Math.min((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const getFlavorTokens = (flavor: string) =>
    flavor
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean);

  const availableBrands = Array.from(
    new Set(products.map((product) => product.brand).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const availableStrengths = Array.from(
    new Set(
      products
        .map((product) => product.strengthMg)
        .filter((strength): strength is number => Number.isFinite(strength))
    )
  ).sort((a, b) => a - b);
  const availableFlavors = Array.from(
    new Set(products.flatMap((product) => getFlavorTokens(product.flavor)))
  ).sort((a, b) => a.localeCompare(b));

  const nicotineLevelLabel =
    language === "it" ? "Livello di nicotina" : "Nicotine level";
  const formatStrengthLabel = (strength: number) =>
    `${Number.isInteger(strength) ? strength.toFixed(0) : strength.toFixed(1).replace(/\.0$/, "")}MG`;
  const filterButtonClassName = (selected: boolean) =>
    cn(
      "inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border px-4 py-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.16em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      selected
        ? "border-primary/70 bg-[linear-gradient(135deg,hsl(var(--primary))_0%,#38d9ff_100%)] text-[#04141b] shadow-[0_20px_40px_-24px_rgba(24,198,255,0.82)] hover:-translate-y-0.5 hover:shadow-[0_26px_48px_-24px_rgba(24,198,255,0.9)]"
        : "border-white/10 bg-white/[0.05] text-[#d9e7ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white/[0.08] hover:text-white hover:shadow-[0_18px_34px_-28px_rgba(0,0,0,0.68)]"
    );

  // Filter products
  const filteredProducts = products.filter((product) => {
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const strengthMatch = selectedStrengths.length === 0 || selectedStrengths.includes(product.strengthMg);
    const flavorTokens = getFlavorTokens(product.flavor);
    const flavorMatch =
      selectedFlavors.length === 0 ||
      selectedFlavors.some((flavor) => flavorTokens.includes(flavor));
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
  const activeFilterCount = selectedBrands.length + selectedStrengths.length + selectedFlavors.length;
  const productCountLabel =
    language === "it"
      ? `${filteredProducts.length} ${filteredProducts.length === 1 ? "prodotto" : "prodotti"}`
      : `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}`;
  const activeFilterLabel =
    language === "it"
      ? `${activeFilterCount} ${activeFilterCount === 1 ? "filtro attivo" : "filtri attivi"}`
      : `${activeFilterCount} ${activeFilterCount === 1 ? "active filter" : "active filters"}`;

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
    localStorage.setItem(CHECKOUT_CART_STORAGE_KEY, JSON.stringify(cart));
    navigate("checkout", {
      state: { cart },
    });
  };

  const learnMoreCards = [
    {
      to: "/premium-brands",
      category: t("information") || "Information",
      title: t("premiumNicotineBrands"),
      description: t("premiumNicotineBrandsDesc"),
    },
    {
      to: "/shipping-info",
      category: t("deliveryTimeframes") || "Delivery",
      title: t("worldwideShippingInfo"),
      description: t("worldwideShippingDesc"),
    },
    {
      to: "/why-choose-us",
      category: t("aboutUs") || "About",
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
  ];
  const homeFaqStructuredData = buildFAQPageStructuredData(getQuickFaqEntries(t));

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <SEOHead
        defaultTitle={language === "it" ? "Bustine di Nicotina Italia — ZYN, VELO, CUBA | Pouchesitaly" : "Nicotine Pouches Italy — ZYN, VELO, CUBA | Pouchesitaly"}
        defaultDescription={language === "it" ? "Acquista le migliori bustine di nicotina in Italia: ZYN, VELO, CUBA e altri marchi premium. Spedizione rapida 2–4 giorni. Tobacco-free, legali in Italia." : "Buy premium nicotine pouches in Italy: ZYN, VELO, CUBA and more. Fast shipping in 2–4 business days. Tobacco-free, legal in Italy. Order online."}
        structuredData={homeFaqStructuredData}
      />
      <PageHeader cart={cart} onCartClick={() => setIsCartOpen(true)} />
      <section className="w-full border-b border-white/10 bg-[linear-gradient(90deg,rgba(8,12,24,0.98),rgba(11,28,46,0.92))] text-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-center gap-4 px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.18em] sm:gap-6 sm:text-[0.95rem]">
          <span>100% tobacco free</span>
          <span className="h-4 w-px bg-white/30" aria-hidden="true" />
          <span>18+</span>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="pt-4 pb-8 md:pt-6 md:pb-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        <div className="relative isolate overflow-hidden rounded-[2.75rem] border border-white/10 bg-[linear-gradient(128deg,#07111d_0%,#0b1e32_24%,#0c5a73_58%,#14b7ce_100%)] px-6 py-10 shadow-[0_42px_90px_-46px_rgba(0,0,0,0.82)] min-h-[560px] sm:px-8 lg:min-h-[640px] lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.16),transparent_24%),radial-gradient(circle_at_84%_10%,rgba(255,255,255,0.14),transparent_22%),linear-gradient(160deg,rgba(1,37,55,0.18),transparent_45%),linear-gradient(0deg,rgba(0,0,0,0.36),rgba(0,0,0,0.06))]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgba(3,9,19,0.88)_0%,rgba(3,12,22,0.62)_34%,rgba(3,22,31,0.18)_58%,rgba(3,22,31,0)_78%)] lg:w-[60%]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-[radial-gradient(ellipse_at_center,rgba(0,65,89,0.52)_0%,rgba(0,65,89,0)_72%)]" />
          <div className="pointer-events-none absolute bottom-6 left-[44%] z-[1] h-20 w-[48%] rounded-full bg-[rgba(0,74,95,0.40)] blur-2xl sm:bottom-8" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[33%] z-[1] lg:left-[34%] lg:right-[-1%] lg:top-[16%]">
            <div className="absolute bottom-12 left-[1%] w-[37%] max-w-[330px] rotate-[-8deg] opacity-95 lg:bottom-8 lg:left-[2%] lg:w-[34%]">
              <img
                src="/product-images/import/velo-icy-cherry-10mg.webp"
                alt="VELO Icy Cherry nicotine pouch can"
                loading="eager"
                className="w-full object-contain drop-shadow-[0_28px_36px_rgba(0,0,0,0.34)]"
              />
            </div>
            <div className="absolute bottom-8 left-[31%] z-[2] w-[39%] max-w-[350px] lg:bottom-4 lg:left-[28%] lg:w-[40%]">
              <img
                src="/product-images/import/velo-crispy-peppermint-10mg.png"
                alt="VELO Crispy Peppermint nicotine pouch can"
                loading="eager"
                className="w-full object-contain drop-shadow-[0_32px_42px_rgba(0,0,0,0.38)]"
              />
            </div>
            <div className="absolute bottom-6 right-[0%] z-[3] w-[37%] max-w-[320px] rotate-[8deg] lg:bottom-3 lg:right-[2%] lg:w-[35%]">
              <img
                src="/product-images/import/velo-blue-raspberry-8mg.webp"
                alt="VELO Blue Raspberry nicotine pouch can"
                loading="eager"
                className="w-full object-contain drop-shadow-[0_28px_36px_rgba(0,0,0,0.34)]"
              />
            </div>
            <div className="absolute bottom-7 right-[2%] z-[4] flex items-end gap-2 lg:bottom-7 lg:right-[1%]">
              <span className="block h-8 w-11 rotate-[-15deg] rounded-[0.7rem] bg-white shadow-[0_18px_28px_-16px_rgba(0,0,0,0.45)] sm:h-10 sm:w-14" />
              <span className="block h-8 w-11 rotate-[8deg] rounded-[0.7rem] bg-white shadow-[0_18px_28px_-16px_rgba(0,0,0,0.45)] sm:h-10 sm:w-14" />
              <span className="block h-7 w-10 rotate-[22deg] rounded-[0.65rem] bg-white shadow-[0_18px_28px_-16px_rgba(0,0,0,0.45)] sm:h-9 sm:w-12" />
            </div>
          </div>

          <div className="relative z-10 flex h-full max-w-3xl flex-col items-center justify-center py-4 text-center lg:max-w-[42rem] lg:items-start lg:justify-center lg:text-left">
            <h1 className="mb-6 text-4xl font-heading font-black leading-tight tracking-tight text-white drop-shadow-[0_12px_28px_rgba(0,0,0,0.28)] md:text-6xl lg:text-7xl">
              {t("elevateExperience")}
            </h1>
            <p className="mb-10 max-w-2xl text-lg font-medium text-white/90 drop-shadow-[0_10px_22px_rgba(0,0,0,0.24)] md:text-xl lg:mx-0">
              {t("heroDesc")}
            </p>
            <div className="flex w-full flex-col items-center justify-center gap-4 sm:w-auto sm:flex-row lg:justify-start">
              <a
                href="#products"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,hsl(var(--primary))_0%,#38d9ff_100%)] px-8 py-4 text-lg font-bold text-primary-foreground shadow-[0_24px_44px_-24px_rgba(24,198,255,0.88)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 sm:w-auto"
              >
                {t("shopNow")} <ArrowRight className="w-5 h-5" />
              </a>
              <LocalizedLink
                to="/premium-brands"
                className="w-full rounded-full border border-white/15 bg-white/[0.08] px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.14] sm:w-auto"
              >
                {t("viewBrands")}
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="pt-4 pb-16 md:pt-6 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-8 overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(18,26,45,0.88)_0%,rgba(10,16,28,0.98)_100%)] p-5 shadow-[0_30px_70px_-50px_rgba(0,0,0,0.82)] ring-1 ring-white/5 sm:p-7">
            <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-primary/16 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-0 h-28 w-28 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-end gap-2.5 border-b border-white/10 pb-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-foreground shadow-[0_12px_30px_-28px_rgba(0,0,0,0.8)]">
                    {productCountLabel}
                  </span>
                  {hasActiveFilters && (
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/12 px-4 py-2 text-sm font-semibold text-primary">
                      {activeFilterLabel}
                    </span>
                  )}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center rounded-full border border-transparent px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-white/10 hover:bg-white/[0.05] hover:text-foreground"
                    >
                      {t("clearFilters")}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid gap-5">
                <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
                  <div className="grid gap-3 md:grid-cols-[10rem_minmax(0,1fr)] md:items-center">
                    <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.32em] text-[#9ab8ff]">
                      {t("brand")}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {availableBrands.map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          aria-pressed={selectedBrands.includes(brand)}
                          onClick={() => toggleBrand(brand)}
                          className={filterButtonClassName(selectedBrands.includes(brand))}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 border-t border-white/10 pt-5 md:grid-cols-[10rem_minmax(0,1fr)] md:items-center lg:border-l lg:border-t-0 lg:border-white/10 lg:pl-8 lg:pt-0">
                    <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.32em] text-[#9ab8ff]">
                      {nicotineLevelLabel}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {availableStrengths.map((strength) => (
                        <button
                          key={strength}
                          type="button"
                          aria-pressed={selectedStrengths.includes(strength)}
                          onClick={() => toggleStrength(strength)}
                          className={filterButtonClassName(selectedStrengths.includes(strength))}
                        >
                          {formatStrengthLabel(strength)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 border-t border-white/10 pt-5 md:grid-cols-[10rem_minmax(0,1fr)] md:items-center">
                  <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.32em] text-[#9ab8ff]">
                    {t("flavor")}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {availableFlavors.map((flavor) => (
                      <button
                        key={flavor}
                        type="button"
                        aria-pressed={selectedFlavors.includes(flavor)}
                        onClick={() => toggleFlavor(flavor)}
                        className={filterButtonClassName(selectedFlavors.includes(flavor))}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {productsLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground font-medium">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(19,27,46,0.74),rgba(11,17,29,0.86))] p-16 text-center shadow-[0_24px_54px_-34px_rgba(0,0,0,0.8)]">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                We couldn't find any products matching your current filters. Try adjusting them or clearing all filters.
              </p>
              <button
                onClick={clearFilters}
                className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl transition-colors hover:bg-primary/90"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      </section>

      {/* Delivery Section */}
      <section className="py-20 md:py-32" style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1000px" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-foreground mb-6">
              {t("deliveryTimeframes")}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t("shipWorldwide")} {language === "it" ? "Spedizione gratuita da €100." : "Free shipping from €100."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { region: t("europe"), days: t("europeDays"), desc: t("europeDesc"), icon: ShieldCheck },
              { region: t("northAmerica"), days: t("northAmericaDays"), desc: t("northAmericaDesc"), icon: Clock },
              { region: t("asiaOceania"), days: t("asiaOceaniaDays"), desc: t("asiaOceaniaDesc"), icon: MapPin },
              { region: t("restOfWorld"), days: t("restOfWorldDays"), desc: t("restOfWorldDesc"), icon: Truck },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.region} className="relative group bg-card rounded-3xl border border-border p-8 hover:border-primary/50 transition-colors shadow-sm hover:shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-muted group-hover:bg-primary/10 flex items-center justify-center mb-6 transition-colors">
                      <Icon className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h4 className="font-heading font-bold text-foreground text-xl mb-2">
                      {item.region}
                    </h4>
                    <p className="text-3xl font-heading font-black text-primary mb-3">{item.days}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <p className="inline-block bg-muted/50 rounded-lg px-4 py-2 text-sm text-muted-foreground border border-border/50">
              {t("deliveryDisclaimer")}
            </p>
          </div>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="py-20 md:py-32 bg-card border-t border-border" style={{ contentVisibility: "auto", containIntrinsicSize: "1px 1000px" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-heading font-black text-foreground mb-4">
                {t("learnMore")}
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our products, shipping, and more.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learnMoreCards.map((card, i) => (
              <LocalizedLink
                key={card.to}
                to={card.to}
                className="group relative flex flex-col justify-between bg-background rounded-3xl p-8 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110" />
                
                <div>
                  <span className="inline-block px-3 py-1 bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider rounded-lg mb-6">
                    {card.category}
                  </span>
                  <h3 className="text-2xl font-heading font-bold text-foreground mb-4 leading-tight">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {card.description}
                  </p>
                </div>
                
                <div className="flex items-center text-primary font-bold text-sm uppercase tracking-wide">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
                </div>
              </LocalizedLink>
            ))}
          </div>
        </div>
      </section>

      {cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-40 px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">
                {amountUntilFreeShipping > 0
                  ? language === "it"
                    ? `Aggiungi €${amountUntilFreeShipping.toFixed(2)} per la spedizione gratuita`
                    : `Add €${amountUntilFreeShipping.toFixed(2)} for free shipping`
                  : language === "it"
                    ? "Spedizione gratuita sbloccata"
                    : "Free shipping unlocked"}
              </span>
              <span className="text-muted-foreground">€{cartSubtotal.toFixed(2)} / €{FREE_SHIPPING_THRESHOLD}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${freeShippingProgress}%` }} />
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => setIsCartOpen(true)}
                className="text-xs font-bold text-primary hover:opacity-80"
              >
                {language === "it" ? "Apri carrello" : "Open cart"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
}
