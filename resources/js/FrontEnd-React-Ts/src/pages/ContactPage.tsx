import { Mail, MapPin, Phone, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { InstagramIcon } from "@/components/ui/icon-svg";
import { useTranslation } from "@/i18n";
import { SEOHead } from "@/components/SEOHead";

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
        placeholder={placeholder}
        className="rounded-xl border-border bg-background px-4 py-6 text-sm"
      />
    </div>
  );
}

export function ContactPage() {
  const { t } = useTranslation("ContactPage");

  return (
    <>
      <SEOHead pageKey="contact" />
      <section className="mx-auto max-w-7xl px-6 pb-12 pt-12 md:pb-16 md:pt-16">
      <Badge
        variant="outline"
        className="w-fit gap-2 rounded-full border-primary/40 bg-background/40 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-primary backdrop-blur"
      >
        <Sparkles className="h-3.5 w-3.5" /> {t("heading")}
      </Badge>
      <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-[1.15] md:text-4xl">
        {t("title_t1")} <span className="text-gradient-gold">{t("title_y1")}</span> {t("title_t2")}
      </h1>
      <p className="mt-5 max-w-3xl text-muted-foreground">
        {t("desc")}
      </p>

      <div className="mt-14 flex flex-col gap-10">
        {/* Top Section: Form and Map */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Map */}
          <Card className="relative rounded-3xl border-border/60 bg-card overflow-hidden min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.7634380384557!2d106.9343985!3d-6.918859899999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e683633fcd15215%3A0x261f558445241e0c!2sUniversitas%20Muhammadiyah%20Sukabumi!5e0!3m2!1sid!2sid!4v1784882369528!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0, position: "absolute", inset: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* alamat */}
            <div className="absolute bottom-6 left-6 right-6">
              <Card className="rounded-2xl border-border/60 bg-card/85 backdrop-blur-md shadow-lg">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-gold shadow-gold">
                    <MapPin className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                      Sekretariat
                    </div>
                    <div className="mt-1 font-medium text-foreground text-sm leading-snug">
                      Kampus UMMI, Jl. R. Syamsudin, S.H. No. 50, Sukabumi
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Card>

          {/* Form */}
          <Card className="rounded-3xl border-border/60 bg-card h-full">
            <CardContent className="p-8 h-full">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const name = formData.get("name")?.toString().trim();
                  const email = formData.get("email")?.toString().trim();
                  const subject = formData.get("subject")?.toString().trim();
                  const message = formData.get("message")?.toString().trim();

                  if (!name || !email || !subject || !message) {
                    toast.error(t("form.message_error"));
                    return;
                  }

                  toast.success(t("form.message_success"));
                  // Optionally reset the form
                  event.currentTarget.reset();
                }}
                className="flex flex-col justify-between h-full space-y-5"
              >
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t("form.label1")} name="name" placeholder={t("form.placeholder1")} />
                    <Field label={t("form.label2")} name="email" type="email" placeholder={t("form.placeholder2")} />
                  </div>
                  <Field
                    label={t("form.label3")}
                    name="subject"
                    placeholder={t("form.placeholder3")}
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("form.label4")}</label>
                    <Textarea
                      name="message"
                      rows={6}
                      placeholder={t("form.placeholder4")}
                      className="rounded-xl border-border bg-background px-4 py-3 text-sm resize-none"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="rounded-full bg-gradient-gold px-7 py-6 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.02] w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4 mr-2" /> {t("form.btn_submit")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section: 4 Contact Items */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {[
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
            {
              icon: InstagramIcon,
              title: "Instagram",
              val: "@lises.asmarandana",
            },
          ].map((contact) => (
            <Card
              key={contact.title}
              className="rounded-3xl border-border/60 bg-card transition-colors hover:border-primary/40"
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-gold shadow-gold">
                  <contact.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    {contact.title}
                  </div>
                  <div className="mt-1 font-medium text-foreground text-sm leading-snug break-all sm:break-normal">
                    {contact.val}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
