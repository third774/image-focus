export function assignStyles(el: HTMLElement, styles: {}) {
  for (const key in styles) {
    el.style[key] = styles[key]
  }
}
