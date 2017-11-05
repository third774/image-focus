export function assignStyles(el: HTMLElement | SVGElement, styles: {}) {
  for (const key in styles) {
    el.style[key] = styles[key]
  }
}
