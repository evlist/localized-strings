/**
 * Can be used to isolate an object or array so that the localization stop
 * recursing to add fallback values inside the object (or array)
 * @param {*} obj
 *
 * This function returns a "Fence" object which should should be useable directly
 * like the object (or array) in many cases: this object has all the properties
 * of the original one. Its valueOf() method is overriden to return the original
 * object or array.
 *
 * Note that the mechanism is less transparent for arrays than for objects: for
 * arrays, the Fence object is not an array but an object using the array indexes
 * as keys. While this is transparent to access arrays members by their indexes
 * (array[0] for instance), the methods specific to arrays can't be used on this
 * object.
 *
 * The (unmodified) object (or array) can be retrieved from the return value
 * through its 'valueOf()' function.
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
 * The object can later be refered as `strings.ratings` (fenced) or
 * `strings.ratings.valueOf()` (direct access)
 *
 */

const stopRecursion = (obj) => {
  class Fence {
    constructor(obj) {
      const t = this;
      Object.keys(obj).forEach(function (key) {
        t[key] = obj[key];
      });
    }
  }
  Fence.prototype.valueOf = () => obj;
  const fence = new Fence(obj);
  Object.preventExtensions(fence);
  return fence;
};

export default stopRecursion;
