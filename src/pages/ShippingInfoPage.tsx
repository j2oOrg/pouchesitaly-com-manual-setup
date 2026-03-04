import { LocalizedLink } from "@/components/LocalizedLink";
import { ArrowRight, CheckCircle2, Clock, MapPin, Package, Truck } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "@/hooks/useTranslation";

export default function ShippingInfoPage() {
  const { t, language } = useTranslation();
  const isItalian = language === "it";

  const pageTitle = isItalian ? "Spedizione in Italia" : "Shipping in Italy";
  const pageDescription = isItalian
    ? "Spediamo esclusivamente in Italia con corrieri nazionali tracciati. Ogni ordine viene preparato rapidamente e consegnato con imballaggio discreto. La spedizione gratuita si applica da €100."
    : "We ship exclusively within Italy using tracked domestic couriers. Every order is prepared quickly and delivered in discreet packaging. Free shipping applies from €100.";
  const italyOnlyBadge = isItalian ? "Spedizione Solo Italia" : "Italy-Only Shipping";

  const coverageTitle = isItalian ? "Copertura Nazionale" : "Nationwide Coverage";
  const coverageDescription = isItalian
    ? "Consegniamo in tutte le regioni italiane, dalle grandi città ai centri più piccoli."
    : "We deliver to all Italian regions, from major cities to smaller towns.";
  const dispatchTitle = isItalian ? "Preparazione Rapida" : "Fast Dispatch";
  const dispatchDescription = isItalian
    ? "Gli ordini confermati entro le 16:00 vengono generalmente affidati al corriere lo stesso giorno lavorativo."
    : "Orders confirmed by 4:00 PM are usually handed to the courier on the same business day.";
  const deliveryZonesTitle = isItalian ? "Tempi di Consegna per Area" : "Delivery Times by Area";
  const deliveryZonesIntro = isItalian
    ? "Le stime sotto indicano i tempi medi per le principali aree italiane."
    : "The estimates below show typical delivery windows for the main Italian areas.";
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
    : [
        "Product quality check",
        "Address and contact verification",
        "Plain and secure packaging",
      ];
  const ctaText = isItalian
    ? "Ordina ora per ricevere consegna rapida in tutta Italia e spedizione gratuita da €100."
    : "Place your order now for fast delivery across Italy and free shipping from €100.";

  const deliveryZones = [
    {
      region: t("europe"),
      eta: t("europeDays"),
      description: t("europeDesc"),
      badgeClass:
        "border-emerald-200/80 bg-emerald-50 text-emerald-700",
      accentClass: "from-emerald-500/20 to-emerald-500/0",
    },
    {
      region: t("northAmerica"),
      eta: t("northAmericaDays"),
      description: t("northAmericaDesc"),
      badgeClass: "border-sky-200/80 bg-sky-50 text-sky-700",
      accentClass: "from-sky-500/20 to-sky-500/0",
    },
    {
      region: t("asiaOceania"),
      eta: t("asiaOceaniaDays"),
      description: t("asiaOceaniaDesc"),
      badgeClass: "border-indigo-200/80 bg-indigo-50 text-indigo-700",
      accentClass: "from-indigo-500/20 to-indigo-500/0",
    },
    {
      region: t("restOfWorld"),
      eta: t("restOfWorldDays"),
      description: t("restOfWorldDesc"),
      badgeClass: "border-amber-200/80 bg-amber-50 text-amber-700",
      accentClass: "from-amber-500/20 to-amber-500/0",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <SEOHead
        defaultTitle={`${pageTitle} | Pouchesitaly`}
        defaultDescription={pageDescription}
      />
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
            <h1 className="mt-4 text-3xl md:text-5xl font-heading font-black tracking-tight text-foreground">
              {pageTitle}
            </h1>
            <p className="mt-4 max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground">
              {pageDescription}
            </p>
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
              <article
                key={zone.region}
                className="relative overflow-hidden rounded-2xl border border-border/70 bg-background p-5"
              >
                <span
                  className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${zone.accentClass}`}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-heading font-bold text-foreground">{zone.region}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{zone.description}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] ${zone.badgeClass}`}
                  >
                    {zone.eta}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">{t("deliveryDisclaimer")}</p>
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
