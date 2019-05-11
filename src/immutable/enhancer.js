import { subscribeToStoreAndHistory } from '../enhancer';

export default ({ history, matchRoute, createMatcher }) => (createStore) => (
  userReducer,
  initialState,
  enhancer
) => {
  const store = createStore(userReducer, initialState, enhancer);
  const { dispatch, subscribe: subscribeToStore } = store;
  const { listen: subscribeToHistory } = history;

  const getState = () => {
    const routerState = store.getState().get('router');

    return {
      routes: routerState.get('routes'),
      pathname: routerState.get('pathname'),
      search: routerState.get('search'),
      hash: routerState.get('hash'),
      updateRoutes: routerState.getIn(['options', 'updateRoutes'])
    };
  };

  subscribeToStoreAndHistory({
    getState,
    dispatch,
    createMatcher,
    matchRoute,
    subscribeToStore,
    subscribeToHistory
  });

  return { ...store, matchRoute };
};
