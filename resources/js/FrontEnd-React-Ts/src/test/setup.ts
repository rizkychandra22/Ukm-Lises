import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock matchMedia if needed
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

vi.mock("@inertiajs/react", () => {
  return {
    Head: ({ children }: { children: React.ReactNode }) => children,
    Link: ({ children, href, ...props }: any) => {
      return React.createElement("a", { href, ...props }, children);
    },
    usePage: () => ({
      props: {
        auth: { user: { name: "Test User", roles: ["Developer"] } },
        errors: {},
        flash: {},
      },
      url: "/",
    }),
    useForm: (initialValues = {}) => {
      let data = initialValues;
      return {
        data,
        setData: (keyOrData: any, value?: any) => {
          if (typeof keyOrData === "string") {
            data = { ...data, [keyOrData]: value };
          } else {
            data = { ...data, ...keyOrData };
          }
        },
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
        patch: vi.fn(),
        processing: false,
        errors: {},
        reset: vi.fn(),
        clearErrors: vi.fn(),
      };
    },
    router: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      visit: vi.fn(),
      reload: vi.fn(),
    },
  };
});
