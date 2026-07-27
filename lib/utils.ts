import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number with commas */
export function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

/** Clamp a value between min and max */
export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

/** Linear interpolation */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Map a value from one range to another */
export function mapRange(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}
