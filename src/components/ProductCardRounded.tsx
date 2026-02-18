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
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card/95 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
      <span className="pointer-events-none absolute -left-20 -top-16 h-44 w-44 rounded-full bg-primary/12 blur-3xl" />
      <span className="pointer-events-none absolute -right-20 -bottom-16 h-44 w-44 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-4 mt-4 overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-muted/60 to-background/5 px-4 pt-4 pb-6">
        <div className="relative mx-auto flex h-56 w-full max-w-[16.5rem] items-center justify-center rounded-[1.25rem] border border-border/25 bg-card/85 p-4 shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <span className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-1 ring-border/40" />
        </div>

        <div className="absolute left-5 top-5 right-5 flex items-start justify-between">
          <span className="inline-flex items-center rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium tracking-wide text-foreground shadow-sm backdrop-blur-sm">
            {product.brand}
          </span>
          <Badge className={`${getStrengthColor(product.strength)} rounded-full px-3 py-1 text-xs shadow-sm`}>
            {product.strengthMg}mg
          </Badge>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-6 pt-4">
        <h3 className="font-heading font-bold text-xl text-foreground">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="mt-5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Pack size
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {packOptions.map((option) => {
              const isSelected = selectedPack === option.size;
              return (
                <button
                  key={option.size}
                  onClick={() => setSelectedPack(option.size)}
                  className={`relative rounded-xl border p-3 text-left transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/25"
                      : "bg-muted/60 border-border/80 hover:border-primary/35 hover:bg-muted"
                  }`}
                >
                  <span className="font-heading font-bold leading-none text-sm md:text-base">
                    {option.size}
                  </span>
                  <span className="mt-1 block text-[11px] opacity-80">
                    {t("cans")}
                  </span>
                  {option.discount > 0 && (
                    <span
                      className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        isSelected ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                      }`}
                    >
                      -{Math.round(option.discount * 100)}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-border/70 bg-muted/50 p-4">
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
              Save <span className="font-semibold text-primary">€{savingsAmount}</span> on this pack
            </p>
          )}
        </div>

        <Button
          className="mt-4 h-12 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          onClick={() => onAddToCart(product, selectedPack)}
        >
          {t("addToCart")}
        </Button>
      </div>
    </article>
  );
}
