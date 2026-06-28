export function throttle<T extends (...args: unknown[]) => void>(
  fn: T,
  limit: number,
) {
  let waiting = false;

  return (...args: Parameters<T>) => {
    if (waiting) return;

    fn(...args);

    waiting = true;

    setTimeout(() => {
      waiting = false;
    }, limit);
  };
}