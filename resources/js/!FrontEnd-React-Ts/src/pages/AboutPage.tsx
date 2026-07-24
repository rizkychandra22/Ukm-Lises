import { Eye, Heart, Sparkles, Target } from "lucide-react";
import img from "@/assets/gallery-2.jpg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-12 md:pt-16">
        {/* <p className="text-sm uppercase tracking-[0.25em] text-primary">
          Tentang Kami
        </p> */}
        <Badge
          variant="outline"
          className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" /> Tentang Kami
        </Badge>
        <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-[1.15] md:text-6xl">
          Menyalakan tradisi lewat{" "}
          <span className="text-gradient-gold">kolektif seni mahasiswa</span>.
        </h1>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-12 md:pb-16 md:grid-cols-2 md:items-center">
        <div className="relative overflow-hidden rounded-3xl border border-border/60">
          <img
            src={img}
            alt="Penari Lises Asmarandana"
            width={800}
            height={800}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-5 text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">UKM Lises Asmarandana</span> adalah Unit
            Kegiatan Mahasiswa di bidang seni musik dan tari di Universitas Muhammadiyah Sukabumi.
            Nama <em>Asmarandana</em> diambil dari salah satu tembang Sunda yang sarat makna, cinta
            pada budaya, dan keindahan.
          </p>
          <p>
            Sejak berdiri, UKM ini menjadi ruang bertumbuh bagi mahasiswa yang ingin belajar
            gamelan, kacapi suling, jaipong, tari kreasi, dan berbagai bentuk pertunjukan
            tradisional maupun kontemporer.
          </p>
          <p>
            Setiap tahun, Lises Asmarandana tampil di acara kampus, festival budaya, dan pementasan
            kolaboratif bersama komunitas seni lain.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Eye,
              title: "Visi",
              desc: "Menjadi wadah utama pelestarian seni musik dan tari di lingkungan UMMI serta Sukabumi.",
            },
            {
              icon: Target,
              title: "Misi",
              desc: "Mengembangkan bakat mahasiswa lewat latihan rutin, workshop, dan pementasan berkualitas.",
            },
            {
              icon: Heart,
              title: "Nilai",
              desc: "Kolektivitas, disiplin latihan, dan cinta pada akar budaya tanpa menutup diri pada kebaruan.",
            },
          ].map((item) => (
            <Card key={item.title} className="rounded-3xl border-border/60 bg-card">
              <CardContent className="p-8">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-gold shadow-gold">
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="font-display text-2xl font-bold">{item.title}</CardTitle>
                <CardDescription className="mt-3 text-base">{item.desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
