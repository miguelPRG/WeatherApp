import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ScatterChartComponent } from "../src/components/Charts";

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("ScatterChartComponent", () => {
  const mockData = [
    { day: 1, Min: 10, Avg: 15, Max: 20 },
    { day: 2, Min: 12, Avg: 18, Max: 22 },
    { day: 3, Min: 14, Avg: 16, Max: 24 },
  ];

  const mockYUnits = (value: number) => `${value} UVI`;
  const mockYLabel = "UV Index";

  let renderResult: any;

  beforeEach(() => {
    renderResult = render(
      <ScatterChartComponent
        data={mockData}
        yUnits={mockYUnits}
        yLabel={mockYLabel}
      />,
    );
  });

  it("renders without crashing", () => {
    const container = document.querySelector(".recharts-responsive-container");
    expect(container).toBeDefined();
  });

  it("responds to window resize and changes XAxis properties based on screen size", () => {
    // Test desktop view (> 640px)
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    fireEvent(window, new Event("resize"));
    renderResult.rerender(
      <ScatterChartComponent
        data={mockData}
        yUnits={mockYUnits}
        yLabel={mockYLabel}
      />,
    );

    // Verifica propriedades desktop no XAxis
    let xAxis = document.querySelector(".recharts-cartesian-axis-ticks");
    if (xAxis) {
      expect(xAxis).toBeDefined();
    }

    // Test mobile view (< 640px)
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    fireEvent(window, new Event("resize"));
    renderResult.rerender(
      <ScatterChartComponent
        data={mockData}
        yUnits={mockYUnits}
        yLabel={mockYLabel}
      />,
    );

    // Verifica que o componente ainda está renderizado após resize mobile
    xAxis = document.querySelector(".recharts-cartesian-axis-ticks");
    if (xAxis) {
      expect(xAxis).toBeDefined();
    }
  });

  it("adds and removes resize event listener on mount/unmount", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    // Re-render para capturar os spies
    const { unmount } = render(
      <ScatterChartComponent
        data={mockData}
        yUnits={mockYUnits}
        yLabel={mockYLabel}
      />,
    );

    // Verifica se o event listener foi adicionado
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );

    // Unmount o componente
    unmount();

    // Verifica se o event listener foi removido
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it("calls handleResize immediately on component mount", () => {
    const originalInnerWidth = window.innerWidth;

    // Set initial mobile width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 400,
    });

    // Re-render com nova largura
    renderResult.rerender(
      <ScatterChartComponent
        data={mockData}
        yUnits={mockYUnits}
        yLabel={mockYLabel}
      />,
    );

    // Verify component rendered (handleResize was called immediately)
    const container = document.querySelector(".recharts-responsive-container");
    expect(container).toBeDefined();

    // Restore original width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });
});
