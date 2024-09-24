import * as THREE from "three";
import { EventEmitter } from "eventemitter3";

export default class Time extends EventEmitter {
  start: number;
  current: number;
  elapsed: number;
  delta: number;
  clock: THREE.Clock;
  ticker?: number | null;
  playing: boolean;
  constructor() {
    super();
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    this.playing = true;
    this.clock = new THREE.Clock();
    this.tick = this.tick.bind(this);
    this.tick();
  }
  play() {
    this.playing = true;
  }
  pause() {
    this.playing = false;
  }
  tick() {
    this.ticker = window.requestAnimationFrame(this.tick);

    const current = Date.now();

    this.delta = current - this.current;

    this.elapsed = (current - this.start) / 1000;

    if (this.delta > 60) {
      this.delta = 60;
    }

    if (this.playing) {
      this.emit("loop");
    }
  }

  stop() {
    if (this.ticker) window.cancelAnimationFrame(this.ticker);
    else console.warn("ticker is not defined");
  }
}
