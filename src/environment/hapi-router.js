import { createMemoryHistory } from 'history';
import normalizeHref from '../util/normalize-href';
import install from '../install';

export const createHapiRouter = (installer) => ({
  routes,
  request,
  historyOptions = {}
}) => {
  const history = createMemoryHistory(historyOptions);

  const location = normalizeHref({
    pathname: request.path,
    query: request.query
  });

  return installer({ routes, history, location });
};

export default createHapiRouter(install);
