import { FocusedImage, FocusPicker } from "../lib/main"

const focusedImages: FocusedImage[] = []

const startingFocus = { x: 0, y: 0 }

Array.prototype.forEach.call(document.querySelectorAll(".focused-image"), function(image: HTMLImageElement) {
  focusedImages.push(
    new FocusedImage(image, {
      focus: startingFocus,
    }),
  )
})

const coordinates = document.querySelector(".coordinates") as HTMLInputElement

function updateCoordinatesValue({ x, y }: { x: number; y: number }) {
  coordinates.value = `{x: ${x >= 0 ? " " : ""}${x.toFixed(2)}, y: ${y >= 0 ? " " : ""}${y.toFixed(2)}}`
}

updateCoordinatesValue(startingFocus)

const focusPickerEl = document.getElementById("focus-picker-img")
const focusPicker = new FocusPicker(focusPickerEl as HTMLImageElement, {
  onChange: (x: number, y: number) => {
    focusedImages.forEach(focusedImage => focusedImage.setFocus(x, y))
    updateCoordinatesValue({ x, y })
  },
  focus: startingFocus,
})

const imgSrc = document.querySelector(".image-src") as HTMLInputElement

imgSrc.addEventListener("input", function(e) {
  focusPicker.img.src = imgSrc.value
  focusedImages.forEach(fp => (fp.img.src = imgSrc.value))
})
