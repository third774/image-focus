import { FocusedImage, FocusPicker, Focus } from "../lib/main"

const focusedImages: FocusedImage[] = []

const startingFocus = { x: 0, y: 0 }

Array.prototype.forEach.call(document.querySelectorAll(".focused-image"), (imageEl: HTMLImageElement) => {
  focusedImages.push(
    new FocusedImage(imageEl, {
      focus: startingFocus,
    }),
  )
})

const coordinates = document.getElementById("coordinates") as HTMLInputElement

function updateCoordinatesValue({ x, y }: Focus) {
  coordinates.value = `{x: ${x >= 0 ? " " : ""}${x.toFixed(2)}, y: ${y >= 0 ? " " : ""}${y.toFixed(2)}}`
}

updateCoordinatesValue(startingFocus)

const focusPickerEl = document.getElementById("focus-picker-img") as HTMLImageElement
const focusPicker = new FocusPicker(focusPickerEl, {
  onChange: focus => {
    focusedImages.forEach(focusedImage => focusedImage.setFocus(focus))
    updateCoordinatesValue(focus)
  },
  focus: startingFocus,
})

const imgSrcEl = document.getElementById("image-src") as HTMLInputElement

imgSrcEl.addEventListener("input", function(e) {
  focusPicker.img.src = imgSrcEl.value
  focusedImages.forEach(fp => (fp.img.src = imgSrcEl.value))
})
