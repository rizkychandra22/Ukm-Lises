import { Link } from "react-router-dom";
import {
  ArrowRight,
  Ticket,
  Music2,
  Sparkles,
  Users,
  ArrowUpRight,
  CalendarDays,
  Newspaper,
  Image,
} from "lucide-react";
import hero from "@/assets/hero-lises.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/i18n";
import { usePosts } from "@/constants/news";
import { SEOHead } from "@/components/SEOHead";
import { ScrollTop } from "@/components/scroll-top";
import { useState, useEffect, useRef } from "react";
import { getGalleries, Gallery } from "@/lib/api/gallery";
import { getNews, News } from "@/lib/api/news";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

export function HomePage() {
  const { t, i18n } = useTranslation("HomePage");
  const isEn = i18n.language === 'en';
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  
  const [sliderImages, setSliderImages] = useState<Gallery[]>([]);
  const [momentImages, setMomentImages] = useState<Gallery[]>([]);
  const [latestNews, setLatestNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      const [galleryData, newsData] = await Promise.all([
        getGalleries(),
        getNews()
      ]);

      const activeData = galleryData.filter(g => g.is_active).slice(0, 3);
      const latestGalleryData = galleryData.slice(0, 3);
      setSliderImages(activeData);
      setMomentImages(latestGalleryData);
      
      setLatestNews(newsData.slice(0, 3));
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <SEOHead pageKey="home" />
      <section className="relative overflow-hidden group">
        <div className="absolute inset-0 h-full w-full">
          <img
            src={hero}
            alt="Pertunjukan tari Lises Asmarandana"
            width={1600}
            height={1008}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-hero)" }} />
        </div>
        
        {/* We need pointer-events-none here so clicks pass through to the carousel buttons underneath, but pointer-events-auto on buttons so they can be clicked */}
        <div className="relative mx-auto flex min-h-[50vh] md:min-h-[60vh] max-w-7xl flex-col justify-center px-6 pt-12 pb-12 md:pt-18 md:pb-18 pointer-events-none">
          <div className="pointer-events-auto">
            <Badge
              variant="outline"
              className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" /> UKM Lises - UMMI
            </Badge>
            <h1 className="mt-6 max-w-4xl font-display text-5xl font-black leading-[1.05] md:text-7xl">
              <span className="text-gradient-gold">{t("banner.title_y1")}{" "}</span>
              {t("banner.title_t1")}.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{t("banner.description")}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                asChild
                className="rounded-full bg-gradient-gold px-7 py-6 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
              >
                <Link to="/about">
                  {t("banner.btn_about")} <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-primary/40 px-7 py-6 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:text-white"
              >
                <Link to="/contact">
                  {t("banner.btn_contact")} <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
              {[
                { n: "120+", l: t("banner.card_1") },
                { n: "45", l: t("banner.card_2") },
                { n: "12", l: t("banner.card_3") },
              ].map((item) => (
                <Card key={item.l} className="rounded-2xl border-border/60 bg-card/40 backdrop-blur">
                  <CardContent className="p-5">
                    <div className="font-display text-3xl font-bold text-gradient-gold">{item.n}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{item.l}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">
              {t("section_divisi.title")}
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-[1.15] md:text-5xl">
              {t("section_divisi.title_t1")}{" "}
              <span className="text-gradient-gold">{t("section_divisi.title_y1")}</span>.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">{t("section_divisi.desc")}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Music2,
              title: t("section_divisi.division.title_1"),
              desc: t("section_divisi.division.desc_1"),
            },
            {
              icon: Users,
              title: t("section_divisi.division.title_2"),
              desc: t("section_divisi.division.desc_2"),
            },
          ].map((division) => (
            <Card
              key={division.title}
              className="group relative overflow-hidden rounded-3xl border-border/60 bg-card transition-colors hover:border-primary/60"
            >
              <CardContent className="p-8">
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-gold shadow-gold">
                  <division.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="font-display text-2xl font-bold">{division.title}</CardTitle>
                <CardDescription className="mt-3 text-base">{division.desc}</CardDescription>
                <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">
              {t("section_momen.title")}
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold leading-[1.15] md:text-5xl">
              {t("section_momen.subtitle")}
            </h2>
          </div>
          <Link
            to="/gallery"
            className="hidden text-sm font-semibold text-primary hover:underline sm:inline-flex items-center"
          >
            {t("section_momen.link")} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-3">
               {[1,2,3].map(i => <Skeleton key={i} className="aspect-[4/5] rounded-2xl w-full" />)}
            </div>
          ) : momentImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-primary/50 border-2 border-dashed rounded-2xl">
              <Image className="w-10 h-10 mb-4 opacity-20" />
              <p>{t("section_momen.no_upload")}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {momentImages.map((item) => {
                const title = isEn ? item.title_en : item.title_id;
                const desc = isEn ? item.desc_en : item.desc_id;
                
                return (
                  <div key={item.id} className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/60">
                    <img
                      src={item.image}
                      alt={title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="font-medium text-primary text-sm md:text-base">{title}</div>
                      {desc && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{desc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="md:w-1/3">
            <p className="text-sm uppercase tracking-[0.25em] text-primary">
              {t("section_news.title")}
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              {t("section_news.subtitle")}
            </h2>
            <p className="mt-4 text-muted-foreground">{t("section_news.desc")}</p>
            <Button
              asChild
              variant="outline"
              className="mt-8 rounded-full border-primary/40 px-6 hidden sm:inline-flex"
            >
              <Link to="/news">
                {t("section_news.link")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-4 md:w-1/2">
            {isLoading ? (
               Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-28 w-full rounded-3xl" />
               ))
            ) : latestNews.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border-primary/50 border-2 border-dashed rounded-3xl h-full">
                <Newspaper className="w-10 h-10 mb-4 opacity-20" />
                <p>{t("section_news.no_upload")}</p>
               </div>
            ) : latestNews.map((post) => {
              const title = isEn ? post.title_en || post.title_id : post.title_id;
              const date = new Date(post.date).toLocaleDateString(isEn ? 'en-US' : 'id-ID', {
                year: 'numeric', month: 'short', day: 'numeric'
              });

              return (
              <Link
                key={post.id}
                to={`/news/${post.slug}`}
                className="group flex flex-col justify-between rounded-3xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/60 sm:flex-row sm:items-center"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" /> {date}
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold group-hover:text-primary line-clamp-2">
                    {title}
                  </h3>
                </div>
                <div className="mt-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background transition-colors group-hover:bg-primary group-hover:text-primary-foreground sm:mt-0">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </Link>
            )})}
          </div>
        </div>
        <div className="mt-8 flex justify-center sm:hidden">
          <Button asChild variant="outline" className="rounded-full border-primary/40 px-6">
            <Link to="/news">
              {t("section_news.link")} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
        <Card className="relative overflow-hidden rounded-3xl border-primary/30 bg-card">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(1000px 400px at 20% 0%, var(--gold-deep), transparent 60%)",
            }}
          />
          <CardContent className="relative flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between md:p-16">
            <div>
              <p className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-primary">
                <Ticket className="h-4 w-4" /> {t("section_event.tag")}
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold md:text-4xl">
                {t("section_event.title")}
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">{t("section_event.desc")}</p>
            </div>
            <Button
              asChild
              className="rounded-full bg-gradient-gold px-7 py-6 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
            >
              <Link to="/event">
                {t("section_event.btn")}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <ScrollTop />
    </>
  );
}
