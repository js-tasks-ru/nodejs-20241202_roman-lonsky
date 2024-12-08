
export const defined = <T>(value: T) => {
  return value !== undefined;
}

export const hasFilter = <T>(query: T[]) => {
  return query.some(defined);
}

export const getPage = (page: number, limit: number) => {
    const start = page * limit;
    const end = start + limit;

    return [start, end]
}
