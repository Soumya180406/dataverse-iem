import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/site/Reveal";
import { FAQS } from "@/data/content";

export const Faq = () => (
  <section id="faq" className="relative py-20 md:py-32" data-testid="faq-section">
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <SectionHeading id="faq" eyebrow="// FAQs" title="Questions, answered" />
      <Accordion type="single" collapsible className="space-y-3">
        {FAQS.map((f, i) => (
          <AccordionItem key={i} value={`f${i}`} className="glass rounded-2xl border px-6">
            <AccordionTrigger className="py-5 text-left font-display text-base text-white hover:no-underline md:text-lg" data-testid={`faq-trigger-${i}`}>{f.q}</AccordionTrigger>
            <AccordionContent className="text-slate-400">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);
