import { describe, expect, it } from 'vitest'
import { isValidDescription } from '../src/utils'

describe('isValidDescription', () => {
  it('accepts descriptions up to 132 characters', () => {
    expect(isValidDescription('a'.repeat(132))).toBe(true)
  })

  it('rejects descriptions longer than 132 characters', () => {
    expect(isValidDescription('a'.repeat(133))).toBe(false)
  })

  it('rejects empty or whitespace-only descriptions', () => {
    expect(isValidDescription('')).toBe(false)
    expect(isValidDescription('   ')).toBe(false)
  })
})
