/**
 * Can be used to isolate an object or array so that the localization stop
 * recursing to add fallback values inside the object (or array)
 * @param {*} obj
 *
 * This function returns a proxy which should should be useable directly
 * like the object (or array) in most cases.
 *
 * The (unmodified) object (or array) can be retrieved from the return value
 * through its '_value' property.
 *
 * Example:
 *
 *       en: {
 *        language: 'english',
 *        ratings: stopRecursion({
 *          excellent: 'excellent',
 *          good: 'good',
 *          bad: 'bad',
 *       }),
 * .../...
 * 
 * The object can later be refered as `strings.ratings` (proxied) or 
 * `strings.ratings._value` (direct access)
 * 
 */

const stopRecursion = (obj) => {
  const handler = {
    getPrototypeOf(target) {
      return {};
    },
    get: (target, prop, receiver) => {
      if (prop === '_value') {
        return target.valueOf();
      }
      return target[prop];
    },
  };
  return new Proxy(obj, handler);
};

export default stopRecursion;
