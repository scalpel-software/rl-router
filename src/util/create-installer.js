import { default as matcherFactory } from '../util/create-matcher';
import validateRoutes from '../util/validate-routes';
import flattenRoutes from '../util/flatten-routes';

export default ({ reducer, middleware, enhancer }) => ({
  routes: nestedRoutes,
  history,
  location,
  createMatcher = matcherFactory
}) => {
  validateRoutes(nestedRoutes);
  const routes = flattenRoutes(nestedRoutes);
  const matchRoute = createMatcher(routes);

  return {
    reducer: reducer({
      routes,
      initialLocation: {
        ...location,
        ...matchRoute(location.pathname)
      }
    }),
    middleware: middleware({ history }),
    enhancer: enhancer({
      history,
      matchRoute,
      createMatcher
    })
  };
};
