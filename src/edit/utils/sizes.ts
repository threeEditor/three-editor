import { EventEmitter } from "eventemitter3";

export default class Sizes extends EventEmitter {
  width: number = 0;
  height: number = 0;

  private wrap: HTMLElement;
  constructor(wrap: HTMLDivElement) {
    super();
    this.wrap = wrap;

    // Resize event
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);

    this.resize();
  }

  /**
   * Resize
   */
  resize() {
    const { width, height } = this.wrap.getBoundingClientRect();
    this.width = width;
    this.height = height;
    this.emit("resize");
  }

  destory() {
    window.removeEventListener('resize', this.resize);
  }
}
