<template>
  <div class="calculator">
    <!-- 显示屏 -->
    <div class="mb-4">
      <!-- 表达式显示 -->
      <div class="text-right text-gray-500 text-sm h-6 overflow-x-auto">
        {{ expression || '&nbsp;' }}
      </div>
      
      <!-- 结果显示 -->
      <div 
        class="text-right text-4xl font-mono font-bold text-gray-800 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
        @click="copyResult"
        :title="'点击复制: ' + displayResult"
      >
        {{ displayResult }}
      </div>
      
      <!-- 错误提示 -->
      <div v-if="error" class="text-red-500 text-sm mt-1">
        {{ error }}
      </div>
    </div>

    <!-- 历史记录按钮 -->
    <div class="flex justify-between items-center mb-4">
      <button
        @click="showHistory = !showHistory"
        class="text-sm text-blue-500 hover:text-blue-600"
      >
        {{ showHistory ? '隐藏历史' : '显示历史' }} ({{ history.length }})
      </button>
      <button
        v-if="history.length > 0"
        @click="clearHistory"
        class="text-sm text-red-500 hover:text-red-600"
      >
        清空历史
      </button>
    </div>

    <!-- 历史记录面板 -->
    <div v-if="showHistory && history.length > 0" class="mb-4 max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3">
      <div
        v-for="(item, index) in history"
        :key="index"
        class="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
      >
        <div class="flex-1">
          <div class="text-sm text-gray-600">{{ item.expression }}</div>
          <div class="text-lg font-semibold text-gray-800">= {{ item.result }}</div>
        </div>
        <button
          @click="useHistoryItem(item)"
          class="ml-2 text-blue-500 hover:text-blue-600 text-sm"
        >
          使用
        </button>
      </div>
    </div>

    <!-- 按钮网格 -->
    <div class="calculator-grid grid-cols-4">
      <!-- 第一行：清除和运算符 -->
      <button @click="handleClear" class="calculator-btn calculator-btn-function">C</button>
      <button @click="handleBackspace" class="calculator-btn calculator-btn-function">⌫</button>
      <button @click="handleInput('%')" class="calculator-btn calculator-btn-function">%</button>
      <button @click="handleInput('÷')" class="calculator-btn calculator-btn-operator">÷</button>

      <!-- 第二行：7-9 和 乘号 -->
      <button @click="handleInput('7')" class="calculator-btn calculator-btn-number">7</button>
      <button @click="handleInput('8')" class="calculator-btn calculator-btn-number">8</button>
      <button @click="handleInput('9')" class="calculator-btn calculator-btn-number">9</button>
      <button @click="handleInput('×')" class="calculator-btn calculator-btn-operator">×</button>

      <!-- 第三行：4-6 和 减号 -->
      <button @click="handleInput('4')" class="calculator-btn calculator-btn-number">4</button>
      <button @click="handleInput('5')" class="calculator-btn calculator-btn-number">5</button>
      <button @click="handleInput('6')" class="calculator-btn calculator-btn-number">6</button>
      <button @click="handleInput('-')" class="calculator-btn calculator-btn-operator">−</button>

      <!-- 第四行：1-3 和 加号 -->
      <button @click="handleInput('1')" class="calculator-btn calculator-btn-number">1</button>
      <button @click="handleInput('2')" class="calculator-btn calculator-btn-number">2</button>
      <button @click="handleInput('3')" class="calculator-btn calculator-btn-number">3</button>
      <button @click="handleInput('+')" class="calculator-btn calculator-btn-operator">+</button>

      <!-- 第五行：0、小数点、括号、等号 -->
      <button @click="handleInput('0')" class="calculator-btn calculator-btn-number">0</button>
      <button @click="handleInput('.')" class="calculator-btn calculator-btn-number">.</button>
      <button @click="handleInput('(')" class="calculator-btn calculator-btn-number">(</button>
      <button @click="handleCalculate" class="calculator-btn calculator-btn-equal">=</button>
    </div>

    <!-- 键盘提示 -->
    <div class="mt-4 text-xs text-gray-400 text-center">
      <p>键盘快捷键: 数字键、运算符、Enter=计算、Esc=清除、Backspace=退格</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCalculator } from '../composables/useCalculator'
import { useHistory } from '../composables/useHistory'
import { useKeyboard } from '../composables/useKeyboard'
import { useClipboard } from '../composables/useClipboard'

// 使用组合式函数
const { calculate, formatDisplay, isValidInput, getCalcChar } = useCalculator()
const { history, saveToHistory, clearHistory } = useHistory()
const { copyToClipboard, showCopyToast } = useClipboard()

// 响应式状态
const expression = ref('')
const result = ref('0')
const error = ref('')
const showHistory = ref(false)

// 计算属性
const displayResult = computed(() => {
  return formatDisplay(result.value)
})

// 处理输入
const handleInput = (value) => {
  error.value = ''
  
  // 验证输入
  if (!isValidInput(expression.value, value)) {
    return
  }
  
  expression.value += value
}

// 处理计算
const handleCalculate = () => {
  if (!expression.value) return
  
  // 转换表达式中的符号
  const calcExpression = expression.value
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
  
  const calcResult = calculate(calcExpression)
  
  if (calcResult.success) {
    result.value = calcResult.result
    // 保存到历史记录
    saveToHistory(expression.value, calcResult.result)
  } else {
    error.value = calcResult.error
  }
}

// 清除
const handleClear = () => {
  expression.value = ''
  result.value = '0'
  error.value = ''
}

// 退格
const handleBackspace = () => {
  expression.value = expression.value.slice(0, -1)
  error.value = ''
}

// 复制结果
const copyResult = async () => {
  const success = await copyToClipboard(result.value)
  if (success) {
    showCopyToast()
  }
}

// 使用历史记录项
const useHistoryItem = (item) => {
  expression.value = item.expression
  result.value = item.result
  showHistory.value = false
}

// 键盘事件处理
const handleKeyPress = (key) => {
  if (key === '=') {
    handleCalculate()
  } else if (key === 'C') {
    handleClear()
  } else if (key === '⌫') {
    handleBackspace()
  } else {
    handleInput(key)
  }
}

// 设置键盘监听
useKeyboard(handleKeyPress)
</script>

<style scoped>
.calculator {
  user-select: none;
}

/* 按钮按下效果 */
.calculator-btn:active {
  transform: scale(0.95);
}

/* 历史记录滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>