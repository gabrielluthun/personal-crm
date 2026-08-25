export type IsoDateTime = string & {
  readonly __isoDateTime: true;
};

export type Timestamps = {
  readonly createdAt: IsoDateTime;
  readonly updatedAt: IsoDateTime;
};

export function toIsoDateTime(date: Date = new Date()): IsoDateTime {
  return date.toISOString() as IsoDateTime;
}

export function createTimestamps(now: Date = new Date()): Timestamps {
  const iso = toIsoDateTime(now);
  return {
    createdAt: iso,
    updatedAt: iso,
  };
}

export function touchUpdatedAt(
  timestamps: Timestamps,
  now: Date = new Date(),
): Timestamps {
  return {
    createdAt: timestamps.createdAt,
    updatedAt: toIsoDateTime(now),
  };
}
