import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Mail, Menu, X } from "lucide-react";
import logo from "@/assets/logo-bg-dark.png";
import flagId from "@/assets/flag-id.png";
import flagEn from "@/assets/flag-en.png";
import { InstagramIcon, YoutubeIcon } from "./ui/icon-svg";
import { ScrollToTop } from "./scrolling";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/news", label: "News" },
  { to: "/event", label: "Event" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<"id" | "en">("id");

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
                Universitas Muhammadiyah Sukabumi
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
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="hidden h-auto items-center gap-2 rounded-full border-border/60 bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground md:inline-flex">
                <img
                  src={lang === "id" ? flagId : flagEn}
                  alt="Language"
                  className="h-4 w-6 rounded-sm object-cover"
                />
                <span className="uppercase">{lang}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setLang("id")} className="gap-3 cursor-pointer">
                <img src={flagId} alt="Indonesia" className="h-4 w-6 rounded-sm object-cover" />
                Indonesia
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("en")} className="gap-3 cursor-pointer">
                <img src={flagEn} alt="English" className="h-4 w-6 rounded-sm object-cover" />
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden border-border text-primary"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full flex-col border-border/60 bg-background/95 backdrop-blur-xl px-6 py-6 sm:max-w-sm">
              <SheetTitle className="sr-only">Menu Navigasi Mobile</SheetTitle>
              <nav className="mt-8 flex flex-col gap-2">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-4 py-4 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-auto flex gap-3 pt-6 border-t border-border/60">
                <Button
                  variant={lang === "id" ? "default" : "outline"}
                  onClick={() => { setLang("id"); setOpen(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-6 text-sm font-semibold ${
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
                  onClick={() => { setLang("en"); setOpen(false); }}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-6 text-sm font-semibold ${
                    lang === "en"
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "border-border bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <img src={flagEn} alt="English" className="h-4 w-6 rounded-sm object-cover" />
                  EN
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
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
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Unit Kegiatan Mahasiswa seni musik dan tari Universitas
              Muhammadiyah Sukabumi. Merawat budaya, memanggung talenta.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-primary">
              Navigasi
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
              Terhubung
            </h4>
            <p className="mt-4 text-sm text-muted-foreground">
              Sekretariat UKM - Kampus UMMI
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
            &copy; {new Date().getFullYear()} UKM Lises Asmarandana &mdash; Universitas
            Muhammadiyah Sukabumi &mdash; Created By 
            <a href="https://portofolio-rizky-chandra.laravel.cloud/" className="text-primary hover:underline"> Chndr</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
