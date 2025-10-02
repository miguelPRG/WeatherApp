import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../../src/components/Header";
import { WeatherProvider } from "../../src/hooks/WeatherContext";

const mockSearchWeather = vi.fn();

vi.mock("../../src/hooks/WeatherContext", async () => {
  const actual = await vi.importActual("../../src/hooks/WeatherContext");
  return {
    ...actual,
    useWeather: () => ({
      searchWeather: mockSearchWeather,
    }),
    WeatherProvider: actual.WeatherProvider,
  };
});

beforeEach(() => {
  render(
    <WeatherProvider>
      <Header />
    </WeatherProvider>
  );
});

describe("Header component", () => {
  it("Renders header content", () => {
    expect(screen.getByText("Weather App")).toBeDefined();
    const input = screen.getByPlaceholderText("Search for a city...");
    expect(input).toBeDefined();
    expect(input.tagName.toLowerCase()).toBe("input");
    expect(screen.getByRole("button", { name: /search/i })).toBeDefined();
  });

  it("User interaction: search input and button", () => {
    const input = screen.getByPlaceholderText("Search for a city...");
    expect(input).toBeDefined();
    expect(input.tagName.toLowerCase()).toBe("input");
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "New York" } });
    expect((input as HTMLInputElement).value).toBe("New York");
  });

  it("calls searchWeather when search button is clicked", async () => {
    
    const input = screen.getByPlaceholderText("Search for a city...");
    const button = screen.getByRole("button", { name: /search/i });

    fireEvent.change(input, { target: { value: "New York" } });
    fireEvent.click(button);

    expect(mockSearchWeather).toHaveBeenCalledWith("New York");
  });
});
