export const defined = <T>(value: T) => {
  return value !== undefined;
}

export const hasFilter = <T>(query: T[]) => {
  return query.some(defined);
}

const ZERO_OFFSET = 1;

export const getPage = (page: number, limit: number) => {
    const start = (page - ZERO_OFFSET) * limit;
    const end = start + limit;

    return [start, end]
}
