import { List, Map, fromJS } from './util/immutable';

import {
  LOCATION_CHANGED,
  REPLACE_ROUTES,
  DID_REPLACE_ROUTES,
  isNavigationActionWithPayload
} from '../types';

import { resolveLocation } from '../reducer';

const locationChangeReducer = (state, action) => {
  // No-op the initial route action
  const queue = state.get('queue', List());

  if (
    state.get('pathname') === action.payload.pathname &&
    state.get('search') === action.payload.search &&
    state.get('hash') === action.payload.hash &&
    !queue.size
  ) { return state; }

  const queuedLocation = queue.get(0, Map());
  const newQueue = queue.rest();

  // Extract the previous state, but dump the
  // previous state's previous state so that the
  // state tree doesn't keep growing indefinitely
  // eslint-disable-next-line no-unused-vars
  const oldLocation = state
    .withMutations(routerState => {
      routerState.delete('previous').delete('routes');
    })
    .toJS();
  const options = queuedLocation.get('options', Map()).toJS();
  const query = queuedLocation.get('query', Map()).toJS();
  const newLocation = { ...action.payload, query };

  const { newLocation: resolvedNewLocation } = resolveLocation({
    oldLocation,
    newLocation,
    options
  });

  return fromJS(resolvedNewLocation).merge({
    routes: state.get('routes', Map()),
    queue: newQueue
  });
};

export default ({ routes = {}, initialLocation } = {}) => (
  state = fromJS({ ...initialLocation, routes, queue: [] }),
  action
) => {
  if (isNavigationActionWithPayload(action)) {
    const payload = fromJS(action.payload);
    return state.update('queue', List(), queue => queue.push(payload));
  }

  if (action.type === REPLACE_ROUTES) {
    const { routes: currentRoutes, options } = action.payload;
    return state.withMutations(routerState => {
      routerState
        .set('routes', fromJS(currentRoutes))
        .set('options', fromJS(options));
    });
  }

  if (action.type === DID_REPLACE_ROUTES) {
    return state.set('options', Map());
  }

  if (action.type === LOCATION_CHANGED) {
    return locationChangeReducer(state, action);
  }

  return state;
};
