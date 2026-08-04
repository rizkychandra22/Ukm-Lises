import { useState, useEffect } from "react";
import { useTranslation } from "@/i18n";
import { SEOHead } from "@/components/SEOHead";
import { ScrollTop } from "@/components/scroll-top";
import { Sparkles, Camera } from "lucide-react";
import { getGalleries, Gallery } from "@/lib/api/gallery";
import { Skeleton } from "@/components/ui/skeleton";

export function GalleryPage() {
  const { t, i18n } = useTranslation("GalleryPage");
  const isEn = i18n.language === "en";

  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      setIsLoading(true);
      const data = await getGalleries();

      // Susun agar is_index berada di paling awal
      const indexItem = data.find((g) => g.is_index);
      const otherItems = data.filter((g) => !g.is_index);
      const sortedData = indexItem ? [indexItem, ...otherItems] : data;

      setGalleries(sortedData);
      setIsLoading(false);
    };
    fetchGalleries();
  }, []);

  return (
    <>
      <SEOHead pageKey="gallery" />
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-12 md:pb-16 md:pt-16">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" /> {t("heading")}
        </span>
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-[1.15] md:text-4xl">
          {t("title_t1")} <span className="text-gradient-gold">{t("title_y1")}</span> &{" "}
          {t("title_t2")}
        </h1>

        <div
          className={`mt-12 grid gap-4 md:grid-cols-3 ${galleries.length > 0 || isLoading ? "auto-rows-[220px]" : ""}`}
        >
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  className={`h-full w-full rounded-2xl ${i === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                />
              ))
          ) : galleries.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 md:py-20 px-3 text-center text-muted-foreground border-primary/50 border-2 border-dashed rounded-2xl">
              <Camera className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">{t("no_upload")}</p>
            </div>
          ) : (
            galleries.map((item) => {
              const title = isEn ? item.title_en : item.title_id;
              const desc = isEn ? item.desc_en : item.desc_id;

              return (
                <div
                  key={item.id}
                  className={`group relative overflow-hidden rounded-2xl border border-border/60 ${item.is_index ? "md:col-span-2 md:row-span-2" : ""}`}
                >
                  <img
                    src={item.image}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="font-medium text-primary text-sm md:text-base">{title}</div>
                    {desc && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{desc}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <ScrollTop />
    </>
  );
}
