import { FocalPoint, FocalPicker, initializeFocalPoint } from "./lib/main"

// window["initializeFocalPoint"] = initializeFocalPoint
const focalPoints: FocalPoint[] = []

Array.prototype.forEach.call(
  document.querySelectorAll(".focal-point"),
  function(container: HTMLElement) {
    focalPoints.push(new FocalPoint(container))
  },
)

function updateFocalPoints(x: number, y: number) {
  focalPoints.forEach(fp => {
    fp.container.setAttribute("data-focus-x", x.toString())
    fp.container.setAttribute("data-focus-y", y.toString())
    fp.adjustFocus()
  })
}

const focalPicker = document.getElementById("focus-point-picker-img")
if (focalPicker) {
  new FocalPicker(focalPicker as HTMLImageElement, {
    onUpdate: updateFocalPoints,
    initialCoordinates: {
      x: 0.75,
      y: -0.25,
    },
  })
}
