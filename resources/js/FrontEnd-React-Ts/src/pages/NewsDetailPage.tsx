import DOMPurify from "dompurify";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronUp,
  Check,
  Copy,
  MessageCircle,
  Share2,
  Sparkles,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePosts } from "@/constants/news";
import { useTranslation } from "@/i18n";
import { SEOHead } from "@/components/SEOHead";

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation("NewsDetailPage");
  const posts = usePosts();
  const post = posts.find((p) => p.slug === slug);
  const relatedPosts = posts.filter((p) => p.slug !== slug).slice(0, 4);

  const [copied, setCopied] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!post) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-6 py-16 md:py-24 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-card border border-border/60 mb-8">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <h1 className="font-display text-4xl font-bold">{t("not_found_title")}</h1>
        <p className="mt-4 max-w-md text-muted-foreground">{t("not_found_desc")}</p>
        <Button
          asChild
          className="mt-8 rounded-full bg-gradient-gold px-7 shadow-gold text-primary-foreground"
        >
          <Link to="/news">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("btn_back_news")}
          </Link>
        </Button>
      </section>
    );
  }

  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url: pageUrl });
      } catch { /* cancelled */ }
    } else {
      handleCopy();
    }
  };

  const handleWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + "\n" + pageUrl)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <SEOHead
        pageKey="news"
        customTitle={`${post.title} - UKM Lises Asmarandana`}
        customDescription={post.excerpt || post.title}
      />

      {/* ─────────── HEADER (mirroring AboutPage) ─────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:pt-16">
        {/* Top Row: Badge (left) + Back Button (right) */}
        <div className="flex items-center justify-between gap-4">
          <Badge
            variant="outline"
            className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" /> {post.tag}
          </Badge>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-full border border-border/60 bg-background/40 backdrop-blur-sm text-sm font-medium text-foreground hover:bg-primary/20 hover:text-primary transition-all"
          >
            <Link to="/news">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("btn_back")}
            </Link>
          </Button>
        </div>

        {/* Title */}
        <h1 className="mt-4 max-w-4xl font-display text-xl font-bold leading-[1.15] md:text-2xl lg:text-4xl">
          {post.title}
        </h1>

        {/* Meta Row */}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-primary/70" /> {post.date}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-primary/70" /> Admin Lises Asmarandana
          </span>
        </div>
      </section>

      {/* ─────────── TWO-COLUMN LAYOUT (like AboutPage) ─────────── */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-12 md:pb-16 md:grid-cols-2 md:items-start">
        {/* Left Column — Image */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60">
          <img
            src={post.img}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Column — Excerpt + Content */}
        <div className="space-y-6">
          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">{post.tag}.</span>{" "}
              {post.excerpt}
            </p>
          )}

          {/* Article Content */}
          <div
            className="
              max-w-none text-base leading-[1.8] text-muted-foreground space-y-5
              [&>p]:leading-[1.8]
              [&>h2]:mt-10 [&>h2]:mb-3 [&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-foreground
              [&>h3]:mt-7 [&>h3]:mb-2 [&>h3]:font-display [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-foreground
              [&>blockquote]:my-6 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/60
              [&>blockquote]:bg-card/50 [&>blockquote]:rounded-r-2xl [&>blockquote]:px-5 [&>blockquote]:py-4
              [&>blockquote]:italic [&>blockquote]:text-foreground/80
              [&>img]:my-6 [&>img]:rounded-2xl [&>img]:border [&>img]:border-border/60
              [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6
            "
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
        </div>
      </section>

      {/* ─────────── SHARE SECTION ─────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
        <Separator className="mb-10 bg-border/40" />
        <div className="space-y-5 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Bagikan Berita
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="rounded-full border-border/60 bg-card gap-2 text-sm hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Button>
            <Button
              onClick={handleCopy}
              variant="outline"
              className="rounded-full border-border/60 bg-card gap-2 text-sm hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? "Tersalin!" : "Salin Tautan"}
            </Button>
            <Button
              onClick={handleShare}
              className="rounded-full bg-gradient-gold shadow-gold gap-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all"
            >
              <Share2 className="h-4 w-4" /> Bagikan
            </Button>
          </div>
        </div>
      </section>

      {/* ─────────── BERITA LAINNYA (List Style) ─────────── */}
      {relatedPosts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16 md:pb-20">
          <Separator className="mb-10 bg-border/40" />

          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-primary">
                Berita Lainnya
              </h2>
            </div>
            <Button
              asChild
              variant="ghost"
              className="hidden rounded-full bg-gradient-gold shadow-gold sm:inline-flex text-sm font-semibold text-primary-foreground hover:opacity-90 gap-1.5"
            >
              <Link to="/news">
                Lihat Semua <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* List Items */}
          <div className="divide-y divide-border/40">
            {relatedPosts.map((item) => (
              <Link
                key={item.slug}
                to={`/news/${item.slug}`}
                className="group flex items-center gap-4 py-5 transition-colors hover:bg-card/40 -mx-4 px-4 rounded-2xl"
              >
                {/* Thumbnail */}
                <div className="h-16 w-16 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl border border-border/60">
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <Badge
                      variant="outline"
                      className="shrink-0 rounded-full border-primary/30 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-primary"
                    >
                      {item.tag}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" /> {item.date}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 hidden sm:block">
                    {item.excerpt}
                  </p>
                </div>

                {/* Arrow */}
                <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>

          {/* Mobile CTA */}
          <div className="mt-6 text-center sm:hidden">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-border/60 text-sm text-primary"
            >
              <Link to="/news">
                Lihat Semua Berita <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      {/* ─── Scroll to Top FAB ─── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className={`
          fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full
          bg-gradient-gold shadow-gold text-primary-foreground
          transition-all duration-300
          ${showTop ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}
        `}
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </>
  );
}
