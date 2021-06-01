/**
 * returns a copy of its argument -- if the argument is an array or map
 * @param arg
 * @param def -- a default map if none is provided
 * @returns {Map<K, V>|Map<any, any>}
 */
export function m(arg, def) {
  if (arg instanceof Map || (Array.isArray(arg) && (arg.length === 0 || Array.isArray(arg[0])))) {
    return new Map(arg);
  }
  if (def) {
    return m(def);
  }
  return new Map;
}

/**
 * is a non-null object
 * @param arg
 * @returns {boolean}
 */
export function io(arg) {
  return arg && (typeof arg === 'object');
}

export function p(arg, def) {
  if (io(arg)) {
    return { ...arg };
  }
  if (def) {
    return p(def);
  }
  return {};
}

/**
 * returns a map from the first parameter; if any other parameters are maps,
 * -- AND -- they have not been set, they are added to the returned map.
 * put another way -- any subsequent parameters provide defaults for unset map keys.
 *
 * @param maps
 * @returns {Map<K, V>|Map<*, *>}
 */
export function mm(...maps) {
  const out = m(maps.shift());
  while (maps.length) {
    const def = m(maps.shift());
    def.forEach((value, key) => {
      if (!out.has(key)) {
        out.set(key, value);
      }
    });
  }
  return out;
}

/**
 * returns either the "name" or "key" property of an object.
 * @param obj {Object}
 * @param throwIfBad {boolean} a flag to throw if the value is a "stupid name";
 * @returns {*}
 */
export function kn(obj, throwIfBad = false) {
  if (throwIfBad) {
    const k = kn(obj);
    if (['', 0, null].includes(k)) {
      throw new Error('invalid key');
    }
    return k;
  }
  if (!(io(obj))) {
    throw new Error('kn requires object');
  }
  if ('key' in obj) {
    return obj.key;
  }
  return obj.name;
}
