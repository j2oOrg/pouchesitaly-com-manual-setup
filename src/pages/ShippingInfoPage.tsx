import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowRight, CheckCircle2, Clock, MapPin, Package, Truck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "@/hooks/useTranslation";

type DeliveryZone = {
  region: string;
  eta: string;
  description: string;
  badgeClass: string;
  accentClass: string;
};

export default function ShippingInfoPage() {
  const { t, language } = useTranslation();
  const isItalian = language === "it";

  const pageTitle = isItalian ? "Spedizione in Italia" : "Shipping in Italy";
  const pageDescription = isItalian
    ? "Spediamo esclusivamente in Italia con corrieri nazionali tracciati. Spedizione gratuita da €100, altrimenti tariffa fissa di €6,90."
    : "We ship exclusively within Italy using tracked domestic couriers. Free shipping from €100, otherwise a flat €6.90 fee.";

  const italyOnlyBadge = isItalian ? "Spedizione Solo Italia" : "Italy-Only Shipping";

  const coverageTitle = isItalian ? "Copertura Nazionale" : "Nationwide Coverage";
  const coverageDescription = isItalian
    ? "Consegniamo in tutte le regioni italiane, dalle grandi città ai centri più piccoli."
    : "We deliver to all Italian regions, from major cities to smaller towns.";

  const dispatchTitle = isItalian ? "Preparazione Rapida" : "Fast Dispatch";
  const dispatchDescription = isItalian
    ? "Gli ordini confermati entro le 16:00 vengono generalmente affidati al corriere lo stesso giorno lavorativo."
    : "Orders confirmed by 4:00 PM are usually handed to the courier on the same business day.";

  const pricingTitle = isItalian ? "Regole di Spedizione" : "Shipping Rules";
  const pricingDescription = isItalian
    ? "Regola semplice: sotto €100 la spedizione costa €6,90. Da €100 in su, è gratuita."
    : "Simple rule: below €100 shipping is €6.90. From €100 and above, shipping is free.";

  const deliveryZonesTitle = isItalian ? "Tempi di Consegna in Italia" : "Delivery Times in Italy";
  const deliveryZonesIntro = isItalian
    ? "Tempi medi stimati per area geografica."
    : "Estimated average delivery times by region.";

  const deliveryZones: DeliveryZone[] = isItalian
    ? [
        {
          region: "Nord Italia",
          eta: "1-2 giorni",
          description: "Consegna rapida nelle principali aree del nord.",
          badgeClass: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
          accentClass: "from-emerald-500/20 to-emerald-500/0",
        },
        {
          region: "Centro Italia",
          eta: "1-3 giorni",
          description: "Spedizione affidabile nelle regioni centrali.",
          badgeClass: "border-sky-200/80 bg-sky-50 text-sky-700",
          accentClass: "from-sky-500/20 to-sky-500/0",
        },
        {
          region: "Sud Italia",
          eta: "2-4 giorni",
          description: "Tempi medi per le regioni del sud.",
          badgeClass: "border-indigo-200/80 bg-indigo-50 text-indigo-700",
          accentClass: "from-indigo-500/20 to-indigo-500/0",
        },
        {
          region: "Isole (Sicilia e Sardegna)",
          eta: "3-5 giorni",
          description: "Copertura completa per le isole.",
          badgeClass: "border-amber-200/80 bg-amber-50 text-amber-700",
          accentClass: "from-amber-500/20 to-amber-500/0",
        },
      ]
    : [
        {
          region: "Northern Italy",
          eta: "1-2 days",
          description: "Fast delivery across key northern areas.",
          badgeClass: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
          accentClass: "from-emerald-500/20 to-emerald-500/0",
        },
        {
          region: "Central Italy",
          eta: "1-3 days",
          description: "Reliable delivery in central regions.",
          badgeClass: "border-sky-200/80 bg-sky-50 text-sky-700",
          accentClass: "from-sky-500/20 to-sky-500/0",
        },
        {
          region: "Southern Italy",
          eta: "2-4 days",
          description: "Typical timing for southern regions.",
          badgeClass: "border-indigo-200/80 bg-indigo-50 text-indigo-700",
          accentClass: "from-indigo-500/20 to-indigo-500/0",
        },
        {
          region: "Islands (Sicily & Sardinia)",
          eta: "3-5 days",
          description: "Full coverage for island destinations.",
          badgeClass: "border-amber-200/80 bg-amber-50 text-amber-700",
          accentClass: "from-amber-500/20 to-amber-500/0",
        },
      ];

  const trackingDescription = isItalian
    ? "Quando il tuo ordine parte, ricevi via email il codice di tracciamento per seguirlo in tempo reale fino alla consegna."
    : "Once your order ships, you receive a tracking code by email so you can follow each step in real time until delivery.";

  const checklistTitle = isItalian ? "Prima della Spedizione" : "Before Dispatch";
  const checklistItems = isItalian
    ? [
        "Controllo qualità del prodotto",
        "Verifica indirizzo e contatto",
        "Imballaggio anonimo e sicuro",
      ]
    : ["Product quality check", "Address and contact verification", "Plain and secure packaging"];

  const ctaText = isItalian
    ? "Ordina ora per ricevere consegna rapida in tutta Italia e spedizione gratuita da €100."
    : "Place your order now for fast delivery across Italy and free shipping from €100.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <SEOHead defaultTitle={`${pageTitle} | Pouchesitaly`} defaultDescription={pageDescription} />
      <PageHeader />

      <main className="container mx-auto px-4 pb-16 pt-4 md:pt-6">
        <div className="mb-5 md:mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <LocalizedLink to="/" className="hover:text-foreground transition-colors">
            {t("home")}
          </LocalizedLink>
          <span>/</span>
          <span className="font-medium text-foreground">{t("shipping")}</span>
        </div>

        <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card p-6 md:p-10 shadow-sm">
          <span className="pointer-events-none absolute -left-24 -top-24 h-52 w-52 rounded-full bg-primary/10 blur-3xl" />
          <span className="pointer-events-none absolute -right-20 -bottom-20 h-52 w-52 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative z-10">
            <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.11em] text-primary">
              {italyOnlyBadge}
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-heading font-black tracking-tight text-foreground">{pageTitle}</h1>
            <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground">{pageDescription}</p>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <article className="rounded-2xl border border-border/70 bg-background p-5">
              <MapPin className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-lg font-heading font-bold text-foreground">{coverageTitle}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{coverageDescription}</p>
            </article>

            <article className="rounded-2xl border border-border/70 bg-background p-5">
              <Package className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-lg font-heading font-bold text-foreground">{t("discreetPackagingTitle")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t("discreetPackagingLong")}</p>
            </article>

            <article className="rounded-2xl border border-border/70 bg-background p-5">
              <Clock className="h-7 w-7 text-primary" />
              <h2 className="mt-4 text-lg font-heading font-bold text-foreground">{dispatchTitle}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{dispatchDescription}</p>
            </article>
          </div>
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-border/70 bg-card p-6 md:p-8 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{pricingTitle}</h2>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">{pricingDescription}</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
              <Truck className="h-5 w-5" />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <article className="rounded-2xl border border-border/70 bg-background p-5">
              <h3 className="text-base font-heading font-bold text-foreground">{isItalian ? "Ordini sotto €100" : "Orders below €100"}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{isItalian ? "Spedizione fissa: €6,90" : "Flat shipping: €6.90"}</p>
            </article>
            <article className="rounded-2xl border border-border/70 bg-background p-5">
              <h3 className="text-base font-heading font-bold text-foreground">{isItalian ? "Ordini da €100 in su" : "Orders from €100 and above"}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{isItalian ? "Spedizione gratuita" : "Free shipping"}</p>
            </article>
          </div>
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-border/70 bg-card p-6 md:p-8 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{deliveryZonesTitle}</h2>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">{deliveryZonesIntro}</p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
              <Truck className="h-5 w-5" />
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveryZones.map((zone) => (
              <article key={zone.region} className="relative overflow-hidden rounded-2xl border border-border/70 bg-background p-5">
                <span className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${zone.accentClass}`} />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-heading font-bold text-foreground">{zone.region}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{zone.description}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${zone.badgeClass}`}>
                    {zone.eta}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            {isItalian
              ? "*I tempi possono variare in base ai volumi del corriere e alle condizioni locali."
              : "*Delivery times may vary based on courier volumes and local conditions."}
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border border-border/70 bg-card p-6 md:p-7 shadow-sm">
            <h2 className="text-2xl font-heading font-bold text-foreground">{t("trackingTitle")}</h2>
            <p className="mt-3 text-sm md:text-base leading-relaxed text-muted-foreground">{trackingDescription}</p>
          </article>

          <article className="rounded-2xl border border-border/70 bg-card p-6 md:p-7 shadow-sm">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">{checklistTitle}</h2>
            <ul className="mt-4 space-y-3">
              {checklistItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm md:text-base text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mt-8 rounded-[1.75rem] border border-primary/25 bg-gradient-to-r from-primary to-primary/85 p-7 md:p-9 text-center shadow-lg shadow-primary/20">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground">{t("readyToOrder")}</h2>
          <p className="mt-3 text-primary-foreground/85">{ctaText}</p>
          <LocalizedLink
            to="/#products"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-card px-6 py-3 font-bold text-foreground transition-colors hover:bg-card/90"
          >
            {t("shopNow")}
            <ArrowRight className="h-4 w-4" />
          </LocalizedLink>
        </section>
      </main>

      <Footer />
    </div>
  );
}
