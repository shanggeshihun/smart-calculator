<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md card fade-in">
      <!-- 标题 -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Smart Calculator</h1>
        <p class="text-sm text-gray-500 mt-1">多功能智能计算器</p>
      </div>

      <!-- 标签切换 -->
      <div class="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all',
            currentTab === tab.id
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-800'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- 基础计算器 -->
      <BasicCalculator v-if="currentTab === 'basic'" />
      
      <!-- 科学计算器 -->
      <ScientificCalculator v-else-if="currentTab === 'scientific'" />
      
      <!-- 财务计算器 -->
      <FinancialCalculator v-else-if="currentTab === 'financial'" />
      
      <!-- 单位换算 -->
      <ConverterCalculator v-else-if="currentTab === 'converter'" />

      <!-- 页脚 -->
      <div class="mt-6 text-center text-xs text-gray-400">
        <p v-if="currentTab === 'basic'">支持键盘快捷键 | 点击结果可复制</p>
        <p v-else-if="currentTab === 'scientific'">角度模式切换 | 支持内存功能</p>
        <p v-else-if="currentTab === 'financial'">贷款计算 | 复利计算 | ROI分析</p>
        <p v-else-if="currentTab === 'converter'">支持8大类别单位换算</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BasicCalculator from './components/BasicCalculator.vue'
import ScientificCalculator from './components/ScientificCalculator.vue'
import FinancialCalculator from './components/FinancialCalculator.vue'
import ConverterCalculator from './components/ConverterCalculator.vue'

const currentTab = ref('basic')

const tabs = [
  { id: 'basic', name: '基础' },
  { id: 'scientific', name: '科学' },
  { id: 'financial', name: '财务' },
  { id: 'converter', name: '换算' }
]
</script>

<style scoped>
/* 可以添加组件特定的样式 */
</style>