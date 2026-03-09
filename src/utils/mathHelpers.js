/**
 * Mathematical Utility Functions
 * Comprehensive library for calculator operations including:
 * - Angle conversions
 * - Factorial calculations
 * - Financial functions (Excel-compatible)
 * - Compound interest calculations
 * - ROI and NPV/IRR calculations
 * - Unit conversion factors
 * - Temperature conversions
 * - Currency formatting
 */

import Decimal from 'decimal.js'
import { evaluate } from 'mathjs'

/**
 * Converts degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} - Angle in radians
 * @example
 * degreesToRadians(180) // returns π (approximately 3.141592653589793)
 */
export function degreesToRadians(degrees) {
  return Decimal(degrees).mul(Math.PI).div(180).toNumber()
}

/**
 * Converts radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} - Angle in degrees
 * @example
 * radiansToDegrees(Math.PI) // returns 180
 */
export function radiansToDegrees(radians) {
  return Decimal(radians).mul(180).div(Math.PI).toNumber()
}

/**
 * Calculates factorial of a number with error handling
 * @param {number} n - The number to calculate factorial for
 * @returns {number|string} - Factorial value or error message
 * @throws {Error} - If n is negative, non-integer, or overflow (n > 170)
 * @example
 * factorial(5) // returns 120
 * factorial(0) // returns 1
 * factorial(-1) // throws Error
 */
export function factorial(n) {
  // Check for negative numbers
  if (n < 0) {
    throw new Error('Factorial is not defined for negative numbers')
  }

  // Check for non-integer
  if (!Number.isInteger(n)) {
    throw new Error('Factorial is only defined for integers')
  }

  // Check for overflow (factorial of numbers > 170 exceeds Number.MAX_VALUE)
  if (n > 170) {
    throw new Error('Factorial overflow: number is too large (> 170)')
  }

  // Base case
  if (n === 0 || n === 1) {
    return 1
  }

  // Calculate factorial iteratively for performance
  let result = 1
  for (let i = 2; i <= n; i++) {
    result *= i
  }

  return result
}

/**
 * Calculates the payment for a loan based on constant payments and constant interest rate
 * Excel-compatible PMT function
 * @param {number} rate - Interest rate per period
 * @param {number} nper - Total number of payment periods
 * @param {number} pv - Present value (loan amount)
 * @param {number} [fv=0] - Future value (optional, default 0)
 * @param {number} [type=0] - Payment timing: 0 = end of period, 1 = beginning of period (optional, default 0)
 * @returns {number} - Payment amount per period
 * @example
 * PMT(0.05/12, 360, 100000) // returns approximately 536.82
 */
export function PMT(rate, nper, pv, fv = 0, type = 0) {
  const r = new Decimal(rate)
  const n = new Decimal(nper)
  const presentValue = new Decimal(pv)
  const futureValue = new Decimal(fv)

  if (r.isZero()) {
    // Simple division if rate is zero
    return presentValue.neg().add(futureValue).div(n).toNumber()
  }

  const typeFactor = type === 1 ? new Decimal(1) : new Decimal(0)
  const r1 = r.add(1)
  const r1N = r1.pow(n)

  const numerator = presentValue.mul(r1N)
    .add(futureValue)
    .mul(r)

  const denominator = r1N.neg()
    .add(1)
    .mul(r1.add(typeFactor))

  return numerator.div(denominator).toNumber()
}

/**
 * Calculates the present value of an investment
 * Excel-compatible PV function
 * @param {number} rate - Interest rate per period
 * @param {number} nper - Total number of payment periods
 * @param {number} pmt - Payment made each period
 * @param {number} [fv=0] - Future value (optional, default 0)
 * @param {number} [type=0] - Payment timing: 0 = end of period, 1 = beginning of period (optional, default 0)
 * @returns {number} - Present value
 * @example
 * PV(0.05/12, 360, -536.82) // returns approximately 100000
 */
export function PV(rate, nper, pmt, fv = 0, type = 0) {
  const r = new Decimal(rate)
  const n = new Decimal(nper)
  const payment = new Decimal(pmt)
  const futureValue = new Decimal(fv)

  if (r.isZero()) {
    return payment.mul(n).neg().add(futureValue).toNumber()
  }

  const typeFactor = type === 1 ? new Decimal(1) : new Decimal(0)
  const r1 = r.add(1)
  const r1N = r1.pow(n)

  const pv = payment.mul(r1N.neg().add(1).div(r).mul(r1.add(typeFactor).neg()))
    .add(futureValue.div(r1N))

  return pv.toNumber()
}

/**
 * Calculates the future value of an investment
 * Excel-compatible FV function
 * @param {number} rate - Interest rate per period
 * @param {number} nper - Total number of payment periods
 * @param {number} pmt - Payment made each period
 * @param {number} [pv=0] - Present value (optional, default 0)
 * @param {number} [type=0] - Payment timing: 0 = end of period, 1 = beginning of period (optional, default 0)
 * @returns {number} - Future value
 * @example
 * FV(0.05/12, 12, -100, -1000) // returns approximately 2300.47
 */
export function FV(rate, nper, pmt, pv = 0, type = 0) {
  const r = new Decimal(rate)
  const n = new Decimal(nper)
  const payment = new Decimal(pmt)
  const presentValue = new Decimal(pv)

  if (r.isZero()) {
    return presentValue.neg().add(payment.mul(n)).toNumber()
  }

  const typeFactor = type === 1 ? new Decimal(1) : new Decimal(0)
  const r1 = r.add(1)
  const r1N = r1.pow(n)

  const fv = payment.mul(r1N.neg().add(1).div(r).mul(r1.add(typeFactor)))
    .neg()
    .add(presentValue.mul(r1N).neg())

  return fv.toNumber()
}

/**
 * Calculates the number of periods for an investment
 * Excel-compatible NPER function
 * @param {number} rate - Interest rate per period
 * @param {number} pmt - Payment made each period
 * @param {number} pv - Present value
 * @param {number} [fv=0] - Future value (optional, default 0)
 * @param {number} [type=0] - Payment timing: 0 = end of period, 1 = beginning of period (optional, default 0)
 * @returns {number} - Number of periods
 * @example
 * NPER(0.05/12, -536.82, 100000) // returns approximately 360
 */
export function NPER(rate, pmt, pv, fv = 0, type = 0) {
  const r = new Decimal(rate)
  const payment = new Decimal(pmt)
  const presentValue = new Decimal(pv)
  const futureValue = new Decimal(fv)

  if (r.isZero()) {
    return presentValue.add(futureValue).div(payment).neg().toNumber()
  }

  const typeFactor = type === 1 ? new Decimal(1) : new Decimal(0)
  const r1 = r.add(1)

  const numerator = payment.mul(r1.add(typeFactor)).sub(r.mul(futureValue))
  const denominator = payment.mul(r1.add(typeFactor)).add(r.mul(presentValue))

  return numerator.div(denominator).abs().ln().div(r1.ln()).toNumber()
}

/**
 * Calculates the interest rate per period of an annuity
 * Excel-compatible RATE function using Newton-Raphson method
 * @param {number} nper - Total number of payment periods
 * @param {number} pmt - Payment made each period
 * @param {number} pv - Present value
 * @param {number} [fv=0] - Future value (optional, default 0)
 * @param {number} [type=0] - Payment timing: 0 = end of period, 1 = beginning of period (optional, default 0)
 * @param {number} [guess=0.1] - Guess for interest rate (optional, default 0.1)
 * @returns {number} - Interest rate per period
 * @example
 * RATE(360, -536.82, 100000) // returns approximately 0.0041667 (0.05/12)
 */
export function RATE(nper, pmt, pv, fv = 0, type = 0, guess = 0.1) {
  const n = new Decimal(nper)
  const payment = new Decimal(pmt)
  const presentValue = new Decimal(pv)
  const futureValue = new Decimal(fv)

  // Edge case: if pmt is 0, simple rate calculation
  if (payment.isZero()) {
    return presentValue.div(futureValue).abs().pow(n.neg()).sub(1).toNumber()
  }

  const typeFactor = type === 1 ? 1 : 0

  // Newton-Raphson iteration
  let rate = guess
  const maxIter = 100
  const tolerance = 1e-6

  for (let i = 0; i < maxIter; i++) {
    const r1 = rate + 1
    const r1N = Math.pow(r1, n.toNumber())

    // Function value
    const f = presentValue + payment * (1 + rate * typeFactor) * (1 - r1N) / rate + futureValue * r1N

    // Derivative
    const df = payment * (1 + rate * typeFactor) * ((r1N - 1) / (rate * rate) - n * r1N / rate) +
               typeFactor * payment * (1 - r1N) / rate +
               futureValue * n * r1N

    const newRate = rate - f / df

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate
    }

    rate = newRate
  }

  return rate
}

/**
 * Calculates compound interest
 * @param {number} principal - Initial principal amount
 * @param {number} rate - Annual interest rate (as percentage, e.g., 5 for 5%)
 * @param {number} time - Time in years
 * @param {number} [frequency=1] - Number of compounding periods per year (optional, default 1)
 * @returns {number} - Total amount after compound interest
 * @example
 * compoundInterest(1000, 5, 10, 12) // returns approximately 1647.01 (interest = 647.01)
 */
export function compoundInterest(principal, rate, time, frequency = 1) {
  const p = new Decimal(principal)
  const r = new Decimal(rate).div(100)
  const t = new Decimal(time)
  const n = new Decimal(frequency)

  const amount = p.mul(r.div(n).add(1).pow(n.mul(t)))
  return amount.toNumber()
}

/**
 * Calculates continuous compound interest
 * @param {number} principal - Initial principal amount
 * @param {number} rate - Annual interest rate (as percentage, e.g., 5 for 5%)
 * @param {number} time - Time in years
 * @returns {number} - Total amount after continuous compounding
 * @example
 * continuousCompound(1000, 5, 10) // returns approximately 1648.72
 */
export function continuousCompound(principal, rate, time) {
  const p = new Decimal(principal)
  const r = new Decimal(rate).div(100)
  const t = new Decimal(time)

  const amount = p.mul(r.mul(t).exp())
  return amount.toNumber()
}

/**
 * Calculates Return on Investment (ROI) as a percentage
 * @param {number} gain - Total gain or final value
 * @param {number} cost - Initial cost or investment
 * @returns {number} - ROI as a percentage
 * @example
 * ROI(1500, 1000) // returns 50
 */
export function ROI(gain, cost) {
  if (cost === 0) {
    throw new Error('Cost cannot be zero')
  }
  const g = new Decimal(gain)
  const c = new Decimal(cost)
  return g.sub(c).div(c).mul(100).toNumber()
}

/**
 * Calculates Net Present Value (NPV) of a series of cash flows
 * @param {number} rate - Discount rate per period (as percentage, e.g., 5 for 5%)
 * @param {number[]} cashFlows - Array of cash flows (first element is typically initial investment)
 * @returns {number} - Net present value
 * @example
 * NPV(10, [-1000, 300, 300, 300, 300]) // returns approximately -49.21
 */
export function NPV(rate, cashFlows) {
  const r = new Decimal(rate).div(100)
  let npv = new Decimal(0)

  cashFlows.forEach((cf, index) => {
    const cashFlow = new Decimal(cf)
    npv = npv.add(cashFlow.div(r.add(1).pow(index)))
  })

  return npv.toNumber()
}

/**
 * Calculates Internal Rate of Return (IRR) using Newton-Raphson method
 * @param {number[]} cashFlows - Array of cash flows
 * @param {number} [guess=0.1] - Guess for IRR (optional, default 0.1)
 * @returns {number} - IRR as a decimal (e.g., 0.1 for 10%)
 * @example
 * IRR([-1000, 300, 300, 300, 300]) // returns approximately 0.0771 (7.71%)
 */
export function IRR(cashFlows, guess = 0.1) {
  let rate = guess
  const maxIter = 100
  const tolerance = 1e-6

  for (let i = 0; i < maxIter; i++) {
    let npv = 0
    let dnpv = 0

    cashFlows.forEach((cf, index) => {
      const pow = Math.pow(1 + rate, index)
      npv += cf / pow
      dnpv -= index * cf / (pow * (1 + rate))
    })

    const newRate = rate - npv / dnpv

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate
    }

    rate = newRate
  }

  return rate
}

/**
 * Unit conversion factors
 * Each category has a base unit with factor = 1
 * Other units convert to/from the base unit
 */
export const unitConversionFactors = {
  length: {
    baseUnit: 'meter',
    units: {
      nanometer: 1e-9,
      micrometer: 1e-6,
      millimeter: 0.001,
      centimeter: 0.01,
      meter: 1,
      kilometer: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.344,
      nauticalMile: 1852
    }
  },
  weight: {
    baseUnit: 'kilogram',
    units: {
      milligram: 1e-6,
      gram: 0.001,
      kilogram: 1,
      metricTon: 1000,
      ounce: 0.0283495,
      pound: 0.453592,
      stone: 6.35029,
      ton: 1016.0469088
    }
  },
  volume: {
    baseUnit: 'liter',
    units: {
      milliliter: 0.001,
      liter: 1,
      cubicMeter: 1000,
      cubicCentimeter: 0.001,
      cubicInch: 0.016387064,
      cubicFoot: 28.316846592,
      gallonUS: 3.785411784,
      gallonUK: 4.54609,
      pintUS: 0.473176473,
      pintUK: 0.56826125
    }
  },
  area: {
    baseUnit: 'squareMeter',
    units: {
      squareMillimeter: 1e-6,
      squareCentimeter: 1e-4,
      squareMeter: 1,
      squareKilometer: 1e6,
      squareInch: 0.00064516,
      squareFoot: 0.09290304,
      squareYard: 0.83612736,
      acre: 4046.8564224,
      hectare: 10000,
      squareMile: 2589988.110336
    }
  },
  speed: {
    baseUnit: 'meterPerSecond',
    units: {
      meterPerSecond: 1,
      kilometerPerHour: 0.2777777778,
      milePerHour: 0.44704,
      footPerSecond: 0.3048,
      knot: 0.5144444444,
      mach: 343
    }
  },
  time: {
    baseUnit: 'second',
    units: {
      millisecond: 0.001,
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      month: 2629746,
      year: 31556952
    }
  },
  data: {
    baseUnit: 'byte',
    units: {
      bit: 0.125,
      byte: 1,
      kilobyte: 1024,
      megabyte: 1048576,
      gigabyte: 1073741824,
      terabyte: 1099511627776,
      petabyte: 1125899906842624
    }
  },
  temperature: {
    baseUnit: 'celsius',
    units: {
      celsius: 1,
      fahrenheit: 1, // Special case handled by conversion functions
      kelvin: 1 // Special case handled by conversion functions
    }
  }
}

/**
 * Converts temperature from Celsius to Fahrenheit
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} - Temperature in Fahrenheit
 * @example
 * celsiusToFahrenheit(0) // returns 32
 * celsiusToFahrenheit(100) // returns 212
 */
export function celsiusToFahrenheit(celsius) {
  const c = new Decimal(celsius)
  return c.mul(9).div(5).add(32).toNumber()
}

/**
 * Converts temperature from Fahrenheit to Celsius
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * @returns {number} - Temperature in Celsius
 * @example
 * fahrenheitToCelsius(32) // returns 0
 * fahrenheitToCelsius(212) // returns 100
 */
export function fahrenheitToCelsius(fahrenheit) {
  const f = new Decimal(fahrenheit)
  return f.sub(32).mul(5).div(9).toNumber()
}

/**
 * Converts temperature from Celsius to Kelvin
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} - Temperature in Kelvin
 * @example
 * celsiusToKelvin(0) // returns 273.15
 */
export function celsiusToKelvin(celsius) {
  const c = new Decimal(celsius)
  return c.add(273.15).toNumber()
}

/**
 * Converts temperature from Kelvin to Celsius
 * @param {number} kelvin - Temperature in Kelvin
 * @returns {number} - Temperature in Celsius
 * @example
 * kelvinToCelsius(273.15) // returns 0
 */
export function kelvinToCelsius(kelvin) {
  const k = new Decimal(kelvin)
  return k.sub(273.15).toNumber()
}

/**
 * Converts temperature from Fahrenheit to Kelvin
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * @returns {number} - Temperature in Kelvin
 * @example
 * fahrenheitToKelvin(32) // returns 273.15
 */
export function fahrenheitToKelvin(fahrenheit) {
  const c = fahrenheitToCelsius(fahrenheit)
  return celsiusToKelvin(c)
}

/**
 * Converts temperature from Kelvin to Fahrenheit
 * @param {number} kelvin - Temperature in Kelvin
 * @returns {number} - Temperature in Fahrenheit
 * @example
 * kelvinToFahrenheit(273.15) // returns 32
 */
export function kelvinToFahrenheit(kelvin) {
  const c = kelvinToCelsius(kelvin)
  return celsiusToFahrenheit(c)
}

/**
 * Formats a number as currency using Intl.NumberFormat
 * @param {number} amount - The amount to format
 * @param {string} [currency='USD'] - Currency code (ISO 4217, e.g., 'USD', 'EUR', 'JPY')
 * @param {string} [locale='en-US'] - Locale for formatting (e.g., 'en-US', 'de-DE', 'ja-JP')
 * @returns {string} - Formatted currency string
 * @example
 * formatCurrency(1234.56, 'USD') // returns "$1,234.56"
 * formatCurrency(1234.56, 'EUR', 'de-DE') // returns "1.234,56 €"
 */
export function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount)
  } catch (error) {
    // Fallback to basic formatting if locale/currency is invalid
    return `${currency} ${amount.toFixed(2)}`
  }
}