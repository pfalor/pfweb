import { describe, it, expect } from 'vitest'
import { navigationItems, experiences } from './data'

describe('navigationItems', () => {
  it('includes the Interactive hub link', () => {
    expect(navigationItems.map((n) => n.href)).toContain('/experiences')
  })
  it('no longer lists the individual experience routes', () => {
    const hrefs = navigationItems.map((n) => n.href)
    for (const gone of ['/agentic-ai-threats', '/red-team', '/in-the-chair', '/playground', '/ai-tools']) {
      expect(hrefs).not.toContain(gone)
    }
  })
})

describe('experiences', () => {
  it('lists five experiences, each with a title, description, and in-app href', () => {
    expect(experiences).toHaveLength(5)
    for (const e of experiences) {
      expect(e.title.length).toBeGreaterThan(0)
      expect(e.description.length).toBeGreaterThan(0)
      expect(e.href.startsWith('/')).toBe(true)
    }
  })
  it('covers exactly the five experience routes', () => {
    expect(experiences.map((e) => e.href).sort()).toEqual(
      ['/agentic-ai-threats', '/ai-tools', '/in-the-chair', '/playground', '/red-team']
    )
  })
})
