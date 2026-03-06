import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import type { CartItem } from "@/types/product";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string | number, packSize: number, quantity: number) => void;
  onRemove: (id: string | number, packSize: number) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const { t, language } = useTranslation();

  const FREE_SHIPPING_THRESHOLD = 100;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amountUntilFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const freeShippingProgress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-foreground/50 z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 shadow-2xl animate-slide-in">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-heading font-bold text-xl">{t("yourCart")}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t("emptyCart")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.packSize}`}
                    className="flex gap-4 p-4 bg-muted rounded-xl"
                  >
                    <div className="relative w-16 h-16 bg-muted rounded-[14px] overflow-hidden flex items-center justify-center border border-border/30">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="relative z-10 w-14 h-14 object-contain rounded-[10px]"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-[14px] border border-background/8" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading font-semibold text-sm">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.packSize} {t("cans")} × €{item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, item.packSize, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-full bg-card flex items-center justify-center hover:bg-primary/10 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.id, item.packSize, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-full bg-card flex items-center justify-center hover:bg-primary/10 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => onRemove(item.id, item.packSize)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="font-heading font-bold">
                        €{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-border">
              <div className="mb-4 rounded-xl border border-border bg-muted/40 p-3">
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
                  <span className="text-muted-foreground">€{total.toFixed(2)} / €{FREE_SHIPPING_THRESHOLD}</span>
                </div>
                <div className="h-2 rounded-full bg-background overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-300" style={{ width: `${freeShippingProgress}%` }} />
                </div>
                {amountUntilFreeShipping > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {language === "it"
                      ? "Suggerimento: aggiungi 1 pack in più per aumentare il valore ordine e sbloccare la spedizione gratuita."
                      : "Tip: add 1 more pack to increase order value and unlock free shipping."}
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">{t("total")}</span>
                <span className="font-heading font-bold text-2xl">
                  €{total.toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6"
                onClick={onCheckout}
              >
                {t("checkout")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
