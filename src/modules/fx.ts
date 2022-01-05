import { solve } from "./math.js";

const OPERATOR = RegExp(/\(|\)|\^|\*|\/|\+|\-/);

/** Inserts the value of x to the equation. */
export default function solveFx(equation: string, x: number): number {
  const fx = equation
    .split("")
    .map((value, index, array) => {
      // Return if not x
      if (value !== "x") return value;
      // Check if index - 1 is not out of array bounds
      if (index - 1 < 0) return value;
      // Check if index - 1 is not an operator
      if (OPERATOR.test(array[index - 1])) return value;
      // Add multiplication operand prefix to the value
      return `(${value})`;
    })
    .join("")
    .replaceAll("x", x.toString());

  return solve(fx);
}
