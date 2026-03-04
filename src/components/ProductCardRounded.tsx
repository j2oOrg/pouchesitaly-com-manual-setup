import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
        <div className="mb-4">
          <LocalizedLink to={`/product/${product.id}`} className="hover:text-primary transition-colors block">
            <h3 className="font-heading font-bold text-xl text-foreground line-clamp-1">
              {product.name}
            </h3>
          </LocalizedLink>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-auto space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.08em] bg-gradient-to-r from-primary via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {t("selectPackSize")}
              </span>
            </div>
            
            <Select 
              value={selectedPack.toString()} 
              onValueChange={(val) => setSelectedPack(parseInt(val, 10))}
            >
              <SelectTrigger
                hideIcon
                className="w-full h-[70px] bg-background border-2 border-primary/50 rounded-2xl font-medium transition-all hover:border-primary hover:bg-muted/5 text-left relative overflow-hidden px-4 shadow-[0_0_0_3px_rgba(50,120,93,0.12),0_10px_28px_rgba(50,120,93,0.18)] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
              >
                <div className="flex items-center justify-between w-full gap-3">
                  <div className="flex flex-col items-start gap-0.5">
                    <span className="font-bold text-base flex items-center gap-2 text-foreground">
                      {selectedPack} {t("cans")}
                    </span>
                    {selectedPack === 20 ? (
                      <span className="text-[10px] font-bold text-destructive uppercase tracking-tight bg-destructive/10 px-1.5 py-0.5 rounded-md border border-destructive/20">{t("bestValue")}</span>
                    ) : selectedPack === 10 ? (
                      <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight bg-indigo-50 px-1.5 py-0.5 rounded-md border border-indigo-100">{t("popular")}</span>
                    ) : (
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight">{t("standardPack")}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end text-right">
                      <span className="text-base font-black text-foreground">
                        €{(product.price * (1 - (packOptions.find(o => o.size === selectedPack)?.discount || 0))).toFixed(2)}
                        <span className="text-[11px] font-medium text-muted-foreground ml-0.5">/{t("cans").replace("lattine", "pz")}</span>
                      </span>
                      {(packOptions.find(o => o.size === selectedPack)?.discount || 0) > 0 && (
                        <span className="text-[11px] text-emerald-600 font-bold mt-0.5">
                          -{Math.round((packOptions.find(o => o.size === selectedPack)?.discount || 0) * 100)}% {t("save")}
                        </span>
                      )}
                    </div>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-blue-300/90 bg-blue-100 text-blue-700 shadow-[0_0_0_2px_rgba(59,130,246,0.14)]">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </SelectTrigger>

              <SelectContent className="rounded-2xl border-2 border-border shadow-2xl p-1.5 bg-white" style={{ minWidth: 'var(--radix-select-trigger-width)' }}>
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
                        className={`cursor-pointer py-3.5 px-4 rounded-xl my-1 transition-all duration-200 focus:bg-primary/5 focus:text-foreground data-[highlighted]:bg-primary/5 data-[highlighted]:text-foreground ${
                          isSelected 
                          ? "bg-primary/[0.08] text-primary border-primary/20 shadow-none" 
                          : "hover:bg-primary/5"
                        } relative group border border-transparent`}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-[15px] ${isSelected ? 'text-primary' : 'text-foreground'}`}>{option.size} {t("cans")}</span>
                              {isBestValue && (
                                <span className={`${isSelected ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-destructive text-white'} text-[9px] font-black uppercase px-1.5 py-0.5 rounded border shadow-sm`}>{t("bestValue")}</span>
                              )}
                              {isPopular && !isBestValue && (
                                <span className={`${isSelected ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-indigo-600 text-white'} text-[9px] font-black uppercase px-1.5 py-0.5 rounded border shadow-sm`}>{t("popular")}</span>
                              )}
                            </div>
                            {option.discount > 0 && (
                              <span className={`text-[11px] font-bold ${isSelected ? 'text-emerald-700' : 'text-emerald-600'}`}>
                                {t("save")} {Math.round(option.discount * 100)}% {t("onEveryCan")}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end pl-4">
                            <span className={`font-black text-[16px] ${isSelected ? 'text-primary' : 'text-foreground'}`}>€{pricePerCan}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-primary/70' : 'text-muted-foreground'}`}>/ {t("cans").replace("lattine", "pz")}</span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/50 p-4">
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
                {t("save")} <span className="font-semibold text-primary">€{savingsAmount}</span> {t("onEveryCan").replace("ogni lattina", "questo pack").replace("every can", "this pack")}
              </p>
            )}
          </div>

          <Button
            className="h-12 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            onClick={() => onAddToCart(product, selectedPack)}
          >
            {t("addToCart")}
          </Button>
        </div>
      </div>
    </article>
  );
}
