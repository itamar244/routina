export function groupBy<T, K extends string>(
  arr: T[],
  selector: (value: T) => K,
): Record<K, T[]> {
  const object: Record<K, T[]> = {} as any;

  for (const item of arr) {
    const key = selector(item);
    const group: T[] = object[key] ?? [];
    if (!(key in object)) {
      object[key] = group;
    }

    group.push(item);
  }

  return object;
}

export function keyBy<T, K extends string>(
  arr: T[],
  selector: (value: T) => K,
): Record<K, T> {
  const object: Record<K, T> = {} as any;

  for (const item of arr) {
    const key = selector(item);
    object[key] = item;
  }

  return object;
}

export function mapValues<K extends string, V, U>(
  obj: Record<K, V>,
  mapper: (value: V) => U,
): Record<K, U> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, mapper(value as V)]),
  ) as Record<K, U>;
}
