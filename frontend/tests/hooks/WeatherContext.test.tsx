import { describe, it, expect, beforeEach, vi, afterEach, test } from "vitest";
import {
  render,
  cleanup,
  fireEvent,
  renderHook,
  waitFor,
} from "@testing-library/react";
import { WeatherProvider, useWeather } from "../../src/hooks/WeatherContext";

// Mock das APIs
global.fetch = vi.fn();
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("WeatherContext", () => {
  // Mock data globais
  const mockLocationData = {
    city: "Bragança",
    region: "Bragança",
    country_name: "Portugal",
  };

  const mockWeatherData = [{ time: new Date().toISOString(), temperature: 25 }];
  const mockCachedWeatherData = [
    { time: new Date().toISOString(), temperature: 20 },
  ];

  const createExpiredWeatherData = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return [{ time: yesterday.toISOString(), temperature: 20 }];
  };

  // Helper para criar mock de fetch com sucesso
  const mockSuccessfulFetch = (
    locationData = mockLocationData,
    weatherData = mockWeatherData,
  ) => {
    global.fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(locationData),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ timelines: { daily: weatherData } }),
      });
  };

  // Helper para criar mock de fetch apenas para localização
  const mockLocationOnlyFetch = (locationData = mockLocationData) => {
    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(locationData),
    });
  };

  // Helper para criar mock de fetch com erro
  const mockErrorFetch = (errorMessage: string) => {
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ error: errorMessage }),
    });
  };

  // Helper para criar mock de fetch com erro de rede
  const mockNetworkErrorFetch = (errorMessage: string) => {
    global.fetch.mockRejectedValue(new Error(errorMessage));
  };

  // Helper para criar mock de fetch com erro na API do weather apenas
  const mockWeatherErrorFetch = (errorMessage: string) => {
    global.fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockLocationData),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ error: errorMessage }),
      });
  };

  // Helper para renderizar hook
  const renderWeatherHook = () => {
    return renderHook(() => useWeather(), {
      wrapper: WeatherProvider,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  // Basic render test
  test("provides initial context values", () => {
    const { result } = renderWeatherHook();

    expect(result.current).toEqual({
      location: null,
      weather: null,
      error: null,
      loading: true,
      searchWeather: expect.any(Function),
    });
  });

  test("throws error when used outside provider", () => {
    expect(() => {
      renderHook(() => useWeather());
    }).toThrow("useWeather must be used within WeatherProvider");
  });

  test("initializes with location data on mount", async () => {
    mockSuccessfulFetch();
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderWeatherHook();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.location).toBe("Bragança, Bragança, Portugal");
    expect(result.current.weather).toEqual(mockWeatherData);
    expect(result.current.error).toBe(null);
  });

  test("uses cached weather data when still valid", async () => {
    mockLocationOnlyFetch();
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify(mockCachedWeatherData),
    );

    const { result } = renderWeatherHook();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weather).toEqual(mockCachedWeatherData);
    expect(global.fetch).toHaveBeenCalledTimes(1); // Only location API called
  });

  test("fetches fresh weather data when cache is expired", async () => {
    const expiredWeatherData = createExpiredWeatherData();
    const freshWeatherData = [
      { time: new Date().toISOString(), temperature: 25 },
    ];

    mockSuccessfulFetch(mockLocationData, freshWeatherData);
    mockLocalStorage.getItem.mockReturnValue(
      JSON.stringify(expiredWeatherData),
    );

    const { result } = renderWeatherHook();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weather).toEqual(freshWeatherData);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test("searchWeather updates location and weather data", async () => {
    const searchWeatherData = [
      { time: new Date().toISOString(), temperature: 30 },
    ];

    // Mock inicial para localização + mock para searchWeather
    global.fetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve(mockLocationData),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ timelines: { daily: mockWeatherData } }),
      })
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({ timelines: { daily: searchWeatherData } }),
      });

    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderWeatherHook();

    // Aguarda inicialização
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.searchWeather("Bragança");

    expect(result.current.location).toBe("Bragança, Bragança, Portugal");
    expect(result.current.weather).toBeDefined();
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  test("handles weather API error correctly", async () => {
    mockWeatherErrorFetch("Location not found");

    const { result } = renderWeatherHook();

    await result.current.searchWeather("InvalidCity");

    expect(result.current.weather).toBe(null);
    expect(result.current.weather).toBe(null);
    expect(result.current.loading).toBe(true);
  });

  test("handles invalid cached data format", async () => {
    const saoPauloLocationData = {
      city: "São Paulo",
      region: "SP",
      country_name: "Brazil",
    };

    mockSuccessfulFetch(saoPauloLocationData);
    mockLocalStorage.getItem.mockReturnValue("invalid json");

    const { result } = renderWeatherHook();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weather).toBeDefined();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
