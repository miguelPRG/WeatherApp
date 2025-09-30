import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Graphics from '../../src/components/Graphics'
import { WeatherProvider } from '../../src/hooks/WeatherContext'
import { Suspense } from 'react'

// Mock the chart components to avoid lazy loading issues
vi.mock('../../src/components/Charts', () => ({
  LineChartComponent: () => <div>LineChartComponent</div>,
  BarChartComponent: () => <div>BarChartComponent</div>,
  AreaChartComponent: () => <div>AreaChartComponent</div>,
  ComposedChartComponent: () => <div>ComposedChartComponent</div>,
  SimpleRadarChartComponent: () => <div>SimpleRadarChartComponent</div>,
  ScatterChartComponent: () => <div>ScatterChartComponent</div>,
}))

describe('Graphics Component', () => {
  it('renders location title', () => {
    render(
      <WeatherProvider>
        <Graphics />
      </WeatherProvider>
    )
    expect(screen.getByRole('heading', { level: 2 })).toBeTruthy()
  })

  it('renders chart components when weather data is present', () => {
    const mockWeather = [
      {
        time: new Date().toISOString(),
        values: {
          temperatureMin: 10,
          temperatureAvg: 15,
          temperatureMax: 20,
          humidityMin: 40,
          humidityAvg: 50,
          humidityMax: 60,
          evapotranspirationMin: 1,
          evapotranspirationAvg: 2,
          evapotranspirationMax: 3,
          cloudCoverMin: 10,
          cloudCoverAvg: 20,
          cloudCoverMax: 30,
          windSpeedAvg: 5,
          uvIndexMin: 1,
          uvIndexAvg: 2,
          uvIndexMax: 3,
        }
      }
    ]
    // Custom provider to inject mockWeather
    const CustomProvider = ({ children }: any) => (
      <WeatherProvider value={{ location: 'Test', weather: mockWeather, error: null, loading: false }}>
        {children}
      </WeatherProvider>
    )
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <CustomProvider>
          <Graphics />
        </CustomProvider>
      </Suspense>
    )
    expect(screen.getByText('LineChartComponent')).toBeTruthy()
    expect(screen.getByText('BarChartComponent')).toBeTruthy()
    expect(screen.getByText('AreaChartComponent')).toBeTruthy()
    expect(screen.getByText('ComposedChartComponent')).toBeTruthy()
    expect(screen.getByText('SimpleRadarChartComponent')).toBeTruthy()
    expect(screen.getByText('ScatterChartComponent')).toBeTruthy()
  })
})