import { describe, expect, it } from 'vitest'
import { classifyBmi } from './classify-bmi'

describe('classifyBmi', () => {
  it('classifies underweight below 18.5', () => {
    expect(classifyBmi(18.4)).toBe('underweight')
    expect(classifyBmi(10)).toBe('underweight')
  })

  it('classifies normal from 18.5 up to (not including) 25', () => {
    expect(classifyBmi(18.5)).toBe('normal')
    expect(classifyBmi(22)).toBe('normal')
    expect(classifyBmi(24.99)).toBe('normal')
  })

  it('classifies overweight from 25 up to (not including) 30', () => {
    expect(classifyBmi(25)).toBe('overweight')
    expect(classifyBmi(29.99)).toBe('overweight')
  })

  it('classifies obese class 1 from 30 up to (not including) 35', () => {
    expect(classifyBmi(30)).toBe('obese_class_1')
    expect(classifyBmi(34.99)).toBe('obese_class_1')
  })

  it('classifies obese class 2 from 35 up to (not including) 40', () => {
    expect(classifyBmi(35)).toBe('obese_class_2')
    expect(classifyBmi(39.99)).toBe('obese_class_2')
  })

  it('classifies obese class 3 from 40 up', () => {
    expect(classifyBmi(40)).toBe('obese_class_3')
    expect(classifyBmi(55)).toBe('obese_class_3')
  })
})
