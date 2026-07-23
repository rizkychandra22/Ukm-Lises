import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Music2, Sparkles, Users } from "lucide-react";
import hero from "@/assets/hero-lises.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <img
          src={hero}
          alt="Pertunjukan tari Lises Asmarandana"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-6 py-24">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> UKM Lises - UMMI
          </span>
          <h1 className="mt-6 max-w-4xl font-display text-5xl font-black leading-[1.05] md:text-7xl">
            Bergema dalam <span className="text-gradient-gold">Nada</span>,
            <br />
            Bercerita lewat <span className="text-gradient-gold">Gerak</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            UKM Lises Asmarandana adalah rumah bagi mahasiswa Universitas
            Muhammadiyah Sukabumi yang mencintai seni musik dan tari - merawat
            tradisi, menghidupkan panggung.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
            >
              Kenali Kami <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-7 py-3 text-sm font-semibold text-primary hover:bg-primary/10"
            >
              Lihat Galeri
            </Link>
          </div>

          <div className="mt-16 grid max-w-3xl gap-6 sm:grid-cols-3">
            {[
              { n: "120+", l: "Anggota Aktif" },
              { n: "45", l: "Pementasan" },
              { n: "12", l: "Tahun Berkarya" },
            ].map((item) => (
              <div
                key={item.l}
                className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur"
              >
                <div className="font-display text-3xl font-bold text-gradient-gold">
                  {item.n}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {item.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">
              Divisi Kami
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold md:text-5xl">
              Dua nafas, satu <span className="text-gradient-gold">panggung</span>.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Musik dan tari berjalan berdampingan di Lises Asmarandana - saling
            mengisi dalam setiap karya dan pertunjukan.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Music2,
              title: "Divisi Musik",
              desc: "Gamelan, kacapi suling, hingga kolaborasi kontemporer. Kami menghidupkan bunyi dari akar tradisi.",
            },
            {
              icon: Users,
              title: "Divisi Tari",
              desc: "Jaipong, tari kreasi, dan koreografi baru - gerak yang jujur berpadu dengan cerita budaya.",
            },
          ].map((division) => (
            <div
              key={division.title}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-8 transition-colors hover:border-primary/60"
            >
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-gold shadow-gold">
                <division.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold">
                {division.title}
              </h3>
              <p className="mt-3 text-muted-foreground">{division.desc}</p>
              <div className="absolute -right-16 -bottom-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-primary">
              Momen
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Cuplikan panggung
            </h2>
          </div>
          <Link
            to="/gallery"
            className="hidden text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            Lihat Galeri 
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

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-10 md:p-16">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(1000px 400px at 20% 0%, var(--gold-deep), transparent 60%)",
            }}
          />
          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
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
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3 text-sm font-semibold text-primary-foreground shadow-gold"
            >
              Daftar Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
