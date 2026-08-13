import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NewsDetailPage } from "../pages/NewsDetailPage";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useParams: () => ({ slug: "test-news" }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

// Mock i18n
vi.mock("@/i18n", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'id' },
  }),
}));

// Mock usePosts to return a post with a script tag (for testing XSS)
vi.mock("@/hooks/useNews", () => ({
  useNews: () => ({ isLoading: false, news: [] }),
  useNewsDetail: () => ({
    isLoading: false,
    newsDetail: {
      slug: "test-news",
      title_id: "Test News Title",
      title_en: "Test News Title",
      date: "2026-07-31",
      tag: "Kegiatan",
      img: "test.jpg",
      excerpt: "Test excerpt",
      description_id: '<p>Safe Content</p><script data-testid="xss-script">alert("xss")</script>',
    }
  }),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: any) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;

describe("NewsDetailPage", () => {
  it("should render post title and date", () => {
    render(<NewsDetailPage />, { wrapper });

    expect(screen.getByText("Test News Title")).toBeInTheDocument();
    expect(screen.getAllByText("31 Jul 2026")[0]).toBeInTheDocument();
  });

  it("should sanitize HTML and prevent XSS (script injection)", () => {
    const { container } = render(<NewsDetailPage />, { wrapper });

    // The safe content should be in the document
    expect(screen.getByText("Safe Content")).toBeInTheDocument();

    // The script tag should be stripped out by DOMPurify
    const scriptTag = container.querySelector("script");
    expect(scriptTag).toBeNull();
  });
});



