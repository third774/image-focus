export function firstNumberIn(values: (string | number)[]): number {
  return values
    .map(val => (typeof val === "string" ? parseFloat(val) : val))
    .find(value => typeof value === "number")
}
