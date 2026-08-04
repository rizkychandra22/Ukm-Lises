import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface SEOHeadProps {
  pageKey: "home" | "about" | "members" | "events" | "news" | "newsDetail" | "gallery" | "contact";
  customTitle?: string;
  customDescription?: string;
}

export function SEOHead({ pageKey, customTitle, customDescription }: SEOHeadProps) {
  const { t, i18n } = useTranslation("seo");

  const title = customTitle || t(`${pageKey}.title`);
  const description = customDescription || t(`${pageKey}.description`);
  const keywords = t(`${pageKey}.keywords`);
  const currentLang = i18n.language || "id";

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Helmet>
      <html lang={currentLang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />

      {/* Multilingual Alternate Links for SEO */}
      <link rel="alternate" hrefLang="id" href={currentUrl} />
      <link rel="alternate" hrefLang="en" href={currentUrl} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={currentLang === "en" ? "en_US" : "id_ID"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
