const IMG_STYLES = {
  minHeight: "100%",
  minWidth: "100%",
  position: "absolute",
  top: "0",
  right: "0",
  bottom: "0",
  left: "0",
}

interface Options {
  debounceTime?: number
}

interface HTMLImageElementWithFocalPoint extends HTMLImageElement {
  focalPoint: FocalPoint
}

export class FocalPoint {
  container: HTMLDivElement
  img: HTMLImageElementWithFocalPoint
  listening: boolean
  debounceTimer: any

  constructor(
    private initializationNode: HTMLDivElement | HTMLImageElement,
    private options: Options = {
      debounceTime: 17,
    },
  ) {
    this.setUpElementReferences(initializationNode)
    this.setUpStyles()
    this.adjustFocus()
    this.startListening()
  }

  setUpStyles() {
    for (const key in IMG_STYLES) {
      this.img.style[key] = IMG_STYLES[key]
    }

    this.container.style.position = "relative"
    this.container.style.overflow = "hidden"
  }

  startListening() {
    if (this.listening) {
      return
    }
    this.listening = true
    window.addEventListener("resize", this.debouncedAdjustFocus)
  }

  stopListening() {
    if (!this.listening) {
      return
    }
    this.listening = false
    window.removeEventListener("resize", this.debouncedAdjustFocus)
  }

  checkForStaticPosition() {
    if (this.container.style.position === "static") {
      console.warn(`
This container has a static position. The image will not
be contained properly unless it has a non-static position
such as 'absolute' or 'relative'.`)
    }
  }

  hasReferences() {
    let hasReferences = true
    if (!this.img) {
      hasReferences = false
      console.error(`
Refernce to image not found. Make sure the container
has an image inside it.
`)
    }
    if (!this.container) {
      hasReferences = false
      console.error(`
Refernce to container not found. Not sure how that happened.
`)
    }
    return hasReferences
  }

  setUpElementReferences(
    initializationNode: HTMLDivElement | HTMLImageElement,
  ) {
    if (initializationNode.nodeName === "IMG") {
      this.img = initializationNode as HTMLImageElementWithFocalPoint
      this.container = initializationNode.parentElement as HTMLDivElement
    } else {
      this.container = initializationNode as HTMLDivElement
      this.img = initializationNode.querySelector(
        "img",
      ) as HTMLImageElementWithFocalPoint
      if (!this.img) {
        console.error(initializationNode)
        throw new Error("No image found within above container")
      }
    }
    if (this.img.focalPoint) {
      this.img.focalPoint.stopListening()
    }
    this.img.focalPoint = this
    this.img.onload = this.adjustFocus
  }

  debouncedAdjustFocus = () => {
    if (this.debounceTimer) {
      window.clearTimeout(this.debounceTimer)
    }
    this.debounceTimer = window.setTimeout(
      this.adjustFocus,
      this.options.debounceTime,
    )
  }

  adjustFocus = () => {
    // Check a couple things to alert at dev time of problems
    if (!this.hasReferences()) {
      // bail if no references
      return
    }
    this.checkForStaticPosition()

    const imageW = this.img.naturalWidth
    const imageH = this.img.naturalHeight
    const containerW = this.container.getBoundingClientRect().width
    const containerH = this.container.getBoundingClientRect().height
    const focusX = parseFloat(this.container.getAttribute("data-focus-x"))
    const focusY = parseFloat(this.container.getAttribute("data-focus-y"))

    //Amount position will be shifted
    let hShift = "0"
    let vShift = "0"

    if (!(containerW > 0 && containerH > 0 && imageW > 0 && imageH > 0)) {
      return false //Need dimensions to proceed
    }

    //Which is over by more?
    const wR = imageW / containerW
    const hR = imageH / containerH

    //Reset max-width and -height
    this.img.style.maxHeight = null
    this.img.style.maxWidth = null

    //Minimize image while still filling space
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

  // Calculate the new left/top values of an image
  calcShift(
    conToImageRatio: number,
    containerSize: number,
    imageSize: number,
    focusSize: number,
    toMinus?: boolean,
  ) {
    const containerCenter = Math.floor(containerSize / 2) //Container center in px
    const focusFactor = (focusSize + 1) / 2 //Focus point of resize image in px
    const scaledImage = Math.floor(imageSize / conToImageRatio) //Can't use width() as images may be display:none
    let focus = Math.floor(focusFactor * scaledImage)
    if (toMinus) focus = scaledImage - focus
    let focusOffset = focus - containerCenter //Calculate difference between focus point and center
    const remainder = scaledImage - focus //Reduce offset if necessary so image remains filled
    const containerRemainder = containerSize - containerCenter
    if (remainder < containerRemainder)
      focusOffset -= containerRemainder - remainder
    if (focusOffset < 0) focusOffset = 0

    return focusOffset * -100 / containerSize + "%"
  }
}

export function initializeFocalPoint(el) {
  new FocalPoint(el)
}
