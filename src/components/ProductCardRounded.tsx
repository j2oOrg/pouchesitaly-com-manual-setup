import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocalizedLink } from "@/components/LocalizedLink";
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
        <LocalizedLink to={`/product/${product.id}`} className="block relative mx-auto flex h-56 w-full max-w-[16.5rem] items-center justify-center rounded-[1.25rem] border border-border/25 bg-card/85 p-4 shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <span className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-1 ring-border/40" />
        </LocalizedLink>

        <div className="absolute left-5 top-5 right-5 flex items-start justify-between pointer-events-none">
          <span className="inline-flex items-center rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium tracking-wide text-foreground shadow-sm backdrop-blur-sm">
            {product.brand}
          </span>
          <Badge className={`${getStrengthColor(product.strength)} rounded-full px-3 py-1 text-xs shadow-sm`}>
            {product.strengthMg}mg
          </Badge>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-6 pt-4">
        <LocalizedLink to={`/product/${product.id}`} className="hover:text-primary transition-colors block">
          <h3 className="font-heading font-bold text-xl text-foreground">
            {product.name}
          </h3>
        </LocalizedLink>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select Quantity
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {packOptions.map((option) => {
              const isSelected = selectedPack === option.size;
              const pricePerCan = (product.price * (1 - option.discount)).toFixed(2);
              const isBestValue = option.size === 20;
              const isPopular = option.size === 10;

              return (
                <button
                  key={option.size}
                  onClick={() => setSelectedPack(option.size)}
                  className={`relative flex items-center justify-between overflow-hidden rounded-xl border p-3 transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                      : "border-border bg-background hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  {isBestValue && (
                    <span className="absolute right-0 top-0 rounded-bl-lg rounded-tr-xl bg-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground">
                      Best Value
                    </span>
                  )}
                  {isPopular && !isSelected && !isBestValue && (
                    <span className="absolute right-0 top-0 rounded-bl-lg rounded-tr-xl bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                      Popular
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/30 bg-transparent"}`}>
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className={`font-semibold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                        {option.size} {t("cans")}
                      </span>
                      {option.discount > 0 && (
                        <span className="text-[11px] font-medium text-emerald-500">
                          Save {Math.round(option.discount * 100)}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end pt-1">
                    <span className={`font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                      €{pricePerCan}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      / pz
                    </span>
                  </div>
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
