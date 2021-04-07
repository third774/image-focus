import { noop } from './helpers/noop';
import { assign } from './helpers/assign';
import { CONTAINER_STYLES } from './sharedStyles';
import { Focus, FocusPickerOptions } from './interfaces';

import retina from './retina.svg';

const IMAGE_STYLES = {
  // Get rid of bottom padding from default display
  display: 'block',
  // Make image fill container
  maxWidth: '100%',
  // Prevent Android refresh on pull down
  touchAction: 'none',
};

const RETINA_STYLES = {
  position: 'absolute',
  cursor: 'move',

  // Center the retina
  transform: 'translate(-50%, -50%)',
};

const DEFAULT_OPTIONS: FocusPickerOptions = {
  onChange: noop,
  retina,
};

export class FocusPicker {
  container: HTMLElement;
  img: HTMLImageElement;
  retina: HTMLImageElement;
  focus: Focus;
  private isDragging: boolean;
  private options: FocusPickerOptions;
  private _enabled: boolean = false;

  constructor(imageNode: HTMLImageElement, options: FocusPickerOptions = {}) {
    // Merge options in
    this.options = assign({}, DEFAULT_OPTIONS, options);

    // Set up references
    this.img = imageNode;
    this.container = imageNode.parentElement;

    // Styles and DOM config
    this.img.draggable = false;
    // Assign styles
    assign(this.img.style, IMAGE_STYLES);
    assign(this.container.style, CONTAINER_STYLES);

    // Initialize Focus coordinates
    this.focus = this.getFocus();

    // Create and attach the retina focal point, start listeners and attach focus
    this.enable();
  }

  private getFocus(): Focus {
    return this.options.focus
      ? this.options.focus
      : {
          x: parseFloat(this.img.getAttribute('data-focus-x')) || 0,
          y: parseFloat(this.img.getAttribute('data-focus-y')) || 0,
        };
  }

  /**
   * Creates the focal point retina and
   */
  public enable() {
    if (!this._enabled) {
      // Create and attach the retina focal point
      this.retina = document.createElement('img');
      this.retina.src = this.options.retina;
      this.retina.draggable = false;
      this.container.appendChild(this.retina);
      assign(this.retina.style, RETINA_STYLES);
      this.startListening();
      this.setFocus(this.focus);
      this._enabled = true;
    }
  }

  public disable() {
    if (this._enabled && this.retina) {
      this.stopListening();
      this.container.removeChild(this.retina);
      this._enabled = false;
    }
  }

  get enabled(): boolean {
    return this._enabled;
  }

  public startListening() {
    // Bind container events
    this.container.addEventListener('mousedown', this.startDragging);
    this.container.addEventListener('mousemove', this.handleMove);
    this.container.addEventListener('mouseup', this.stopDragging);
    this.container.addEventListener('mouseleave', this.stopDragging);
    this.container.addEventListener('touchend', this.stopDragging);

    // temporarily cast config objs until this issue is resolved
    // https://github.com/Microsoft/TypeScript/issues/9548
    this.container.addEventListener('touchstart', this.startDragging, {
      passive: true,
    } as any);
    this.container.addEventListener('touchmove', this.handleMove, {
      passive: true,
    } as any);

    this.img.addEventListener('load', this.updateRetinaPositionFromFocus);
  }

  public stopListening() {
    this.container.removeEventListener('mousedown', this.startDragging);
    this.container.removeEventListener('mousemove', this.handleMove);
    this.container.removeEventListener('mouseup', this.stopDragging);
    this.container.removeEventListener('mouseleave', this.stopDragging);
    this.container.removeEventListener('touchend', this.stopDragging);
    this.container.removeEventListener('touchstart', this.startDragging);
    this.container.removeEventListener('touchmove', this.handleMove);
    this.img.removeEventListener('load', this.updateRetinaPositionFromFocus);
  }

  public setFocus(focus: Focus) {
    this.focus = focus;
    this.img.setAttribute('data-focus-x', focus.x.toString());
    this.img.setAttribute('data-focus-y', focus.y.toString());
    this.updateRetinaPositionFromFocus();
    this.options.onChange(focus);
  }

  private startDragging = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    this.isDragging = true;
    e instanceof MouseEvent
      ? this.updateCoordinates(e.clientX, e.clientY)
      : this.updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
  };

  private handleMove = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (e instanceof MouseEvent) {
      this.updateCoordinates(e.clientX, e.clientY);
    } else {
      const touch = e.touches[0];
      const touchedEl = document.elementFromPoint(touch.pageX, touch.pageY);
      touchedEl !== this.retina && touchedEl !== this.img
        ? this.stopDragging()
        : this.updateCoordinates(touch.clientX, touch.clientY);
    }
  };

  private stopDragging = () => {
    this.isDragging = false;
  };

  private calculateOffsetFromFocus() {
    const { width, height } = this.img.getBoundingClientRect();
    const offsetX = width * (this.focus.x / 2 + 0.5);
    const offsetY = height * (this.focus.y / -2 + 0.5);
    return { offsetX, offsetY };
  }

  private updateRetinaPositionFromFocus = () => {
    this.updateRetinaPosition(this.calculateOffsetFromFocus());
  };

  private updateRetinaPosition = (offsets: {
    offsetX: number;
    offsetY: number;
  }) => {
    this.retina.style.top = `${offsets.offsetY}px`;
    this.retina.style.left = `${offsets.offsetX}px`;
  };

  private updateCoordinates(clientX: number, clientY: number) {
    if (!this.isDragging) return; // bail if not dragging
    const { width, height, left, top } = this.img.getBoundingClientRect();

    // Calculate FocusPoint coordinates
    const offsetX = clientX - left;
    const offsetY = clientY - top;
    const x = (offsetX / width - 0.5) * 2;
    const y = (offsetY / height - 0.5) * -2;

    // TODO: Figure out an elegant way to use the setFocus API without
    // having to recalculate the offset from focus
    this.setFocus({ x, y });
  }
}
