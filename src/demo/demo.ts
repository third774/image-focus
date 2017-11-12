import { FocusedImage, FocusPicker, Focus } from "../lib/main"

const focusPickerEl = document.getElementById("focus-picker-img") as HTMLImageElement
const imgSrcEl = document.getElementById("image-src") as HTMLInputElement
const coordinates = document.getElementById("coordinates") as HTMLInputElement
const dataAttributes = document.getElementById("data-attributes") as HTMLInputElement
const focusedImageElements = document.querySelectorAll(".focused-image") as NodeListOf<HTMLImageElement>

// Set our starting point
const focus = { x: 0.75, y: 0 }

//
const focusedImages: FocusedImage[] = []
Array.prototype.forEach.call(focusedImageElements, (imageEl: HTMLImageElement) => {
  focusedImages.push(new FocusedImage(imageEl, { focus }))
})

const focusPicker = new FocusPicker(focusPickerEl, {
  focus,
  onChange: (newFocus: Focus) => {
    const x = newFocus.x.toFixed(2)
    const y = newFocus.y.toFixed(2)
    coordinates.value = `{x: ${x}, y: ${y}}`
    dataAttributes.value = `data-focus-x="${x}" data-focus-y="${y}"`
    focusedImages.forEach(focusedImage => focusedImage.setFocus(newFocus))
  },
})

imgSrcEl.addEventListener("input", function(e) {
  focusPicker.img.src = imgSrcEl.value
  focusedImages.forEach(focusedImage => (focusedImage.img.src = imgSrcEl.value))
})
