import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export function ScrollTop() {
  const [showTop, setShowTop] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  });

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-full bg-gradient-gold shadow-gold text-primary-foreground transition-all duration-300 ${showTop ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}`}
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
}
