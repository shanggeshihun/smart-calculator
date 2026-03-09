import { ref, computed } from 'vue'
import { evaluate } from 'mathjs'
import Decimal from 'decimal.js'
import { degreesToRadians, radiansToDegrees, factorial } from '../utils/mathHelpers'

/**
 * Scientific Calculator Composable
 * Provides advanced mathematical functions with angle mode support and memory operations
 */
export function useScientificCalculator() {
  // State
  const expression = ref('')
  const result = ref('0')
  const error = ref('')
  const angleMode = ref('degrees') // 'degrees' or 'radians'
  const memory = ref('0')

  // Load memory from localStorage
  const loadMemory = () => {
    try {
      const saved = localStorage.getItem('scientific_calculator_memory')
      if (saved) {
        memory.value = saved
      }
    } catch (e) {
      console.error('Failed to load memory:', e)
    }
  }

  // Save memory to localStorage
  const saveMemory = () => {
    try {
      localStorage.setItem('scientific_calculator_memory', memory.value)
    } catch (e) {
      console.error('Failed to save memory:', e)
    }
  }

  // Initialize memory
  loadMemory()

  /**
   * Evaluate scientific expression
   */
  const calculate = () => {
    if (!expression.value || expression.value.trim() === '') {
      return
    }

    error.value = ''

    try {
      // Prepare expression for evaluation
      let expr = expression.value
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi')
        .replace(/π/g, 'pi')

      // Replace scientific functions with angle-aware versions
      if (angleMode.value === 'degrees') {
        expr = expr
          .replace(/sin\(([^)]+)\)/g, (match, p1) => {
            return `sin(${degreesToRadians(parseFloat(p1))})`
          })
          .replace(/cos\(([^)]+)\)/g, (match, p1) => {
            return `cos(${degreesToRadians(parseFloat(p1))})`
          })
          .replace(/tan\(([^)]+)\)/g, (match, p1) => {
            return `tan(${degreesToRadians(parseFloat(p1))})`
          })
          .replace(/asin\(([^)]+)\)/g, (match, p1) => {
            return `${radiansToDegrees(Math.asin(parseFloat(p1)))}`
          })
          .replace(/acos\(([^)]+)\)/g, (match, p1) => {
            return `${radiansToDegrees(Math.acos(parseFloat(p1)))}`
          })
          .replace(/atan\(([^)]+)\)/g, (match, p1) => {
            return `${radiansToDegrees(Math.atan(parseFloat(p1)))}`
          })
      }

      // Replace factorial
      expr = expr.replace(/(\d+)!/g, (match, p1) => {
        return factorial(parseInt(p1))
      })

      // Evaluate expression
      const evalResult = evaluate(expr)

      // Format result with Decimal for precision
      const decimalResult = new Decimal(evalResult)
      result.value = decimalResult.toPrecision(10).replace(/\.?0+$/, '')

      return { success: true, result: result.value }
    } catch (e) {
      error.value = '表达式错误'
      return { success: false, error: error.value }
    }
  }

  /**
   * Format display value
   */
  const formatDisplay = (value, maxLength = 15) => {
    const str = String(value)
    if (str.length <= maxLength) {
      return str
    }

    if (!isNaN(parseFloat(str))) {
      const num = parseFloat(str)
      return num.toExponential(maxLength - 6)
    }

    return str.substring(0, maxLength) + '...'
  }

  /**
   * Display result
   */
  const displayResult = computed(() => {
    return formatDisplay(result.value)
  })

  /**
   * Handle input
   */
  const handleInput = (value) => {
    error.value = ''
    expression.value += value
  }

  /**
   * Clear all
   */
  const clearAll = () => {
    expression.value = ''
    result.value = '0'
    error.value = ''
  }

  /**
   * Clear entry
   */
  const clearEntry = () => {
    expression.value = ''
    error.value = ''
  }

  /**
   * Backspace
   */
  const backspace = () => {
    expression.value = expression.value.slice(0, -1)
    error.value = ''
  }

  /**
   * Toggle angle mode
   */
  const toggleAngleMode = () => {
    angleMode.value = angleMode.value === 'degrees' ? 'radians' : 'degrees'
  }

  /**
   * Memory Clear
   */
  const MC = () => {
    memory.value = '0'
    saveMemory()
  }

  /**
   * Memory Recall
   */
  const MR = () => {
    expression.value += memory.value
  }

  /**
   * Memory Add
   */
  const MPlus = () => {
    try {
      const currentValue = new Decimal(result.value || '0')
      const memoryValue = new Decimal(memory.value)
      memory.value = currentValue.plus(memoryValue).toString()
      saveMemory()
    } catch (e) {
      console.error('Memory add failed:', e)
    }
  }

  /**
   * Memory Subtract
   */
  const MMinus = () => {
    try {
      const currentValue = new Decimal(result.value || '0')
      const memoryValue = new Decimal(memory.value)
      memory.value = memoryValue.minus(currentValue).toString()
      saveMemory()
    } catch (e) {
      console.error('Memory subtract failed:', e)
    }
  }

  /**
   * Memory Store
   */
  const MS = () => {
    memory.value = result.value || '0'
    saveMemory()
  }

  return {
    // State
    expression,
    result,
    error,
    angleMode,
    memory,
    displayResult,

    // Methods
    calculate,
    handleInput,
    clearAll,
    clearEntry,
    backspace,
    toggleAngleMode,
    formatDisplay,

    // Memory operations
    MC,
    MR,
    MPlus,
    MMinus,
    MS
  }
}