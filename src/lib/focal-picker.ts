import { assignStyles } from "./helpers/assignStyles"
import { firstNumberIn } from "./helpers/firstNumberIn"
import { noop } from "./helpers/noop"

import "./polyfills"

import { retina } from "./retina"

const IMAGE_STYLES = {
  display: "block",
  maxWidth: "100%",
}

const CONTAINER_STYLES = {
  position: "relative",
  overflow: "hidden",
  userSelect: "none",
}

const RETINA_STYLES = {
  position: "absolute",
  cursor: "move",
  top: "-200px",
  left: "-200px",
}

const DEFAULT_OPTIONS: FocalPickerOptions = {
  onUpdate: noop,
}

export interface FocalPickerOptions {
  onUpdate?: (x: number, y: number) => void
  initialCoordinates?: {
    x: number
    y: number
  }
}

export class FocalPicker {
  container: HTMLElement
  img: HTMLImageElement
  retina: SVGElement
  isDragging: boolean
  focusX: number
  focusY: number
  private options: FocalPickerOptions

  constructor(initializationNode: HTMLImageElement, options: FocalPickerOptions) {
    this.options = Object.assign(DEFAULT_OPTIONS, options)
    this.setUpElementReferences(initializationNode)
    this.initailizeFocusCoordinates()
    this.bindContainerEvents()
    this.setUpImageAttributes()
    this.assignStyles()
  }

  assignStyles() {
    assignStyles(this.img, IMAGE_STYLES)
    assignStyles(this.retina, RETINA_STYLES)
    assignStyles(this.container, CONTAINER_STYLES)
  }

  initailizeFocusCoordinates() {
    this.focusX = firstNumberIn([
      this.options.initialCoordinates && this.options.initialCoordinates.x,
      parseFloat(this.container.getAttribute("data-focus-x")),
      0,
    ])

    this.focusY = firstNumberIn([
      this.options.initialCoordinates && this.options.initialCoordinates.y,
      parseFloat(this.container.getAttribute("data-focus-y")),
      0,
    ])
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
    this.retina = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    this.retina.setAttribute("width", "20")
    this.retina.setAttribute("height", "20")
    this.retina.setAttribute("viewBox", "0 0 20 20")

    this.retina.innerHTML = retina

    this.container.appendChild(this.retina)
  }

  bindContainerEvents() {
    this.container.onmousedown = this.startDragging
    this.container.onmouseup = this.stopDragging
    this.container.onmouseleave = this.stopDragging
    this.container.onmousemove = this.handleDrag
  }

  setUpImageAttributes() {
    this.img.draggable = false
    this.img.onload = () => {
      this.updateRetinaPosition(this.calculateOffsetFromFocus())
    }
  }

  calculateOffsetFromFocus = () => {
    const { width, height } = this.img.getBoundingClientRect()
    const offsetX = width * (this.focusX / 2 + 0.5)
    const offsetY = height * (this.focusY / -2 + 0.5)
    return { offsetX, offsetY }
  }

  updateRetinaPosition = (offsets: { offsetX: number; offsetY: number }) => {
    this.retina.style.top = `calc(${offsets.offsetY}px - 10px)`
    this.retina.style.left = `calc(${offsets.offsetX}px - 10px)`
  }

  setFocus = (x, y) => {
    this.focusX = x
    this.focusY = y
    this.updateRetinaPosition(this.calculateOffsetFromFocus())
  }

  startDragging = (e: MouseEvent) => {
    this.isDragging = true
    this.handleDrag(e)
  }

  stopDragging = () => {
    this.isDragging = false
  }

  handleDrag = (e: MouseEvent) => {
    if (this.isDragging) {
      const { width, height, left, top } = this.img.getBoundingClientRect()

      // Calculate FocusPoint coordinates
      var offsetX = e.clientX - left
      var offsetY = e.clientY - top
      var focusX = (offsetX / width - 0.5) * 2
      var focusY = (offsetY / height - 0.5) * -2

      this.updateRetinaPosition({ offsetX, offsetY })
      this.options.onUpdate(focusX, focusY)
    }
  }
}
