import { BracketJSON } from "../utils/types.js";

export default class Bracket {
  private _x0: number;
  private _x1: number;

  constructor(x0: number, x1: number) {
    this._x0 = x0;
    this._x1 = x1;
  }

  get x0() {
    return this._x0;
  }

  get x1() {
    return this._x1;
  }

  toJSON(): BracketJSON {
    return {
      x0: this.x0,
      x1: this.x1,
    };
  }
}