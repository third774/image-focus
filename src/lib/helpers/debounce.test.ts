import { debounce } from "./debounce"

jest.useFakeTimers()

describe("debounce", () => {
  it("should return a function", () => {
    const debouncedFn = debounce(() => null, 0)
    expect(typeof debouncedFn).toBe("function")
  })

  it("should invoke the function after the provided number of ms", () => {
    const mockCallback = jest.fn()
    const debouncedFn = debounce(mockCallback, 5)
    debouncedFn()
    expect(mockCallback.mock.calls.length).toBe(0)
    jest.runTimersToTime(6)
    expect(mockCallback.mock.calls.length).toBe(1)
  })

  it("should not invoke the function more than once if the function is called again within the time", () => {
    const mockCallback = jest.fn()
    const debouncedFn = debounce(mockCallback, 10)
    debouncedFn()
    expect(mockCallback.mock.calls.length).toBe(0)
    jest.runTimersToTime(3)
    debouncedFn()
    expect(mockCallback.mock.calls.length).toBe(0)
    jest.runTimersToTime(8)
    debouncedFn()
    expect(mockCallback.mock.calls.length).toBe(0)
    jest.runTimersToTime(11)
    expect(mockCallback.mock.calls.length).toBe(1)
  })

  it("should invoke the function with the arguments provided when debouncedFn was called", () => {
    const mockCallback = jest.fn()
    const debouncedFn = debounce(mockCallback, 5)
    debouncedFn(13)
    expect(mockCallback.mock.calls.length).toBe(0)
    jest.runTimersToTime(6)
    expect(mockCallback.mock.calls[0][0]).toBe(13)
  })
})
