import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NotFoundPage } from "../pages/not-found-page";
import { BrowserRouter } from "react-router-dom";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "id" },
  }),
}));

describe("NotFoundPage", () => {
  it("should render the not found page successfully", () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>,
    );
    expect(document.body).toBeInTheDocument();
  });
});
