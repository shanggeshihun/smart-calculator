import { ref, computed, watch } from 'vue'
import Decimal from 'decimal.js'
import { unitConversionFactors, celsiusToFahrenheit, fahrenheitToCelsius, celsiusToKelvin, kelvinToCelsius, fahrenheitToKelvin, kelvinToFahrenheit } from '../utils/mathHelpers'

/**
 * Unit Converter Calculator Composable
 * Provides unit conversion functionality for various categories
 */
export function useConverterCalculator() {
  // State
  const category = ref('length')
  const fromUnit = ref('')
  const toUnit = ref('')
  const fromValue = ref('')
  const toValue = ref('')

  // Get available units for current category
  const availableUnits = computed(() => {
    const categoryData = unitConversionFactors[category.value]
    if (!categoryData) return []
    
    return Object.keys(categoryData.units).map(unit => ({
      value: unit,
      label: formatUnitLabel(unit)
    }))
  })

  // Initialize default units
  const initializeUnits = () => {
    if (availableUnits.value.length > 0) {
      fromUnit.value = availableUnits.value[0].value
      toUnit.value = availableUnits.value[1]?.value || availableUnits.value[0].value
    }
  }

  // Initialize on first load
  initializeUnits()

  /**
   * Convert temperature (special case)
   */
  const convertTemperature = (value, from, to) => {
    // Convert to Celsius first as base
    let celsius
    if (from === 'celsius') {
      celsius = value
    } else if (from === 'fahrenheit') {
      celsius = fahrenheitToCelsius(value)
    } else if (from === 'kelvin') {
      celsius = kelvinToCelsius(value)
    }

    // Convert from Celsius to target unit
    if (to === 'celsius') {
      return celsius
    } else if (to === 'fahrenheit') {
      return celsiusToFahrenheit(celsius)
    } else if (to === 'kelvin') {
      return celsiusToKelvin(celsius)
    }

    return value
  }

  /**
   * Perform conversion
   */
  const convert = () => {
    if (!fromValue.value || isNaN(parseFloat(fromValue.value))) {
      toValue.value = ''
      return
    }

    try {
      const value = parseFloat(fromValue.value)

      if (category.value === 'temperature') {
        toValue.value = convertTemperature(value, fromUnit.value, toUnit.value)
      } else {
        const categoryData = unitConversionFactors[category.value]
        const fromFactor = categoryData.units[fromUnit.value]
        const toFactor = categoryData.units[toUnit.value]

        if (!fromFactor || !toFactor) {
          toValue.value = ''
          return
        }

        // Convert: value -> base unit -> target unit
        const decimal = new Decimal(value)
        const baseValue = decimal.mul(fromFactor)
        const result = baseValue.div(toFactor)

        toValue.value = result.toPrecision(10).replace(/\.?0+$/, '')
      }
    } catch (e) {
      console.error('Conversion error:', e)
      toValue.value = ''
    }
  }

  /**
   * Swap units
   */
  const swapUnits = () => {
    const tempUnit = fromUnit.value
    const tempValue = fromValue.value

    fromUnit.value = toUnit.value
    toUnit.value = tempUnit

    fromValue.value = toValue.value
    convert()
  }

  /**
   * Format unit label for display
   */
  const formatUnitLabel = (unit) => {
    const labels = {
      // Length
      nanometer: '纳米 (nm)',
      micrometer: '微米 (μm)',
      millimeter: '毫米 (mm)',
      centimeter: '厘米 (cm)',
      meter: '米 (m)',
      kilometer: '千米 (km)',
      inch: '英寸 (in)',
      foot: '英尺 (ft)',
      yard: '码 (yd)',
      mile: '英里 (mi)',
      nauticalMile: '海里 (nmi)',

      // Weight
      milligram: '毫克 (mg)',
      gram: '克 (g)',
      kilogram: '千克 (kg)',
      metricTon: '公吨 (t)',
      ounce: '盎司 (oz)',
      pound: '磅 (lb)',
      stone: '英石 (st)',
      ton: '英吨 (ton)',

      // Volume
      milliliter: '毫升 (mL)',
      liter: '升 (L)',
      cubicMeter: '立方米 (m³)',
      cubicCentimeter: '立方厘米 (cm³)',
      cubicInch: '立方英寸 (in³)',
      cubicFoot: '立方英尺 (ft³)',
      gallonUS: '美制加仑 (gal)',
      gallonUK: '英制加仑 (gal)',
      pintUS: '美制品脱 (pt)',
      pintUK: '英制品脱 (pt)',

      // Area
      squareMillimeter: '平方毫米 (mm²)',
      squareCentimeter: '平方厘米 (cm²)',
      squareMeter: '平方米 (m²)',
      squareKilometer: '平方千米 (km²)',
      squareInch: '平方英寸 (in²)',
      squareFoot: '平方英尺 (ft²)',
      squareYard: '平方码 (yd²)',
      acre: '英亩 (ac)',
      hectare: '公顷 (ha)',
      squareMile: '平方英里 (mi²)',

      // Speed
      meterPerSecond: '米/秒 (m/s)',
      kilometerPerHour: '千米/时 (km/h)',
      milePerHour: '英里/时 (mph)',
      footPerSecond: '英尺/秒 (ft/s)',
      knot: '节 (kn)',
      mach: '马赫 (Ma)',

      // Time
      millisecond: '毫秒 (ms)',
      second: '秒 (s)',
      minute: '分钟 (min)',
      hour: '小时 (h)',
      day: '天 (d)',
      week: '周 (wk)',
      month: '月 (mo)',
      year: '年 (yr)',

      // Data
      bit: '比特 (b)',
      byte: '字节 (B)',
      kilobyte: '千字节 (KB)',
      megabyte: '兆字节 (MB)',
      gigabyte: '吉字节 (GB)',
      terabyte: '太字节 (TB)',
      petabyte: '拍字节 (PB)',

      // Temperature
      celsius: '摄氏度 (°C)',
      fahrenheit: '华氏度 (°F)',
      kelvin: '开尔文 (K)'
    }

    return labels[unit] || unit
  }

  /**
   * Change category
   */
  const changeCategory = (newCategory) => {
    category.value = newCategory
    fromValue.value = ''
    toValue.value = ''
    initializeUnits()
  }

  // Watch for changes and auto-convert
  watch([fromValue, fromUnit, toUnit], () => {
    convert()
  })

  // Watch for category changes
  watch(category, () => {
    initializeUnits()
  })

  return {
    // State
    category,
    fromUnit,
    toUnit,
    fromValue,
    toValue,
    availableUnits,

    // Methods
    convert,
    swapUnits,
    changeCategory,
    formatUnitLabel
  }
}