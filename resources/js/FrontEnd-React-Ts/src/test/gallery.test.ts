import { describe, it, expect, vi } from "vitest";
import { getGalleries } from "../lib/api/gallery";
import apiClient from "../lib/api-client";

vi.mock("../lib/api-client");

describe("Gallery API", () => {
  it("should fetch galleries", async () => {
    const mockData = [{ id: 1, title_id: "Test Gallery" }];
    (apiClient.get as any).mockResolvedValue({ data: { data: mockData } });

    const result = await getGalleries();
    expect(apiClient.get).toHaveBeenCalledWith("/galleries");
    expect(result).toEqual(mockData);
  });
});
