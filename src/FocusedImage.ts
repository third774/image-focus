import { debounce } from './helpers/debounce';
import { assign } from './helpers/assign';
import { Focus, FocusedImageOptions } from './interfaces';
import { CONTAINER_STYLES, ABSOLUTE_STYLES } from './sharedStyles';

const IMG_STYLES = {
  // Set these styles in case the image dimensions
  // are smaller than the container's
  minHeight: '100%',
  minWidth: '100%',
};

const RESIZE_LISTENER_OBJECT_STYLES = {
  height: '100%',
  width: '100%',
  border: 'none',

  // set these styles to emulate "visibility: hidden"
  // can't use visibility because it breaks the object
  // events in Firefox
  opacity: 0,
  zIndex: -1,
  pointerEvents: 'none',
};

const DEFAULT_OPTIONS: FocusedImageOptions = {
  debounceTime: 17,
  updateOnWindowResize: true,
  updateOnContainerResize: false,
  containerPosition: 'relative',
};

export class FocusedImage {
  focus: Focus;
  options: FocusedImageOptions;
  container: HTMLElement;
  img: HTMLImageElement;
  resizeListenerObject: HTMLObjectElement;
  listening: boolean = false;
  debounceApplyShift: () => void;

  constructor(
    private imageNode: HTMLImageElement,
    options: FocusedImageOptions = {}
  ) {
    // Merge in options
    this.options = assign(DEFAULT_OPTIONS, options);

    // Set up element references
    this.img = imageNode;
    this.container = imageNode.parentElement;

    // Set up instance
    if (this.img['__focused_image_instance__']) {
      this.img['__focused_image_instance__'].stopListening();
      this.img.removeEventListener('load', this.applyShift);
    }
    this.img['__focused_image_instance__'] = this;

    // Add image load event listener
    this.img.addEventListener('load', this.applyShift);

    // Set up styles
    assign(this.container.style, CONTAINER_STYLES);
    this.container.style.position = this.options.containerPosition;
    assign(this.img.style, IMG_STYLES, ABSOLUTE_STYLES);

    // Create debouncedShift function
    this.debounceApplyShift = debounce(
      this.applyShift,
      this.options.debounceTime
    );

    // Initialize focus
    this.focus = this.options.focus
      ? this.options.focus
      : {
          x: parseFloat(this.img.getAttribute('data-focus-x')) || 0,
          y: parseFloat(this.img.getAttribute('data-focus-y')) || 0,
        };

    // Start listening for resize events
    this.startListening();

    // Set focus
    this.setFocus(this.focus);
  }

  public setFocus = (focus: Focus) => {
    this.focus = focus;
    this.img.setAttribute('data-focus-x', focus.x.toString());
    this.img.setAttribute('data-focus-y', focus.y.toString());
    this.applyShift();
  };

  public applyShift = () => {
    const { naturalWidth: imageW, naturalHeight: imageH } = this.img;
    const {
      width: containerW,
      height: containerH,
    } = this.container.getBoundingClientRect();

    // Amount position will be shifted
    let hShift = '0';
    let vShift = '0';

    if (!(containerW > 0 && containerH > 0 && imageW > 0 && imageH > 0)) {
      return false; // Need dimensions to proceed
    }

    // Which is over by more?
    const wR = imageW / containerW;
    const hR = imageH / containerH;

    // Reset max-width and -height
    this.img.style.maxHeight = null;
    this.img.style.maxWidth = null;

    // Minimize image while still filling space
    if (imageW > containerW && imageH > containerH) {
      this.img.style[wR > hR ? 'maxHeight' : 'maxWidth'] = '100%';
    }

    if (wR > hR) {
      hShift = `${this.calcShift(hR, containerW, imageW, this.focus.x)}%`;
    } else if (wR < hR) {
      vShift = `${this.calcShift(wR, containerH, imageH, this.focus.y, true)}%`;
    }

    this.img.style.top = vShift;
    this.img.style.left = hShift;
  };

  public startListening() {
    if (this.listening) {
      return;
    }
    this.listening = true;
    if (this.options.updateOnWindowResize) {
      window.addEventListener('resize', this.debounceApplyShift);
    }
    if (this.options.updateOnContainerResize) {
      const object = document.createElement('object');
      assign(object.style, RESIZE_LISTENER_OBJECT_STYLES, ABSOLUTE_STYLES);
      // Use load event callback because contentDocument doesn't exist
      // until this fires in Firefox
      object.addEventListener('load', (e: Event) =>
        object.contentDocument.defaultView.addEventListener('resize', () =>
          this.debounceApplyShift()
        )
      );
      object.type = 'text/html';
      object.setAttribute('aria-hidden', 'true');
      object.tabIndex = -1;
      this.container.appendChild(object);
      object.data = 'about:blank';
      this.resizeListenerObject = object;
    }
  }

  public stopListening() {
    if (!this.listening) {
      return;
    }
    this.listening = false;
    window.removeEventListener('resize', this.debounceApplyShift);
    if (
      this.resizeListenerObject &&
      this.resizeListenerObject.contentDocument
    ) {
      this.resizeListenerObject.contentDocument.defaultView.removeEventListener(
        'resize',
        this.debounceApplyShift
      );
      this.container.removeChild(this.resizeListenerObject);
      this.resizeListenerObject = null;
    }
  }

  // Calculate the new left/top percentage shift of an image
  private calcShift(
    conToImageRatio: number,
    containerSize: number,
    imageSize: number,
    focusSize: number,
    toMinus?: boolean
  ) {
    const containerCenter = Math.floor(containerSize / 2); // Container center in px
    const focusFactor = (focusSize + 1) / 2; // Focus point of resize image in px
    const scaledImage = Math.floor(imageSize / conToImageRatio); // Can't use width() as images may be display:none
    let focus = Math.floor(focusFactor * scaledImage);
    if (toMinus) focus = scaledImage - focus;
    let focusOffset = focus - containerCenter; // Calculate difference between focus point and center
    const remainder = scaledImage - focus; // Reduce offset if necessary so image remains filled
    const containerRemainder = containerSize - containerCenter;
    if (remainder < containerRemainder)
      focusOffset -= containerRemainder - remainder;
    if (focusOffset < 0) focusOffset = 0;

    return (focusOffset * -100) / containerSize;
  }
}
