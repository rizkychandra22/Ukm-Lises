import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import hero from "@/assets/hero-lises.jpg";
import { Sparkles } from "lucide-react";

const galleryItems = [
  { src: hero, alt: "Pertunjukan tari kolosal", span: "md:col-span-2 md:row-span-2" },
  { src: g1, alt: "Instrumen gamelan" },
  { src: g2, alt: "Solo penari" },
  { src: g4, alt: "Kacapi suling" },
  { src: g3, alt: "Panggung musik" },
];

export function GalleryPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 pt-12 md:pb-16 md:pt-16">
      {/* <p className="text-sm uppercase tracking-[0.25em] text-primary">
        Galeri
      </p> */}
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur">
        <Sparkles className="h-3.5 w-3.5" /> Galeri
      </span>
      <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.15] md:text-6xl">
        Bingkai <span className="text-gradient-gold">panggung</span> & latihan kami.
      </h1>
      <p className="mt-5 max-w-2xl text-muted-foreground">
        Kumpulan dokumentasi visual dari pementasan, workshop, dan momen kebersamaan Lises
        Asmarandana.
      </p>

      <div className="mt-12 grid auto-rows-[220px] gap-4 md:grid-cols-3">
        {galleryItems.map((item, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl border border-border/60 ${item.span ?? ""}`}
          >
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-4 left-4 translate-y-3 text-sm font-medium text-primary opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
              {item.alt}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
