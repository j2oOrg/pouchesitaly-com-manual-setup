import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, Package, MapPin, ChevronDown, ArrowRight, Loader2, SlidersHorizontal, ShieldCheck, Clock } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { ProductCardRounded } from "@/components/ProductCardRounded";
import { CartDrawer } from "@/components/CartDrawer";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "@/hooks/useTranslation";
import { useProducts, toFrontendProduct } from "@/hooks/useProducts";
import { trackCartEvent } from "@/hooks/useAnalyticsTracking";
import type { Product, CartItem } from "@/types/product";
import productImage from "@/assets/product-can.png";
import heroBackground from "../../headerbackground.webp";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedStrengths, setSelectedStrengths] = useState<number[]>([]);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const FREE_SHIPPING_THRESHOLD = 100;
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);
  const freeShippingProgress = Math.min((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

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
    setIsFilterOpen(false);
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

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <SEOHead />
      <PageHeader cart={cart} onCartClick={() => setIsCartOpen(true)} />

      {/* Hero Banner */}
      <section className="pt-4 pb-8 md:pt-6 md:pb-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
        <div
          className="relative overflow-hidden rounded-[2.5rem] bg-cover bg-center bg-no-repeat min-h-[480px] md:min-h-[600px] flex items-center justify-center text-center shadow-2xl"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${heroBackground})`,
          }}
        >
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
          <div className="relative z-10 px-6 max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-white mb-6 drop-shadow-lg tracking-tight leading-tight">
              {t("elevateExperience")}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 font-medium max-w-2xl mx-auto drop-shadow-md">
              {t("heroDesc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a
                href="#products"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-primary/25 flex items-center justify-center gap-2"
              >
                {t("shopNow")} <ArrowRight className="w-5 h-5" />
              </a>
              <LocalizedLink
                to="/premium-brands"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20"
              >
                {t("viewBrands")}
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="pt-4 pb-16 md:pt-6 md:pb-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl md:text-4xl font-heading font-black text-foreground tracking-tight">
              {language === "it" ? "Acquista Nicotine Pouches in Italia" : "Shop Nicotine Pouches in Italy"}
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl">
              {language === "it"
                ? "Seleziona marca, intensità e formato pack. Spedizione gratuita da €100."
                : "Choose brand, strength, and pack size. Free shipping from €100."}
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-end mb-6">
            {/* Filter Toggle Desktop/Mobile */}
            <div className="relative z-20">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3.5 text-sm font-bold transition-all duration-200 ${
                  isFilterOpen || hasActiveFilters
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                    : "bg-card text-foreground border-border hover:bg-muted"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>{t("filters")}</span>
                {hasActiveFilters && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-background text-[11px] text-foreground">
                    {selectedBrands.length + selectedStrengths.length + selectedFlavors.length}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Filter Panel */}
              <div
                className={`absolute right-0 top-full mt-3 w-screen max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl transition-all duration-300 origin-top-right ${
                  isFilterOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-bold text-lg">{t("filters")}</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs font-semibold text-destructive hover:text-destructive/80 transition-colors"
                    >
                      {t("clearFilters")}
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Brand Filter */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("brand")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {["ZYN", "LYFT", "VELO", "CUBA", "KILLA"].map((brand) => (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            selectedBrands.includes(brand)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Strength Filter */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("strength")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {[6, 8, 10, 15, 16].map((strength) => (
                        <button
                          key={strength}
                          onClick={() => toggleStrength(strength)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            selectedStrengths.includes(strength)
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {strength}mg
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Flavor Filter */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">{t("flavor")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {["Mint", "Citrus", "Berry", "Coffee", "Fruit", "Watermelon"].map((flavor) => (
                        <button
                          key={flavor}
                          onClick={() => toggleFlavor(flavor)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            selectedFlavors.includes(flavor)
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {flavor}
                        </button>
                      ))}
                    </div>
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
            <div className="rounded-3xl border border-dashed border-border bg-card/50 p-16 text-center">
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
