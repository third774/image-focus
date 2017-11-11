import { FocusedImage } from "./FocusedImage"

describe("FocusedImage", () => {
  it("FocusedImage is instantiable", () => {
    document.body.innerHTML = `
    <body>
      <div class="focused-image-container top-left">
        <img class="focused-image" src="https://picsum.photos/2400/1400" alt="" data-focus-x="0" data-focus-y="0">
      </div>
    </body>
    `
    const img = document.querySelector(".focused-image") as HTMLImageElement
    const instance = new FocusedImage(img)

    expect(instance).toBeInstanceOf(FocusedImage)
  })
})
