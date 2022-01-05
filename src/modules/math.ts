import precision from "number-precision";
import { evaluate } from "mathjs";

precision.enableBoundaryChecking(false);

export function solve(equation: string): number {
  return evaluate(equation);
}

export function round(x: number, places: number): number {
  return precision.round(x, places);
}

export function add(x: number, y: number): number {
  return precision.plus(x, y);
}

export function sub(x: number, y: number): number {
  return precision.minus(x, y);
}

export function mult(x: number, y: number): number {
  return precision.times(x, y);
}

export function div(x: number, y: number): number {
  return precision.divide(x, y);
}
