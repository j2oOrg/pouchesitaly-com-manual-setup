import { LocalizedLink } from "@/components/LocalizedLink";
import { Shield, Zap, Package, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "@/hooks/useTranslation";

export default function WhyChooseUsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead title={t('whyChooseUsTitle')} />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <LocalizedLink to="/" className="hover:text-foreground transition-colors">{t('home')}</LocalizedLink>
          <span>/</span>
          <span className="text-foreground font-medium">{t('whyChooseUs')}</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            {t('whyChooseUsTitle')}
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              {t('whyChooseUsIntro')}
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">{t('noSignUpTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('noSignUpLong')}
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">{t('freeShipping')}</h3>
                <p className="text-muted-foreground">
                  {t('freeShippingLong')}
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">{t('authenticProductsTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('authenticProductsLong')}
                </p>
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                {t('commitmentTitle')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('commitmentDesc1')}
              </p>
              <p className="text-muted-foreground mb-4">
                {t('commitmentDesc2')}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                {t('customerFirstTitle')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('customerFirstDesc')}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t('supportBenefit')}</li>
                <li>{t('returnsBenefit')}</li>
                <li>{t('pricingBenefit')}</li>
                <li>{t('promoBenefit')}</li>
              </ul>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              {t('experienceDifference')}
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              {t('joinThousands')}
            </p>
            <LocalizedLink
              to="/#products"
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors"
            >
              {t('startShopping')}
              <ArrowRight className="w-4 h-4" />
            </LocalizedLink>
          </div>
        </div>
      </main>

      <QuickFAQ />
      <Footer />
    </div>
  );
}


