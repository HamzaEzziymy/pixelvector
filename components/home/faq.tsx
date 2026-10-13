import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQ } from "@/lib/content/faq";
import { Section } from "./section";

export function Faq() {
  return (
    <Section id="faq" title="Frequently asked questions">
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {FAQ.map((item, i) => (
          <AccordionItem key={item.question} value={`faq-${i}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
