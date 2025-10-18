import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Footer from "../src/components/Footer";

describe("Footer component", () => {
  beforeEach(() => {
    // Render Footer component before each test
    render(<Footer />);
  });

  it("renders the current year", () => {
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}`))).toBeDefined();
  });

  it("renders the copyright text", () => {
    expect(
      screen.getByText(/Weather App. All rights reserved to/i),
    ).toBeDefined();
  });

  it("renders the LinkedIn link", () => {
    const link = screen.getByRole("link", { name: /Miguel Gonçalves/i });
    expect(link).toHaveProperty(
      "href",
      "https://www.linkedin.com/in/miguel-gon%C3%A7alves-087195169/",
    );
    expect(link).toHaveProperty("target", "_blank");
    expect(link).toHaveProperty("rel", "external nofollow");
  });

  it("footer becomes visible when scrolled to bottom", async () => {
    window.scrollY = 400;
    window.innerHeight = 600;
    window.dispatchEvent(new Event("scroll"));
    const footer = await screen.findByRole("contentinfo");
    await waitFor(() => {
      expect(footer.className).toMatch(/footer-fade-in/);
      expect(footer.className).toMatch(/opacity-100/);
    });
  });
});
