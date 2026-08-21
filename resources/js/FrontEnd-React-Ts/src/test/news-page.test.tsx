import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NewsPage } from "../pages/news-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

vi.mock("@/i18n", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "id" },
  }),
}));

vi.mock("@/hooks/use-news", () => ({
  useNews: () => ({ isLoading: false, news: [] }),
}));

describe("NewsPage", () => {
  it("should render the news page successfully", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NewsPage />
        </BrowserRouter>
      </QueryClientProvider>,
    );
    expect(document.body).toBeInTheDocument();
  });
});
