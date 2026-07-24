import g1 from "@/assets/gallery-3.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-1.jpg";
import {useTranslation} from "react-i18next";

export const usePosts = () => {
  const {t} = useTranslation("common");

  return [
    {
      id: 1,
      slug: "gelar-karya-tahunan-malam-asmarandana",
      tag: t("news_1.tag"),
      date: "12 Jul 2026",
      title: t("news_1.title"),
      excerpt: t("news_1.summary"),
      img: g1,
      content: `
        <p>${t("news_1.desc_1")}</p>
        <br/>
        <p>${t("news_1.desc_2")}</p>
        <br/>
        <p>${t("news_1.desc_3")}</p>
      `,
    },
    {
      id: 2,
      slug: "workshop-kacapi-suling-untuk-pemula",
      tag: t("news_2.tag"),
      date: "28 Jun 2026",
      title: t("news_2.title"),
      excerpt: t("news_2.summary"),
      img: g3,
      content: `
        <p>${t("news_2.desc_1")}</p>
        <br/>
        <p>${t("news_2.desc_2")}</p>
        <br/>
        <p>${t("news_2.desc_3")}</p>
      `,
    },
    {
      id: 3,
      slug: "juara-2-festival-tari-se-jawa-barat",
      tag: t("news_3.tag"),
      date: "05 Mei 2026",
      title: t("news_3.title"),
      excerpt: t("news_3.summary"),
      img: g2,
      content: `
        <p>${t("news_3.desc_1")}</p>
        <br/>
        <p>${t("news_3.desc_2")}</p>
        <br/>
        <p>${t("news_3.desc_3")}</p>
      `,
    },
  ];
};
