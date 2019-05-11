import qs from 'query-string';

export default function mergeQueries(oldQuery, newQuery) {
  const mergedQuery = { ...oldQuery, ...newQuery };

  return {
    query: mergedQuery,
    search: `?${qs.stringify(mergedQuery)}`
  };
};
