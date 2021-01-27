import {
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  BLOCK,
  UNBLOCK,
  isNavigationAction
} from './types';

import mergeQueries from './util/merge-queries';

let unblock = null;

const navigate = (history, action) => {
  switch (action.type) {
    case PUSH:
      history.push(action.payload);
      break;
    case REPLACE:
      history.replace(action.payload);
      break;
    case GO:
      history.go(action.payload);
      break;
    case GO_BACK:
      history.back();
      break;
    case GO_FORWARD:
      history.forward();
      break;
    case BLOCK:
      unblock = history.block(action.payload);
      break;
    case UNBLOCK:
      if (unblock) {
        unblock();
      }
      break;
    default:
      break;
  }
};

export const handleNavigationAction = ({
  next,
  action,
  history,
  query
}) => {
  // Synchronously dispatch the original action so that the
  // reducer can add it to its location queue
  const originalDispatch = next(action);

  if (
    (action.type === PUSH || action.type === REPLACE) &&
    action.payload.options &&
    action.payload.options.persistQuery
  ) {
    navigate(history, {
      type: action.type,
      payload: {
        ...action.payload,
        ...mergeQueries(query, action.payload.query)
      }
    });
  } else {
    navigate(history, action);
  }

  return originalDispatch;
};

export default ({ history }) => ({ getState }) => (next) => (action) => {
  const { query } = getState().router;
  return isNavigationAction(action)
    ? handleNavigationAction({ next, action, history, query })
    : next(action);
};
