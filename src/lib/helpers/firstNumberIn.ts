import { isFinite } from "lodash"

export function firstNumberIn(values: any[]): number {
  return values.find(value => isFinite(value))
}
