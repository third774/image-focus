export function firstNumberIn(values: (string | number)[]): number {
  for (let i = 0; i < values.length; i++) {
    const value = values[i]
    const num = typeof value === "string" ? parseFloat(value) : value
    if (typeof num === "number") return num
  }
}
