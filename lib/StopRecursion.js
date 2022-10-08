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
      Object.keys(obj).forEach((key) => {
        t[key] = obj[key];
      });
    }
  }
  const prototype = { valueOf: () => obj };
  const properties = Object.keys(
    Object.getOwnPropertyDescriptors(obj.__proto__)
  );
  try { // Let's **try** to copy proxied versions of object's prototype properties
    properties.forEach((key) => {
      if (key === 'constructor' || key === 'valueOf') {
        return;
      }
      if (obj.__proto__[key] instanceof Function) {
        // If it's a function, apply the function on the fenced object 
        prototype[key] = function () {
          return obj.__proto__[key].apply(obj, arguments);
        };
      } else {
        // Otherwise, return the fenced object's property
        prototype[key] = obj.__proto__[key];
      }
    });
  } catch (error) {
    // For complex objects, this might raise an error...
    // In that case, just pass, we're just doing our best and the proxied object 
    // is available though valueOf().
  }
  const fence = new Fence(obj);
  Object.setPrototypeOf(fence, prototype);
  Object.preventExtensions(fence);
  return fence;
};

export default stopRecursion;
