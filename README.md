# image-focus
A dependency free utility for cropping images based on a focal point

**NOTE: This project is not ready for release yet. API's are subject to change**

[Check out the demo](https://stackblitz.com/edit/image-focus)

## Usage

```
npm install image-focus
```

```ts
import { FocusedImage, FocusPicker, initFocusedImage } from "../lib/main"

const images: FocusedImage[] = []

const startingFocus = { x: 0.81, y: -0.69 }

Array.prototype.forEach.call(document.querySelectorAll(".image-focus"), function(container: HTMLElement) {
  images.push(
    new FocusedImage(container, {
      focus: startingFocus,
    }),
  )
})

const coordinates = document.querySelector(".coordinates") as HTMLInputElement

function updateCoordinatesValue({ x, y }: { x: number; y: number }) {
  coordinates.value = `{x: ${x >= 0 ? " " : ""}${x.toFixed(2)}, y: ${y >= 0 ? " " : ""}${y.toFixed(2)}}`
}

updateCoordinatesValue(startingFocus)

const focusPickerEl = document.getElementById("image-focus-picker-img")
const focusPicker = new FocusPicker(focusPickerEl as HTMLImageElement, {
  onChange: (x: number, y: number) => {
    images.forEach(i => i.setFocus(x, y))
    updateCoordinatesValue({ x, y })
  },
  focus: startingFocus,
})

const imgSrc = document.querySelector(".image-src") as HTMLInputElement

imgSrc.addEventListener("input", function(e) {
  focusPicker.img.src = imgSrc.value
  images.forEach(fp => (fp.img.src = imgSrc.value))
})

```
