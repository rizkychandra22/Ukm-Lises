import { useState } from "react";
import { Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
};

function Field({ label, name, type = "text", placeholder }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-20">
      {/* <p className="text-sm uppercase tracking-[0.25em] text-primary">
        Kontak
      </p> */}
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur">
        <Sparkles className="h-3.5 w-3.5" /> Kontak
      </span>
      <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold md:text-6xl">
        Mari <span className="text-gradient-gold">berkolaborasi</span> bersama
        kami.
      </h1>
      <p className="mt-5 max-w-2xl text-muted-foreground">
        Ingin mengundang kami tampil, kolaborasi, atau bergabung menjadi
        anggota? Silakan hubungi kami melalui kanal berikut.
      </p>

      <div className="mt-14 grid gap-10 md:grid-cols-5">
        <div className="space-y-4 md:col-span-2">
          {[
            {
              icon: MapPin,
              title: "Sekretariat",
              val: "Kampus UMMI, Jl. R. Syamsudin, S.H. No. 50, Sukabumi",
            },
            {
              icon: Mail,
              title: "Email",
              val: "lises.asmarandana@ummi.ac.id",
            },
            {
              icon: Phone,
              title: "WhatsApp",
              val: "+62 812-3456-7890",
            },
          ].map((contact) => (
            <div
              key={contact.title}
              className="flex gap-4 rounded-2xl border border-border/60 bg-card p-5"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-gold shadow-gold">
                <contact.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">
                  {contact.title}
                </div>
                <div className="mt-1 font-medium text-foreground">
                  {contact.val}
                </div>
              </div>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <a
              href="#"
              className="grid h-11 w-11 place-items-center rounded-xl border border-border text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              aria-label="Instagram"
            >
              {/* IG Icons */}
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="#"
              className="grid h-11 w-11 place-items-center rounded-xl border border-border text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              aria-label="YouTube"
            >
              {/* YT Icons */}
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
          className="space-y-5 rounded-3xl border border-border/60 bg-card p-8 md:col-span-3"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama" name="name" placeholder="Nama lengkap" />
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="nama@email.com"
            />
          </div>
          <Field
            label="Subjek"
            name="subject"
            placeholder="Kolaborasi / undangan / lainnya"
          />
          <div>
            <label className="text-sm font-medium">Pesan</label>
            <textarea
              required
              rows={5}
              placeholder="Tulis pesan Anda..."
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02]"
          >
            <Send className="h-4 w-4" /> Kirim Pesan
          </button>
          {sent ? (
            <p className="text-sm text-primary">
              Terima kasih! Pesan Anda telah terkirim.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
