import { evaluate } from 'mathjs'
import Decimal from 'decimal.js'

export function useCalculator() {
  /**
   * 计算表达式
   * @param {string} expression - 数学表达式
   * @returns {object} - { success: boolean, result?: string, error?: string }
   */
  const calculate = (expression) => {
    try {
      if (!expression || expression.trim() === '') {
        return { success: false, error: '表达式为空' }
      }

      // 使用 math.js 计算表达式
      const result = evaluate(expression)
      
      // 使用 Decimal.js 处理精度问题
      const decimalResult = new Decimal(result)
      
      // 格式化结果（最多保留10位小数）
      const formattedResult = decimalResult.toPrecision(10)
      
      return { 
        success: true, 
        result: formattedResult 
      }
    } catch (error) {
      return { 
        success: false, 
        error: '表达式错误' 
      }
    }
  }

  /**
   * 格式化显示数字
   * @param {string|number} value - 数字或表达式
   * @param {number} maxLength - 最大长度
   * @returns {string} - 格式化后的字符串
   */
  const formatDisplay = (value, maxLength = 12) => {
    const str = String(value)
    if (str.length <= maxLength) {
      return str
    }
    
    // 如果是数字，使用科学计数法
    if (!isNaN(parseFloat(str))) {
      const num = parseFloat(str)
      return num.toExponential(maxLength - 6)
    }
    
    return str.substring(0, maxLength) + '...'
  }

  /**
   * 验证输入是否合法
   * @param {string} current - 当前表达式
   * @param {string} input - 输入字符
   * @returns {boolean} - 是否合法
   */
  const isValidInput = (current, input) => {
    const lastChar = current.slice(-1)
    
    // 防止连续运算符
    if (['+', '-', '×', '÷', '.'].includes(input)) {
      if (['+', '-', '×', '÷', '.'].includes(lastChar)) {
        return false
      }
    }
    
    // 防止小数点重复
    if (input === '.') {
      const parts = current.split(/[\+\-\×\÷]/)
      const lastPart = parts[parts.length - 1]
      if (lastPart.includes('.')) {
        return false
      }
    }
    
    return true
  }

  /**
   * 转换显示符号
   * @param {string} char - 字符
   * @returns {string} - 显示字符
   */
  const getDisplayChar = (char) => {
    const charMap = {
      '*': '×',
      '/': '÷',
      'x': '×',
      'X': '×'
    }
    return charMap[char] || char
  }

  /**
   * 转换计算符号
   * @param {string} char - 字符
   * @returns {string} - 计算字符
   */
  const getCalcChar = (char) => {
    const charMap = {
      '×': '*',
      '÷': '/',
      'x': '*',
      'X': '*'
    }
    return charMap[char] || char
  }

  return {
    calculate,
    formatDisplay,
    isValidInput,
    getDisplayChar,
    getCalcChar
  }
}