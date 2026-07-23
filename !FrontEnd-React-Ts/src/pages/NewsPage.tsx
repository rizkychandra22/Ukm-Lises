import { ArrowUpRight, CalendarDays, Sparkles } from "lucide-react";
import g1 from "@/assets/gallery-3.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-1.jpg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const posts = [
  {
    tag: "Pementasan",
    date: "12 Jul 2026",
    title: "Gelar Karya Tahunan: Malam Asmarandana",
    excerpt:
      "Pementasan tahunan menampilkan kolaborasi musik gamelan dan tari kreasi mahasiswa lintas angkatan.",
    img: g1,
  },
  {
    tag: "Workshop",
    date: "28 Jun 2026",
    title: "Workshop Kacapi Suling untuk Pemula",
    excerpt:
      "Kelas terbuka bagi mahasiswa UMMI yang ingin mengenal dasar-dasar permainan kacapi suling.",
    img: g3,
  },
  {
    tag: "Prestasi",
    date: "05 Mei 2026",
    title: "Juara 2 Festival Tari Se-Jawa Barat",
    excerpt:
      "Tim tari Lises Asmarandana meraih penghargaan pada Festival Tari Kreasi Se-Jawa Barat 2026.",
    img: g2,
  },
];

export function NewsPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-20">
      {/* <p className="text-sm uppercase tracking-[0.25em] text-primary">News</p> */}
      <Badge variant="outline" className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur">
        <Sparkles className="h-3.5 w-3.5" /> Berita
      </Badge>
      <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold md:text-6xl">
        Kabar dari <span className="text-gradient-gold">panggung</span> kami.
      </h1>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {posts.map((post) => (
          <Card
            key={post.title}
            className="group flex flex-col overflow-hidden rounded-3xl border-border/60 bg-card transition-colors hover:border-primary/60"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={post.img}
                alt={post.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <Badge className="absolute left-4 top-4 rounded-full bg-gradient-gold px-3 py-1 text-xs font-semibold text-primary-foreground">
                {post.tag}
              </Badge>
            </div>
            <CardContent className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" /> {post.date}
              </div>
              <CardTitle className="mt-3 font-display text-xl font-bold leading-snug">
                {post.title}
              </CardTitle>
              <CardDescription className="mt-3 flex-1 text-sm">
                {post.excerpt}
              </CardDescription>
              <Button
                variant="link"
                className="mt-5 h-auto p-0 inline-flex items-center gap-1.5 justify-start text-sm font-semibold text-primary"
              >
                Baca selengkapnya <ArrowUpRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
