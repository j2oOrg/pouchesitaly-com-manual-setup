import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Check } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";

export default function TobaccoFreePage() {
  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Tobacco-Free Products</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            100% Tobacco-Free Nicotine Pouches
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              All products sold at Pouchesitaly are completely tobacco-free. Experience nicotine satisfaction without the drawbacks of traditional tobacco products.
            </p>

            {/* Benefits */}
            <div className="bg-muted rounded-xl p-8 mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Leaf className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-foreground m-0">
                  Benefits of Tobacco-Free
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "No tobacco staining on teeth",
                  "No tobacco breath or odor",
                  "No spitting required",
                  "Cleaner, more discreet experience",
                  "Can be used anywhere",
                  "Consistent nicotine delivery",
                  "Wide variety of flavors",
                  "Reduced health concerns vs. tobacco",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                What Are Tobacco-Free Nicotine Pouches?
              </h2>
              <p className="text-muted-foreground mb-4">
                Tobacco-free nicotine pouches contain pharmaceutical-grade nicotine extracted from tobacco plants, but the pouches themselves contain no actual tobacco leaf material. Instead, they use plant fibers, flavorings, and other food-grade ingredients.
              </p>
              <p className="text-muted-foreground mb-4">
                This means you get the nicotine experience without the tobacco - no tar, no combustion, no smoke. Just clean, convenient nicotine delivery.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                How to Use
              </h2>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-2">
                <li>Take a single pouch from the container</li>
                <li>Place it between your upper lip and gum</li>
                <li>Leave it in place for 20-60 minutes</li>
                <li>Dispose of the used pouch in the lid's disposal compartment</li>
              </ol>
              <p className="text-muted-foreground mt-4">
                You may feel a tingling sensation - this is normal and indicates the nicotine is being absorbed.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              Make the Switch Today
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Experience tobacco-free nicotine satisfaction
            </p>
            <Link
              to="/#products"
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors"
            >
              Shop Tobacco-Free Products
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

