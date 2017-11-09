import { debounce } from "./helpers/debounce"
import { assignStyles } from "./helpers/assignStyles"
import { assign } from "./helpers/assign"

const IMG_STYLES = {
  minHeight: "100%",
  minWidth: "100%",
  position: "absolute",
  top: "0",
  right: "0",
  bottom: "0",
  left: "0",
}

const CONTAINER_STYLES = {
  position: "relative",
  overflow: "hidden",
}

export interface FocusedImageOptions {
  /**
   * Time in MS before debounceApplyShift fires
   *
   * Defaults to `17`
   */
  debounceTime?: number
  /**
   * Should window resize events fire debounceApplyShift?
   *
   * Defaults to `true`
   */
  updateOnWindowResize?: boolean
  /**
   * Focus coordinates to initialize with
   *
   * Default value is `undefined`
   */
  focus?: {
    x: number
    y: number
  }
}

export interface HTMLImageElementWithFocalPoint extends HTMLImageElement {
  __focal_point_instance__: FocusedImage
}

const DEFAULT_OPTIONS: FocusedImageOptions = {
  debounceTime: 17,
  updateOnWindowResize: true,
}

export class FocusedImage {
  options: FocusedImageOptions
  container: HTMLElement
  img: HTMLImageElementWithFocalPoint
  listening: boolean
  debounceApplyShift: () => void

  constructor(private initializationNode: HTMLImageElement, options?: FocusedImageOptions) {
    this.options = assign(DEFAULT_OPTIONS, options)
    this.setUpElementReferences(initializationNode)
    this.setUpStyles()
    this.debounceApplyShift = debounce(this.applyShift, this.options.debounceTime)
    if (this.options.focus) {
      this.setFocusAttributes(this.options.focus.x, this.options.focus.y)
    }
    if (this.options.updateOnWindowResize) {
      this.startListening()
    }
    // applyShift async to allow container styles to recalculate
    setTimeout(() => this.applyShift(), 0)
  }

  public setFocus = (x: number, y: number) => {
    this.setFocusAttributes(x, y)
    this.applyShift()
  }

  public applyShift = () => {
    const imageW = this.img.naturalWidth
    const imageH = this.img.naturalHeight
    const containerW = this.container.getBoundingClientRect().width
    const containerH = this.container.getBoundingClientRect().height
    const focusX = parseFloat(this.img.getAttribute("data-focus-x") as string)
    const focusY = parseFloat(this.img.getAttribute("data-focus-y") as string)

    // Amount position will be shifted
    let hShift = "0"
    let vShift = "0"

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

    if (wR > hR) {
      hShift = this.calcShift(hR, containerW, imageW, focusX)
    } else if (wR < hR) {
      vShift = this.calcShift(wR, containerH, imageH, focusY, true)
    }

    this.img.style.top = vShift
    this.img.style.left = hShift
  }

  public startListening() {
    if (this.listening) {
      return
    }
    this.listening = true
    window.addEventListener("resize", this.debounceApplyShift)
  }

  public stopListening() {
    if (!this.listening) {
      return
    }
    this.listening = false
    window.removeEventListener("resize", this.debounceApplyShift)
  }

  private setFocusAttributes = (x: number, y: number) => {
    this.img.setAttribute("data-focus-x", x.toString())
    this.img.setAttribute("data-focus-y", y.toString())
  }

  private setUpStyles() {
    assignStyles(this.container, CONTAINER_STYLES)
    assignStyles(this.img, IMG_STYLES)
  }

  private setUpElementReferences(initializationNode: HTMLImageElement) {
    this.img = initializationNode as HTMLImageElementWithFocalPoint
    this.container = initializationNode.parentElement
    if (this.img.__focal_point_instance__) {
      this.img.__focal_point_instance__.stopListening()
    }
    this.img.__focal_point_instance__ = this
    this.img.onload = this.applyShift
  }

  // Calculate the new left/top values of an image
  private calcShift(
    conToImageRatio: number,
    containerSize: number,
    imageSize: number,
    focusSize: number,
    toMinus?: boolean,
  ) {
    const containerCenter = Math.floor(containerSize / 2) // Container center in px
    const focusFactor = (focusSize + 1) / 2 // Focus point of resize image in px
    const scaledImage = Math.floor(imageSize / conToImageRatio) // Can't use width() as images may be display:none
    let focus = Math.floor(focusFactor * scaledImage)
    if (toMinus) focus = scaledImage - focus
    let focusOffset = focus - containerCenter // Calculate difference between focus point and center
    const remainder = scaledImage - focus // Reduce offset if necessary so image remains filled
    const containerRemainder = containerSize - containerCenter
    if (remainder < containerRemainder) focusOffset -= containerRemainder - remainder
    if (focusOffset < 0) focusOffset = 0

    return focusOffset * -100 / containerSize + "%"
  }
}

export function initFocusedImage(el) {
  return new FocusedImage(el)
}
