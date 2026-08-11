import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/site-layout";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { NewsPage } from "./pages/NewsPage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { EventPage } from "./pages/EventPage";
import { MemberPage } from "./pages/MemberPage";
import { NotFoundPage } from "./pages/NotFoundPage";

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
