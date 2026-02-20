import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import { CheckoutFlow } from "@/components/CheckoutFlow";
import { trackCartEvent } from "@/hooks/useAnalyticsTracking";
import { useTranslation } from "@/hooks/useTranslation";
import type { CartItem } from "@/types/product";

const CHECKOUT_CART_STORAGE_KEY = "checkout_cart_v1";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const homePath =
    location.pathname === "/en" || location.pathname.startsWith("/en/")
      ? "/en"
      : location.pathname === "/it" || location.pathname.startsWith("/it/")
        ? "/it"
        : "/";

  useEffect(() => {
    const stateCart = (location.state as { cart?: CartItem[] } | null)?.cart;
    if (Array.isArray(stateCart) && stateCart.length > 0) {
      setCart(stateCart);
      localStorage.setItem(CHECKOUT_CART_STORAGE_KEY, JSON.stringify(stateCart));
      setIsHydrated(true);
      return;
    }

    const stored = localStorage.getItem(CHECKOUT_CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCart(parsed);
          setIsHydrated(true);
          return;
        }
      } catch (error) {
        console.error("Unable to load checkout cart from storage", error);
      }
    }

    setIsHydrated(true);
  }, [location.state]);

  const handleReturnToShop = () => {
    localStorage.removeItem(CHECKOUT_CART_STORAGE_KEY);
    navigate(homePath);
  };

  const handleCheckoutComplete = () => {
    trackCartEvent("checkout_complete");
    localStorage.removeItem(CHECKOUT_CART_STORAGE_KEY);
    navigate(homePath, { replace: true });
  };

  if (!isHydrated) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="fixed inset-0 bg-transparent overflow-hidden">
        <SEOHead />
        <main className="container mx-auto h-full px-4 py-4 flex flex-col justify-center">
          <Button variant="outline" onClick={handleReturnToShop}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
          <div className="mt-6 rounded-2xl border border-border bg-card p-8 text-center">
            <h1 className="font-heading font-bold text-3xl mb-3">{t("checkout")}</h1>
            <p className="text-muted-foreground mb-6">{t("emptyCart")}</p>
            <Button onClick={handleReturnToShop}>{t("back")}</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-transparent overflow-hidden">
      <SEOHead />
      <main className="container mx-auto h-full px-4 grid grid-rows-[auto_1fr]">
        <div className="mb-4">
          <Button variant="outline" onClick={handleReturnToShop}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("back")}
          </Button>
        </div>
        <section className="min-h-0 h-full overflow-hidden">
          <CheckoutFlow
            cart={cart}
            onComplete={handleCheckoutComplete}
            onBack={handleReturnToShop}
          />
        </section>
      </main>
    </div>
  );
}
