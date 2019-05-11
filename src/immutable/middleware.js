import { isNavigationAction } from '../types';
import { handleNavigationAction } from '../middleware';

export default ({ history }) => ({ getState }) => (next) => (action) => {
  const query = getState().getIn(['router', 'query']);

  return isNavigationAction(action)
    ? handleNavigationAction({
        next,
        action,
        history,
        query: query && query.toJS()
      })
    : next(action);
};
