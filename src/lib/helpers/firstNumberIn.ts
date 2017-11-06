export function firstNumberIn(values: (string | number)[]): number {
  return values.find(value => typeof value === "number") as number
}
