const ROUTE_FALLBACK = '@ROUTE_FALLBACK';

export class MatchCache {
  constructor() {
    this._data = {};
  }

  add(parentId, route) {
    this._data[parentId] = route || ROUTE_FALLBACK;
  }

  get(parentId) {
    return this._data[parentId] || null;
  }

  clear() {
    this._data = {};
  }
}

export default new MatchCache();
