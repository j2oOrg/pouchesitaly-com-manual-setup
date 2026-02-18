import { useState } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import type { CartItem } from "@/types/product";

interface CheckoutFlowProps {
  cart: CartItem[];
  onComplete: () => void;
  onClose: () => void;
}

export function CheckoutFlow({ cart, onComplete, onClose }: CheckoutFlowProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<"details" | "complete">("details");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would process the order
    setStep("complete");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-heading font-bold text-xl">
            {step === "complete" ? t("orderComplete") : t("checkout")}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {step === "details" ? (
          <form onSubmit={handleSubmit} className="p-6">
            {/* Order Summary */}
            <div className="bg-muted rounded-xl p-4 mb-6">
              <h3 className="font-heading font-semibold mb-3">Order Summary</h3>
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.packSize}`}
                  className="flex justify-between text-sm py-1"
                >
                  <span>
                    {item.name} ({item.packSize} {t("cans")}) × {item.quantity}
                  </span>
                  <span className="font-medium">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-border mt-3 pt-3 flex justify-between font-heading font-bold">
                <span>{t("total")}</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Details */}
            <h3 className="font-heading font-semibold mb-4">
              {t("shippingDetails")}
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="firstName">{t("firstName")}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t("lastName")}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">{t("address")}</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">{t("city")}</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="postalCode">{t("postalCode")}</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="country">{t("country")}</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6"
            >
              {t("placeOrder")}
            </Button>
          </form>
        ) : (
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-primary/12 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-heading font-bold text-2xl mb-2">
              {t("orderComplete")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t("orderConfirmation")}
            </p>
            <Button
              onClick={() => {
                onComplete();
                onClose();
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
