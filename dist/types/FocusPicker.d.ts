import "./polyfills";
export interface FocusPickerOptions {
    onChange?: (x: number, y: number) => void;
    focus?: {
        x: number;
        y: number;
    };
}
export declare class FocusPicker {
    container: HTMLElement;
    img: HTMLImageElement;
    retina: HTMLImageElement;
    isDragging: boolean;
    focusX: number;
    focusY: number;
    private options;
    constructor(initializationNode: HTMLImageElement, options: FocusPickerOptions);
    assignStyles(): void;
    initailizeFocusCoordinates(): void;
    setUpElementReferences(initializationNode: HTMLElement | HTMLImageElement): void;
    bindContainerEvents(): void;
    setUpImageAttributes(): void;
    calculateOffsetFromFocus: () => {
        offsetX: number;
        offsetY: number;
    };
    updateRetinaPosition: (offsets: {
        offsetX: number;
        offsetY: number;
    }) => void;
    setFocus: (x: any, y: any) => void;
    startDragging: (e: MouseEvent) => void;
    stopDragging: () => void;
    handleDrag: (e: MouseEvent) => void;
}
