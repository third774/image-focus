import { merge, noop } from "lodash"
import { assignStyles } from "./helpers/assignStyles"

declare var require
const retina = require("../img/Retina.svg")

const IMAGE_STYLES = {
  display: "block",
  maxWidth: "100%",
}

const CONTAINER_STYLES = {
  position: "relative",
  overflow: "hidden",
}

const RETINA_STYLES = {
  position: "absolute",
  pointerEvents: "none",
  top: "20px",
  left: "20px",
}

const DEFAULT_OPTIONS: FocalPickerOptions = {
  onUpdate: noop,
  initialCoordinates: {
    x: 0,
    y: 0,
  },
}

export interface FocalPickerOptions {
  onUpdate?: (x: number, y: number) => void
  initialCoordinates?: {
    x: number
    y: number
  }
}

export class FocalPicker {
  private options: FocalPickerOptions
  container: HTMLElement
  img: HTMLImageElement
  retina: HTMLImageElement
  dragging: boolean

  constructor(
    initializationNode: HTMLImageElement,
    options: FocalPickerOptions,
  ) {
    this.options = merge(DEFAULT_OPTIONS, options)
    this.setUpElementReferences(initializationNode)

    this.img.onmousedown = this.startDragging
    this.img.onmouseup = this.stopDragging
    this.img.onmouseleave = this.stopDragging
    this.img.onmousemove = this.handleDrag

    assignStyles(this.img, IMAGE_STYLES)
    assignStyles(this.retina, RETINA_STYLES)
    assignStyles(this.container, CONTAINER_STYLES)

    this.img.draggable = false
  }

  setUpElementReferences(initializationNode: HTMLElement | HTMLImageElement) {
    if (initializationNode.nodeName === "IMG") {
      this.img = initializationNode as HTMLImageElement
      this.container = initializationNode.parentElement as HTMLElement
    } else {
      this.container = initializationNode as HTMLElement
      this.img = initializationNode.querySelector("img") as HTMLImageElement
      if (!this.img) {
        console.error(initializationNode)
        throw new Error("No image found within above container")
      }
    }
    this.retina = document.createElement("img")
    this.retina.src = retina
    this.retina.draggable = false
    this.container.appendChild(this.retina)
  }

  startDragging = () => {
    this.dragging = true
  }

  stopDragging = () => {
    this.dragging = false
  }

  handleDrag = e => {
    if (this.dragging) {
      const imageRect = this.img.getBoundingClientRect()

      const imageW = imageRect.width
      const imageH = imageRect.height

      //Calculate FocusPoint coordinates
      var offsetX = e.clientX - imageRect.left
      var offsetY = e.clientY - imageRect.top
      var focusX = (offsetX / imageW - 0.5) * 2
      var focusY = (offsetY / imageH - 0.5) * -2

      this.options.onUpdate(focusX, focusY)

      //Calculate CSS Percentages
      var percentageX = offsetX / imageW * 100
      var percentageY = offsetY / imageH * 100

      //Leave a sweet target reticle at the focus point.
      // $(".reticle").css({
      //   top: percentageY + "%",
      //   left: percentageX + "%",
      // })

      this.retina.style.top = `calc(${percentageY}% - 11px)`
      this.retina.style.left = `calc(${percentageX}% - 11px)`
    }
  }
}
