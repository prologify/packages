import { BehaviorSubject, Observable } from 'rxjs';
import { Curve } from './curve';
import { map, tap } from 'rxjs/operators';

export interface Plus<T> {
  plus(t: T): T;
}

export interface Minus<T> {
  minus(t: T): T;
}

export interface Multiply<T> {
  multiply(i: number): T;
}

export interface MathObject<T> extends Plus<T>, Minus<T>, Multiply<T> {
}

export abstract class Animation<T> {
  abstract get onChange(): Observable<T>;

  abstract get value(): T;
}

export class CurveAnimation extends Animation<number> {
  constructor(public parent: Animation<number>, public curve: Curve) {
    super();
  }

  private _value: number;

  get value(): number {
    return this._value;
  }

  get onChange(): Observable<number> {
    return this.parent.onChange.pipe(
      map(i => this.curve.transform(i >= 0 ? i <= 1 ? i : 1 : 0)),
      tap(i => this._value = i)
    );
  }
}

export class ObjectAnimation<T extends MathObject<T>> extends Animation<T> {
  constructor(public begin: T, public end: T, public parent: Animation<number>) {
    super();
  }

  private _value: T;

  get value(): T {
    return this._value;
  }

  get onChange(): Observable<T> {
    return this.parent.onChange.pipe(
      map(index => this.begin.plus(this.end.minus(this.begin).multiply(index))),
      tap(graph => this._value = graph)
    );
  }
}

export class AnimationController extends Animation<number> {
  private readonly begin: number;
  private readonly end: number;
  private readonly duration: number;
  private readonly _onChange: BehaviorSubject<number>;

  constructor({ begin = 0, end = 1, duration }: { begin?: number; end?: number; duration: number }) {
    super();
    this.begin = begin;
    this.end = end;
    this.duration = duration;
    this._value = begin;
    this._onChange = new BehaviorSubject<number>(this.begin);
  }

  public get onChange(): Observable<number> {
    return this._onChange.asObservable();
  };

  private _value;

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this._onChange.next(this._value);
  }

  public forward() {
    return new Promise((resolve) =>
      this._animate((i) => this.value = (this.end - this.begin) * i, resolve));
  }

  public reverse() {
    return new Promise((resolve) =>
      this._animate((i) => this.value = this.end - (this.end - this.begin) * i, resolve));
  }

  public reset() {
    this.value = 0;
  }

  public repeat() {
    this.value = 0;
    return this.forward();
  }

  private _animate(onChange: (i: number) => any, resolve: () => any) {
    const start = performance.now();
    const { duration } = this;

    requestAnimationFrame(function animate(time) {
      let timePassed = time - start;
      if (timePassed > duration) timePassed = duration;
      onChange(timePassed / duration);
      if (timePassed < duration) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    });
  }
}
