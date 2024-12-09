export const defined = <T>(value?: T): value is T => {
  return value !== undefined;
}

export const notNullable = <T>(value?: T): value is T => {
  return value !== undefined && value !== null;
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
