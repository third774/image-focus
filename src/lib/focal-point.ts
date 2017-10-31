export class FocalPoint {
  container: HTMLDivElement
  img: HTMLImageElement

  constructor(private initializationNode: HTMLDivElement | HTMLImageElement) {
    if (initializationNode.nodeName === "DIV") {
      this.container = initializationNode as HTMLDivElement
      this.img = initializationNode.querySelector("img")
      if (!this.img) {
        console.error(initializationNode)
        throw new Error("No image found within above container")
      }
    } else if (initializationNode.nodeName === "IMG") {
      this.img = initializationNode as HTMLImageElement
      this.container = initializationNode.parentElement as HTMLDivElement
    }

    this.img.style.position = "absolute"
    // this.img.style.visibility = "hidden"
    this.img.style.minHeight = "100%"
    this.img.style.minWidth = "100%"

    this.container.style.position = "relative"
    this.container.style.overflow = "hidden"

    window.addEventListener("resize", this.adjustFocus.bind(this))
    this.img.onload = this.adjustFocus.bind(this)
    this.adjustFocus()
  }

  adjustFocus() {
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
      this.img.style[wR > hR ? "max-height" : "max-width"] = "100%"
      // $image.css(wR > hR ? "max-height" : "max-width", "100%")
    }

    if (wR > hR) {
      hShift = this.calcShift(hR, containerW, imageW, focusX)
    } else if (wR < hR) {
      vShift = this.calcShift(wR, containerH, imageH, focusY, true)
    }

    this.img.style.top = vShift
    this.img.style.left = hShift
    // this.img.style.visibility = "visible"
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
