import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Dashboard from "../Pages/Dashboard";

describe("Dashboard Component", () => {
  it("renders the Dashboard component without crashing", () => {
    render(<Dashboard />);
    const elements = screen.getAllByText(/Dashboard/i);
    expect(elements.length).toBeGreaterThan(0);
  });
});
