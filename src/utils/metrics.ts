/** Simple timer utility for tracking operation durations */

export class Timer {
  readonly label: string;
  readonly startTime: number;

  constructor(label: string) {
    this.label = label;
    this.startTime = Date.now();
  }

  /** Stop timer and return elapsed time in milliseconds */
  stop(): number {
    return Date.now() - this.startTime;
  }

  /** Get elapsed time without stopping */
  elapsed(): number {
    return Date.now() - this.startTime;
  }
}
