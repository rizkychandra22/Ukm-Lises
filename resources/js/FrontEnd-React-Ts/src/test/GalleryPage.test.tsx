import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GalleryPage } from "../pages/GalleryPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/i18n", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "id" },
  }),
}));

vi.mock("@/hooks/useGallery", () => ({
  useGallery: () => ({ isLoading: false, galleries: [] }),
}));

describe("GalleryPage", () => {
  it("should render the gallery page successfully", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <GalleryPage />
      </QueryClientProvider>,
    );
    expect(document.body).toBeInTheDocument();
  });
});
