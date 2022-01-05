import Bracket from "../structures/bracket.js";
import Result from "../structures/result.js";
import {
  BisectionResult,
  BracketFX,
  BracketResult,
  Options,
} from "../utils/types.js";
import solveFx from "./fx.js";
import { div, add, sub, round } from "./math.js";

function getPosibleBrackets(brackets: BracketFX[]): Bracket[] {
  const possibleBracketValues = [] as Bracket[];

  let x0: number | undefined = undefined;
  let x1: number | undefined = undefined;

  let tempX: number | undefined = undefined;

  // positive x0 - negative x1
  for (const bracket of brackets) {
    if (bracket.fx >= 0) {
      tempX = bracket.x;
      continue;
    }

    if (typeof tempX === "number" && bracket.fx < 0) {
      if (
        typeof x0 === "undefined" ||
        typeof x1 === "undefined" ||
        Math.abs(x0 - x1) >= Math.abs(tempX - bracket.x)
      ) {
        x0 = tempX;
        x1 = bracket.x;
        possibleBracketValues.push(new Bracket(x0, x1));
      }
    }
  }

  // Reset temp
  tempX = undefined;

  // negative - positive
  for (const bracket of brackets) {
    if (bracket.fx < 0) {
      tempX = bracket.x;
      continue;
    }

    if (typeof tempX === "number" && bracket.fx >= 0) {
      if (
        typeof x0 === "undefined" ||
        typeof x1 === "undefined" ||
        Math.abs(x0 - x1) >= Math.abs(tempX - bracket.x)
      ) {
        x0 = tempX;
        x1 = bracket.x;
        possibleBracketValues.push(new Bracket(x0, x1));
      }
    }
  }

  // Sort x0 in ascending order
  possibleBracketValues.sort((a, b) => a.x0 - b.x0);

  return possibleBracketValues;
}

export default function solveBisection(
  equation: string,
  options?: Options
): BisectionResult {
  // Set defaults
  const range = options?.range ?? 4;
  const places = options?.places ?? 4;
  const condition = options?.ea;

  // Solve FX Limit Values
  const fx_limit_values = [] as BracketFX[];
  const bracket_results = [] as BracketResult[];

  for (let x = -range; x <= range; x++) {
    const raw_fx = solveFx(equation, x);
    if (typeof raw_fx !== "number") continue;
    const fx = round(raw_fx, places);
    fx_limit_values.push({ x, fx });
  }

  const possible_brackets = getPosibleBrackets(fx_limit_values);

  if (possible_brackets.length === 0) {
    return { fx_limit_values, possible_brackets, bracket_results };
  }

  for (const bracket of possible_brackets) {
    const results = [] as Result[];

    let x0 = bracket.x0;
    let x1 = bracket.x1;
    let x2 = round(div(add(x0, x1), 2), places);
    let fx0 = solveFx(equation, x0);
    let fx1 = solveFx(equation, x1);
    let fx2 = round(solveFx(equation, x2), places);
    let ea: number | undefined;

    let current_result = new Result(x0, x1, x2, fx2);
    results.push(current_result);

    do {
      // Solve for the values
      fx0 = solveFx(equation, x0);
      fx1 = solveFx(equation, x1);

      if (fx2 > 0) {
        // Replace positive function limit value with x2
        fx0 > fx1 ? (x0 = x2) : (x1 = x2);
      } else {
        // Replace negative function limit value with x2
        fx0 < fx1 ? (x0 = x2) : (x1 = x2);
      }

      x2 = round(div(add(x0, x1), 2), places);
      fx2 = round(solveFx(equation, x2), places);
      ea = round(Math.abs(sub(current_result.x2, x2)), places);
      current_result = new Result(x0, x1, x2, fx2, ea);

      results.push(current_result);
    } while (
      typeof ea === "undefined" || typeof condition === "undefined"
        ? fx2 !== 0
        : !(condition.startsWith("<=")
            ? ea <= parseFloat(condition.substring(2))
            : ea < parseFloat(condition.substring(1)))
    );

    bracket_results.push({
      bracket: bracket.toJSON(),
      results: results.map((e) => e.toJSON()),
    });
  }

  return {
    fx_limit_values,
    possible_brackets: possible_brackets.map((e) => e.toJSON()),
    bracket_results,
  };
}
