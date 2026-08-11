import DOMPurify from "dompurify";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
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
import { Skeleton } from "@/components/ui/skeleton";
import { useNews, useNewsDetail } from "@/hooks/useNews";
import { useTranslation } from "@/i18n";
import { SEOHead } from "@/components/SEOHead";
import { ScrollTop } from "@/components/scroll-top";

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation("NewsDetailPage");
  const isEn = i18n.language === "en";

  const { newsDetail: post, isLoading: isDetailLoading } = useNewsDetail(slug || "");
  const { news: allNews, isLoading: isAllNewsLoading } = useNews();

  const isLoading = isDetailLoading || isAllNewsLoading;
  const relatedPosts = allNews.filter((n) => n.slug !== slug).slice(0, 4);
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 space-y-12 animate-pulse">
        {/* 1. Header Section Skeleton */}
        <div className="space-y-4">
          {/* Top Row: Badge + Back Button */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-full" />
          </div>

          {/* Title */}
          <div className="space-y-2 max-w-3xl pt-2">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-3/4 rounded-lg" />
          </div>

          {/* Meta Row (Date & Author) */}
          <div className="flex items-center gap-4 pt-1">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
        </div>

        {/* 2. Two-Column Layout Skeleton */}
        <div className="grid gap-12 md:grid-cols-2 md:items-start">
          {/* Left Column - Image Placeholder */}
          <Skeleton className="h-[320px] sm:h-[420px] w-full rounded-3xl" />

          {/* Right Column - Article Excerpt & Content */}
          <div className="space-y-6">
            {/* Excerpt */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-5 w-4/5 rounded" />
            </div>

            {/* Article Paragraphs */}
            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-11/12 rounded" />
              <Skeleton className="h-4 w-4/5 rounded" />
            </div>

            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-9/12 rounded" />
            </div>
          </div>
        </div>

        {/* 3. Share Section Skeleton */}
        <div className="pt-4 space-y-4 text-center">
          <Skeleton className="h-4 w-36 mx-auto rounded" />
          <div className="flex justify-center gap-3">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>

        {/* 4. Related News List Skeleton */}
        <div className="pt-8 space-y-6">
          <div className="flex justify-between items-end">
            <Skeleton className="h-8 w-44 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-full hidden sm:block" />
          </div>

          <div className="space-y-4 divide-y divide-border/40">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 pt-4">
                <Skeleton className="h-16 w-16 sm:h-20 sm:w-28 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded" />
                  </div>
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded hidden sm:block" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
        await navigator.share({
          title: isEn ? post.title_en || post.title_id : post.title_id,
          text: isEn ? post.summary_en || post.summary_id : post.summary_id,
          url: pageUrl,
        });
      } catch {
        /* cancelled */
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent((isEn ? post.title_en || post.title_id : post.title_id) + "\n" + pageUrl)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      <SEOHead
        pageKey="news"
        customTitle={`${isEn ? post.title_en || post.title_id : post.title_id} - UKM Lises Asmarandana`}
        customDescription={isEn ? post.summary_en || post.summary_id : post.summary_id}
      />

      {/* ─────────── HEADER (mirroring AboutPage) ─────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:pt-16">
        {/* Top Row: Badge (left) + Back Button (right) */}
        <div className="flex items-center justify-between gap-4">
          <Badge
            variant="outline"
            className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" /> {post.type}
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
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-[1.15] md:text-4xl">
          {isEn ? post.title_en || post.title_id : post.title_id}
        </h1>

        {/* Meta Row */}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 text-primary/70" />{" "}
            {new Date(post.date).toLocaleDateString(isEn ? "en-US" : "id-ID", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4 text-primary/70" /> {post.uploaded_by}
          </span>
        </div>
      </section>

      {/* ─────────── TWO-COLUMN LAYOUT (like AboutPage) ─────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-12 md:pb-16 block after:content-[''] after:table after:clear-both">
        {/* Left Column — Image (Floated on Desktop) */}
        <div className="relative overflow-hidden rounded-3xl border border-border/60 md:float-left md:w-[48%] md:mr-10 md:mb-6 mb-8">
          <img
            src={post.image}
            alt={isEn ? post.title_en || post.title_id : post.title_id}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Excerpt */}
        {(post.summary_id || post.summary_en) && (
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground mb-6">
            <span className="font-semibold text-foreground">{post.type}.</span>{" "}
            {isEn ? post.summary_en || post.summary_id : post.summary_id}
          </p>
        )}

        {/* Article Content */}
        <div
          className="
            max-w-none w-full text-base leading-relaxed text-muted-foreground
            [&>p]:mt-4 [&>p]:mb-4 [&>p]:last:mb-0 [&>p]:text-justify [&>p]:indent-8
            [&>h2]:mt-6 [&>h2]:mb-2 [&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-foreground
            [&>h3]:mt-4 [&>h3]:mb-2 [&>h3]:font-display [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-foreground
            [&>blockquote]:my-5 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/60
            [&>blockquote]:bg-card/50 [&>blockquote]:rounded-r-2xl [&>blockquote]:px-5 [&>blockquote]:py-4
            [&>blockquote]:italic [&>blockquote]:text-foreground/80
            [&>img]:my-5 [&>img]:rounded-2xl [&>img]:border [&>img]:border-border/60
            [&>ul]:list-disc [&>ul]:my-2 [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:my-2 [&>ol]:pl-6
          "
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(
              (isEn ? post.description_en || post.description_id : post.description_id).replace(/&nbsp;/g, ' ')
            ),
          }}
        />
      </section>

      {/* ─────────── SHARE SECTION ─────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
        <Separator className="mb-10 bg-border/40" />
        <div className="space-y-5 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            {t("share_news")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="rounded-full border-border/60 bg-card gap-2 text-sm hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
            >
              <MessageCircle className="h-4 w-4" /> {t("share_wa")}
            </Button>
            <Button
              onClick={handleCopy}
              variant="outline"
              className="rounded-full border-border/60 bg-card gap-2 text-sm hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? t("salin_link_true") : t("share_link")}
            </Button>
            <Button
              onClick={handleShare}
              className="rounded-full bg-gradient-gold shadow-gold gap-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all"
            >
              <Share2 className="h-4 w-4" /> {t("share")}
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
              <h2 className="font-display text-3xl font-bold text-primary">{t("news")}</h2>
            </div>
            <Button
              asChild
              variant="ghost"
              className="hidden rounded-full bg-gradient-gold shadow-gold sm:inline-flex text-sm font-semibold text-primary-foreground hover:opacity-90 gap-1.5"
            >
              <Link to="/news">
                {t("cta_dekstop")} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* List Items */}
          <div className="divide-y divide-border/40">
            {relatedPosts.map((item) => {
              const itemTitle = isEn ? item.title_en || item.title_id : item.title_id;
              const itemExcerpt = isEn ? item.summary_en || item.summary_id : item.summary_id;
              const itemDate = new Date(item.date).toLocaleDateString(isEn ? "en-US" : "id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <Link
                  key={item.slug}
                  to={`/news/${item.slug}`}
                  className="group flex items-center gap-4 py-5 transition-colors hover:bg-card/40 -mx-4 px-4 rounded-2xl"
                >
                  {/* Thumbnail */}
                  <div className="h-16 w-16 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl border border-border/60">
                    <img
                      src={item.image}
                      alt={itemTitle}
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
                        {item.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" /> {itemDate}
                      </span>
                    </div>
                    <h3 className="font-display text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors truncate">
                      {itemTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 hidden sm:block">
                      {itemExcerpt}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </Link>
              );
            })}
          </div>

          {/* Mobile CTA */}
          <div className="mt-6 text-center sm:hidden">
            <Button
              asChild
              variant="outline"
              className="rounded-full border-border/60 text-sm text-primary"
            >
              <Link to="/news">
                {t("cta_mobile")} <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}

      <ScrollTop />
    </>
  );
}
