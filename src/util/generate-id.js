/**
 * Returns a psuedo-unique identifier used by fragments
 * to track match status within MatchCache.
 * @returns {String} id
 */
export default function generateId() {
  return (Math.random() * Date.now()).toString(16).slice(0, 8);
};
