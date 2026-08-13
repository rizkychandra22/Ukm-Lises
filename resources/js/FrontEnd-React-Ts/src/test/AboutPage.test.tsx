import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AboutPage } from "../pages/AboutPage";

vi.mock("@/i18n", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "id" },
  }),
}));

describe("AboutPage", () => {
  it("should render the about page successfully", () => {
    render(<AboutPage />);
    expect(document.body).toBeInTheDocument();
  });
});
