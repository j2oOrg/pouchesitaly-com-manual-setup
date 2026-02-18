import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    title: "General Questions",
    faqs: [
      {
        question: "What are nicotine pouches?",
        answer:
          "Nicotine pouches are small, discreet pouches containing nicotine, plant fiber, and flavorings - but no tobacco. You place them between your lip and gum for a convenient, smoke-free nicotine experience. They come in various strengths and flavors to suit different preferences.",
      },
      {
        question: "How do I use nicotine pouches?",
        answer:
          "Take one pouch from the container and place it between your upper lip and gum. Leave it there for 20-60 minutes while the nicotine is absorbed. You may feel a tingling sensation - this is normal. When finished, dispose of the pouch in the lid's compartment or in a trash bin.",
      },
      {
        question: "Are nicotine pouches safer than cigarettes?",
        answer:
          "While nicotine pouches are tobacco-free and don't involve combustion or smoke, they still contain nicotine which is addictive. They eliminate many risks associated with smoking such as tar and carcinogens from combustion. However, they're intended for adult nicotine users only.",
      },
    ],
  },
  {
    title: "Ordering & Payment",
    faqs: [
      {
        question: "Do I need to create an account to order?",
        answer:
          "No! We offer a quick checkout process with no registration required. You can complete your purchase as a guest in just a few minutes.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and various local payment methods depending on your country.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes! Once your order ships, you'll receive an email with a tracking number that you can use to monitor your package's progress.",
      },
    ],
  },
  {
    title: "Shipping & Delivery",
    faqs: [
      {
        question: "Is shipping really free?",
        answer:
          "Yes! We offer free worldwide shipping on all orders with no minimum purchase required. Your order will be shipped in discreet, unmarked packaging.",
      },
      {
        question: "How long does delivery take?",
        answer:
          "Delivery times vary by location: Europe 7-10 days, North America 10-14 days, Asia & Oceania 12-18 days, Rest of World 14-21 days. Times may vary due to customs processing.",
      },
      {
        question: "Is the packaging discreet?",
        answer:
          "Absolutely. All orders are shipped in plain, unmarked packaging with no indication of the contents. Your privacy is important to us.",
      },
    ],
  },
  {
    title: "Products",
    faqs: [
      {
        question: "Are your products authentic?",
        answer:
          "Yes, 100%. We source all products directly from authorized distributors and manufacturers. Every product is genuine and properly stored to ensure freshness.",
      },
      {
        question: "How do I choose the right nicotine strength?",
        answer:
          "If you're new to nicotine pouches, we recommend starting with Regular strength (3-6mg). Experienced users may prefer Strong (8-11mg) or Extra Strong (12-15mg+). Check our Strengths Guide for more details.",
      },
      {
        question: "How should I store nicotine pouches?",
        answer:
          "Store pouches in a cool, dry place away from direct sunlight. Keep the container sealed when not in use. Properly stored pouches typically stay fresh for 6-12 months.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      <PageHeader />

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">FAQ</span>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="bg-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Frequently Asked Questions
          </h1>
          
          <p className="text-lg text-muted-foreground mb-12">
            Find answers to common questions about nicotine pouches, ordering, shipping, and more.
          </p>

          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-10">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                {category.title}
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem
                    key={faqIndex}
                    value={`${categoryIndex}-${faqIndex}`}
                    className="bg-muted border border-border rounded-xl px-6"
                  >
                    <AccordionTrigger className="text-left font-heading font-semibold hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {/* CTA */}
          <div className="mt-12 p-8 bg-primary rounded-xl text-center">
            <h3 className="text-2xl font-heading font-bold text-primary-foreground mb-4">
              Still Have Questions?
            </h3>
            <p className="text-primary-foreground/80 mb-6">
              Our customer support team is here to help
            </p>
            <a
              href="mailto:support@nicoxpress.com"
              className="inline-flex items-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-bold hover:bg-card/90 transition-colors"
            >
              Contact Support
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}