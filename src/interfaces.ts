export interface Focus {
  x: number;
  y: number;
}

/**
 * @param {Focus} focusCoordinates
 * @returns {void}
 */
export type OnFocusChange = (focusCoordinates: {
  x: number;
  y: number;
}) => void;

export interface FocusPickerOptions {
  /**
   * Callback that receives FocusCoordinates on change
   */
  onChange?: OnFocusChange;
  /**
   * Focus to initialize with
   */
  focus?: Focus;
  /**
   * src attribute for the retina
   */
  retina?: string;
}

export interface FocusedImageOptions {
  /**
   * Time in MS before debounceApplyShift fires
   *
   * Defaults to `17`
   */
  debounceTime?: number;
  /**
   * Should window resize events fire debounceApplyShift?
   *
   * Defaults to `true`
   */
  updateOnWindowResize?: boolean;
  /**
   * Should container resize (even from CSS) fire debounceApplyShift?
   *
   * Defaults to `false`
   */
  updateOnContainerResize?: boolean;
  /**
   * Focus coordinates to initialize with
   *
   * Default value is `undefined`
   */
  focus?: Focus;
  /**
   * Container position
   *
   * Default value is "relative"
   */
  containerPosition?: 'fixed' | 'relative' | 'absolute' | 'sticky';
}
