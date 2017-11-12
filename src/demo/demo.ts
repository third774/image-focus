import { FocusedImage, FocusPicker, Focus } from "../lib/main"

// Get our references to elements
const focusPickerEl = document.getElementById("focus-picker-img") as HTMLImageElement
const imgSrcEl = document.getElementById("image-src") as HTMLInputElement
const coordinates = document.getElementById("coordinates") as HTMLInputElement
const dataAttributes = document.getElementById("data-attributes") as HTMLInputElement
const focusedImageElements = document.querySelectorAll(".focused-image") as NodeListOf<HTMLImageElement>

// Set our starting focus
const focus: Focus = { x: 0, y: 0 }

// Create helper function for updating cooridates and dataAttributes inputs
function updateInputs(newFocus: Focus) {
  const x = newFocus.x.toFixed(2)
  const y = newFocus.y.toFixed(2)
  coordinates.value = `{x: ${x}, y: ${y}}`
  dataAttributes.value = `data-focus-x="${x}" data-focus-y="${y}"`
}

// Update inputs using starting focus
updateInputs(focus)

// Iterate over images and instantiate FocusedImage from each
// pushing into an array for updates later
const focusedImages: FocusedImage[] = []
Array.prototype.forEach.call(focusedImageElements, (imageEl: HTMLImageElement) => {
  focusedImages.push(
    new FocusedImage(imageEl, {
      focus,
      debounceTime: 17,
      updateOnWindowResize: true,
    }),
  )
})

// Instantiate our FocusPicker providing starting focus
// and onChange callback
const focusPicker = new FocusPicker(focusPickerEl, {
  focus,
  onChange: (newFocus: Focus) => {
    updateInputs(newFocus)
    focusedImages.forEach(focusedImage => focusedImage.setFocus(newFocus))
  },
})

// Add event listener for updating image sources
imgSrcEl.addEventListener("input", () => {
  focusPicker.img.src = imgSrcEl.value
  focusedImages.forEach(focusedImage => (focusedImage.img.src = imgSrcEl.value))
})
