import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '../../src/components/Footer'

describe('Footer Component', () => {
  it('should display the current year', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`${year}`))).toBeTruthy()
  })

  it("should contain a link to Miguel Gonçalves's LinkedIn", () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /Miguel Gonçalves/i })
    expect(link).toBeTruthy()
    expect(link.getAttribute('href')).toContain('https://www.linkedin.com/in/miguel-gon%C3%A7alves-087195169/')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toContain('external')
  })

  it('should render the copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/Weather App. All rights reserved/i)).toBeTruthy()
  })


})