import { createBrowserHistory } from 'history';
import normalizeHref from '../util/normalize-href';
import install from '../install';

export const createBrowserRouter = (installer) => ({
  routes,
  basename,
  historyOptions = {},
  history = createBrowserHistory({ basename, ...historyOptions })
}) => {
  const {
    pathname: fullPathname,
    search,
    hash,
    state: { key, state } = {}
  } = history.location;

  // Strip the basename from the initial pathname
  const pathname =
    basename && fullPathname.indexOf(basename) === 0
      ? fullPathname.slice(basename.length)
      : fullPathname;

  const descriptor = basename
    ? { pathname, basename, search, hash, key, state }
    : { pathname, search, hash, key, state };

  const location = normalizeHref(descriptor);

  return installer({ routes, history, location });
};

export default createBrowserRouter(install);
