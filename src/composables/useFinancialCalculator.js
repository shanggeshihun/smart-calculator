import { ref, computed } from 'vue'
import Decimal from 'decimal.js'
import { PMT, PV, FV, NPER, RATE, compoundInterest, continuousCompound, ROI, NPV, IRR, formatCurrency } from '../utils/mathHelpers'

/**
 * Financial Calculator Composable
 * Provides financial calculations for loans, compound interest, ROI, and amortization
 */
export function useFinancialCalculator() {
  // State
  const mode = ref('loan') // 'loan', 'compound', 'roi', 'amortization'
  const inputs = ref({
    // Loan inputs
    principal: '',
    annualRate: '',
    termYears: '',
    loanType: 'equal', // 'equal' or 'principal'

    // Compound interest inputs
    compoundPrincipal: '',
    compoundRate: '',
    compoundTime: '',
    compoundFrequency: '12', // 1, 2, 4, 12, 365

    // ROI inputs
    initialValue: '',
    finalValue: '',

    // NPV/IRR inputs
    discountRate: '',
    cashFlows: []
  })

  const results = ref({
    // Loan results
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    schedule: [],

    // Compound interest results
    futureValue: 0,
    totalCompoundInterest: 0,

    // ROI results
    roiPercentage: 0,
    profit: 0,

    // NPV/IRR results
    npv: 0,
    irr: 0
  })

  const error = ref('')

  /**
   * Calculate loan payment and amortization schedule
   */
  const calculateLoan = () => {
    try {
      error.value = ''

      const principal = parseFloat(inputs.value.principal)
      const annualRate = parseFloat(inputs.value.annualRate) / 100
      const termYears = parseInt(inputs.value.termYears)
      const loanType = inputs.value.loanType

      if (!principal || !annualRate || !termYears) {
        error.value = '请填写所有必填项'
        return false
      }

      const monthlyRate = annualRate / 12
      const nper = termYears * 12

      if (loanType === 'equal') {
        // Equal payment (等额本息)
        const monthlyPayment = PMT(monthlyRate, nper, -principal)
        const totalPayment = monthlyPayment * nper
        const totalInterest = totalPayment - principal

        // Generate amortization schedule
        const schedule = []
        let balance = principal

        for (let period = 1; period <= nper; period++) {
          const interestPayment = balance * monthlyRate
          const principalPayment = monthlyPayment - interestPayment
          balance -= principalPayment

          schedule.push({
            period,
            payment: monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            balance: Math.max(0, balance)
          })
        }

        results.value = {
          monthlyPayment,
          totalPayment,
          totalInterest,
          schedule
        }
      } else {
        // Equal principal (等额本金)
        const monthlyPrincipal = principal / nper
        let totalInterest = 0
        const schedule = []

        for (let period = 1; period <= nper; period++) {
          const interestPayment = (principal - monthlyPrincipal * (period - 1)) * monthlyRate
          const payment = monthlyPrincipal + interestPayment
          totalInterest += interestPayment
          const balance = principal - monthlyPrincipal * period

          schedule.push({
            period,
            payment,
            principal: monthlyPrincipal,
            interest: interestPayment,
            balance: Math.max(0, balance)
          })
        }

        results.value = {
          monthlyPayment: schedule[0].payment,
          totalPayment: principal + totalInterest,
          totalInterest,
          schedule
        }
      }

      return true
    } catch (e) {
      error.value = '计算错误: ' + e.message
      return false
    }
  }

  /**
   * Calculate compound interest
   */
  const calculateCompound = () => {
    try {
      error.value = ''

      const principal = parseFloat(inputs.value.compoundPrincipal)
      const rate = parseFloat(inputs.value.compoundRate)
      const time = parseFloat(inputs.value.compoundTime)
      const frequency = parseInt(inputs.value.compoundFrequency)

      if (!principal || !rate || !time) {
        error.value = '请填写所有必填项'
        return false
      }

      const futureValue = compoundInterest(principal, rate, time, frequency)
      const totalInterest = futureValue - principal

      results.value = {
        futureValue,
        totalCompoundInterest: totalInterest
      }

      return true
    } catch (e) {
      error.value = '计算错误: ' + e.message
      return false
    }
  }

  /**
   * Calculate ROI
   */
  const calculateROI = () => {
    try {
      error.value = ''

      const initial = parseFloat(inputs.value.initialValue)
      const final = parseFloat(inputs.value.finalValue)

      if (!initial || !final) {
        error.value = '请填写所有必填项'
        return false
      }

      const roiPercentage = ROI(final, initial)
      const profit = final - initial

      results.value = {
        roiPercentage,
        profit
      }

      return true
    } catch (e) {
      error.value = '计算错误: ' + e.message
      return false
    }
  }

  /**
   * Calculate NPV
   */
  const calculateNPV = () => {
    try {
      error.value = ''

      const rate = parseFloat(inputs.value.discountRate)
      const cashFlows = inputs.value.cashFlows.map(cf => parseFloat(cf))

      if (!rate || cashFlows.length === 0) {
        error.value = '请填写所有必填项'
        return false
      }

      const npv = NPV(rate, cashFlows)
      const irr = IRR(cashFlows)

      results.value = {
        npv,
        irr: irr * 100
      }

      return true
    } catch (e) {
      error.value = '计算错误: ' + e.message
      return false
    }
  }

  /**
   * Switch calculator mode
   */
  const switchMode = (newMode) => {
    mode.value = newMode
    error.value = ''
  }

  /**
   * Reset inputs
   */
  const resetInputs = () => {
    inputs.value = {
      principal: '',
      annualRate: '',
      termYears: '',
      loanType: 'equal',
      compoundPrincipal: '',
      compoundRate: '',
      compoundTime: '',
      compoundFrequency: '12',
      initialValue: '',
      finalValue: '',
      discountRate: '',
      cashFlows: []
    }
    results.value = {
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      schedule: [],
      futureValue: 0,
      totalCompoundInterest: 0,
      roiPercentage: 0,
      profit: 0,
      npv: 0,
      irr: 0
    }
    error.value = ''
  }

  return {
    // State
    mode,
    inputs,
    results,
    error,

    // Methods
    calculateLoan,
    calculateCompound,
    calculateROI,
    calculateNPV,
    switchMode,
    resetInputs,
    formatCurrency
  }
}