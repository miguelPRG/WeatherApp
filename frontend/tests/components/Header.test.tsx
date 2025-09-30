import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from '../../src/components/Header'
import { WeatherProvider } from '../../src/hooks/WeatherContext'

describe('Header Component', () => {
  it('should render the the header correctly', () => {
    render(
      <WeatherProvider>
        <Header />
      </WeatherProvider>
    )
    expect(screen.getByText('Weather App')).toBeTruthy()
    expect(screen.getByPlaceholderText('Search for a city...').tagName).toBe('INPUT')
    expect(screen.getByRole('button', { name: 'Search' })).toBeTruthy()
  })
})