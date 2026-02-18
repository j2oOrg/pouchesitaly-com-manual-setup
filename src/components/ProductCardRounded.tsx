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
  { size: 20, discount: 0.20 },
];

export function ProductCardRounded({ product, onAddToCart }: ProductCardRoundedProps) {
  const [selectedPack, setSelectedPack] = useState(10);
  const { t } = useTranslation();

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case "Regular":
        return "bg-green-100 text-green-800";
      case "Strong":
        return "bg-orange-100 text-orange-800";
      case "Extra Strong":
        return "bg-red-100 text-red-800";
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

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow animate-fade-in h-full flex flex-col">
      {/* Image */}
      <div className="relative aspect-square bg-muted p-6">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
        <Badge className={`absolute top-4 left-4 ${getStrengthColor(product.strength)}`}>
          {product.strengthMg}mg
        </Badge>
      </div>

      {/* Content */}
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

        {/* Pack Options */}
        <div className="mt-auto">
        <div className="flex gap-2 mb-4">
          {packOptions.map((option) => (
            <button
              key={option.size}
              onClick={() => setSelectedPack(option.size)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                selectedPack === option.size
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              <span className="block">{option.size}</span>
              <span className="text-xs opacity-70">{t("cans")}</span>
              {option.discount > 0 && (
                <span className="block text-xs mt-1 font-bold">
                  -{Math.round(option.discount * 100)}%
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-heading font-bold text-foreground">
            €{getDiscountedPrice(selectedPack)}
          </span>
          {selectedPack > 5 && (
            <span className="text-sm text-muted-foreground line-through">
              €{getOriginalPrice(selectedPack)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
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