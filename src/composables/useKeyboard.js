import { ref, onMounted, onUnmounted } from 'vue'

export function useKeyboard(callback) {
  const enabled = ref(true)

  const keyMap = {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '+': '+',
    '-': '-',
    '*': '×',
    '/': '÷',
    'x': '×',
    'X': '×',
    '.': '.',
    'Enter': '=',
    '=': '=',
    'Escape': 'C',
    'Backspace': '⌫',
    '(': '(',
    ')': ')',
    '%': '%'
  }

  const handleKeyDown = (event) => {
    if (!enabled.value) return

    const key = keyMap[event.key]
    
    if (key) {
      event.preventDefault()
      callback(key)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  const enable = () => {
    enabled.value = true
  }

  const disable = () => {
    enabled.value = false
  }

  return {
    enabled,
    enable,
    disable
  }
}