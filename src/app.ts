import { FocalPoint, initializeFocalPoint } from "./lib/focal-point"
import { FocalPicker } from "./lib/focal-picker"

// window["initializeFocalPoint"] = initializeFocalPoint
const focalPoints: FocalPoint[] = []

Array.prototype.forEach.call(
  document.querySelectorAll(".focal-point"),
  function(container) {
    focalPoints.push(new FocalPoint(container))
  },
)

function updateFocalPoints(x, y) {
  focalPoints.forEach(fp => {
    fp.container.setAttribute("data-focus-x", x)
    fp.container.setAttribute("data-focus-y", y)
    fp.adjustFocus()
  })
}

const focalPicker = document.getElementById("focus-point-picker-img")
if (focalPicker) {
  new FocalPicker(focalPicker as HTMLImageElement, {
    onUpdate: updateFocalPoints,
  })
}
