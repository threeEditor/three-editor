import { EventEmitter } from "eventemitter3";

export default class Sizes extends EventEmitter {
  width: number = 0;
  height: number = 0;

  viewport: {
    width: number;
    height: number;
  };
  _sizeViewport: any;
  /**
   * Constructor
   */
  constructor() {
    super();

    // Viewport size
    this.viewport = {
      width: 0,
      height: 0,
    };
    this._sizeViewport = document.createElement("div");
    this._sizeViewport.style.width = "100vw";
    this._sizeViewport.style.height = "100vh";
    this._sizeViewport.style.position = "absolute";
    this._sizeViewport.style.top = 0;
    this._sizeViewport.style.left = 0;
    this._sizeViewport.style.pointerEvents = "none";

    // Resize event
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);

    this.resize();
  }

  /**
   * Resize
   */
  resize() {
    document.body.appendChild(this._sizeViewport);
    this.viewport.width = this._sizeViewport.offsetWidth;
    this.viewport.height = this._sizeViewport.offsetHeight;
    document.body.removeChild(this._sizeViewport);

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.emit("resize");
  }
}