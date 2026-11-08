import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { GALLERY } from "@/data/content";

export const Gallery = () => {
  const [active, setActive] = useState(null);
  return (
    <section id="gallery" className="relative py-20 md:py-32" data-testid="gallery-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading id="gallery" eyebrow="// Gallery" title="Moments in the verse" sub="A glimpse of the energy — photos from DataVerse 2K27 will land here after the fest." />
        <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:auto-rows-[220px] md:grid-cols-4">
          {GALLERY.map((g, i) => (
            <Reveal key={g.src} delay={(i % 4) * 0.06} className={`${g.span} overflow-hidden rounded-2xl`}>
              <button onClick={() => setActive(g)} className="group relative h-full w-full overflow-hidden rounded-2xl border border-purple-500/20" data-testid={`gallery-item-${i}`}>
                <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070E]/80 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-40" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
      <Dialog open={!!active} onOpenChange={() => setActive(null)}>
        <DialogContent className="max-w-4xl border-purple-500/30 bg-[#070a14] p-2" data-testid="gallery-lightbox">
          <DialogTitle className="sr-only">{active?.alt}</DialogTitle>
          {active && <img src={active.src} alt={active.alt} className="max-h-[80vh] w-full rounded-xl object-contain" />}
        </DialogContent>
      </Dialog>
    </section>
  );
};
