export function firstNumberIn(values: (string | number)[]): number {
  return values
    .map(value => (typeof value === "string" ? parseFloat(value) : value))
    .find(value => typeof value === "number")
}
