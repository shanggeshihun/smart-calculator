<template>
  <div class="financial-calculator">
    <!-- Mode Tabs -->
    <div class="flex mb-4 bg-gray-100 rounded-lg p-1">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="switchMode(tab.id)"
        :class="[
          'flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all',
          mode === tab.id
            ? 'bg-white text-blue-600 shadow'
            : 'text-gray-600 hover:text-gray-800'
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Loan Calculator -->
    <div v-if="mode === 'loan'" class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">贷款本金 (元)</label>
        <input
          v-model.number="inputs.principal"
          type="number"
          placeholder="例如: 100000"
          class="input"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">年利率 (%)</label>
        <input
          v-model.number="inputs.annualRate"
          type="number"
          step="0.01"
          placeholder="例如: 5.25"
          class="input"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">贷款期限 (年)</label>
        <input
          v-model.number="inputs.termYears"
          type="number"
          placeholder="例如: 30"
          class="input"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">还款方式</label>
        <select v-model="inputs.loanType" class="input">
          <option value="equal">等额本息</option>
          <option value="principal">等额本金</option>
        </select>
      </div>

      <button
        @click="calculateLoan"
        class="btn btn-primary w-full"
      >
        计算贷款
      </button>

      <div v-if="results.monthlyPayment" class="bg-gray-50 rounded-lg p-4 space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-600">每月还款</span>
          <span class="font-bold text-lg">{{ formatCurrency(results.monthlyPayment, 'CNY', 'zh-CN') }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">还款总额</span>
          <span class="font-semibold">{{ formatCurrency(results.totalPayment, 'CNY', 'zh-CN') }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">利息总额</span>
          <span class="font-semibold text-orange-500">{{ formatCurrency(results.totalInterest, 'CNY', 'zh-CN') }}</span>
        </div>
      </div>
    </div>

    <!-- Compound Interest Calculator -->
    <div v-else-if="mode === 'compound'" class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">本金 (元)</label>
        <input
          v-model.number="inputs.compoundPrincipal"
          type="number"
          placeholder="例如: 10000"
          class="input"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">年利率 (%)</label>
        <input
          v-model.number="inputs.compoundRate"
          type="number"
          step="0.01"
          placeholder="例如: 5"
          class="input"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">投资年限 (年)</label>
        <input
          v-model.number="inputs.compoundTime"
          type="number"
          placeholder="例如: 10"
          class="input"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">复利频率</label>
        <select v-model.number="inputs.compoundFrequency" class="input">
          <option :value="1">每年</option>
          <option :value="2">每半年</option>
          <option :value="4">每季度</option>
          <option :value="12">每月</option>
          <option :value="365">每天</option>
        </select>
      </div>

      <button
        @click="calculateCompound"
        class="btn btn-primary w-full"
      >
        计算复利
      </button>

      <div v-if="results.futureValue" class="bg-gray-50 rounded-lg p-4 space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-600">未来价值</span>
          <span class="font-bold text-lg">{{ formatCurrency(results.futureValue, 'CNY', 'zh-CN') }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">复利收益</span>
          <span class="font-semibold text-green-500">{{ formatCurrency(results.totalCompoundInterest, 'CNY', 'zh-CN') }}</span>
        </div>
      </div>
    </div>

    <!-- ROI Calculator -->
    <div v-else-if="mode === 'roi'" class="space-y-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">初始投资 (元)</label>
        <input
          v-model.number="inputs.initialValue"
          type="number"
          placeholder="例如: 10000"
          class="input"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">最终价值 (元)</label>
        <input
          v-model.number="inputs.finalValue"
          type="number"
          placeholder="例如: 15000"
          class="input"
        />
      </div>

      <button
        @click="calculateROI"
        class="btn btn-primary w-full"
      >
        计算ROI
      </button>

      <div v-if="results.roiPercentage" class="bg-gray-50 rounded-lg p-4 space-y-2">
        <div class="flex justify-between">
          <span class="text-gray-600">投资回报率</span>
          <span class="font-bold text-lg" :class="results.roiPercentage > 0 ? 'text-green-500' : 'text-red-500'">
            {{ results.roiPercentage.toFixed(2) }}%
          </span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">投资收益</span>
          <span class="font-semibold" :class="results.profit > 0 ? 'text-green-500' : 'text-red-500'">
            {{ formatCurrency(results.profit, 'CNY', 'zh-CN') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { useFinancialCalculator } from '../composables/useFinancialCalculator'

const {
  mode,
  inputs,
  results,
  error,
  calculateLoan,
  calculateCompound,
  calculateROI,
  switchMode,
  formatCurrency
} = useFinancialCalculator()

const tabs = [
  { id: 'loan', name: '贷款计算' },
  { id: 'compound', name: '复利计算' },
  { id: 'roi', name: 'ROI计算' }
]
</script>

<style scoped>
.financial-calculator {
  user-select: none;
}

.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg text-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}
</style>