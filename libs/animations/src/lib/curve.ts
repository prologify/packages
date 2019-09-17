export abstract class Curve {
  public abstract transform(t: number): number;
}

export class Cubic extends Curve {
  public static ease = new Cubic(0.25, 0.1, 0.25, 1.0);
  public static easeIn = new Cubic(0.42, 0.0, 1.0, 1.0);
  public static easeOut = new Cubic(0.0, 0.0, 0.58, 1.0);
  public static easeInOut = new Cubic(0.42, 0.0, 0.58, 1.0);

  constructor(public a: number,
              public b: number,
              public c: number,
              public d: number) {
    super();
  }

  public transform(t: number) {
    let start = 0.0;
    let end = 1.0;
    while (true) {
      const midpoint = (start + end) / 2;
      const estimate = this._evaluateCubic(this.a, this.c, midpoint);
      if (Math.abs(t - estimate) < 0.001)
        return this._evaluateCubic(this.b, this.d, midpoint);
      if (estimate < t)
        start = midpoint;
      else
        end = midpoint;
    }
  }

  private _evaluateCubic(a: number, b: number, m: number) {
    return 3 * a * (1 - m) * (1 - m) * m +
      3 * b * (1 - m) * m * m +
      m * m * m;
  }
}
