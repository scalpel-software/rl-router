export const LOCATION_CHANGED = 'ROUTER_LOCATION_CHANGED';
export const PUSH = 'ROUTER_PUSH';
export const REPLACE = 'ROUTER_REPLACE';
export const GO = 'ROUTER_GO';
export const GO_BACK = 'ROUTER_GO_BACK';
export const GO_FORWARD = 'ROUTER_GO_FORWARD';
export const POP = 'ROUTER_POP';
export const BLOCK = 'ROUTER_BLOCK';
export const UNBLOCK = 'ROUTER_UNBLOCK';
export const REPLACE_ROUTES = 'ROUTER_REPLACE_ROUTES';
export const DID_REPLACE_ROUTES = 'ROUTER_DID_REPLACE_ROUTES';

const actionsWithPayload = [PUSH, REPLACE, GO, POP];
const actions = [
  ...actionsWithPayload,
  GO_FORWARD,
  GO_BACK,
  POP,
  BLOCK,
  UNBLOCK
];

export function isNavigationAction(action) {
  return actions.indexOf(action.type) !== -1;
}

export function isNavigationActionWithPayload(action) {
  return actionsWithPayload.indexOf(action.type) !== -1;
}
