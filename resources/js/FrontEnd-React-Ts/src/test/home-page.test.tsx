import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HomePage } from "../pages/home-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

vi.mock("@/i18n", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "id" },
  }),
}));

vi.mock("@/hooks/useGallery", () => ({
  useGallery: () => ({ isLoading: false, galleries: [] }),
}));
vi.mock("@/hooks/useNews", () => ({
  useNews: () => ({ isLoading: false, news: [] }),
}));
vi.mock("@/hooks/useStats", () => ({
  useStats: () => ({
    isLoading: false,
    stats: { total_members: 10, total_batches: 5, total_events: 3 },
  }),
}));

describe("HomePage", () => {
  it("should render the homepage successfully", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </QueryClientProvider>,
    );
    expect(document.body).toBeInTheDocument();
  });
});
