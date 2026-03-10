import { ref, computed, watch, onMounted } from 'vue'
import Decimal from 'decimal.js'

/**
 * Unit Converter Calculator Composable
 * Provides unit conversion functionality for various categories including currency
 */
export function useConverterCalculator() {
  // State
  const category = ref('length')
  const fromUnit = ref('meter')
  const toUnit = ref('kilometer')
  const fromValue = ref('')
  const toValue = ref('')

  // Currency state
  const currencyRates = ref({})
  const currencyLoading = ref(false)
  const currencyError = ref('')

  // Conversion data
  const conversionData = {
    length: {
      name: '长度',
      units: {
        millimeter: { factor: 0.001, label: '毫米 (mm)' },
        centimeter: { factor: 0.01, label: '厘米 (cm)' },
        meter: { factor: 1, label: '米 (m)' },
        kilometer: { factor: 1000, label: '千米 (km)' },
        inch: { factor: 0.0254, label: '英寸 (in)' },
        foot: { factor: 0.3048, label: '英尺 (ft)' },
        yard: { factor: 0.9144, label: '码 (yd)' },
        mile: { factor: 1609.344, label: '英里 (mi)' },
        nauticalMile: { factor: 1852, label: '海里 (nmi)' }
      }
    },
    weight: {
      name: '重量',
      units: {
        milligram: { factor: 0.000001, label: '毫克 (mg)' },
        gram: { factor: 0.001, label: '克 (g)' },
        kilogram: { factor: 1, label: '千克 (kg)' },
        metricTon: { factor: 1000, label: '公吨 (t)' },
        ounce: { factor: 0.0283495, label: '盎司 (oz)' },
        pound: { factor: 0.453592, label: '磅 (lb)' },
        jin: { factor: 0.5, label: '斤' }
      }
    },
    volume: {
      name: '体积',
      units: {
        milliliter: { factor: 0.001, label: '毫升 (mL)' },
        liter: { factor: 1, label: '升 (L)' },
        cubicMeter: { factor: 1000, label: '立方米 (m³)' },
        gallonUS: { factor: 3.78541, label: '美制加仑 (gal)' },
        gallonUK: { factor: 4.54609, label: '英制加仑 (gal)' },
        pint: { factor: 0.473176, label: '品脱 (pt)' },
        cup: { factor: 0.236588, label: '杯 (cup)' }
      }
    },
    area: {
      name: '面积',
      units: {
        squareMillimeter: { factor: 0.000001, label: '平方毫米 (mm²)' },
        squareCentimeter: { factor: 0.0001, label: '平方厘米 (cm²)' },
        squareMeter: { factor: 1, label: '平方米 (m²)' },
        squareKilometer: { factor: 1000000, label: '平方千米 (km²)' },
        hectare: { factor: 10000, label: '公顷 (ha)' },
        acre: { factor: 4046.86, label: '英亩 (ac)' },
        squareFoot: { factor: 0.092903, label: '平方英尺 (ft²)' },
        mu: { factor: 666.667, label: '亩' }
      }
    },
    speed: {
      name: '速度',
      units: {
        meterPerSecond: { factor: 1, label: '米/秒 (m/s)' },
        kilometerPerHour: { factor: 0.277778, label: '千米/时 (km/h)' },
        milePerHour: { factor: 0.44704, label: '英里/时 (mph)' },
        knot: { factor: 0.514444, label: '节 (kn)' },
        footPerSecond: { factor: 0.3048, label: '英尺/秒 (ft/s)' }
      }
    },
    time: {
      name: '时间',
      units: {
        millisecond: { factor: 0.001, label: '毫秒 (ms)' },
        second: { factor: 1, label: '秒 (s)' },
        minute: { factor: 60, label: '分钟 (min)' },
        hour: { factor: 3600, label: '小时 (h)' },
        day: { factor: 86400, label: '天 (d)' },
        week: { factor: 604800, label: '周 (wk)' },
        month: { factor: 2592000, label: '月 (30天)' },
        year: { factor: 31536000, label: '年 (365天)' }
      }
    },
    data: {
      name: '数据存储',
      units: {
        bit: { factor: 0.125, label: '比特 (b)' },
        byte: { factor: 1, label: '字节 (B)' },
        kilobyte: { factor: 1024, label: '千字节 (KB)' },
        megabyte: { factor: 1048576, label: '兆字节 (MB)' },
        gigabyte: { factor: 1073741824, label: '吉字节 (GB)' },
        terabyte: { factor: 1099511627776, label: '太字节 (TB)' }
      }
    },
    temperature: {
      name: '温度',
      units: {
        celsius: { factor: 1, label: '摄氏度 (°C)' },
        fahrenheit: { factor: 1, label: '华氏度 (°F)' },
        kelvin: { factor: 1, label: '开尔文 (K)' }
      }
    },
    pressure: {
      name: '压力',
      units: {
        pascal: { factor: 1, label: '帕斯卡 (Pa)' },
        kilopascal: { factor: 1000, label: '千帕 (kPa)' },
        bar: { factor: 100000, label: '巴 (bar)' },
        psi: { factor: 6894.76, label: '磅/平方英寸 (psi)' },
        atmosphere: { factor: 101325, label: '标准大气压 (atm)' },
        mmHg: { factor: 133.322, label: '毫米汞柱 (mmHg)' }
      }
    },
    power: {
      name: '功率',
      units: {
        watt: { factor: 1, label: '瓦特 (W)' },
        kilowatt: { factor: 1000, label: '千瓦 (kW)' },
        horsepower: { factor: 745.7, label: '马力 (hp)' },
        btuPerHour: { factor: 0.293071, label: '英热单位/时 (BTU/h)' }
      }
    },
    energy: {
      name: '能量',
      units: {
        joule: { factor: 1, label: '焦耳 (J)' },
        kilojoule: { factor: 1000, label: '千焦 (kJ)' },
        calorie: { factor: 4.184, label: '卡路里 (cal)' },
        kilocalorie: { factor: 4184, label: '千卡 (kcal)' },
        wattHour: { factor: 3600, label: '瓦时 (Wh)' },
        kilowattHour: { factor: 3600000, label: '千瓦时 (kWh)' }
      }
    },
    angle: {
      name: '角度',
      units: {
        degree: { factor: 1, label: '度 (°)' },
        radian: { factor: 57.2958, label: '弧度 (rad)' },
        gradian: { factor: 0.9, label: '百分度 (gon)' },
        arcminute: { factor: 0.0166667, label: '角分 (\')' },
        arcsecond: { factor: 0.000277778, label: '角秒 (\")' }
      }
    },
    fuel: {
      name: '油耗',
      units: {
        literPer100km: { factor: 1, label: '升/百公里 (L/100km)' },
        kmPerLiter: { factor: 100, label: '公里/升 (km/L)' },
        mpgUS: { factor: 42.517, label: '美制英里/加仑 (mpg)' },
        mpgUK: { factor: 35.401, label: '英制英里/加仑 (mpg)' }
      }
    }
  }

  // Currency data (static rates, will be updated from API)
  const currencyData = {
    name: '货币',
    units: {
      CNY: { label: '人民币 (¥)', symbol: '¥' },
      USD: { label: '美元 ($)', symbol: '$' },
      EUR: { label: '欧元 (€)', symbol: '€' },
      GBP: { label: '英镑 (£)', symbol: '£' },
      JPY: { label: '日元 (¥)', symbol: '¥' },
      KRW: { label: '韩元 (₩)', symbol: '₩' },
      HKD: { label: '港币 (HK$)', symbol: 'HK$' },
      TWD: { label: '新台币 (NT$)', symbol: 'NT$' },
      SGD: { label: '新加坡元 (S$)', symbol: 'S$' },
      AUD: { label: '澳元 (A$)', symbol: 'A$' },
      CAD: { label: '加元 (C$)', symbol: 'C$' },
      CHF: { label: '瑞士法郎 (Fr)', symbol: 'Fr' },
      THB: { label: '泰铢 (฿)', symbol: '฿' },
      MYR: { label: '马来西亚林吉特 (RM)', symbol: 'RM' },
      RUB: { label: '俄罗斯卢布 (₽)', symbol: '₽' },
      INR: { label: '印度卢比 (₹)', symbol: '₹' }
    },
    // Base rates (CNY = 1)
    baseRates: {
      CNY: 1,
      USD: 0.138,
      EUR: 0.127,
      GBP: 0.11,
      JPY: 20.5,
      KRW: 183.5,
      HKD: 1.08,
      TWD: 4.35,
      SGD: 0.186,
      AUD: 0.21,
      CAD: 0.19,
      CHF: 0.124,
      THB: 4.85,
      MYR: 0.65,
      RUB: 12.7,
      INR: 11.5
    }
  }

  // Get available units for current category
  const availableUnits = computed(() => {
    if (category.value === 'currency') {
      return Object.entries(currencyData.units).map(([key, data]) => ({
        value: key,
        label: data.label,
        symbol: data.symbol
      }))
    }
    
    const categoryData = conversionData[category.value]
    if (!categoryData) return []
    
    return Object.entries(categoryData.units).map(([key, data]) => ({
      value: key,
      label: data.label,
      factor: data.factor
    }))
  })

  // Get category list
  const categories = computed(() => {
    const cats = Object.entries(conversionData).map(([key, data]) => ({
      value: key,
      label: data.name
    }))
    // Add currency at the end
    cats.push({ value: 'currency', label: currencyData.name })
    return cats
  })

  /**
   * Convert temperature (special case)
   */
  const convertTemperature = (value, from, to) => {
    let celsius
    
    // Convert to Celsius first
    switch (from) {
      case 'celsius':
        celsius = value
        break
      case 'fahrenheit':
        celsius = (value - 32) * 5 / 9
        break
      case 'kelvin':
        celsius = value - 273.15
        break
      default:
        return value
    }
    
    // Convert from Celsius to target
    switch (to) {
      case 'celsius':
        return celsius
      case 'fahrenheit':
        return celsius * 9 / 5 + 32
      case 'kelvin':
        return celsius + 273.15
      default:
        return celsius
    }
  }

  /**
   * Convert currency
   */
  const convertCurrency = (value, from, to) => {
    const rates = currencyData.baseRates
    if (!rates[from] || !rates[to]) return value
    
    // Convert to CNY first, then to target currency
    const inCNY = value / rates[from]
    return inCNY * rates[to]
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
      let result

      if (category.value === 'currency') {
        result = convertCurrency(value, fromUnit.value, toUnit.value)
      } else if (category.value === 'temperature') {
        result = convertTemperature(value, fromUnit.value, toUnit.value)
      } else {
        const categoryData = conversionData[category.value]
        const fromData = categoryData?.units[fromUnit.value]
        const toData = categoryData?.units[toUnit.value]

        if (!fromData || !toData) {
          toValue.value = ''
          return
        }

        // Convert: value -> base unit -> target unit
        const decimal = new Decimal(value)
        const baseValue = decimal.mul(fromData.factor)
        result = baseValue.div(toData.factor).toNumber()
      }

      // Format result
      if (Math.abs(result) < 0.000001 || Math.abs(result) > 100000000) {
        toValue.value = result.toExponential(6)
      } else {
        toValue.value = parseFloat(result.toPrecision(10)).toString()
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
    fromUnit.value = toUnit.value
    toUnit.value = tempUnit
    
    // Also swap values
    if (toValue.value) {
      fromValue.value = toValue.value
    }
  }

  /**
   * Change category
   */
  const changeCategory = (newCategory) => {
    category.value = newCategory
    fromValue.value = ''
    toValue.value = ''
    
    // Set default units for new category
    if (availableUnits.value.length > 0) {
      fromUnit.value = availableUnits.value[0].value
      toUnit.value = availableUnits.value[1]?.value || availableUnits.value[0].value
    }
  }

  /**
   * Get quick reference tips
   */
  const getQuickReference = computed(() => {
    const refs = {
      length: ['1 千米 = 1000 米', '1 英寸 = 2.54 厘米', '1 英尺 = 30.48 厘米'],
      weight: ['1 千克 = 1000 克', '1 斤 = 500 克', '1 磅 ≈ 453.59 克'],
      volume: ['1 升 = 1000 毫升', '1 美制加仑 ≈ 3.79 升', '1 杯 ≈ 236.6 毫升'],
      area: ['1 公顷 = 10000 平方米', '1 亩 ≈ 666.67 平方米', '1 英亩 ≈ 4047 平方米'],
      temperature: ['0°C = 32°F = 273.15K', '100°C = 212°F = 373.15K', '37°C = 98.6°F (体温)'],
      speed: ['1 km/h ≈ 0.278 m/s', '1 mph ≈ 1.609 km/h', '1 节 ≈ 1.852 km/h'],
      time: ['1 天 = 86400 秒', '1 年 = 365 天', '1 周 = 7 天'],
      data: ['1 KB = 1024 B', '1 MB = 1024 KB', '1 GB = 1024 MB'],
      pressure: ['1 atm = 101.325 kPa', '1 bar = 100 kPa', '1 psi ≈ 6.895 kPa'],
      power: ['1 hp ≈ 745.7 W', '1 kW = 1000 W', '1 BTU/h ≈ 0.293 W'],
      energy: ['1 kcal ≈ 4.184 kJ', '1 kWh = 3.6 MJ', '1 卡 ≈ 4.184 J'],
      angle: ['π 弧度 = 180°', '1 圆周 = 360°', '1 弧度 ≈ 57.3°'],
      fuel: ['1 L/100km = 100 km/L', '1 mpg ≈ 0.425 km/L', '数值越小越省油'],
      currency: ['汇率仅供参考', '实际汇率以银行为准', '支持16种常用货币']
    }
    return refs[category.value] || ['选择类别查看换算提示']
  })

  // Initialize units on mount
  onMounted(() => {
    if (availableUnits.value.length > 0) {
      fromUnit.value = availableUnits.value[0].value
      toUnit.value = availableUnits.value[1]?.value || availableUnits.value[0].value
    }
  })

  // Watch for changes and auto-convert
  watch([fromValue, fromUnit, toUnit], () => {
    convert()
  })

  return {
    // State
    category,
    fromUnit,
    toUnit,
    fromValue,
    toValue,
    availableUnits,
    categories,
    currencyLoading,
    currencyError,
    getQuickReference,

    // Methods
    convert,
    swapUnits,
    changeCategory
  }
}