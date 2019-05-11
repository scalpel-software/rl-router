function filterObject(target, predicate) {
  return Object.keys(target).reduce((acc, key) => {
    return predicate(key) ? { ...acc, [key]: target[key] } : acc;
  }, {});
}

function mapObject(target, transformKey, transformValue) {
  return Object.keys(target).reduce((acc, key) => {
    const newKey = transformKey ? transformKey(key) : key;
    const newValue = transformValue ? transformValue(target[key]) : target[key];

    return { ...acc, [newKey]: newValue };
  }, {});
}

function onlyRoutes(routes) {
  return filterObject(routes, (key) => {
    return key.indexOf('/') === 0;
  });
}

function withoutRoutes(routes) {
  return filterObject(routes, (key) => {
    return key.indexOf('/') !== 0;
  });
}

export default function flattenRoutes(routes, acc = {}) {
  Object.keys(routes).forEach(key => {
    const baseRoute = key === '/' ? '' : key;

    flattenRoutes(
      mapObject(
        onlyRoutes(routes[key]),
        routeKey => `${baseRoute}${routeKey}`,
        routeValue => ({
          ...routeValue,
          parent: {
            ...withoutRoutes(routes[key]),
            route: key
          }
        })
      ),
      acc
    );
  });

  return Object.assign(acc, mapObject(routes, null, withoutRoutes));
};
