import "./polyfills";
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
     * Focus coordinates to initialize with
     *
     * Default value is `undefined`
     */
    focus?: {
        x: number;
        y: number;
    };
}
export interface HTMLImageElementWithFocalPoint extends HTMLImageElement {
    __focal_point_instance__: FocusedImage;
}
export declare class FocusedImage {
    private initializationNode;
    options: FocusedImageOptions;
    container: HTMLElement;
    img: HTMLImageElementWithFocalPoint;
    listening: boolean;
    debounceApplyShift: () => void;
    constructor(initializationNode: HTMLElement | HTMLImageElement, options?: FocusedImageOptions);
    setFocus: (x: number, y: number) => void;
    applyShift: () => boolean;
    startListening(): void;
    stopListening(): void;
    private setFocusAttributes;
    private setUpStyles();
    private checkForStaticPosition();
    private hasReferences();
    private setUpElementReferences(initializationNode);
    private calcShift(conToImageRatio, containerSize, imageSize, focusSize, toMinus?);
}
export declare function initFocusedImage(el: any): FocusedImage;
