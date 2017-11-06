import { ImageFocus, FocusPicker, initImageFocus } from "../lib/main"

const images: ImageFocus[] = []

Array.prototype.forEach.call(document.querySelectorAll(".image-focus"), function(container: HTMLElement) {
  images.push(new ImageFocus(container))
})

const coordinates = document.querySelector(".coordinates") as HTMLInputElement

function updateCoordinates(x: number, y: number) {
  images.forEach(i => {
    i.updateFocus(x, y)
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
  images.forEach(fp => (fp.img.src = imgSrc.value))
})
