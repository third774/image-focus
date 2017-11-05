import { FocalPoint, FocalPicker, initializeFocalPoint } from "../lib/main"

const focalPoints: FocalPoint[] = []

Array.prototype.forEach.call(document.querySelectorAll(".focal-point"), function(container: HTMLElement) {
  focalPoints.push(new FocalPoint(container))
})

const coordinates = document.querySelector(".coordinates") as HTMLInputElement

function updateCoordinates(x: number, y: number) {
  focalPoints.forEach(fp => {
    fp.container.setAttribute("data-focus-x", x.toString())
    fp.container.setAttribute("data-focus-y", y.toString())
    fp.adjustFocus()
  })

  coordinates.value = `{x: ${x > 0 ? " " : ""}${x.toFixed(2)}, y: ${y > 0 ? " " : ""}${y.toFixed(2)}}`
}

const focalPickerEl = document.getElementById("focus-point-picker-img")
let focalPicker: FocalPicker
if (focalPickerEl) {
  focalPicker = new FocalPicker(focalPickerEl as HTMLImageElement, {
    onUpdate: updateCoordinates,
  })
}

const imgSrc = document.querySelector(".image-src") as HTMLInputElement

imgSrc.addEventListener("input", function(e) {
  focalPicker.img.src = imgSrc.value
  focalPoints.forEach(fp => (fp.img.src = imgSrc.value))
})
