import { useState } from "react";
import { Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "@/components/ui/icon-svg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
};

function Field({ label, name, type = "text", placeholder }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="rounded-xl border-border bg-background px-4 py-6 text-sm"
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
      <Badge variant="outline" className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur">
        <Sparkles className="h-3.5 w-3.5" /> Kontak
      </Badge>
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
            <Card
              key={contact.title}
              className="rounded-2xl border-border/60 bg-card"
            >
              <CardContent className="flex gap-4 p-5">
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
              </CardContent>
            </Card>
          ))}
          <div className="flex gap-3 pt-2">
            <a
              href="#"
              className="grid h-11 w-11 place-items-center rounded-xl border border-border text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              aria-label="Instagram"
            >
              {/* IG Icons */}
              <InstagramIcon />
            </a>
            <a
              href="#"
              className="grid h-11 w-11 place-items-center rounded-xl border border-border text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              aria-label="YouTube"
            >
              {/* YT Icons */}
              <YoutubeIcon />
            </a>
          </div>
        </div>

        <Card className="rounded-3xl border-border/60 bg-card md:col-span-3">
          <CardContent className="p-8">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSent(true);
              }}
              className="space-y-5"
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Pesan</label>
            <Textarea
              required
              rows={5}
              placeholder="Tulis pesan Anda..."
              className="rounded-xl border-border bg-background px-4 py-3 text-sm"
            />
          </div>
          <Button
            type="submit"
            className="rounded-full bg-gradient-gold px-7 py-6 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02]"
          >
            <Send className="h-4 w-4 mr-2" /> Kirim Pesan
          </Button>
          {sent ? (
            <p className="text-sm text-primary">
              Terima kasih! Pesan Anda telah terkirim.
            </p>
          ) : null}
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
