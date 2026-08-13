import { describe, it, expect, vi } from "vitest";
import { getPaymentAccounts, generateOrderCode, submitOrder, trackOrder } from "../lib/api/order";
import apiClient from "../lib/api-client";

vi.mock("../lib/api-client");

describe("Order API", () => {
  it("should fetch payment accounts", async () => {
    const mockData = [{ id: 1, type: "bank" }];
    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await getPaymentAccounts();
    expect(apiClient.get).toHaveBeenCalledWith("/payment-accounts");
    expect(result).toEqual(mockData);
  });

  it("should generate order code", async () => {
    (apiClient.get as any).mockResolvedValue({ data: { order_code: "ORD-123" } });

    const result = await generateOrderCode();
    expect(apiClient.get).toHaveBeenCalledWith("/generate-order-code");
    expect(result).toEqual("ORD-123");
  });

  it("should submit order", async () => {
    const mockFormData = new FormData();
    const mockResponse = { message: "Success", order: { id: 1 } };
    (apiClient.post as any).mockResolvedValue({ data: mockResponse });

    const result = await submitOrder(mockFormData);
    expect(apiClient.post).toHaveBeenCalledWith("/orders", mockFormData, expect.any(Object));
    expect(result).toEqual({ success: true, message: "Success", order: { id: 1 } });
  });

  it("should track order", async () => {
    const mockData = { id: 1, status: "pending" };
    (apiClient.get as any).mockResolvedValue({ data: mockData });

    const result = await trackOrder("ORD-123");
    expect(apiClient.get).toHaveBeenCalledWith("/orders/track/ORD-123");
    expect(result).toEqual(mockData);
  });
});
