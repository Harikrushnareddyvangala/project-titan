import type {
  PerformanceMeasurement,
} from "./performanceTypes";

export class PerformanceMonitor {

  private readonly startTimes =
    new Map<string, number>();

  start(
    name: string,
  ): void {

    this.startTimes.set(
      name,
      performance.now(),
    );

  }

  stop(
    name: string,
  ): PerformanceMeasurement {

    const startTime =
      this.startTimes.get(name);

    if (startTime === undefined) {

      throw new Error(
        `No active measurement found for "${name}".`,
      );

    }

    const endTime =
      performance.now();

    this.startTimes.delete(name);

    return {

      name,

      startTime,

      endTime,

      duration:
        endTime - startTime,

    };

  }

}