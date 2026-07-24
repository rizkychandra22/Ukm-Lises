import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Music2, Sparkles, Users } from "lucide-react";
import hero from "@/assets/hero-lises.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/i18n";

export function HomePage() {
  const { t } = useTranslation("HomePage");

  return (
    <>
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="Pertunjukan tari Lises Asmarandana"
          width={1600}
          height={1008}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative mx-auto flex min-h-[50vh] md:min-h-[60vh] max-w-7xl flex-col justify-center px-6 pt-12 pb-12 md:pt-18 md:pb-18">
          <Badge variant="outline" className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> UKM Lises - UMMI
          </Badge>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-black leading-[1.05] md:text-7xl">
            {t("banner.title_t1")} <span className="text-gradient-gold">{t("banner.title_y1")}</span>,
            <br />
            {t("banner.title_t2")} <span className="text-gradient-gold">{t("banner.title_y2")}</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            {t("banner.description")}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild className="rounded-full bg-gradient-gold px-7 py-6 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]">
              <Link to="/about">
                {t("banner.btn_about")} <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-primary/40 px-7 py-6 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 hover:text-white">
              <Link to="/gallery">
                {t("banner.btn_gallery")}
              </Link>
            </Button>
          </div>

          <div className="mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
            {[
              { n: "120+", l: t("banner.card_1") },
              { n: "45", l: t("banner.card_2") },
              { n: "12", l: t("banner.card_3") },
            ].map((item) => (
              <Card
                key={item.l}
                className="rounded-2xl border-border/60 bg-card/40 backdrop-blur"
              >
                <CardContent className="p-5">
                  <div className="font-display text-3xl font-bold text-gradient-gold">
                    {item.n}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {item.l}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">
              {t("section_divisi.title")}
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold md:text-5xl">
              {t("section_divisi.title_t1")} <span className="text-gradient-gold">{t("section_divisi.title_y1")}</span>.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            {t("section_divisi.desc")}
          </p>
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
                <CardTitle className="font-display text-2xl font-bold">
                  {division.title}
                </CardTitle>
                <CardDescription className="mt-3 text-base">
                  {division.desc}
                </CardDescription>
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
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              {t("section_momen.subtitle")}
            </h2>
          </div>
          <Link
            to="/gallery"
            className="hidden text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            {t("section_momen.link")} 
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[g1, g2, g3].map((src, index) => (
            <div
              key={index}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/60"
            >
              <img
                src={src}
                alt={`Momen ${index + 1}`}
                width={800}
                height={800}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>
          ))}
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
                <Calendar className="h-4 w-4" /> Open Recruitment
              </p>
              <h2 className="mt-3 max-w-xl font-display text-3xl font-bold md:text-4xl">
                Siap menari dan bermusik bersama kami?
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Terbuka untuk seluruh mahasiswa aktif UMMI. Tidak wajib punya
                pengalaman - cukup semangat berkarya.
              </p>
            </div>
            <Button asChild className="rounded-full bg-gradient-gold px-7 py-6 text-sm font-semibold text-primary-foreground shadow-gold">
              <Link to="/contact">
                Daftar Sekarang <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
