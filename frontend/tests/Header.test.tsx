import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../src/components/Header";
import * as WeatherContext from "../src/hooks/WeatherContext"; // Importa tudo como objeto

vi.mock("../src/hooks/WeatherContext");

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar todos os elementos corretamente', () => {
    (WeatherContext.useWeather as any).mockReturnValue({
      searchWeather: vi.fn()
    });

    render(<Header />);

    expect(screen.getByText('Weather App')).toBeDefined();
    expect(screen.getByPlaceholderText('Search for a city...')).toBeDefined();
    expect(screen.getByRole('button', { name: /search/i })).toBeDefined();
  });

  it('deve chamar searchWeather com valor do input quando botão é clicado', () => {
    const mockSearchWeather = vi.fn();
    (WeatherContext.useWeather as any).mockReturnValue({
      searchWeather: mockSearchWeather
    });

    render(<Header />);

    const input = screen.getByPlaceholderText('Search for a city...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(button);

    expect(mockSearchWeather).toHaveBeenCalledWith('London');
    expect(mockSearchWeather).toHaveBeenCalledTimes(1);
  });

  it('deve chamar searchWeather com string vazia quando input está vazio', () => {
    const mockSearchWeather = vi.fn();
    (WeatherContext.useWeather as any).mockReturnValue({
      searchWeather: mockSearchWeather
    });

    render(<Header />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockSearchWeather).toHaveBeenCalledWith('');
  });

  it('não deve chamar searchWeather ao pressionar Enter se o botão não for focado', () => {
    const mockSearchWeather = vi.fn();
    (WeatherContext.useWeather as any).mockReturnValue({
      searchWeather: mockSearchWeather
    });

    render(<Header />);
    const input = screen.getByPlaceholderText('Search for a city...');

    fireEvent.change(input, { target: { value: 'Paris' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockSearchWeather).not.toHaveBeenCalled();
  });

  it('deve manter o valor do input após clicar no botão', () => {
    const mockSearchWeather = vi.fn();
    (WeatherContext.useWeather as any).mockReturnValue({
      searchWeather: mockSearchWeather
    });

    render(<Header />);
    const input = screen.getByPlaceholderText('Search for a city...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'Tokyo' } });
    fireEvent.click(button);

    expect((input as HTMLInputElement).value).toBe('Tokyo');
  });

  it('deve renderizar corretamente com diferentes valores de input', () => {
    const mockSearchWeather = vi.fn();
    (WeatherContext.useWeather as any).mockReturnValue({
      searchWeather: mockSearchWeather
    });

    render(<Header />);
    const input = screen.getByPlaceholderText('Search for a city...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'São Paulo' } });
    fireEvent.click(button);

    expect(mockSearchWeather).toHaveBeenCalledWith('São Paulo');
  });
});