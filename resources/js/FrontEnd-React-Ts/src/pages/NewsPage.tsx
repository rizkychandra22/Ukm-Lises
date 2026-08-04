import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Newspaper, Sparkles, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useNews } from "@/hooks/useNews";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n";
import { SEOHead } from "@/components/SEOHead";
import { ScrollTop } from "@/components/scroll-top";

export function NewsPage() {
  const { t, i18n } = useTranslation("NewsPage");
  const isEn = i18n.language === "en";

  const { news: posts, isLoading } = useNews();

  return (
    <>
      <SEOHead pageKey="news" />
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-12 md:pb-16 md:pt-16">
        {/* <p className="text-sm uppercase tracking-[0.25em] text-primary">News</p> */}
        <Badge
          variant="outline"
          className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" /> {t("badge")}
        </Badge>
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-[1.15] md:text-4xl">
          {t("title_t1")} <span className="text-gradient-gold">{t("title_y1")}</span>{" "}
          {t("title_t2")}
        </h1>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card
                  key={i}
                  className="flex flex-col rounded-3xl border-border/60 bg-card overflow-hidden"
                >
                  <Skeleton className="aspect-[4/3] w-full" />
                  <CardContent className="flex flex-col p-6 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))
          ) : posts.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 md:py-20 px-3 text-center text-muted-foreground border-primary/50 border-2 border-dashed rounded-2xl">
              <Newspaper className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">{t("no_upload")}</p>
            </div>
          ) : (
            posts.map((post) => {
              const title = isEn ? post.title_en || post.title_id : post.title_id;
              const excerpt = isEn ? post.summary_en || post.summary_id : post.summary_id;
              const date = new Date(post.date).toLocaleDateString(isEn ? "en-US" : "id-ID", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <Card
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border-border/60 bg-card transition-colors hover:border-primary/60"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={post.image}
                      alt={title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <Badge className="absolute left-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-xs font-semibold text-primary-foreground">
                      {post.type}
                    </Badge>
                  </div>
                  <CardContent className="flex flex-1 flex-col p-6">
                    <div className=" flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5 text-primary/70" /> {date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-4 w-4 text-primary/70" /> {post.uploaded_by}
                      </div>
                    </div>
                    <CardTitle className="mt-3 font-display text-xl font-bold leading-snug line-clamp-2">
                      {title}
                    </CardTitle>
                    <CardDescription className="mt-3 flex-1 text-sm line-clamp-3">
                      {excerpt}
                    </CardDescription>
                    <Button
                      asChild
                      variant="link"
                      className="mt-5 h-auto p-0 inline-flex items-center gap-1.5 justify-start text-sm font-semibold text-primary"
                    >
                      <Link to={`/news/${post.slug}`}>
                        {t("btn_readmore")} <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </section>

      <ScrollTop />
    </>
  );
}
