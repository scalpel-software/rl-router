import {
  StoreCreator,
  Reducer,
  StoreEnhancer,
  Dispatch,
  Store
} from 'redux';

import { History, Action, Location as HistoryLocation } from 'history';

import { State, POP } from './types';

import qs from 'query-string';

import { locationDidChange, didReplaceRoutes, replace } from './actions';

import matchCache from './util/match-cache';

export const createStoreSubscriber = (getState, dispatch, createMatcher) => (currentMatcher) => {
  const { routes, pathname, search, hash, updateRoutes } = getState();

  if (updateRoutes) {
    currentMatcher = createMatcher(routes);
    dispatch(didReplaceRoutes());
    dispatch(replace({ pathname, search, hash }));
  }

  return currentMatcher;
};

export const createHistoryListener = (dispatch) => (
  currentMatcher,
  location,
  action
) => {
  matchCache.clear();

  const match = currentMatcher(location.pathname);
  const payload = {
    ...location,
    ...match,
    query: qs.parse(location.search || '')
  };

  // Other actions come from the user, so they already have a
  // corresponding queued navigation action.
  if (action === 'POP') {
    dispatch({
      type: POP,
      payload
    });
  }

  dispatch(locationDidChange(payload));
};

export const subscribeToStoreAndHistory = ({
  getState,
  dispatch,
  createMatcher,
  matchRoute,
  subscribeToStore,
  subscribeToHistory
}) => {
  const storeSubscriber = createStoreSubscriber(
    getState,
    dispatch,
    createMatcher
  );
  const historyListener = createHistoryListener(dispatch);

  let currentMatcher = matchRoute;

  // Replace the matcher when replacing routes
  subscribeToStore(() => {
    currentMatcher = storeSubscriber(currentMatcher);
  });

  subscribeToHistory(({location, action}) =>
    historyListener(currentMatcher, location, action)
  );
};

export default ({ history, matchRoute, createMatcher }) => (
  createStore
) => (
  userReducer,
  initialState,
  enhancer
) => {
  const store = createStore(userReducer, initialState, enhancer);
  const { dispatch, subscribe: subscribeToStore } = store;
  const { listen: subscribeToHistory } = history;

  const getState = () => {
    const routerState = store.getState().router;
    const { options: { updateRoutes } = {} } = routerState;
    return { ...routerState, updateRoutes };
  };

  subscribeToStoreAndHistory({
    getState,
    dispatch,
    createMatcher,
    matchRoute,
    subscribeToStore,
    subscribeToHistory
  });

  return {
    ...store,
    matchRoute
  };
};
