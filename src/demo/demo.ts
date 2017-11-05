import { FocalPoint, FocalPicker, initializeFocalPoint } from "../lib/main"

const focalPoints: FocalPoint[] = []

Array.prototype.forEach.call(document.querySelectorAll(".focal-point"), function(container: HTMLElement) {
  focalPoints.push(new FocalPoint(container))
})

function updateFocalPoints(x: number, y: number) {
  focalPoints.forEach(fp => {
    fp.container.setAttribute("data-focus-x", x.toString())
    fp.container.setAttribute("data-focus-y", y.toString())
    fp.adjustFocus()
  })
}

const focalPickerEl = document.getElementById("focus-point-picker-img")
if (focalPickerEl) {
  const focalPicker = new FocalPicker(focalPickerEl as HTMLImageElement, {
    onUpdate: updateFocalPoints,
    initialCoordinates: {
      x: 0.75,
      y: -0.25,
    },
  })
}
