export function debounce(func: Function, debounceTime: number) {
  let timeout: any;
  return function debouncedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), debounceTime);
  };
}
