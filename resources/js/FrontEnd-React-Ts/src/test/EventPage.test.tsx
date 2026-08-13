import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EventPage } from "../pages/EventPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

vi.mock("@/i18n", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "id" },
  }),
}));

vi.mock("@/hooks/useEvent", () => ({
  useEvents: () => ({ isLoading: false, events: [] }),
}));
vi.mock("@/hooks/usePayment", () => ({
  usePaymentAccounts: () => ({ isLoading: false, accounts: [], refetch: vi.fn() }),
  useGenerateOrderCode: () => ({ isLoading: false, data: null, refetch: vi.fn() }),
  useSubmitOrder: () => ({ submitOrderAsync: vi.fn(), isPending: false }),
}));

describe("EventPage", () => {
  it("should render the event page successfully", () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <EventPage />
        </BrowserRouter>
      </QueryClientProvider>,
    );
    expect(document.body).toBeInTheDocument();
  });
});
