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

let input: HTMLElement;
let button: HTMLElement;

beforeEach(() => {
  render(
    <WeatherProvider>
      <Header />
    </WeatherProvider>,
  );
  input = screen.getByPlaceholderText("Search for a city...");
  button = screen.getByRole("button", { name: /search/i });
  vi.clearAllMocks();
});

describe("Header component", () => {
  it("Renders header content", () => {
    expect(screen.getByText("Weather App")).toBeDefined();
    expect(input).toBeDefined();
    expect(input.tagName.toLowerCase()).toBe("input");
    expect(button).toBeDefined();
    expect(button.tagName.toLowerCase()).toBe("button");
  });

  it("User interaction: search input and button", () => {
    fireEvent.change(input, { target: { value: "New York" } });
    expect((input as HTMLInputElement).value).toBe("New York");
  });

  it("calls searchWeather when search button is clicked", async () => {
    fireEvent.change(input, { target: { value: "New York" } });
    fireEvent.click(button);

    expect(mockSearchWeather).toHaveBeenCalledWith("New York");
  });
});
