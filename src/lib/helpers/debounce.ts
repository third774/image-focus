export function debounce<Func extends (...p: any[]) => void>(func: Func, debounceTime: number) {
  let timeout: NodeJS.Timer
  return function debouncedFunction(...args: Parameters<Func>) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), debounceTime)
  }
}
