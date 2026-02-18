import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "@/hooks/useTranslation";

export function QuickFAQ() {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t("faqQuestion1"),
      answer: t("faqAnswer1"),
    },
    {
      question: t("faqQuestion2"),
      answer: t("faqAnswer2"),
    },
    {
      question: t("faqQuestion3"),
      answer: t("faqAnswer3"),
    },
  ];

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-heading font-bold text-3xl text-center mb-8">
            {t("faqTitle")}
          </h3>

          <Accordion type="single" collapsible className="space-y-4 mb-8">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
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

          <div className="text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              {t("viewAllFaqs")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
