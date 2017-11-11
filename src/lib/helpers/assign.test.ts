import { assign } from "./assign"
import { DEFAULT_ENCODING } from "crypto"

/**
 * Dummy test
 */
describe("assign", () => {
  it("should shallow merge options from right to left", () => {
    const DEFAULT_OPTIONS = {
      foo: true,
      bar: 3,
      baz: "poo",
      fizz: "buzz",
    }

    const newOptions = {
      bar: 7,
      fizz: "bang",
    }

    const evenNewerOptions = {
      foo: false,
      bar: 12,
    }

    const result = assign(DEFAULT_OPTIONS, newOptions, evenNewerOptions)

    expect(result.foo).toBe(false)
    expect(result.bar).toBe(12)
    expect(result.baz).toBe("poo")
    expect(result.fizz).toBe("bang")
  })
})
