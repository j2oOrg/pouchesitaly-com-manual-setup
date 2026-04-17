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
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(19,27,46,0.92),rgba(11,17,29,0.98))] shadow-[0_22px_58px_-30px_rgba(0,0,0,0.7)] transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_28px_70px_-32px_rgba(0,0,0,0.78)]">
      <span className="pointer-events-none absolute -left-20 -top-16 h-44 w-44 rounded-full bg-primary/16 blur-3xl" />
      <span className="pointer-events-none absolute -right-20 -bottom-16 h-44 w-44 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-4 mt-4 overflow-hidden rounded-[1.5rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-4 pt-4 pb-6">
        <LocalizedLink to={`/product/${product.id}`} className="block relative mx-auto flex h-56 w-full max-w-[16.5rem] items-center justify-center rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(20,28,48,0.98),rgba(9,14,24,0.98))] p-4 shadow-[0_18px_34px_-24px_rgba(0,0,0,0.72)]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          <span className="pointer-events-none absolute inset-0 rounded-[1.25rem] ring-1 ring-white/10" />
        </LocalizedLink>

        <div className="absolute left-5 top-5 right-5 flex items-start justify-between pointer-events-none">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-background/70 px-3 py-1.5 text-xs font-medium tracking-wide text-foreground shadow-sm backdrop-blur-sm">
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
              className="h-[76px] rounded-2xl border border-white/10 bg-background/70 px-4 text-left shadow-[0_10px_28px_-20px_rgba(0,0,0,0.65)] transition-colors hover:border-white/15 hover:bg-card focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <ChevronDown className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </SelectTrigger>

              <SelectContent className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(19,27,46,0.98),rgba(11,17,29,0.98))] p-1.5 shadow-[0_26px_48px_-24px_rgba(0,0,0,0.82)]">
                <SelectGroup>
                  {packOptions.map((option) => {
                    const pricing = getPackPricing(option.size);

                    return (
                      <SelectItem
                        key={option.size}
                        value={option.size.toString()}
                        className="my-1 rounded-xl px-4 py-3.5 data-[highlighted]:bg-white/6 data-[highlighted]:text-foreground"
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
            className="h-12 w-full bg-[linear-gradient(135deg,hsl(var(--primary))_0%,#38d9ff_100%)] text-primary-foreground font-bold shadow-[0_24px_38px_-24px_rgba(24,198,255,0.85)] transition-transform hover:-translate-y-0.5 hover:opacity-95"
            onClick={() => onAddToCart(product, selectedPack)}
          >
            {t("addToCart")}
          </Button>
        </div>
      </div>
    </article>
  );
}
