import isFinite from "lodash.isfinite"

export function firstNumberIn(values: any[]): number {
  return values.find(value => isFinite(value))
}
