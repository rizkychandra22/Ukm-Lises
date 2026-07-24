import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Mail, Menu, X } from "lucide-react";
import logo from "@/assets/logo-bg-dark.png";
import flagId from "@/assets/flag-id.png";
import flagEn from "@/assets/flag-en.png";
import { InstagramIcon, YoutubeIcon } from "./ui/icon-svg";
import { useTranslation } from "react-i18next";
import { ScrollToTop } from "./scrolling";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const getNav = (t: any) => [
  { to: "/", label: t("nav.home") },
  { to: "/about", label: t("nav.about") },
  { to: "/gallery", label: t("nav.gallery") },
  { to: "/news", label: t("nav.news") },
  { to: "/event", label: t("nav.event") },
  { to: "/contact", label: t("nav.contact") },
];

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation("site-layout");
  const nav = getNav(t);
  const lang = i18n.language || "id";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollToTop />
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="group flex items-center gap-3">
            <img
              src={logo}
              alt="Logo Lises Asmarandana"
              width={40}
              height={40}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-10 w-10 rounded-full object-cover shadow-gold"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-lg font-bold text-gradient-gold">
                Lises Asmarandana
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {t("nav.brand")}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="hidden h-auto items-center gap-2 rounded-full border-border/60 bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground md:inline-flex"
              >
                <img
                  src={lang === "id" ? flagId : flagEn}
                  alt="Language"
                  className="h-4 w-6 rounded-sm object-cover"
                />
                <span className="uppercase">{lang}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => i18n.changeLanguage("id")}
                className="gap-3 cursor-pointer"
              >
                <img src={flagId} alt="Indonesia" className="h-4 w-6 rounded-sm object-cover" />
                Indonesia
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => i18n.changeLanguage("en")}
                className="gap-3 cursor-pointer"
              >
                <img src={flagEn} alt="English" className="h-4 w-6 rounded-sm object-cover" />
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="icon"
            className="md:hidden border-border text-primary"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {open ? (
          <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] md:hidden">
            <Card className="shadow-lg border-border/60">
              <CardContent className="flex flex-col p-4">
                <nav className="flex flex-col gap-1">
                  {nav.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                          isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
                <div className="mt-4 flex gap-3 pt-4 border-t border-border/60">
                  <Button
                    variant={lang === "id" ? "default" : "outline"}
                    onClick={() => {
                      i18n.changeLanguage("id");
                      setOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-5 text-sm font-semibold ${
                      lang === "id"
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "border-border bg-card text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <img src={flagId} alt="Indonesia" className="h-4 w-6 rounded-sm object-cover" />
                    ID
                  </Button>
                  <Button
                    variant={lang === "en" ? "default" : "outline"}
                    onClick={() => {
                      i18n.changeLanguage("en");
                      setOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-5 text-sm font-semibold ${
                      lang === "en"
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "border-border bg-card text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <img src={flagEn} alt="English" className="h-4 w-6 rounded-sm object-cover" />
                    EN
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-24 border-t border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo Lises Asmarandana"
                width={36}
                height={36}
                loading="eager"
                decoding="async"
                className="h-9 w-9 rounded-full object-cover"
              />
              <span className="font-display text-lg font-bold text-gradient-gold">
                Lises Asmarandana
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t("footer.desc")}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-primary">
              {t("footer.links")}
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-primary">
              {t("footer.social")}
            </h4>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("footer.address")}
              <br />
              Jl. R. Syamsudin, S.H. No. 50, Sukabumi
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Instagram"
              >
                {/* IG Icons */}
                <InstagramIcon />
              </a>
              <a
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="YouTube"
              >
                {/* YT Icons */}
                <YoutubeIcon />
              </a>
              <a
                href="mailto:lises@ummi.ac.id"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border/60">
          <p className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-muted-foreground">
            {t("footer.copyright")} <br className="sm:hidden" /> {t("footer.outhor")}
            <a
              href="https://portofolio-rizky-chandra.laravel.cloud/"
              className="text-primary hover:underline"
            >
              {" "}
              Chndr
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
