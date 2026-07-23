import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SiteLayout } from "./components/site-layout";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { NewsPage } from "./pages/NewsPage";
import { EventPage } from "./pages/EventPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="event" element={<EventPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
