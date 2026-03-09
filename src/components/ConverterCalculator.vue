<template>
  <div class="converter-calculator">
    <!-- Category Selection -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">选择类别</label>
      <select
        v-model="category"
        @change="changeCategory(category)"
        class="input"
      >
        <option value="length">长度</option>
        <option value="weight">重量</option>
        <option value="volume">体积</option>
        <option value="area">面积</option>
        <option value="speed">速度</option>
        <option value="time">时间</option>
        <option value="data">数据</option>
        <option value="temperature">温度</option>
      </select>
    </div>

    <!-- Conversion Interface -->
    <div class="space-y-4">
      <!-- From Unit -->
      <div class="bg-gray-50 rounded-lg p-4">
        <label class="block text-xs text-gray-500 mb-1">从</label>
        <div class="flex gap-2">
          <input
            v-model.number="fromValue"
            type="number"
            placeholder="输入数值"
            class="input flex-1"
          />
          <select
            v-model="fromUnit"
            class="input w-40"
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
      <div class="flex justify-center">
        <button
          @click="swapUnits"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          ⇅ 交换单位
        </button>
      </div>

      <!-- To Unit -->
      <div class="bg-blue-50 rounded-lg p-4">
        <label class="block text-xs text-gray-500 mb-1">到</label>
        <div class="flex gap-2">
          <div class="flex-1 px-3 py-2 text-lg font-semibold text-gray-800">
            {{ toValue || '—' }}
          </div>
          <select
            v-model="toUnit"
            class="input w-40"
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
    <div class="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 class="text-sm font-semibold text-gray-700 mb-2">快速参考</h3>
      <div class="text-xs text-gray-600 space-y-1">
        <div v-if="category === 'length'">
          <p>1 千米 = 1000 米</p>
          <p>1 英寸 = 2.54 厘米</p>
          <p>1 英尺 = 30.48 厘米</p>
        </div>
        <div v-else-if="category === 'weight'">
          <p>1 千克 = 1000 克</p>
          <p>1 磅 ≈ 453.59 克</p>
          <p>1 盎司 ≈ 28.35 克</p>
        </div>
        <div v-else-if="category === 'temperature'">
          <p>0°C = 32°F = 273.15K</p>
          <p>100°C = 212°F = 373.15K</p>
        </div>
        <div v-else-if="category === 'volume'">
          <p>1 升 = 1000 毫升</p>
          <p>1 美制加仑 ≈ 3.79 升</p>
        </div>
        <div v-else>
          <p>选择不同的类别查看换算参考</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useConverterCalculator } from '../composables/useConverterCalculator'

const {
  category,
  fromUnit,
  toUnit,
  fromValue,
  toValue,
  availableUnits,
  swapUnits,
  changeCategory
} = useConverterCalculator()
</script>

<style scoped>
.converter-calculator {
  user-select: none;
}

.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg text-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}
</style>