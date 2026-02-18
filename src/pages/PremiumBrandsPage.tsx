import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";
import { useTranslation } from "@/hooks/useTranslation";

export default function PremiumBrandsPage() {
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
          <span className="text-foreground font-medium">{t('premiumNicotineBrands')}</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            {t('premiumBrandsTitle')}
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              {t('premiumBrandsIntro')}
            </p>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                {t('zynTitle')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('zynDesc')}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t('zynFeature1')}</li>
                <li>{t('zynFeature2')}</li>
                <li>{t('zynFeature3')}</li>
                <li>{t('zynFeature4')}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                {t('veloTitle')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('veloDesc')}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t('veloFeature1')}</li>
                <li>{t('veloFeature2')}</li>
                <li>{t('veloFeature3')}</li>
                <li>{t('veloFeature4')}</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                {t('lyftTitle')}
              </h2>
              <p className="text-muted-foreground mb-4">
                {t('lyftDesc')}
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>{t('lyftFeature1')}</li>
                <li>{t('lyftFeature2')}</li>
                <li>{t('lyftFeature3')}</li>
                <li>{t('lyftFeature4')}</li>
              </ul>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              {t('readyToShop')}
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              {t('browseSelection')}
            </p>
            <Link
              to="/#products"
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors"
            >
              {t('viewAllProducts')}
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
