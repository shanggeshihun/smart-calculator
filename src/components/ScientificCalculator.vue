<template>
  <div class="scientific-calculator">
    <!-- Display -->
    <div class="mb-4">
      <div class="flex justify-between items-center mb-2">
        <div class="text-xs text-gray-500">
          <span class="mr-2">{{ angleMode === 'degrees' ? 'DEG' : 'RAD' }}</span>
          <span v-if="memory !== '0'" class="text-blue-500">M</span>
        </div>
        <div class="text-xs text-gray-500">{{ expression || '&nbsp;' }}</div>
      </div>
      
      <div 
        class="text-right text-3xl font-mono font-bold text-gray-800 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
        @click="copyResult"
        :title="'点击复制: ' + displayResult"
      >
        {{ displayResult }}
      </div>
      
      <div v-if="error" class="text-red-500 text-sm mt-1">
        {{ error }}
      </div>
    </div>

    <!-- Mode Toggle & Memory -->
    <div class="grid grid-cols-6 gap-2 mb-4">
      <button 
        @click="toggleAngleMode"
        :class="['calculator-btn calculator-btn-function text-xs', angleMode === 'degrees' ? 'bg-blue-500 text-white' : '']"
      >
        {{ angleMode === 'degrees' ? 'DEG' : 'RAD' }}
      </button>
      <button @click="MC" class="calculator-btn calculator-btn-function text-xs">MC</button>
      <button @click="MR" class="calculator-btn calculator-btn-function text-xs">MR</button>
      <button @click="MPlus" class="calculator-btn calculator-btn-function text-xs">M+</button>
      <button @click="MMinus" class="calculator-btn calculator-btn-function text-xs">M-</button>
      <button @click="MS" class="calculator-btn calculator-btn-function text-xs">MS</button>
    </div>

    <!-- Scientific Functions -->
    <div class="grid grid-cols-5 gap-2 mb-2">
      <button @click="handleInput('sin(')" class="calculator-btn calculator-btn-scientific text-sm">sin</button>
      <button @click="handleInput('cos(')" class="calculator-btn calculator-btn-scientific text-sm">cos</button>
      <button @click="handleInput('tan(')" class="calculator-btn calculator-btn-scientific text-sm">tan</button>
      <button @click="handleInput('log(')" class="calculator-btn calculator-btn-scientific text-sm">log</button>
      <button @click="handleInput('ln(')" class="calculator-btn calculator-btn-scientific text-sm">ln</button>
    </div>

    <div class="grid grid-cols-5 gap-2 mb-2">
      <button @click="handleInput('asin(')" class="calculator-btn calculator-btn-scientific text-sm">asin</button>
      <button @click="handleInput('acos(')" class="calculator-btn calculator-btn-scientific text-sm">acos</button>
      <button @click="handleInput('atan(')" class="calculator-btn calculator-btn-scientific text-sm">atan</button>
      <button @click="handleInput('^')" class="calculator-btn calculator-btn-scientific text-sm">x^y</button>
      <button @click="handleInput('!')" class="calculator-btn calculator-btn-scientific text-sm">n!</button>
    </div>

    <div class="grid grid-cols-5 gap-2 mb-2">
      <button @click="handleInput('sqrt(')" class="calculator-btn calculator-btn-scientific text-sm">√</button>
      <button @click="handleInput('(')" class="calculator-btn calculator-btn-scientific text-sm">(</button>
      <button @click="handleInput(')')" class="calculator-btn calculator-btn-scientific text-sm">)</button>
      <button @click="handleInput('π')" class="calculator-btn calculator-btn-scientific text-sm">π</button>
      <button @click="handleInput('e')" class="calculator-btn calculator-btn-scientific text-sm">e</button>
    </div>

    <!-- Standard Keypad -->
    <div class="calculator-grid grid-cols-4">
      <!-- Row 1 -->
      <button @click="clearAll" class="calculator-btn calculator-btn-function">AC</button>
      <button @click="clearEntry" class="calculator-btn calculator-btn-function">CE</button>
      <button @click="backspace" class="calculator-btn calculator-btn-function">⌫</button>
      <button @click="handleInput('÷')" class="calculator-btn calculator-btn-operator">÷</button>

      <!-- Row 2 -->
      <button @click="handleInput('7')" class="calculator-btn calculator-btn-number">7</button>
      <button @click="handleInput('8')" class="calculator-btn calculator-btn-number">8</button>
      <button @click="handleInput('9')" class="calculator-btn calculator-btn-number">9</button>
      <button @click="handleInput('×')" class="calculator-btn calculator-btn-operator">×</button>

      <!-- Row 3 -->
      <button @click="handleInput('4')" class="calculator-btn calculator-btn-number">4</button>
      <button @click="handleInput('5')" class="calculator-btn calculator-btn-number">5</button>
      <button @click="handleInput('6')" class="calculator-btn calculator-btn-number">6</button>
      <button @click="handleInput('-')" class="calculator-btn calculator-btn-operator">−</button>

      <!-- Row 4 -->
      <button @click="handleInput('1')" class="calculator-btn calculator-btn-number">1</button>
      <button @click="handleInput('2')" class="calculator-btn calculator-btn-number">2</button>
      <button @click="handleInput('3')" class="calculator-btn calculator-btn-number">3</button>
      <button @click="handleInput('+')" class="calculator-btn calculator-btn-operator">+</button>

      <!-- Row 5 -->
      <button @click="handleInput('0')" class="calculator-btn calculator-btn-number">0</button>
      <button @click="handleInput('.')" class="calculator-btn calculator-btn-number">.</button>
      <button @click="handleInput('%')" class="calculator-btn calculator-btn-number">%</button>
      <button @click="calculate" class="calculator-btn calculator-btn-equal">=</button>
    </div>
  </div>
</template>

<script setup>
import { useScientificCalculator } from '../composables/useScientificCalculator'
import { useClipboard } from '../composables/useClipboard'

const {
  expression,
  result,
  error,
  angleMode,
  memory,
  displayResult,
  calculate,
  handleInput,
  clearAll,
  clearEntry,
  backspace,
  toggleAngleMode,
  MC, MR, MPlus, MMinus, MS
} = useScientificCalculator()

const { copyToClipboard, showCopyToast } = useClipboard()

const copyResult = async () => {
  const success = await copyToClipboard(result.value)
  if (success) {
    showCopyToast()
  }
}
</script>

<style scoped>
.scientific-calculator {
  user-select: none;
}

.calculator-btn-scientific {
  @apply bg-purple-100 text-purple-700;
}

.calculator-btn-scientific:hover {
  @apply bg-purple-200;
}

.calculator-btn:active {
  transform: scale(0.95);
}
</style>