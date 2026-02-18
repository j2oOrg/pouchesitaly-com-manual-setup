import { Link } from "react-router-dom";
import { MapPin, Package, Clock, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "@/hooks/useTranslation";

export default function ShippingInfoPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">{t('home')}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{t('shipping')}</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            {t('shippingInfoTitle')}
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              {t('shippingInfoIntro')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-muted rounded-lg p-6 border border-border">
                <MapPin className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">{t('globalCoverage')}</h3>
                <p className="text-muted-foreground">
                  {t('globalCoverageDesc')}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-6 border border-border">
                <Package className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">{t('discreetPackagingTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('discreetPackagingLong')}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-6 border border-border">
                <Clock className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">{t('fastDelivery')}</h3>
                <p className="text-muted-foreground">
                  {t('fastDeliveryDesc')}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-6 border border-border">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary-foreground font-bold text-xl">€0</span>
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">{t('freeShippingTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('freeShippingLong')}
                </p>
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                {t('deliveryTimeframesTitle')}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 font-heading font-bold">{t('region')}</th>
                      <th className="py-3 px-4 font-heading font-bold">{t('estimatedDelivery')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">{t('europe')}</td>
                      <td className="py-3 px-4 font-medium">7-10 {t('businessDays')}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">{t('northAmerica')}</td>
                      <td className="py-3 px-4 font-medium">10-14 {t('businessDays')}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="py-3 px-4 text-muted-foreground">{t('asiaOceania')}</td>
                      <td className="py-3 px-4 font-medium">12-18 {t('businessDays')}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-muted-foreground">{t('restOfWorld')}</td>
                      <td className="py-3 px-4 font-medium">14-21 {t('businessDays')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {t('deliveryDisclaimer')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                {t('trackingTitle')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('trackingDesc')}
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              {t('readyToOrder')}
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              {t('shopNowCta')}
            </p>
            <Link
              to="/#products"
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors"
            >
              {t('shopNow')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <QuickFAQ />
      <Footer />
    </div>
  );
}
