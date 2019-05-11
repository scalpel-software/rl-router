import { createHashHistory } from 'history';
import normalizeHref from '../util/normalize-href';
import install from '../install';

export const createHashRouter = (installer) => ({
  routes,
  basename,
  hashType = 'slash',
  historyOptions,
  history = createHashHistory({ basename, hashType, ...historyOptions })
}) => {
  const descriptor = basename
    ? { basename, ...history.location }
    : history.location;

  const location = normalizeHref(descriptor);

  return installer({ routes, history, location });
};

export default createHashRouter(install);
