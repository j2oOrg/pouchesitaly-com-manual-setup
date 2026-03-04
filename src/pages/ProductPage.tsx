import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Loader2, Info } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { useProduct, toFrontendProduct } from "@/hooks/useProducts";
import { trackCartEvent } from "@/hooks/useAnalyticsTracking";
import type { CartItem } from "@/types/product";
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
  const { t, language } = useTranslation();

  const product = dbProduct
    ? {
        ...toFrontendProduct(dbProduct, language as "en" | "it"),
        image: dbProduct.image || productImageFallback,
        image_2: dbProduct.image_2 || null,
        image_3: dbProduct.image_3 || null,
      }
    : null;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedPack, setSelectedPack] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  // Initialize cart from local storage if needed (or manage global state, but here we keep it local for simplicity and sync later if needed, assuming the same implementation as Index.tsx)
  useEffect(() => {
     // Ideally cart state is global. In this app it seems each page manages it or relies on checkout storage. Let's initialize from checkout storage if possible, otherwise empty.
     try {
       const savedCart = localStorage.getItem(CHECKOUT_CART_STORAGE_KEY);
       if (savedCart) {
         setCart(JSON.parse(savedCart));
       }
     } catch (e) {
       console.error("Failed to load cart", e);
     }
  }, []);

  // Update active image when product loads
  useEffect(() => {
    if (product && !activeImage) {
      setActiveImage(product.image);
    }
  }, [product, activeImage]);


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

  const handleAddToCart = () => {
    if (!product) return;

    const option = packOptions.find((opt) => opt.size === selectedPack);
    const discount = option?.discount || 0;
    const calculatedPrice = parseFloat((product.price * selectedPack * (1 - discount)).toFixed(2));

    trackCartEvent("add", String(product.id), selectedPack);

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.packSize === selectedPack
      );
      
      let newCart;
      if (existingItem) {
        newCart = prevCart.map((item) =>
          item.id === product.id && item.packSize === selectedPack
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prevCart, { ...product, price: calculatedPrice, quantity, packSize: selectedPack }];
      }
      
      localStorage.setItem(CHECKOUT_CART_STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    });

    setIsCartOpen(true);
    setQuantity(1); // Reset quantity after adding
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
        <SEOHead title="Product Not Found" />
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
  const pricePerCan = (product.price * (1 - selectedDiscount)).toFixed(2);
  const totalPackPrice = (product.price * selectedPack * (1 - selectedDiscount)).toFixed(2);
  const originalPackPrice = (product.price * selectedPack).toFixed(2);
  const savingsAmount = (product.price * selectedPack * selectedDiscount).toFixed(2);
  
  const allImages = [product.image, product.image_2, product.image_3].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 flex flex-col">
      <SEOHead 
        title={`${product.name} | ${product.brand} Nicotine Pouches`}
        description={product.description || `Buy ${product.name} by ${product.brand}. Premium nicotine pouches available now.`}
      />
      
      <PageHeader cart={cart} onCartClick={() => setIsCartOpen(true)} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
        <div className="mb-6">
          <LocalizedLink to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </LocalizedLink>
        </div>

        <div className="bg-card rounded-[2rem] border border-border shadow-sm p-6 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-muted/60 to-background/5 border border-border/50 flex items-center justify-center p-8 overflow-hidden">
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
                <div className="grid grid-cols-4 gap-3">
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
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="px-3 py-1 text-sm bg-background">
                  {product.brand}
                </Badge>
                <Badge variant="outline" className={`px-3 py-1 text-sm ${getStrengthColor(product.strength)}`}>
                  {product.strengthMg}mg / {product.strength}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-sm bg-background capitalize">
                  {product.flavor}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-heading font-black text-foreground mb-4 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              {product.description && (
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}

              <div className="space-y-6 flex-1">
                {/* Product Details Section */}
                <div className="bg-background rounded-2xl p-6 border border-border">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                    Product Details
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">Brand</span>
                      <span className="font-semibold text-foreground">{product.brand}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Format</span>
                      <span className="font-semibold text-foreground">Slim</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Strength</span>
                      <span className="font-semibold text-foreground">{product.strength} ({product.strengthMg}mg/g)</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Flavor Profile</span>
                      <span className="font-semibold text-foreground capitalize">{product.flavor}</span>
                    </div>
                  </div>
                  
                  {product.ingredients && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <span className="text-muted-foreground block mb-2 text-sm font-medium">Ingredients</span>
                      <p className="text-sm text-foreground leading-relaxed">
                        {product.ingredients}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pack Size Selection */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
                    Select Pack Size
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {packOptions.map((option) => {
                      const isSelected = selectedPack === option.size;
                      const isBestValue = option.size === 20;
                      const isPopular = option.size === 10;
                      const optPricePerCan = (product.price * (1 - option.discount)).toFixed(2);

                      return (
                        <button
                          key={option.size}
                          onClick={() => setSelectedPack(option.size)}
                          className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-border bg-background hover:border-primary/30 hover:bg-muted/30"
                          }`}
                        >
                          {isBestValue && (
                            <span className="absolute -top-2.5 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                              Best Value
                            </span>
                          )}
                          {isPopular && !isBestValue && (
                            <span className="absolute -top-2.5 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                              Popular
                            </span>
                          )}
                          
                          <span className={`text-2xl font-heading font-black mb-1 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {option.size}
                          </span>
                          <span className="text-xs text-muted-foreground mb-2">{t("cans")}</span>
                          
                          <div className={`w-full text-center py-1.5 rounded-lg mb-1 ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
                            <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>€{optPricePerCan}</span>
                            <span className="text-[10px] text-muted-foreground ml-1">/can</span>
                          </div>
                          
                          {option.discount > 0 ? (
                            <span className="text-[11px] font-bold text-emerald-500">
                              Save {Math.round(option.discount * 100)}%
                            </span>
                          ) : (
                            <span className="text-[11px] text-transparent">No discount</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-muted/40 rounded-2xl p-6 border border-border/50">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-muted-foreground font-medium">Total Price:</span>
                    <div className="flex items-end gap-3">
                      {selectedDiscount > 0 && (
                        <span className="text-lg text-muted-foreground line-through mb-0.5">
                          €{originalPackPrice}
                        </span>
                      )}
                      <span className="text-4xl font-heading font-black text-foreground">
                        €{totalPackPrice}
                      </span>
                    </div>
                  </div>
                  {selectedDiscount > 0 && (
                    <p className="text-right text-sm font-medium text-emerald-500 flex items-center justify-end gap-1">
                      <Info className="w-4 h-4" /> You are saving €{savingsAmount} with this pack
                    </p>
                  )}
                </div>

                {/* Add to Cart Actions */}
                <div className="flex gap-4 pt-4">
                  <div className="flex items-center justify-between border-2 border-border rounded-xl px-2 w-32 bg-background">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="font-heading font-bold text-lg w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <Button
                    size="lg"
                    className="flex-1 h-14 text-lg font-bold rounded-xl shadow-xl hover:shadow-primary/25 transition-all transform hover:scale-[1.02]"
                    onClick={handleAddToCart}
                  >
                    Add {quantity * selectedPack} Cans to Cart
                  </Button>
                </div>
                
                <div className="pt-6 mt-6 border-t border-border/50 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    In Stock & Ready to Ship
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    Discreet Packaging
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
