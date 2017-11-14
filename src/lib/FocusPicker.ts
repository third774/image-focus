import { firstNumberIn } from "./helpers/firstNumberIn"
import { noop } from "./helpers/noop"
import { assign } from "./helpers/assign"
import { Focus, OnFocusChange, FocusPickerOptions } from "./interfaces"

import retina from "./retina.svg"

const IMAGE_STYLES = {
  display: "block",
  maxWidth: "100%",
}

const CONTAINER_STYLES = {
  position: "relative",
  overflow: "hidden",
  touchAction: "none",
}

const RETINA_STYLES = {
  position: "absolute",
  cursor: "move",
  transform: "translate(-50%, -50%)",
}

const DEFAULT_OPTIONS: FocusPickerOptions = {
  onChange: noop,
  retina,
}

export class FocusPicker {
  container: HTMLElement
  img: HTMLImageElement
  retina: HTMLImageElement
  focus: Focus
  private isDragging: boolean
  private options: FocusPickerOptions

  constructor(initializationNode: HTMLImageElement, options?: FocusPickerOptions) {
    this.options = assign(DEFAULT_OPTIONS, options || {})
    this.setUpElementReferences(initializationNode)
    this.bindContainerEvents()
    this.setUpImageAttributes()
    this.assignStyles()
    this.initailizeFocusCoordinates()
    this.setFocus(this.focus)
  }

  public setFocus = (focus: Focus) => {
    this.focus = focus
    this.updateRetinaPositionFromFocus()
    this.options.onChange(focus)
  }

  private assignStyles() {
    assign(this.img.style, IMAGE_STYLES)
    assign(this.retina.style, RETINA_STYLES)
    assign(this.container.style, CONTAINER_STYLES)
  }

  private initailizeFocusCoordinates() {
    const x = firstNumberIn([
      this.options.focus && this.options.focus.x,
      this.img.getAttribute("data-focus-x"),
      0,
    ])

    const y = firstNumberIn([
      this.options.focus && this.options.focus.y,
      this.img.getAttribute("data-focus-y"),
      0,
    ])

    this.focus = { x, y }
  }

  private setUpElementReferences(initializationNode: HTMLImageElement) {
    this.img = initializationNode
    this.container = initializationNode.parentElement
    this.retina = document.createElement("img")
    this.retina.src = this.options.retina
    this.retina.draggable = false
    this.container.appendChild(this.retina)
  }

  private bindContainerEvents() {
    this.container.addEventListener("mousedown", this.startDragging)
    this.container.addEventListener("mousemove", this.handleMove)
    this.container.addEventListener("mouseup", this.stopDragging)
    this.container.addEventListener("mouseleave", this.stopDragging)
    this.container.addEventListener("touchend", this.stopDragging)

    // temporarily cast config objs until this issue is resolved
    // https://github.com/Microsoft/TypeScript/issues/9548
    this.container.addEventListener("touchstart", this.startDragging, { passive: true } as any)
    this.container.addEventListener("touchmove", this.handleMove, { passive: true } as any)
  }

  private startDragging = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    this.isDragging = true
    e instanceof MouseEvent
      ? this.updateCoordinates(e.clientX, e.clientY)
      : this.updateCoordinates(e.touches[0].clientX, e.touches[0].clientY)
  }

  private handleMove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    if (e instanceof MouseEvent) {
      this.updateCoordinates(e.clientX, e.clientY)
    } else {
      const touch = e.touches[0]
      const touchedEl = document.elementFromPoint(touch.pageX, touch.pageY)
      touchedEl !== this.retina && touchedEl !== this.img
        ? this.stopDragging()
        : this.updateCoordinates(touch.clientX, touch.clientY)
    }
  }

  private stopDragging = () => {
    this.isDragging = false
  }

  private setUpImageAttributes() {
    this.img.draggable = false
    this.img.addEventListener("load", this.updateRetinaPositionFromFocus)
  }

  private calculateOffsetFromFocus = () => {
    const { width, height } = this.img.getBoundingClientRect()
    const offsetX = width * (this.focus.x / 2 + 0.5)
    const offsetY = height * (this.focus.y / -2 + 0.5)
    return { offsetX, offsetY }
  }

  private updateRetinaPositionFromFocus = () => {
    this.updateRetinaPosition(this.calculateOffsetFromFocus())
  }

  private updateRetinaPosition = (offsets: { offsetX: number; offsetY: number }) => {
    this.retina.style.top = `${offsets.offsetY}px`
    this.retina.style.left = `${offsets.offsetX}px`
  }

  private updateCoordinates(clientX: number, clientY: number) {
    if (!this.isDragging) return // bail if not dragging
    const { width, height, left, top } = this.img.getBoundingClientRect()

    // Calculate FocusPoint coordinates
    const offsetX = clientX - left
    const offsetY = clientY - top
    const x = (offsetX / width - 0.5) * 2
    const y = (offsetY / height - 0.5) * -2
    this.focus = { x, y }

    this.updateRetinaPosition({ offsetX, offsetY })

    this.img.setAttribute("data-focus-x", x.toString())
    this.img.setAttribute("data-focus-y", y.toString())
    this.options.onChange(this.focus)
  }
}
