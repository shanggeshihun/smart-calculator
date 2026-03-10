<template>
  <div class="converter-calculator">
    <!-- Category Tabs -->
    <div class="mb-4">
      <div class="flex flex-wrap gap-1 mb-2">
        <button
          v-for="cat in displayCategories"
          :key="cat.value"
          @click="changeCategory(cat.value)"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            category === cat.value
              ? 'bg-blue-500 text-white shadow'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- Main Conversion Interface -->
    <div class="space-y-4">
      <!-- From Unit -->
      <div class="bg-gray-50 rounded-xl p-4">
        <label class="block text-xs text-gray-500 mb-1 font-medium">从</label>
        <div class="flex gap-2">
          <input
            v-model.number="fromValue"
            type="number"
            placeholder="输入数值"
            class="flex-1 px-4 py-3 text-xl font-semibold border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            @input="convert"
          />
          <select
            v-model="fromUnit"
            class="w-36 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
          >
            <option
              v-for="unit in availableUnits"
              :key="unit.value"
              :value="unit.value"
            >
              {{ unit.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Swap Button -->
      <div class="flex justify-center -my-1">
        <button
          @click="swapUnits"
          class="bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-all active:scale-95"
        >
          ⇅ 交换单位
        </button>
      </div>

      <!-- To Unit -->
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-100">
        <label class="block text-xs text-gray-500 mb-1 font-medium">到</label>
        <div class="flex gap-2 items-center">
          <div class="flex-1 px-4 py-3 text-2xl font-bold text-gray-800 min-h-[50px] flex items-center">
            {{ toValue || '—' }}
          </div>
          <select
            v-model="toUnit"
            class="w-36 px-3 py-2 border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none text-sm bg-white"
          >
            <option
              v-for="unit in availableUnits"
              :key="unit.value"
              :value="unit.value"
            >
              {{ unit.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Quick Reference -->
    <div class="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
      <h3 class="text-sm font-semibold text-amber-800 mb-2 flex items-center">
        <span class="mr-1">💡</span> 快速参考
      </h3>
      <div class="text-xs text-amber-700 space-y-1">
        <p v-for="(tip, index) in getQuickReference" :key="index" class="leading-relaxed">
          • {{ tip }}
        </p>
      </div>
    </div>

    <!-- All Categories Quick Access -->
    <div class="mt-4 grid grid-cols-4 gap-2">
      <button
        v-for="cat in allCategories"
        :key="cat.value"
        @click="changeCategory(cat.value)"
        :class="[
          'p-2 rounded-lg text-center transition-all',
          category === cat.value
            ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        ]"
      >
        <div class="text-lg mb-0.5">{{ getCategoryIcon(cat.value) }}</div>
        <div class="text-xs">{{ cat.label }}</div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useConverterCalculator } from '../composables/useConverterCalculator'

const {
  category,
  fromUnit,
  toUnit,
  fromValue,
  toValue,
  availableUnits,
  categories,
  getQuickReference,
  swapUnits,
  changeCategory
} = useConverterCalculator()

// Display only first 8 categories in top bar
const displayCategories = computed(() => categories.value.slice(0, 8))

// All categories for grid
const allCategories = computed(() => categories.value)

// Get category icon
const getCategoryIcon = (cat) => {
  const icons = {
    length: '📏',
    weight: '⚖️',
    volume: '🧪',
    area: '📐',
    speed: '🚀',
    time: '⏱️',
    data: '💾',
    temperature: '🌡️',
    pressure: '🌡',
    power: '⚡',
    energy: '🔋',
    angle: '📊',
    fuel: '⛽',
    currency: '💱'
  }
  return icons[cat] || '📋'
}
</script>

<style scoped>
.converter-calculator {
  user-select: none;
}

/* Hide number input spinners */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>