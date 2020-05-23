import { FocusedImage } from '../src/FocusedImage';

jest.useFakeTimers();

describe('FocusedImage', () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => {
      return {
        width: 120,
        height: 120,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      };
    }) as any;

    Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', {
      get: () => 220,
    });
    Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', {
      get: () => 300,
    });

    document.body.innerHTML = `
    <body>
      <div class="focused-image-container top-left">
        <img class="focused-image" src="https://picsum.photos/2400/1400" alt="" data-focus-x="0.28" data-focus-y="0.33">
      </div>
    </body>
    `;
  });

  it('FocusedImage is instantiable', () => {
    const img = document.querySelector('.focused-image') as HTMLImageElement;
    const instance = new FocusedImage(img);
    expect(instance).toBeInstanceOf(FocusedImage);
  });

  it('should be able to update focus with setFocus', () => {
    const img = document.querySelector('.focused-image') as HTMLImageElement;
    const instance = new FocusedImage(img);
    const spy = jest.spyOn(instance, 'applyShift');
    instance.setFocus({ x: 0.25, y: 0.3 });
    expect(img.getAttribute('data-focus-x')).toBe('0.25');
    expect(img.getAttribute('data-focus-y')).toBe('0.3');
    expect(spy).toHaveBeenCalled();
  });

  it('should calculate the shift % correctly', () => {
    const img = document.querySelector('.focused-image') as HTMLImageElement;
    const instance = new FocusedImage(img);
    // TODO: figure out a better way to test this private method
    const result = (instance as any).calcShift(
      7.064574627454072,
      238.90625,
      2400,
      0.7133333333333334
    );
    expect(result).toBe(-41.89666448659254);
  });

  it('should have element references', () => {
    const img = document.querySelector('.focused-image') as HTMLImageElement;
    const instance = new FocusedImage(img);
    expect(instance.img).toBeTruthy();
    expect(instance.container).toBeTruthy();
  });
});
