/* eslint-disable @typescript-eslint/comma-dangle */
type ArgumentsType<T> = T extends (...args: infer A) => unknown ? A : never;
type ReturnVoidFn = (...args: any[]) => void;

export const DEBOUNCE_THRESHOLD = 500;
export function debounce<T extends ReturnVoidFn = ReturnVoidFn>(
  fn: T,
  wait = DEBOUNCE_THRESHOLD,
  immediate = true
): (...args: ArgumentsType<T>) => void {
  let timer: NodeJS.Timeout | null = null;
  return function (this: unknown, ...args: ArgumentsType<T>) {
    timer && clearTimeout(timer);
    if (immediate && !timer) {
      fn.apply(this, args);
    }
    timer = setTimeout(() => {
      timer = null;
      !immediate && fn.apply(this, args);
    }, wait);
  };
}

export const THROTTLE_THRESHOLD = 500;
export function throttle<T extends ReturnVoidFn = ReturnVoidFn>(
  fn: T,
  wait: number
): (...args: ArgumentsType<T>) => void {
  let timer: NodeJS.Timeout | null = null;
  let startTime = Date.now();
  return function (this: unknown, ...args: ArgumentsType<T>) {
    const currentTime = Date.now();
    const remaining = wait - (currentTime - startTime);
    timer && clearTimeout(timer);
    if (remaining <= 0) {
      fn.apply(this, args);
      startTime = Date.now();
    } else {
      timer = setTimeout(() => fn.apply(this, args), remaining);
    }
  };
}

export function toFix(number: number, n = 2) {
  return number.toFixed(n);
}