import { ImageFocus, FocusPicker, initImageFocus } from "../lib/main"

const focalPoints: ImageFocus[] = []

Array.prototype.forEach.call(document.querySelectorAll(".image-focus"), function(container: HTMLElement) {
  focalPoints.push(new ImageFocus(container))
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

const focusPickerEl = document.getElementById("image-focus-picker-img")
let focusPicker: FocusPicker
if (focusPickerEl) {
  focusPicker = new FocusPicker(focusPickerEl as HTMLImageElement, {
    onUpdate: updateCoordinates,
  })
}

const imgSrc = document.querySelector(".image-src") as HTMLInputElement

imgSrc.addEventListener("input", function(e) {
  focusPicker.img.src = imgSrc.value
  focalPoints.forEach(fp => (fp.img.src = imgSrc.value))
})
