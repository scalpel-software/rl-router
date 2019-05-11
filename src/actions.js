import { BlockCallback } from 'history';
import { Location, LocationOptions, Href } from './types';

import {
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  BLOCK,
  UNBLOCK,
  LOCATION_CHANGED,
  REPLACE_ROUTES,
  DID_REPLACE_ROUTES
} from './types';

import normalizeHref from './util/normalize-href';
import flattenRoutes from './util/flatten-routes';

export function push(href, options = {}) {
  return {
    type: PUSH,
    payload: { ...normalizeHref(href), options }
  }
}

export function replace(href, options = {}) {
  return {
    type: REPLACE,
    payload: { ...normalizeHref(href), options }
  }
}

export function go(index) {
  return {
    type: GO,
    payload: index
  }
}

export function goBack() {
  return { type: GO_BACK }
}

export function goForward() {
  return { type: GO_FORWARD }
}

export function block(historyShouldBlock) {
  return {
    type: BLOCK,
    payload: historyShouldBlock
  }
}

export function unblock() {
  return { type: UNBLOCK }
}

export function locationDidChange(location) {
  return {
    type: LOCATION_CHANGED,
    payload: location
  }
}

export function initializeCurrentLocation(location) {
  return {
    type: LOCATION_CHANGED,
    payload: location
  }
}

export function replaceRoutes(routes) {
  return {
    type: REPLACE_ROUTES,
    payload: {
      routes: flattenRoutes(routes),
      options: {
        updateRoutes: true
      }
    }
  }
}

export function didReplaceRoutes() {
  return { type: DID_REPLACE_ROUTES }
}
