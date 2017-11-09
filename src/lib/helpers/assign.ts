export function assign(target: any, ...sources) {
  sources.reverse().forEach(source => Object.keys(source).forEach(key => (target[key] = source[key])))
  return target
}
