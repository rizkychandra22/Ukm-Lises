import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/site-layout";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { AboutPage } from "./pages/about-page";
import { ContactPage } from "./pages/contact-page";
import { GalleryPage } from "./pages/gallery-page";
import { HomePage } from "./pages/home-page";
import { NewsPage } from "./pages/news-page";
import { NewsDetailPage } from "./pages/news-detail-page";
import { EventPage } from "./pages/event-page";
import { MemberPage } from "./pages/member-page";
import { NotFoundPage } from "./pages/not-found-page";

function App() {
  useEffect(() => {
    // @ts-expect-error window.flashMessage injected by Laravel
    if (window.flashMessage) {
      // @ts-expect-error window.flashMessage injected by Laravel
      const msg = window.flashMessage;
      if (typeof msg === "object" && msg !== null) {
        toast.success(msg.title || "Berhasil", { description: msg.message });
      } else {
        toast.success(String(msg));
      }
      // @ts-expect-error window.flashMessage injected by Laravel
      window.flashMessage = null;
    }
  }, []);

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:slug" element={<NewsDetailPage />} />
          <Route path="event" element={<EventPage />} />
          <Route path="member" element={<MemberPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
