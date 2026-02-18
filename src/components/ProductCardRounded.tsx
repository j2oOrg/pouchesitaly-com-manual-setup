import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import type { Product } from "@/types/product";

interface ProductCardRoundedProps {
  product: Product;
  onAddToCart: (product: Product, packSize: number) => void;
}

const packOptions = [
  { size: 5, discount: 0.05 },
  { size: 10, discount: 0.12 },
  { size: 20, discount: 0.2 },
];

export function ProductCardRounded({ product, onAddToCart }: ProductCardRoundedProps) {
  const [selectedPack, setSelectedPack] = useState(10);
  const { t } = useTranslation();

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Regular":
        return "bg-primary/12 text-primary";
      case "Strong":
        return "bg-accent/12 text-accent";
      case "Extra Strong":
        return "bg-destructive/12 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getDiscountedPrice = (packSize: number) => {
    const option = packOptions.find((opt) => opt.size === packSize);
    const discount = option?.discount || 0;
    return (product.price * packSize * (1 - discount)).toFixed(2);
  };

  const getOriginalPrice = (packSize: number) => {
    return (product.price * packSize).toFixed(2);
  };

  const selectedOption = packOptions.find((option) => option.size === selectedPack);
  const selectedDiscount = selectedOption?.discount || 0;
  const savingsAmount = (product.price * selectedPack * selectedDiscount).toFixed(2);

  return (
    <div className="group bg-card/95 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/80 shadow-sm hover:shadow-md transition-all animate-fade-in h-full flex flex-col">
      <div className="relative aspect-square bg-gradient-to-br from-muted/80 via-muted/60 to-muted/30 p-4 overflow-hidden rounded-2xl">
        <span
          aria-hidden
          className="pointer-events-none absolute -left-10 -top-8 h-28 w-28 rounded-full bg-primary/15 blur-3xl"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-8 h-28 w-28 rounded-full bg-accent/10 blur-3xl"
        />
        <div className="relative z-10 h-full w-full max-w-[84%] max-h-[84%] mx-auto overflow-hidden rounded-[1.25rem] transition-transform duration-500 group-hover:-rotate-1">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain rounded-[1.25rem] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
          />
          <div className="pointer-events-none absolute inset-0 rounded-[1.25rem] border border-border/25" />
        </div>
        <Badge className={`absolute top-4 left-4 z-20 ${getStrengthColor(product.strength)}`}>
          {product.strengthMg}mg
        </Badge>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            {product.brand}
          </span>
        </div>
        <h3 className="font-heading font-bold text-lg text-foreground mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto">
          <p className="text-sm font-medium text-muted-foreground mb-3 tracking-wide">
            Pack size
          </p>
          <div className="flex gap-2 mb-4">
            {packOptions.map((option) => {
              const isSelected = selectedPack === option.size;
              return (
                <button
                  key={option.size}
                  onClick={() => setSelectedPack(option.size)}
                  className={`relative flex-1 rounded-xl border px-4 py-3 text-left transition-all ${isSelected
                    ? "bg-primary border-primary text-primary-foreground shadow-sm"
                    : "bg-muted/55 border-border/80 hover:border-primary/40 hover:bg-muted"}`}
                >
                  <span className="font-heading font-bold text-lg leading-none">
                    {option.size}
                  </span>
                  <span className="text-xs opacity-80 block mt-1">
                    {t("cans")}
                  </span>
                  {option.discount > 0 && (
                    <span
                      className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        isSelected ? "bg-white/25 text-white" : "bg-primary/10 text-primary"
                      }`}
                    >
                      -{Math.round(option.discount * 100)}%
                    </span>
                  )}
                  {isSelected && (
                    <span className="mt-2 block text-[11px] leading-none opacity-85">
                      Best value
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="bg-muted/55 rounded-xl p-4 border border-border/70 mb-4">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-heading font-bold text-foreground">
                €{getDiscountedPrice(selectedPack)}
              </span>
              {selectedDiscount > 0 && (
                <span className="text-sm text-muted-foreground line-through">
                  €{getOriginalPrice(selectedPack)}
                </span>
              )}
            </div>
            {selectedDiscount > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Save up to <span className="font-semibold text-primary">€{savingsAmount}</span> on this pack
              </p>
            )}
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            onClick={() => onAddToCart(product, selectedPack)}
          >
            {t("addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}

