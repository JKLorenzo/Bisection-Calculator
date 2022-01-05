import { ResultJSON } from "../utils/types.js";

export default class Result {
  x0: number;
  x1: number;
  x2: number;
  fx2: number;
  Ea: number | undefined;

  constructor(x0: number, x1: number, x2: number, fx2: number, Ea?: number) {
    this.x0 = x0;
    this.x1 = x1;
    this.x2 = x2;
    this.fx2 = fx2;
    this.Ea = Ea;
  }

  toJSON(): ResultJSON {
    return {
      x0: this.x0,
      x1: this.x1,
      x2: this.x2,
      fx2: this.fx2,
      Ea: this.Ea,
    };
  }
}
