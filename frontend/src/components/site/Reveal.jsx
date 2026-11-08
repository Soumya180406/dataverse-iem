import { motion } from "framer-motion";

export const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const SectionHeading = ({ eyebrow, title, sub, id }) => (
  <Reveal className="mb-12 max-w-3xl md:mb-16">
    <p className="eyebrow mb-4" data-testid={`${id}-eyebrow`}>{eyebrow}</p>
    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
    {sub && <p className="mt-4 text-base text-slate-400 md:text-lg">{sub}</p>}
  </Reveal>
);
