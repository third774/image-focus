export function debounce(func: Function, debounceTime: number) {
  let timeout: any
  function debouncedFunction(...args) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), debounceTime)
  }
  return debouncedFunction
}
