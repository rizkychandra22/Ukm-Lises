import DOMPurify from 'dompurify';
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/constants/news";
import { useTranslation } from "@/i18n";
import { SEOHead } from "@/components/SEOHead";

export function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation("NewsDetailPage");
  const posts = usePosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-16 md:py-24 text-center">
        <h1 className="font-display text-4xl font-bold">{t("not_found_title")}</h1>
        <p className="mt-4 text-muted-foreground">{t("not_found_desc")}</p>
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

  return (
    <>
      <SEOHead
        pageKey="news"
        customTitle={`${post.title} - UKM Lises Asmarandana`}
        customDescription={post.summary || post.title}
      />
      <article className="mx-auto max-w-4xl px-6 pb-12 pt-12 md:pb-16 md:pt-16">
      <Button
        asChild
        variant="ghost"
        className="mb-4 -ml-4 rounded-full border border-border/60 bg-background/40 backdrop-blur-sm text-sm font-semibold text-white transition-colors hover:bg-primary/20 hover:text-primary"
      >
        <Link to="/news">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("btn_back")}
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-3">
        <Badge
          variant="outline"
          className="gap-2 rounded-full border-primary/40 bg-background/40 px-3 py-1 text-xs uppercase tracking-widest text-primary"
        >
          <Sparkles className="h-3 w-3" /> {post.tag}
        </Badge>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" /> {post.date}
        </div>
      </div>

      <h1 className="mt-6 font-display text-4xl font-bold leading-[1.15] md:text-5xl lg:text-6xl">
        {post.title}
      </h1>

      <div className="mt-10 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
        <img src={post.img} alt={post.title} className="w-full h-auto object-cover" />
      </div>

      <div
        className="mt-12 max-w-none text-lg leading-relaxed text-muted-foreground space-y-6"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
      />
    </article>
    </>
  );
}
