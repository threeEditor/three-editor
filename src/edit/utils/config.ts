export default class Config {
  debug?: boolean;
  public pixelRatio?: number;
  public width?: number;
  public height?: number;
  wrap: HTMLElement;
  constructor(wrap: HTMLElement) {
    //Debug
    this.debug = window.location.hash == "#debug";

    //Pixel
    this.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);
    this.wrap = wrap;
    // Width - Height
    const boundings = wrap?.getBoundingClientRect();
    this.width = boundings?.width;
    this.height = boundings?.height || window.innerHeight;
  }

  resize() {
    const boundings = this.wrap.getBoundingClientRect();
    this.width = boundings.width;
    this.height = boundings.height;

    this.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);
  }
}
