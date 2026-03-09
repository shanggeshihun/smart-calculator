import { ref } from 'vue'

export function useClipboard() {
  const copied = ref(false)

  /**
   * 复制文本到剪贴板
   * @param {string} text - 要复制的文本
   * @returns {Promise<boolean>} - 是否成功
   */
  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // 使用现代 Clipboard API
        await navigator.clipboard.writeText(text)
      } else {
        // 降级方案：使用 execCommand
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        if (!successful) {
          throw new Error('复制失败')
        }
      }
      
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
      
      return true
    } catch (error) {
      console.error('复制失败:', error)
      copied.value = false
      return false
    }
  }

  /**
   * 显示复制成功提示
   */
  const showCopyToast = () => {
    // 创建提示元素
    const toast = document.createElement('div')
    toast.className = 'copy-toast'
    toast.textContent = '已复制到剪贴板'
    document.body.appendChild(toast)
    
    // 2秒后移除
    setTimeout(() => {
      toast.style.opacity = '0'
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 300)
    }, 2000)
  }

  return {
    copied,
    copyToClipboard,
    showCopyToast
  }
}