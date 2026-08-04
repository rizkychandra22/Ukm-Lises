import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
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
  }),
}));

// Mock usePosts to return a post with a script tag (for testing XSS)
vi.mock("@/constants/news", () => ({
  usePosts: () => [
    {
      slug: "test-news",
      title: "Test News Title",
      date: "31 July 2026",
      tag: "Kegiatan",
      img: "test.jpg",
      excerpt: "Test excerpt",
      content: '<p>Safe Content</p><script data-testid="xss-script">alert("xss")</script>',
    },
  ],
}));

describe("NewsDetailPage", () => {
  it("should render post title and date", () => {
    render(<NewsDetailPage />);

    expect(screen.getByText("Test News Title")).toBeInTheDocument();
    expect(screen.getAllByText("31 July 2026")[0]).toBeInTheDocument();
  });

  it("should sanitize HTML and prevent XSS (script injection)", () => {
    const { container } = render(<NewsDetailPage />);

    // The safe content should be in the document
    expect(screen.getByText("Safe Content")).toBeInTheDocument();

    // The script tag should be stripped out by DOMPurify
    const scriptTag = container.querySelector("script");
    expect(scriptTag).toBeNull();
  });
});
