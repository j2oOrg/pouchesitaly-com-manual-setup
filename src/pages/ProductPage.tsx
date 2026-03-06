import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Loader2, Info, ChevronDown } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { useProduct, useProducts, toFrontendProduct } from "@/hooks/useProducts";
import { trackCartEvent } from "@/hooks/useAnalyticsTracking";
import type { Product, CartItem } from "@/types/product";
import productImageFallback from "@/assets/product-can.png";

const packOptions = [
  { size: 5, discount: 0.05 },
  { size: 10, discount: 0.12 },
  { size: 20, discount: 0.20 },
];
const CHECKOUT_CART_STORAGE_KEY = "checkout_cart_v1";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: dbProduct, isLoading, error } = useProduct(id);
  const { data: dbProducts } = useProducts();
  const { t, language } = useTranslation();

  const product = dbProduct
    ? {
        ...toFrontendProduct(dbProduct, language as "en" | "it"),
        image: dbProduct.image || productImageFallback,
        image_2: dbProduct.image_2 || null,
        image_3: dbProduct.image_3 || null,
      }
    : null;
  
  const relatedProducts: Product[] =
    product && dbProducts
      ? dbProducts
          .filter((item) => item.brand === dbProduct?.brand && item.id !== dbProduct.id)
          .slice(0, 8)
          .map((item) => ({
            ...toFrontendProduct(item, language as "en" | "it"),
            image: item.image || productImageFallback,
          }))
      : [];
  const relatedSectionTitle =
    language === "it"
      ? `Altri prodotti ${product?.brand || ""}`.trim()
      : `More from ${product?.brand || ""}`.trim();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(10);
  const [relatedPackSelections, setRelatedPackSelections] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Initialize cart from local storage if needed
  useEffect(() => {
     try {
       const savedCart = localStorage.getItem(CHECKOUT_CART_STORAGE_KEY);
       if (savedCart) {
         setCart(JSON.parse(savedCart));
       }
     } catch (e) {
       console.error("Failed to load cart", e);
     }
  }, []);

  // Update active image and controls when product changes
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedPack(10);
      setQuantity(1);
    }
  }, [product?.id]);


  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Regular":
        return "bg-primary/12 text-primary border-primary/20";
      case "Strong":
        return "bg-accent/12 text-accent border-accent/20";
      case "Extra Strong":
        return "bg-destructive/12 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const addProductToCart = (targetProduct: Product, packSize: number, qty: number) => {
    const option = packOptions.find((opt) => opt.size === packSize);
    const discount = option?.discount || 0;
    const calculatedPrice = parseFloat((targetProduct.price * packSize * (1 - discount)).toFixed(2));

    trackCartEvent("add", String(targetProduct.id), packSize);

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === targetProduct.id && item.packSize === packSize
      );
      
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === targetProduct.id && item.packSize === packSize
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        newCart = [...prevCart, { ...targetProduct, price: calculatedPrice, quantity: qty, packSize }];
      }
      
      localStorage.setItem(CHECKOUT_CART_STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    });

    setIsCartOpen(true);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addProductToCart(product, selectedPack, quantity);
    setQuantity(1);
  };

  const getRelatedPackSize = (productId: string | number) => {
    return relatedPackSelections[String(productId)] ?? 10;
  };

  const handleRelatedPackChange = (productId: string | number, packSize: number) => {
    setRelatedPackSelections((prev) => ({
      ...prev,
      [String(productId)]: packSize,
    }));
  };

  const handleAddRelatedToCart = (relatedProduct: Product) => {
    addProductToCart(relatedProduct, getRelatedPackSize(relatedProduct.id), 1);
  };

  const handleUpdateQuantity = (cartId: string | number, packSize: number, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveFromCart(cartId, packSize);
    } else {
      setCart((prevCart) => {
        const newCart = prevCart.map((item) =>
          item.id === cartId && item.packSize === packSize ? { ...item, quantity: newQuantity } : item
        );
        localStorage.setItem(CHECKOUT_CART_STORAGE_KEY, JSON.stringify(newCart));
        return newCart;
      });
    }
  };

  const handleRemoveFromCart = (cartId: string | number, packSize: number) => {
    trackCartEvent("remove", String(cartId), packSize);
    setCart((prevCart) => {
      const newCart = prevCart.filter((item) => !(item.id === cartId && item.packSize === packSize));
      localStorage.setItem(CHECKOUT_CART_STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    });
  };

  const handleCheckoutStart = () => {
    trackCartEvent("checkout_start");
    localStorage.setItem(CHECKOUT_CART_STORAGE_KEY, JSON.stringify(cart));
    navigate("/checkout", {
      state: { cart },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <PageHeader cart={cart} onCartClick={() => setIsCartOpen(true)} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <SEOHead defaultTitle="Product Not Found | Pouchesitaly" defaultDescription="The requested product could not be found." noindex />
        <PageHeader cart={cart} onCartClick={() => setIsCartOpen(true)} />
        <div className="flex-1 container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you are looking for does not exist or is no longer available.</p>
          <LocalizedLink to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </LocalizedLink>
        </div>
        <Footer />
      </div>
    );
  }

  const selectedOption = packOptions.find((option) => option.size === selectedPack);
  const selectedDiscount = selectedOption?.discount || 0;
  const totalPackPrice = (product.price * selectedPack * (1 - selectedDiscount)).toFixed(2);
  const originalPackPrice = (product.price * selectedPack).toFixed(2);
  const savingsAmount = (product.price * selectedPack * selectedDiscount).toFixed(2);
  
  const allImages = [product.image, product.image_2, product.image_3].filter(Boolean) as string[];
  const localePrefix = language === "it" ? "" : "/en";
  const productUrl = `https://pouchesitaly.com${localePrefix}/product/${product.id}`;
  const productTitle = `${product.name} | ${product.brand} ${language === "it" ? "Nicotine Pouches" : "Nicotine Pouches"} | Pouchesitaly`;
  const productDescription =
    product.description ||
    (language === "it"
      ? `Acquista ${product.name} di ${product.brand}. Spedizione in Italia e packaging discreto.`
      : `Buy ${product.name} by ${product.brand}. Fast shipping in Italy and discreet packaging.`);
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: allImages.map((img) => (img.startsWith("http") ? img : `https://pouchesitaly.com${img.startsWith("/") ? "" : "/"}${img}`)),
      description: productDescription,
      sku: String(product.id),
      brand: {
        "@type": "Brand",
        name: product.brand,
      },
      offers: {
        "@type": "Offer",
        url: productUrl,
        priceCurrency: "EUR",
        price: Number(totalPackPrice),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: language === "it" ? "Home" : "Home",
          item: `https://pouchesitaly.com${localePrefix || "/"}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: product.brand,
          item: `https://pouchesitaly.com${localePrefix}/premium-brands`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: product.name,
          item: productUrl,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
      <SEOHead
        defaultTitle={productTitle}
        defaultDescription={productDescription}
        structuredData={structuredData}
      />
      
      <PageHeader cart={cart} onCartClick={() => setIsCartOpen(true)} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 max-w-7xl">
        <div className="mb-4 md:mb-6">
          <LocalizedLink to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            {t("backToProducts")}
          </LocalizedLink>
        </div>

        <div className="bg-card rounded-[1.5rem] md:rounded-[2rem] border border-border shadow-sm p-4 md:p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-muted/60 to-background/5 border border-border/50 flex items-center justify-center p-6 md:p-8 overflow-hidden">
                <span className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
                <span className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
                
                {activeImage && (
                  <img
                    src={activeImage}
                    alt={product.name}
                    className="relative z-10 w-full h-full object-contain filter drop-shadow-xl animate-in fade-in zoom-in duration-500"
                  />
                )}
              </div>
              
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-square rounded-xl border-2 overflow-hidden bg-muted/30 transition-all ${
                        activeImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-border'
                      }`}
                    >
                      <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-contain p-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="px-2 py-0.5 text-xs bg-background">
                  {product.brand}
                </Badge>
                <Badge variant="outline" className={`px-2 py-0.5 text-xs ${getStrengthColor(product.strength)}`}>
                  {product.strengthMg}mg / {product.strength}
                </Badge>
                <Badge variant="outline" className="px-2 py-0.5 text-xs bg-background capitalize">
                  {product.flavor}
                </Badge>
              </div>

              <h1 className="text-3xl md:text-5xl font-heading font-black text-foreground mb-3 md:mb-4 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              {product.description && (
                <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="space-y-6 flex-1">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.12em] bg-gradient-to-r from-primary via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      {t("selectPackSize")}
                    </h3>
                  </div>
                  
                  <Select 
                    value={selectedPack.toString()} 
                    onValueChange={(val) => setSelectedPack(parseInt(val, 10))}
                  >
                    <SelectTrigger
                      hideIcon
                      className="w-full h-[80px] bg-background border-2 border-primary/50 rounded-2xl font-medium transition-all hover:border-primary hover:bg-muted/5 text-left relative overflow-hidden px-6 shadow-[0_0_0_3px_rgba(50,120,93,0.12),0_10px_30px_rgba(50,120,93,0.2)] focus-visible:ring-2 focus-visible:ring-primary/55 focus-visible:ring-offset-2"
                    >
                      <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-bold text-xl flex items-center gap-3 text-foreground">
                            {selectedPack} {t("cans")}
                          </span>
                          <div className="flex gap-2">
                            {selectedPack === 20 ? (
                              <span className="text-[10px] font-black text-destructive uppercase tracking-wider bg-destructive/10 px-2 py-0.5 rounded-md border border-destructive/20">{t("bestValue")}</span>
                            ) : selectedPack === 10 ? (
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{t("popular")}</span>
                            ) : (
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{t("standardPack")}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end text-right">
                            <span className="text-xl font-black text-foreground">
                              €{(product.price * (1 - (packOptions.find(o => o.size === selectedPack)?.discount || 0))).toFixed(2)}
                              <span className="text-xs font-medium text-muted-foreground ml-1">/{t("cans").replace("lattine", "pz")}</span>
                            </span>
                            {(packOptions.find(o => o.size === selectedPack)?.discount || 0) > 0 && (
                              <span className="text-xs text-emerald-600 font-bold mt-1">
                                {t("save")} {Math.round((packOptions.find(o => o.size === selectedPack)?.discount || 0) * 100)}% {t("today")}
                              </span>
                            )}
                          </div>
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-300/90 bg-blue-100 text-blue-700 shadow-[0_0_0_2px_rgba(59,130,246,0.14)]">
                            <ChevronDown className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-[2rem] border-2 border-border shadow-2xl p-2 bg-white">
                      <SelectGroup>
                        {packOptions.map((option) => {
                          const pricePerCan = (product.price * (1 - option.discount)).toFixed(2);
                          const isBestValue = option.size === 20;
                          const isPopular = option.size === 10;
                          const isSelected = selectedPack === option.size;
                          
                          return (
                            <SelectItem 
                              key={option.size} 
                              value={option.size.toString()} 
                              className={`cursor-pointer py-5 px-6 rounded-[1.5rem] my-1.5 transition-all duration-300 focus:bg-primary/5 focus:text-foreground data-[highlighted]:bg-primary/5 data-[highlighted]:text-foreground ${
                                isSelected 
                                ? "bg-primary/[0.08] text-primary border-primary/20 shadow-none" 
                                : "hover:bg-primary/5"
                              } border border-transparent`}>
                              <div className="flex items-center justify-between w-full">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-3">
                                    <span className={`font-bold text-lg ${isSelected ? 'text-primary' : 'text-foreground'}`}>{option.size} {t("cans")}</span>
                                    {isBestValue && (
                                      <span className={`${isSelected ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-destructive text-white'} text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm`}>Best Value</span>
                                    )}
                                    {isPopular && !isBestValue && (
                                      <span className={`${isSelected ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-indigo-600 text-white'} text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm`}>Popular</span>
                                    )}
                                  </div>
                                  {option.discount > 0 && (
                                    <span className={`text-xs font-bold ${isSelected ? 'text-emerald-700' : 'text-emerald-600'}`}>
                                      {t("exclusiveDiscount")} {Math.round(option.discount * 100)}%
                                    </span>
                                  )}
                                </div>
                                <div className="flex flex-col items-end pl-8">
                                  <span className={`font-black text-xl ${isSelected ? 'text-primary' : 'text-foreground'}`}>€{pricePerCan}</span>
                                  <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${isSelected ? 'text-primary/70' : 'text-muted-foreground'}`}>/ {t("cans").replace("lattine", "pz")}</span>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Summary */}
                <div className="bg-muted/30 rounded-2xl p-4 md:p-6 border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading text-sm md:text-base font-semibold tracking-[0.04em] text-foreground/80">
                      {t("totalPrice")}:
                    </span>
                    <div className="flex items-center gap-3">
                      {selectedDiscount > 0 && (
                        <span className="text-base md:text-lg text-muted-foreground line-through">
                          €{originalPackPrice}
                        </span>
                      )}
                      <span className="text-3xl md:text-4xl font-heading font-black text-foreground">
                        €{totalPackPrice}
                      </span>
                    </div>
                  </div>
                  {selectedDiscount > 0 && (
                    <p className="text-right text-xs md:text-sm font-medium text-emerald-500 flex items-center justify-end gap-1">
                      <Info className="w-3 h-3 md:w-4 md:h-4" /> {t("youSave")} €{savingsAmount}
                    </p>
                  )}
                </div>

                {/* Add to Cart Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <div className="flex items-center justify-between border-2 border-border rounded-xl px-2 h-14 w-full sm:w-32 bg-background">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="font-heading font-bold text-xl w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <Button
                    size="lg"
                    className="flex-1 h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all active:scale-95"
                    onClick={handleAddToCart}
                  >
                    {t("addToCart")} ({quantity * selectedPack} {t("cans")})
                  </Button>
                </div>
                
                {/* Product Details Section */}
                <div className="bg-background rounded-2xl p-6 border border-border mt-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    {t("productSpecifications")}
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">{t("brand")}</span>
                      <span className="font-semibold text-foreground">{product.brand}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">{t("format")}</span>
                      <span className="font-semibold text-foreground">Slim</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">{t("strength")}</span>
                      <span className="font-semibold text-foreground">{product.strength} ({product.strengthMg}mg/g)</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">{t("flavorProfile")}</span>
                      <span className="font-semibold text-foreground capitalize">{product.flavor}</span>
                    </div>
                  </div>
                  
                  {product.ingredients && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <span className="text-muted-foreground block mb-2 text-sm font-medium">{t("ingredients")}</span>
                      <p className="text-sm text-foreground leading-relaxed">
                        {product.ingredients}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-8 md:mt-12">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-4 md:mb-6">
              {relatedSectionTitle}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => {
                const relatedPackSize = getRelatedPackSize(relatedProduct.id);
                return (
                  <article
                    key={relatedProduct.id}
                    className="rounded-2xl border border-border bg-card p-3 md:p-4 shadow-sm"
                  >
                    <LocalizedLink
                      to={`/product/${relatedProduct.id}`}
                      className="block relative aspect-square rounded-xl border border-border/50 bg-muted/20 p-3 overflow-hidden"
                    >
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-contain"
                      />
                    </LocalizedLink>
                    <div className="mt-3 space-y-3">
                      <Select
                        value={String(relatedPackSize)}
                        onValueChange={(val) => handleRelatedPackChange(relatedProduct.id, parseInt(val, 10))}
                      >
                        <SelectTrigger
                          hideIcon
                          className="h-11 rounded-lg border-2 border-primary/45 px-3 text-sm bg-background transition-all hover:border-primary shadow-[0_0_0_2px_rgba(50,120,93,0.1),0_8px_18px_rgba(50,120,93,0.14)] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                        >
                          <div className="flex items-center justify-between w-full gap-2">
                            <span className="font-semibold text-foreground">{relatedPackSize} {t("cans")}</span>
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-blue-300/90 bg-blue-100 text-blue-700 shadow-[0_0_0_2px_rgba(59,130,246,0.14)]">
                              <ChevronDown className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border border-border bg-white">
                          <SelectGroup>
                            {packOptions.map((option) => {
                              const isSelected = relatedPackSize === option.size;
                              return (
                                <SelectItem
                                  key={option.size}
                                  value={String(option.size)}
                                  className={`focus:bg-primary/5 focus:text-foreground data-[highlighted]:bg-primary/5 data-[highlighted]:text-foreground ${
                                    isSelected
                                      ? "bg-primary/[0.08] text-primary border-primary/20 shadow-none"
                                      : "hover:bg-primary/5"
                                  } border border-transparent`}
                                >
                                  {option.size} {t("cans")}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button
                        className="w-full h-10 text-sm font-bold"
                        onClick={() => handleAddRelatedToCart(relatedProduct)}
                      >
                        {t("addToCart")}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />

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
