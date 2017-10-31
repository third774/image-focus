import { FocalPoint, initializeFocalPoint } from "./lib/focal-point"

// window["initializeFocalPoint"] = initializeFocalPoint

Array.prototype.forEach.call(
  document.querySelectorAll(".focal-point"),
  function(container) {
    const test = new FocalPoint(container)
    setTimeout(() => test.adjustFocus(), 3000)
  },
)
