import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("selectPackSize")}
            </span>
          </div>
          
          <Select 
            value={selectedPack.toString()} 
            onValueChange={(val) => setSelectedPack(parseInt(val, 10))}
          >
            <SelectTrigger className="w-full h-14 bg-background border-2 border-border rounded-xl font-medium focus:ring-primary/20 transition-all hover:border-primary/40 text-left relative overflow-hidden">
              <div className="flex items-center justify-between w-full pr-1">
                <span className="font-bold flex items-center gap-2">
                  {selectedPack} {t("cans")}
                  {selectedPack === 20 && <span className="bg-destructive/10 text-destructive text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ml-1">Best Value</span>}
                  {selectedPack === 10 && <span className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ml-1">Popular</span>}
                </span>
                <div className="flex flex-col items-end text-right mr-1">
                  <span className="text-xs font-semibold text-foreground leading-none">
                    €{(product.price * (1 - (packOptions.find(o => o.size === selectedPack)?.discount || 0))).toFixed(2)}<span className="text-[10px] font-normal text-muted-foreground">/pz</span>
                  </span>
                  {(packOptions.find(o => o.size === selectedPack)?.discount || 0) > 0 && (
                    <span className="text-[9px] text-emerald-500 font-bold leading-none mt-0.5 block">
                      Save {Math.round((packOptions.find(o => o.size === selectedPack)?.discount || 0) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 border-border shadow-lg p-1" style={{ minWidth: 'var(--radix-select-trigger-width)' }}>
              {packOptions.map((option) => {
                const pricePerCan = (product.price * (1 - option.discount)).toFixed(2);
                const isBestValue = option.size === 20;
                const isPopular = option.size === 10;
                
                return (
                  <SelectItem 
                    key={option.size} 
                    value={option.size.toString()} 
                    className="cursor-pointer py-2.5 px-3 rounded-lg my-0.5 hover:bg-primary/5 focus:bg-primary/5 focus:text-foreground relative group">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">{option.size} {t("cans")}</span>
                          {isBestValue && (
                            <span className="bg-destructive/10 text-destructive text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">Best Value</span>
                          )}
                          {isPopular && !isBestValue && (
                            <span className="bg-secondary/10 text-secondary text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">Popular</span>
                          )}
                        </div>
                        {option.discount > 0 && (
                          <span className="text-[10px] font-medium text-emerald-500">
                            Save {Math.round(option.discount * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end pl-4">
                        <span className="font-semibold text-sm">€{pricePerCan}</span>
                        <span className="text-[9px] text-muted-foreground uppercase tracking-wider">/ pz</span>
                      </div>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
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
