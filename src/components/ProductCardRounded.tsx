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
  const { t, language } = useTranslation();

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

  const formatPrice = (value: number) => value.toFixed(2);
  const perCanSuffix = language === "it" ? "/lattina" : "/can";

  const getPackPricing = (packSize: number) => {
    const option = packOptions.find((opt) => opt.size === packSize);
    const discount = option?.discount || 0;
    const originalTotal = product.price * packSize;
    const discountedTotal = originalTotal * (1 - discount);
    const pricePerCan = product.price * (1 - discount);

    return {
      discountedTotal,
      pricePerCan,
    };
  };

  const selectedPricing = getPackPricing(selectedPack);

  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-black/[0.06] bg-card shadow-[0_18px_42px_-28px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.08] hover:shadow-[0_24px_56px_-30px_rgba(15,23,42,0.4)]">
      <span className="pointer-events-none absolute -left-20 -top-16 h-44 w-44 rounded-full bg-primary/12 blur-3xl" />
      <span className="pointer-events-none absolute -right-20 -bottom-16 h-44 w-44 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-4 mt-4 overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-muted/60 to-background/5 px-4 pt-4 pb-6">
        <LocalizedLink to={`/product/${product.id}`} className="block relative mx-auto flex h-56 w-full max-w-[16.5rem] items-center justify-center rounded-[1.25rem] border border-black/[0.04] bg-card p-4 shadow-[0_10px_28px_-20px_rgba(15,23,42,0.28)]">
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
            <h3 className="min-h-[3rem] font-heading font-bold text-[1.5rem] leading-[1.12] text-foreground line-clamp-2">
              {product.name}
            </h3>
          </LocalizedLink>
          <p className="mt-2 min-h-[3rem] text-sm leading-6 text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-auto space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-[0.08em] text-foreground">
                {t("selectPackSize")}
              </span>
            </div>

            <Select
              value={selectedPack.toString()}
              onValueChange={(value) => setSelectedPack(parseInt(value, 10))}
            >
              <SelectTrigger
                hideIcon
                className="h-[76px] rounded-2xl border border-black/[0.06] bg-background px-4 text-left shadow-[0_8px_24px_-20px_rgba(15,23,42,0.4)] transition-colors hover:border-black/[0.1] hover:bg-card focus-visible:ring-2 focus-visible:ring-black/10 focus-visible:ring-offset-2"
              >
                <div className="flex w-full flex-col gap-1.5">
                  <span className="whitespace-nowrap text-sm font-semibold text-foreground">
                    {selectedPack} {t("cans")}
                  </span>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2.5 whitespace-nowrap">
                      <span className="text-2xl font-heading font-black tracking-tight text-foreground">
                        €{formatPrice(selectedPricing.discountedTotal)}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        €{formatPrice(selectedPricing.pricePerCan)}{perCanSuffix}
                      </span>
                    </div>
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted/80 text-muted-foreground">
                      <ChevronDown className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </SelectTrigger>

              <SelectContent className="rounded-2xl border border-black/[0.06] bg-card p-1.5 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.45)]">
                <SelectGroup>
                  {packOptions.map((option) => {
                    const pricing = getPackPricing(option.size);

                    return (
                      <SelectItem
                        key={option.size}
                        value={option.size.toString()}
                        className="my-1 rounded-xl px-4 py-3.5 data-[highlighted]:bg-muted data-[highlighted]:text-foreground"
                      >
                        <div className="flex w-full items-center justify-between gap-4">
                          <span className="font-semibold text-foreground">
                            {option.size} {t("cans")}
                          </span>
                          <div className="flex items-baseline justify-end gap-2.5 whitespace-nowrap">
                            <span className="text-base font-black text-foreground">
                              €{formatPrice(pricing.discountedTotal)}
                            </span>
                            <span className="text-[11px] font-medium text-muted-foreground">
                              €{formatPrice(pricing.pricePerCan)}{perCanSuffix}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
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
