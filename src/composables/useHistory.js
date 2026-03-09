import { ref, watch } from 'vue'

const HISTORY_KEY = 'calculator_history'
const MAX_HISTORY = 50

export function useHistory() {
  const history = ref([])

  // 加载历史记录
  const loadHistory = () => {
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      if (saved) {
        history.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('加载历史记录失败:', error)
      history.value = []
    }
  }

  // 保存历史记录
  const saveToHistory = (expression, result) => {
    if (!expression || !result) return
    
    const record = {
      expression,
      result,
      timestamp: Date.now(),
      date: new Date().toLocaleString('zh-CN')
    }
    
    history.value.unshift(record)
    
    // 限制历史记录数量
    if (history.value.length > MAX_HISTORY) {
      history.value = history.value.slice(0, MAX_HISTORY)
    }
    
    // 保存到 localStorage
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
    } catch (error) {
      console.error('保存历史记录失败:', error)
    }
  }

  // 清空历史记录
  const clearHistory = () => {
    history.value = []
    localStorage.removeItem(HISTORY_KEY)
  }

  // 删除单条历史记录
  const deleteHistoryItem = (index) => {
    history.value.splice(index, 1)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value))
  }

  // 初始化时加载历史记录
  loadHistory()

  return {
    history,
    loadHistory,
    saveToHistory,
    clearHistory,
    deleteHistoryItem
  }
}