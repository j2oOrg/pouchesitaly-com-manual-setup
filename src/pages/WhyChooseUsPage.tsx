import { Link } from "react-router-dom";
import { Shield, Zap, Package, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { QuickFAQ } from "@/components/QuickFAQ";
import { SEOHead } from "@/components/SEOHead";

export default function WhyChooseUsPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <SEOHead />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Why Choose Us</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Why Choose Pouchesitaly
          </h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              At Pouchesitaly, we make buying nicotine pouches simple, fast, and hassle-free. Here's why thousands of customers choose us.
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">No Sign-Up Required</h3>
                <p className="text-muted-foreground">
                  Skip the account creation. Checkout as a guest in minutes without creating an account.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">Free Worldwide Shipping</h3>
                <p className="text-muted-foreground">
                  Every order ships free, no matter where you are. Plain packaging for complete privacy.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-2">Authentic Products</h3>
                <p className="text-muted-foreground">
                  100% genuine products from trusted brands. No fakes, no knockoffs, guaranteed.
                </p>
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Our Commitment to Quality
              </h2>
              <p className="text-muted-foreground mb-4">
                We source all our products directly from authorized distributors to ensure authenticity and freshness. Every product goes through our quality checks before being shipped to you.
              </p>
              <p className="text-muted-foreground mb-4">
                Our inventory is stored in climate-controlled facilities to maintain product quality, ensuring you receive the best possible experience with every order.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                Customer-First Approach
              </h2>
              <p className="text-muted-foreground mb-4">
                We believe shopping should be easy. That's why we've eliminated unnecessary friction like mandatory account creation, hidden fees, and complicated checkout processes.
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Fast, responsive customer support</li>
                <li>Easy returns and refunds</li>
                <li>Transparent pricing with no hidden costs</li>
                <li>Regular promotions and discounts</li>
              </ul>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              Experience the Difference
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Join thousands of satisfied customers worldwide
            </p>
            <Link
              to="/#products"
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors"
            >
              Start Shopping
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

