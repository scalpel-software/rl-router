import { createMemoryHistory } from 'history';
import normalizeHref from '../util/normalize-href';
import install from '../install';

const locationForRequest = request => {
  const { path: pathname, baseUrl: basename, query } = request;

  const descriptor = basename
    ? { pathname, basename, query }
    : { pathname, query };

  return normalizeHref(descriptor);
};

export const createExpressRouter = (installer) => ({
  routes,
  request,
  historyOptions = {}
}) => {
  const history = createMemoryHistory(historyOptions);
  const location = locationForRequest(request);

  return installer({ routes, history, location });
};

export default createExpressRouter(install);
