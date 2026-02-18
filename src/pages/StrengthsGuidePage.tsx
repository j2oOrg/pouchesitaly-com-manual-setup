import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";

export default function StrengthsGuidePage() {
  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Nicotine Strengths Guide</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Nicotine Strengths Guide
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              Choosing the right nicotine strength is essential for a satisfying experience. This guide will help you find the perfect level for your needs.
            </p>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Understanding Nicotine Levels
              </h2>
              
              <div className="space-y-6">
                <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    Regular (3-6mg) - Light
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Perfect for beginners or those who prefer a gentle nicotine experience. Provides subtle satisfaction without overwhelming intensity.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Best for:</strong> New users, casual users, those switching from low-nicotine products
                  </p>
                </div>

                <div className="p-6 bg-orange-50 border border-orange-200 rounded-xl">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    Strong (8-11mg) - Medium
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    The most popular choice for regular users. Offers a noticeable nicotine kick while remaining comfortable for extended use.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Best for:</strong> Experienced users, former smokers, those seeking balanced satisfaction
                  </p>
                </div>

                <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                    Extra Strong (12-15mg+) - Intense
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    For experienced users seeking maximum nicotine delivery. Provides intense satisfaction and long-lasting effect.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Best for:</strong> Heavy users, those with high nicotine tolerance, special occasions
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Tips for Choosing
              </h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Start low if you're new to nicotine pouches - you can always increase later</li>
                <li>Consider your current nicotine consumption when selecting a strength</li>
                <li>Morning use typically calls for stronger options, while evening use may suit milder variants</li>
                <li>Individual tolerance varies - what works for others may not be right for you</li>
              </ul>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              Find Your Perfect Strength
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Browse our products sorted by nicotine content
            </p>
            <Link
              to="/#products"
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors"
            >
              Shop by Strength
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
