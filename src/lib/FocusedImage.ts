import { debounce } from "./helpers/debounce"
import { assign } from "./helpers/assign"
import { Focus, FocusedImageOptions } from "./interfaces"
import { CONTAINER_STYLES, ABSOLUTE_STYLES } from "./sharedStyles"

const IMG_STYLES = {
  // Set these styles in case the image dimensions
  // are smaller than the container's
  minHeight: "100%",
  minWidth: "100%",
}

const RESIZE_LISTENER_OBJECT_STYLES = {
  height: "100%",
  width: "100%",
  border: "none",

  // set these styles to emulate "visibility: hidden"
  // can't use visibility because it breaks the object
  // events in Firefox
  opacity: 0,
  zIndex: -1,
  pointerEvents: "none",
}

const DEFAULT_OPTIONS: FocusedImageOptions = {
  debounceTime: 17,
  updateOnWindowResize: true,
  updateOnContainerResize: false,
  containerPosition: "relative",
}

export class FocusedImage {
  focus: Focus
  options: FocusedImageOptions
  container: HTMLElement
  img: HTMLImageElement
  resizeListenerObject: HTMLObjectElement
  listening: boolean = false
  debounceApplyShift: () => void

  constructor(private imageNode: HTMLImageElement, options: FocusedImageOptions = {}) {
    // Merge in options
    this.options = assign(DEFAULT_OPTIONS, options)

    // Set up element references
    this.img = imageNode
    this.container = imageNode.parentElement

    // Set up instance
    if (this.img["__focused_image_instance__"]) {
      this.img["__focused_image_instance__"].stopListening()
      this.img.removeEventListener("load", this.applyShift)
    }
    this.img["__focused_image_instance__"] = this

    // Add image load event listener
    this.img.addEventListener("load", this.applyShift)

    // Set up styles
    assign(this.container.style, CONTAINER_STYLES)
    this.container.style.position = this.options.containerPosition
    assign(this.img.style, IMG_STYLES, ABSOLUTE_STYLES)

    // Create debouncedShift function
    this.debounceApplyShift = debounce(this.applyShift, this.options.debounceTime)

    // Initialize focus
    this.focus = this.options.focus
      ? this.options.focus
      : {
          x: parseFloat(this.img.getAttribute("data-focus-x")) || 0,
          y: parseFloat(this.img.getAttribute("data-focus-y")) || 0,
        }

    // Start listening for resize events
    this.startListening()

    // Set focus
    this.setFocus(this.focus)
  }

  public setFocus = (focus: Focus) => {
    this.focus = focus
    this.img.setAttribute("data-focus-x", focus.x.toString())
    this.img.setAttribute("data-focus-y", focus.y.toString())
    this.applyShift()
  }

  public applyShift = () => {
    const { naturalWidth: imageW, naturalHeight: imageH } = this.img
    const { width: containerW, height: containerH } = this.container.getBoundingClientRect()

    if (!(containerW > 0 && containerH > 0 && imageW > 0 && imageH > 0)) {
      return false // Need dimensions to proceed
    }

    // Which is over by more?
    const wR = imageW / containerW
    const hR = imageH / containerH

    // Reset max-width and -height
    this.img.style.maxHeight = null
    this.img.style.maxWidth = null

    // Minimize image while still filling space
    if (imageW > containerW && imageH > containerH) {
      this.img.style[wR > hR ? "maxHeight" : "maxWidth"] = "100%"
    }

    // Amount position will be shifted
    let transform
    if (wR > hR) {
      transform = `translateX(${this.calcShift(hR, containerW, imageW, this.focus.x)}px)`
    } else if (wR < hR) {
      transform = `translateY(${this.calcShift(wR, containerH, imageH, this.focus.y, true)}px)`
    }

    this.img.style.transform = transform
  }

  public startListening() {
    if (this.listening) {
      return
    }
    this.listening = true
    if (this.options.updateOnWindowResize) {
      window.addEventListener("resize", this.debounceApplyShift)
    }
    if (this.options.updateOnContainerResize) {
      const object = document.createElement("object")
      assign(object.style, RESIZE_LISTENER_OBJECT_STYLES, ABSOLUTE_STYLES)
      // Use load event callback because contentDocument doesn't exist
      // until this fires in Firefox
      object.addEventListener("load", (e: Event) =>
        object.contentDocument.defaultView.addEventListener("resize", () => this.debounceApplyShift()),
      )
      object.type = "text/html"
      object.setAttribute("aria-hidden", "true")
      object.tabIndex = -1
      this.container.appendChild(object)
      object.data = "about:blank"
      this.resizeListenerObject = object
    }
  }

  public stopListening() {
    if (!this.listening) {
      return
    }
    this.listening = false
    window.removeEventListener("resize", this.debounceApplyShift)
    if (this.resizeListenerObject) {
      this.resizeListenerObject.contentDocument.defaultView.removeEventListener(
        "resize",
        this.debounceApplyShift,
      )
      this.container.removeChild(this.resizeListenerObject)
      this.resizeListenerObject = null
    }
  }

  // Calculate the new translate px
  private calcShift(
    containerToImageRatio: number,
    containerSize: number,
    fullImageSize: number,
    focusCoordinate: number,
    invertPercentageScale?: boolean,
  ) {
    // convert from -1 to +1 coordinates to 0-100% scale
    let shiftPercentage = (focusCoordinate + 1) / 2
    if (invertPercentageScale) shiftPercentage = 1 - shiftPercentage

    const halfContainer = containerSize / 2
    const halfImage = fullImageSize / 2

    let shift = fullImageSize / containerToImageRatio * shiftPercentage - halfContainer
    if (shift < 0) return 0

    const scaledDownImageCenter = halfImage / containerToImageRatio
    const shiftBoundary = (scaledDownImageCenter - halfContainer) * 2
    return Math.min(shiftBoundary, shift) * -1
  }
}
