(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@wonderlandlabs/looking-glass-engine')) :
    typeof define === 'function' && define.amd ? define(['@wonderlandlabs/looking-glass-engine'], factory) :
    (global = global || self, global.LGE = factory(global.lookingGlassEngine));
}(this, (function (lookingGlassEngine) { 'use strict';

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    var _freeGlobal = freeGlobal;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = _freeGlobal || freeSelf || Function('return this')();

    var _root = root;

    /** Built-in value references. */
    var Symbol$1 = _root.Symbol;

    var _Symbol = Symbol$1;

    /** Used for built-in method references. */
    var objectProto = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString = objectProto.toString;

    /** Built-in value references. */
    var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

    /**
     * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the raw `toStringTag`.
     */
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag),
          tag = value[symToStringTag];

      try {
        value[symToStringTag] = undefined;
        var unmasked = true;
      } catch (e) {}

      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }

    var _getRawTag = getRawTag;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var nativeObjectToString$1 = objectProto$1.toString;

    /**
     * Converts `value` to a string using `Object.prototype.toString`.
     *
     * @private
     * @param {*} value The value to convert.
     * @returns {string} Returns the converted string.
     */
    function objectToString(value) {
      return nativeObjectToString$1.call(value);
    }

    var _objectToString = objectToString;

    /** `Object#toString` result references. */
    var nullTag = '[object Null]',
        undefinedTag = '[object Undefined]';

    /** Built-in value references. */
    var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

    /**
     * The base implementation of `getTag` without fallbacks for buggy environments.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    function baseGetTag(value) {
      if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
      }
      return (symToStringTag$1 && symToStringTag$1 in Object(value))
        ? _getRawTag(value)
        : _objectToString(value);
    }

    var _baseGetTag = baseGetTag;

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == 'object' || type == 'function');
    }

    var isObject_1 = isObject;

    /** `Object#toString` result references. */
    var asyncTag = '[object AsyncFunction]',
        funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]',
        proxyTag = '[object Proxy]';

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      if (!isObject_1(value)) {
        return false;
      }
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 9 which returns 'object' for typed arrays and other constructors.
      var tag = _baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }

    var isFunction_1 = isFunction;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = _root['__core-js_shared__'];

    var _coreJsData = coreJsData;

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    var _isMasked = isMasked;

    /** Used for built-in method references. */
    var funcProto = Function.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to convert.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    var _toSource = toSource;

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Used for built-in method references. */
    var funcProto$1 = Function.prototype,
        objectProto$2 = Object.prototype;

    /** Used to resolve the decompiled source of functions. */
    var funcToString$1 = funcProto$1.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject_1(value) || _isMasked(value)) {
        return false;
      }
      var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
      return pattern.test(_toSource(value));
    }

    var _baseIsNative = baseIsNative;

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    var _getValue = getValue;

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = _getValue(object, key);
      return _baseIsNative(value) ? value : undefined;
    }

    var _getNative = getNative;

    /* Built-in method references that are verified to be native. */
    var Map$1 = _getNative(_root, 'Map');

    var _Map = Map$1;

    /* Built-in method references that are verified to be native. */
    var nativeCreate = _getNative(Object, 'create');

    var defineProperty = (function() {
      try {
        var func = _getNative(Object, 'defineProperty');
        func({}, '', {});
        return func;
      } catch (e) {}
    }());

    /**
     * Checks if `value` is object-like. A value is object-like if it's not `null`
     * and has a `typeof` result of "object".
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
     * @example
     *
     * _.isObjectLike({});
     * // => true
     *
     * _.isObjectLike([1, 2, 3]);
     * // => true
     *
     * _.isObjectLike(_.noop);
     * // => false
     *
     * _.isObjectLike(null);
     * // => false
     */
    function isObjectLike(value) {
      return value != null && typeof value == 'object';
    }

    var isObjectLike_1 = isObjectLike;

    /** `Object#toString` result references. */
    var argsTag = '[object Arguments]';

    /**
     * The base implementation of `_.isArguments`.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     */
    function baseIsArguments(value) {
      return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
    }

    var _baseIsArguments = baseIsArguments;

    /** Used for built-in method references. */
    var objectProto$3 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

    /** Built-in value references. */
    var propertyIsEnumerable = objectProto$3.propertyIsEnumerable;

    /**
     * Checks if `value` is likely an `arguments` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an `arguments` object,
     *  else `false`.
     * @example
     *
     * _.isArguments(function() { return arguments; }());
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
      return isObjectLike_1(value) && hasOwnProperty$2.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee');
    };

    /**
     * This method returns `false`.
     *
     * @static
     * @memberOf _
     * @since 4.13.0
     * @category Util
     * @returns {boolean} Returns `false`.
     * @example
     *
     * _.times(2, _.stubFalse);
     * // => [false, false]
     */
    function stubFalse() {
      return false;
    }

    var stubFalse_1 = stubFalse;

    var isBuffer_1 = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports =  exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? _root.Buffer : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse_1;

    module.exports = isBuffer;
    });

    var _nodeUtil = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports =  exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && _freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        // Use `util.types` for Node.js 10+.
        var types = freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        }

        // Legacy `process.binding('util')` for Node.js < 10.
        return freeProcess && freeProcess.binding && freeProcess.binding('util');
      } catch (e) {}
    }());

    module.exports = nodeUtil;
    });

    /* Node.js helper references. */
    var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

    var _cloneBuffer = createCommonjsModule(function (module, exports) {
    /** Detect free variable `exports`. */
    var freeExports =  exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? _root.Buffer : undefined,
        allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

    /**
     * Creates a clone of  `buffer`.
     *
     * @private
     * @param {Buffer} buffer The buffer to clone.
     * @param {boolean} [isDeep] Specify a deep clone.
     * @returns {Buffer} Returns the cloned buffer.
     */
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length,
          result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

      buffer.copy(result);
      return result;
    }

    module.exports = cloneBuffer;
    });

    /* Built-in method references that are verified to be native. */
    var DataView = _getNative(_root, 'DataView');

    var _DataView = DataView;

    /* Built-in method references that are verified to be native. */
    var Promise$1 = _getNative(_root, 'Promise');

    var _Promise = Promise$1;

    /* Built-in method references that are verified to be native. */
    var Set$1 = _getNative(_root, 'Set');

    var _Set = Set$1;

    /* Built-in method references that are verified to be native. */
    var WeakMap = _getNative(_root, 'WeakMap');

    var _WeakMap = WeakMap;

    /** `Object#toString` result references. */
    var mapTag = '[object Map]',
        objectTag = '[object Object]',
        promiseTag = '[object Promise]',
        setTag = '[object Set]',
        weakMapTag = '[object WeakMap]';

    var dataViewTag = '[object DataView]';

    /** Used to detect maps, sets, and weakmaps. */
    var dataViewCtorString = _toSource(_DataView),
        mapCtorString = _toSource(_Map),
        promiseCtorString = _toSource(_Promise),
        setCtorString = _toSource(_Set),
        weakMapCtorString = _toSource(_WeakMap);

    /**
     * Gets the `toStringTag` of `value`.
     *
     * @private
     * @param {*} value The value to query.
     * @returns {string} Returns the `toStringTag`.
     */
    var getTag = _baseGetTag;

    // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
    if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag) ||
        (_Map && getTag(new _Map) != mapTag) ||
        (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
        (_Set && getTag(new _Set) != setTag) ||
        (_WeakMap && getTag(new _WeakMap) != weakMapTag)) {
      getTag = function(value) {
        var result = _baseGetTag(value),
            Ctor = result == objectTag ? value.constructor : undefined,
            ctorString = Ctor ? _toSource(Ctor) : '';

        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString: return dataViewTag;
            case mapCtorString: return mapTag;
            case promiseCtorString: return promiseTag;
            case setCtorString: return setTag;
            case weakMapCtorString: return weakMapTag;
          }
        }
        return result;
      };
    }

    /** Built-in value references. */
    var Uint8Array = _root.Uint8Array;

    /** Used to convert symbols to primitives and strings. */
    var symbolProto = _Symbol ? _Symbol.prototype : undefined,
        symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

    /* Node.js helper references. */
    var nodeIsMap = _nodeUtil && _nodeUtil.isMap;

    /* Node.js helper references. */
    var nodeIsSet = _nodeUtil && _nodeUtil.isSet;

    function n(n){for(var r=arguments.length,t=Array(r>1?r-1:0),e=1;e<r;e++)t[e-1]=arguments[e];if("production"!==process.env.NODE_ENV){var i=Y[n],o=i?"function"==typeof i?i.apply(null,t):i:"unknown error nr: "+n;throw Error("[Immer] "+o)}throw Error("[Immer] minified error nr: "+n+(t.length?" "+t.map((function(n){return "'"+n+"'"})).join(","):"")+". Find the full error at: https://bit.ly/3cXEKWf")}function r(n){return !!n&&!!n[Q]}function t(n){return !!n&&(function(n){if(!n||"object"!=typeof n)return !1;var r=Object.getPrototypeOf(n);if(null===r)return !0;var t=Object.hasOwnProperty.call(r,"constructor")&&r.constructor;return "function"==typeof t&&Function.toString.call(t)===Z}(n)||Array.isArray(n)||!!n[L]||!!n.constructor[L]||s(n)||v(n))}function i(n,r,t){void 0===t&&(t=!1),0===o(n)?(t?Object.keys:nn)(n).forEach((function(e){t&&"symbol"==typeof e||r(e,n[e],n);})):n.forEach((function(t,e){return r(e,t,n)}));}function o(n){var r=n[Q];return r?r.i>3?r.i-4:r.i:Array.isArray(n)?1:s(n)?2:v(n)?3:0}function u(n,r){return 2===o(n)?n.has(r):Object.prototype.hasOwnProperty.call(n,r)}function a(n,r){return 2===o(n)?n.get(r):n[r]}function f(n,r,t){var e=o(n);2===e?n.set(r,t):3===e?(n.delete(r),n.add(t)):n[r]=t;}function c(n,r){return n===r?0!==n||1/n==1/r:n!=n&&r!=r}function s(n){return X&&n instanceof Map}function v(n){return q&&n instanceof Set}function p(n){return n.o||n.t}function l(n){if(Array.isArray(n))return Array.prototype.slice.call(n);var r=rn(n);delete r[Q];for(var t=nn(r),e=0;e<t.length;e++){var i=t[e],o=r[i];!1===o.writable&&(o.writable=!0,o.configurable=!0),(o.get||o.set)&&(r[i]={configurable:!0,writable:!0,enumerable:o.enumerable,value:n[i]});}return Object.create(Object.getPrototypeOf(n),r)}function d(n,e){return void 0===e&&(e=!1),y(n)||r(n)||!t(n)?n:(o(n)>1&&(n.set=n.add=n.clear=n.delete=h),Object.freeze(n),e&&i(n,(function(n,r){return d(r,!0)}),!0),n)}function h(){n(2);}function y(n){return null==n||"object"!=typeof n||Object.isFrozen(n)}function b(r){var t=tn[r];return t||n(18,r),t}function _(){return "production"===process.env.NODE_ENV||U||n(0),U}function j(n,r){r&&(b("Patches"),n.u=[],n.s=[],n.v=r);}function g(n){O(n),n.p.forEach(S),n.p=null;}function O(n){n===U&&(U=n.l);}function w(n){return U={p:[],l:U,h:n,m:!0,_:0}}function S(n){var r=n[Q];0===r.i||1===r.i?r.j():r.g=!0;}function P(r,e){e._=e.p.length;var i=e.p[0],o=void 0!==r&&r!==i;return e.h.O||b("ES5").S(e,r,o),o?(i[Q].P&&(g(e),n(4)),t(r)&&(r=M(e,r),e.l||x(e,r)),e.u&&b("Patches").M(i[Q],r,e.u,e.s)):r=M(e,i,[]),g(e),e.u&&e.v(e.u,e.s),r!==H?r:void 0}function M(n,r,t){if(y(r))return r;var e=r[Q];if(!e)return i(r,(function(i,o){return A(n,e,r,i,o,t)}),!0),r;if(e.A!==n)return r;if(!e.P)return x(n,e.t,!0),e.t;if(!e.I){e.I=!0,e.A._--;var o=4===e.i||5===e.i?e.o=l(e.k):e.o;i(3===e.i?new Set(o):o,(function(r,i){return A(n,e,o,r,i,t)})),x(n,o,!1),t&&n.u&&b("Patches").R(e,t,n.u,n.s);}return e.o}function A(e,i,o,a,c,s){if("production"!==process.env.NODE_ENV&&c===o&&n(5),r(c)){var v=M(e,c,s&&i&&3!==i.i&&!u(i.D,a)?s.concat(a):void 0);if(f(o,a,v),!r(v))return;e.m=!1;}if(t(c)&&!y(c)){if(!e.h.F&&e._<1)return;M(e,c),i&&i.A.l||x(e,c);}}function x(n,r,t){void 0===t&&(t=!1),n.h.F&&n.m&&d(r,t);}function z(n,r){var t=n[Q];return (t?p(t):n)[r]}function I(n,r){if(r in n)for(var t=Object.getPrototypeOf(n);t;){var e=Object.getOwnPropertyDescriptor(t,r);if(e)return e;t=Object.getPrototypeOf(t);}}function k(n){n.P||(n.P=!0,n.l&&k(n.l));}function E(n){n.o||(n.o=l(n.t));}function R(n,r,t){var e=s(r)?b("MapSet").N(r,t):v(r)?b("MapSet").T(r,t):n.O?function(n,r){var t=Array.isArray(n),e={i:t?1:0,A:r?r.A:_(),P:!1,I:!1,D:{},l:r,t:n,k:null,o:null,j:null,C:!1},i=e,o=en;t&&(i=[e],o=on);var u=Proxy.revocable(i,o),a=u.revoke,f=u.proxy;return e.k=f,e.j=a,f}(r,t):b("ES5").J(r,t);return (t?t.A:_()).p.push(e),e}function D(e){return r(e)||n(22,e),function n(r){if(!t(r))return r;var e,u=r[Q],c=o(r);if(u){if(!u.P&&(u.i<4||!b("ES5").K(u)))return u.t;u.I=!0,e=F(r,c),u.I=!1;}else e=F(r,c);return i(e,(function(r,t){u&&a(u.t,r)===t||f(e,r,n(t));})),3===c?new Set(e):e}(e)}function F(n,r){switch(r){case 2:return new Map(n);case 3:return Array.from(n)}return l(n)}var G,U,W="undefined"!=typeof Symbol&&"symbol"==typeof Symbol("x"),X="undefined"!=typeof Map,q="undefined"!=typeof Set,B="undefined"!=typeof Proxy&&void 0!==Proxy.revocable&&"undefined"!=typeof Reflect,H=W?Symbol.for("immer-nothing"):((G={})["immer-nothing"]=!0,G),L=W?Symbol.for("immer-draftable"):"__$immer_draftable",Q=W?Symbol.for("immer-state"):"__$immer_state",Y={0:"Illegal state",1:"Immer drafts cannot have computed properties",2:"This object has been frozen and should not be mutated",3:function(n){return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? "+n},4:"An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",5:"Immer forbids circular references",6:"The first or second argument to `produce` must be a function",7:"The third argument to `produce` must be a function or undefined",8:"First argument to `createDraft` must be a plain object, an array, or an immerable object",9:"First argument to `finishDraft` must be a draft returned by `createDraft`",10:"The given draft is already finalized",11:"Object.defineProperty() cannot be used on an Immer draft",12:"Object.setPrototypeOf() cannot be used on an Immer draft",13:"Immer only supports deleting array indices",14:"Immer only supports setting array indices and the 'length' property",15:function(n){return "Cannot apply patch, path doesn't resolve: "+n},16:'Sets cannot have "replace" patches.',17:function(n){return "Unsupported patch operation: "+n},18:function(n){return "The plugin for '"+n+"' has not been loaded into Immer. To enable the plugin, import and call `enable"+n+"()` when initializing your application."},20:"Cannot use proxies if Proxy, Proxy.revocable or Reflect are not available",21:function(n){return "produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '"+n+"'"},22:function(n){return "'current' expects a draft, got: "+n},23:function(n){return "'original' expects a draft, got: "+n},24:"Patching reserved attributes like __proto__, prototype and constructor is not allowed"},Z=""+Object.prototype.constructor,nn="undefined"!=typeof Reflect&&Reflect.ownKeys?Reflect.ownKeys:void 0!==Object.getOwnPropertySymbols?function(n){return Object.getOwnPropertyNames(n).concat(Object.getOwnPropertySymbols(n))}:Object.getOwnPropertyNames,rn=Object.getOwnPropertyDescriptors||function(n){var r={};return nn(n).forEach((function(t){r[t]=Object.getOwnPropertyDescriptor(n,t);})),r},tn={},en={get:function(n,r){if(r===Q)return n;var e=p(n);if(!u(e,r))return function(n,r,t){var e,i=I(r,t);return i?"value"in i?i.value:null===(e=i.get)||void 0===e?void 0:e.call(n.k):void 0}(n,e,r);var i=e[r];return n.I||!t(i)?i:i===z(n.t,r)?(E(n),n.o[r]=R(n.A.h,i,n)):i},has:function(n,r){return r in p(n)},ownKeys:function(n){return Reflect.ownKeys(p(n))},set:function(n,r,t){var e=I(p(n),r);if(null==e?void 0:e.set)return e.set.call(n.k,t),!0;if(!n.P){var i=z(p(n),r),o=null==i?void 0:i[Q];if(o&&o.t===t)return n.o[r]=t,n.D[r]=!1,!0;if(c(t,i)&&(void 0!==t||u(n.t,r)))return !0;E(n),k(n);}return n.o[r]===t&&"number"!=typeof t||(n.o[r]=t,n.D[r]=!0,!0)},deleteProperty:function(n,r){return void 0!==z(n.t,r)||r in n.t?(n.D[r]=!1,E(n),k(n)):delete n.D[r],n.o&&delete n.o[r],!0},getOwnPropertyDescriptor:function(n,r){var t=p(n),e=Reflect.getOwnPropertyDescriptor(t,r);return e?{writable:!0,configurable:1!==n.i||"length"!==r,enumerable:e.enumerable,value:t[r]}:e},defineProperty:function(){n(11);},getPrototypeOf:function(n){return Object.getPrototypeOf(n.t)},setPrototypeOf:function(){n(12);}},on={};i(en,(function(n,r){on[n]=function(){return arguments[0]=arguments[0][0],r.apply(this,arguments)};})),on.deleteProperty=function(r,t){return "production"!==process.env.NODE_ENV&&isNaN(parseInt(t))&&n(13),en.deleteProperty.call(this,r[0],t)},on.set=function(r,t,e){return "production"!==process.env.NODE_ENV&&"length"!==t&&isNaN(parseInt(t))&&n(14),en.set.call(this,r[0],t,e,r[0])};var un=function(){function e(r){var e=this;this.O=B,this.F=!0,this.produce=function(r,i,o){if("function"==typeof r&&"function"!=typeof i){var u=i;i=r;var a=e;return function(n){var r=this;void 0===n&&(n=u);for(var t=arguments.length,e=Array(t>1?t-1:0),o=1;o<t;o++)e[o-1]=arguments[o];return a.produce(n,(function(n){var t;return (t=i).call.apply(t,[r,n].concat(e))}))}}var f;if("function"!=typeof i&&n(6),void 0!==o&&"function"!=typeof o&&n(7),t(r)){var c=w(e),s=R(e,r,void 0),v=!0;try{f=i(s),v=!1;}finally{v?g(c):O(c);}return "undefined"!=typeof Promise&&f instanceof Promise?f.then((function(n){return j(c,o),P(n,c)}),(function(n){throw g(c),n})):(j(c,o),P(f,c))}if(!r||"object"!=typeof r){if((f=i(r))===H)return;return void 0===f&&(f=r),e.F&&d(f,!0),f}n(21,r);},this.produceWithPatches=function(n,r){return "function"==typeof n?function(r){for(var t=arguments.length,i=Array(t>1?t-1:0),o=1;o<t;o++)i[o-1]=arguments[o];return e.produceWithPatches(r,(function(r){return n.apply(void 0,[r].concat(i))}))}:[e.produce(n,r,(function(n,r){t=n,i=r;})),t,i];var t,i;},"boolean"==typeof(null==r?void 0:r.useProxies)&&this.setUseProxies(r.useProxies),"boolean"==typeof(null==r?void 0:r.autoFreeze)&&this.setAutoFreeze(r.autoFreeze);}var i=e.prototype;return i.createDraft=function(e){t(e)||n(8),r(e)&&(e=D(e));var i=w(this),o=R(this,e,void 0);return o[Q].C=!0,O(i),o},i.finishDraft=function(r,t){var e=r&&r[Q];"production"!==process.env.NODE_ENV&&(e&&e.C||n(9),e.I&&n(10));var i=e.A;return j(i,t),P(void 0,i)},i.setAutoFreeze=function(n){this.F=n;},i.setUseProxies=function(r){r&&!B&&n(20),this.O=r;},i.applyPatches=function(n,t){var e;for(e=t.length-1;e>=0;e--){var i=t[e];if(0===i.path.length&&"replace"===i.op){n=i.value;break}}var o=b("Patches").$;return r(n)?o(n,t):this.produce(n,(function(n){return o(n,t.slice(e+1))}))},e}(),an=new un,fn=an.produce,cn=an.produceWithPatches.bind(an),sn=an.setAutoFreeze.bind(an),vn=an.setUseProxies.bind(an),pn=an.applyPatches.bind(an),ln=an.createDraft.bind(an),dn=an.finishDraft.bind(an);

    var IDX=256, HEX=[], BUFFER;
    while (IDX--) HEX[IDX] = (IDX + 256).toString(16).substring(1);

    function v4() {
    	var i=0, num, out='';

    	if (!BUFFER || ((IDX + 16) > 256)) {
    		BUFFER = Array(i=256);
    		while (i--) BUFFER[i] = 256 * Math.random() | 0;
    		i = IDX = 0;
    	}

    	for (; i < 16; i++) {
    		num = BUFFER[IDX + i];
    		if (i==6) out += HEX[num & 15 | 64];
    		else if (i==8) out += HEX[num & 63 | 128];
    		else out += HEX[num];

    		if (i & 1 && i > 1 && i < 11) out += '-';
    	}

    	IDX++;
    	return out;
    }

    /**
     * This method returns the first argument it receives.
     *
     * @static
     * @since 0.1.0
     * @memberOf _
     * @category Util
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'a': 1 };
     *
     * console.log(_.identity(object) === object);
     * // => true
     */
    function identity(value) {
      return value;
    }

    var identity_1 = identity;

    const RECORD_STATE_NEW = Symbol('record-state-new');
    const RECORD_STATE_SAVING = Symbol('record-state-saving');
    const RECORD_STATE_UPDATING = Symbol('record-state-updating');
    const RECORD_STATE_GETTING = Symbol('record-state-getting');
    // any record that is returned from a request or has been successfully saved or updated has this status
    const RECORD_STATE_PERSISTED = Symbol('record-state-persisted');
    const RECORD_STATE_DELETING = Symbol('record-state-deleting');
    const RECORD_STATE_DELETED = Symbol('record-state-deleted');

    const REQUEST_STATUS_NEW = Symbol('request-status-new');
    const REQUEST_STATUS_WORKING = Symbol('request-status-working');
    const REQUEST_STATUS_ERROR = Symbol('request-status-error');
    const REQUEST_STATUS_FINISHED = Symbol('request-status-finished');
    const REQUEST_STATUS_TIMEOUT = Symbol('request-status-timeout');

    const ACTION_NEW_RECORD = Symbol('action-new-record');
    const ACTION_NEW_REQUEST = Symbol('action-new-request');

    var constants = /*#__PURE__*/Object.freeze({
        __proto__: null,
        RECORD_STATE_NEW: RECORD_STATE_NEW,
        RECORD_STATE_SAVING: RECORD_STATE_SAVING,
        RECORD_STATE_UPDATING: RECORD_STATE_UPDATING,
        RECORD_STATE_GETTING: RECORD_STATE_GETTING,
        RECORD_STATE_PERSISTED: RECORD_STATE_PERSISTED,
        RECORD_STATE_DELETING: RECORD_STATE_DELETING,
        RECORD_STATE_DELETED: RECORD_STATE_DELETED,
        REQUEST_STATUS_NEW: REQUEST_STATUS_NEW,
        REQUEST_STATUS_WORKING: REQUEST_STATUS_WORKING,
        REQUEST_STATUS_ERROR: REQUEST_STATUS_ERROR,
        REQUEST_STATUS_FINISHED: REQUEST_STATUS_FINISHED,
        REQUEST_STATUS_TIMEOUT: REQUEST_STATUS_TIMEOUT,
        ACTION_NEW_RECORD: ACTION_NEW_RECORD,
        ACTION_NEW_REQUEST: ACTION_NEW_REQUEST
    });

    class Record {
      constructor(params) {
        const {
          identity, props, meta = {}, status = RECORD_STATE_NEW, store, tag,
        } = params;
        this.identity = identity;
        this.props = props;
        this.meta = meta;
        this.status = status;
        this.store = store;
        this.tag = tag || v4();

        this[L] = true; // Option 2
      }

      get pure() {
        return {
          identity: this.identity,
          props: this.props,
          status: this.status,
          meta: this.meta,
          store: this.store,
        };
      }
    }

    var recordFactory = (identity, props = {}, status = RECORD_STATE_NEW, meta = {}, storeName) => {
      if (status === lookingGlassEngine["Å"]) status = RECORD_STATE_NEW;
      if (meta === lookingGlassEngine["Å"]) meta = {};
      const tag = v4();

      try {
        return fn(new Record({
          identity,
          status,
          props,
          meta,
          tag,
          store: storeName,
        }), identity_1);
      } catch (err) {
        console.log(err.message, '--- cannot immerize this data:', identity, props, status, meta, tag);
        return new Record({
          identity,
          status,
          props,
          meta,
          tag,
          store: storeName,
        });
      }
    };

    /**
     * creates a stream that updates subscribers as data comes back from the server.
     *
     * A NOTE ON STATUS:
     *
     * as is done in finish/fail, status is the LAST thing you should change. Status changes
     * trigger watchers to act as if a status cycle was complete -- so if you change status THEN
     * change response, listeners probably won't notice the response change.
     *
     * @param action
     * @param params
     * @param store
     * @param options
     * @returns {boolean|*}
     */
    var requestFactory = (action, params, store = '', options = {}) => {
      const name = v4();
      const request = new lookingGlassEngine.ValueObjectStream({
        action,
        params,
        store,
        name,
        out: null,
        status: REQUEST_STATUS_NEW,
        options,
      },
      {
        name,
        actions: {
          isOpen(self) {
            return [REQUEST_STATUS_NEW, REQUEST_STATUS_WORKING].includes(self.my.status);
          },
          work(self) {
            if (self.my.status === REQUEST_STATUS_NEW) {
              return self.do.setStatus(REQUEST_STATUS_WORKING);
            }
            console.warn('attempt to work a request that is status ', self.my.status);
            throw new Error('cannot work this request');
          },
          finish(self, response = lookingGlassEngine["Å"]) {
            if (self.do.isOpen()) {
              const trans = self.trans(-1);
              self.do.setOut(response);
              self.do.setStatus(REQUEST_STATUS_FINISHED);
              trans.complete();
            } else {
              console.warn('!!!!!!!!! attempt to finish a non-opened request', self);
            }
          },
          fail(self, err = lookingGlassEngine["Å"]) {
            if (self.do.isOpen()) {
              const trans = self.trans(-1);
              if (err !== lookingGlassEngine["Å"]) { self.do.setOut(err); }
              self.do.setStatus(REQUEST_STATUS_ERROR);
              trans.complete();
            } else {
              console.warn('attempt to fails a non-opened request', self);
            }
          },
          expire(self) {
            if ([REQUEST_STATUS_NEW, REQUEST_STATUS_WORKING].includes(self.my.status)) {
              self.do.setStatus(REQUEST_STATUS_TIMEOUT);
            }
          },
        },
      });

      request.onField((event, target) => {
        const { status } = event.value;
        if (status === target.my.status) {
          if ([...Object.keys(event.value)].length === 1) event.complete();
          return;
        }

        switch (target.my.status) {
          case REQUEST_STATUS_NEW:
            break;

          case REQUEST_STATUS_WORKING:
            if (![REQUEST_STATUS_TIMEOUT, REQUEST_STATUS_FINISHED, REQUEST_STATUS_ERROR].includes(status)) {
              throw new Error(`cannot transition to ${status.toString()} from ${target.my.status.toString()}`);
            }
            break;

          case REQUEST_STATUS_TIMEOUT:
            throw new Error('cannot change status from Timeout');

          case REQUEST_STATUS_FINISHED:
            throw new Error('cannot change status from Finished');
        }
      }, 'status');

      if (options.time) {
        setTimeout(request.do.expire, options.time);
      }
      return request;
    };

    var storeFactory = (name, schema = {}, transport = false) => {
      const store = lookingGlassEngine.addActions(new lookingGlassEngine.ValueMapStream({
        schema,
        transport,
        name,
        records: new Map(),
        requests: new Map(),
      }, { name }), {
        request(self, action, params, options) {
          const request = requestFactory(action, params, self.name, options);
          // console.log('---- request factory returned ', request);
          self.fields.requests.set(request.name, request);
          self.send(ACTION_NEW_REQUEST, request);
          return request;
        },
        /**
         *
         * @param self
         * @param handler {function} for every new request, recieves(requestValue, requestStream, store, event);
         * @returns {Subscription}
         */
        onRequest(self, handler) {
          return self.on((event) => {
            handler(event.value);
          }, ACTION_NEW_REQUEST, lookingGlassEngine.E_COMPLETE);
        },
        getRequest(self, reqID) {
          if (self.my.requests.has(reqID)) {
            return self.my.requests.get(reqID);
          }
          if (self.do.hasRequestStream(reqID)) {
            return self.fields.requests.get(reqID);
          }
          return null;
        },
        hasRequestStream(self, reqID) {
          return (self.fields.requests.has(reqID));
        },
        getRequestStream(self, reqID) {
          if (self.fields.requests.has(reqID)) {
            return self.fields.requests.fieldSubjects.get(reqID);
          }
          if (name.name) {
            return self.do.getRequestStream(reqID.name);
          }
          return null;
        },
        upsertRecord(self, identity, ...args) {
          if (self.do.hasRecord(identity)) {
            return self.do.updateRecordProps(identity, ...args);
          }
          return self.do.createRecord(self, identity, ...args);
        },
        createRecord(self, identity, props, status, meta) {
          if (self.do.hasRecord(identity)) {
            console.warn('createRecord record -- ', identity, 'exists');
            return self.do.updateRecordProps(identity, props);
          }
          const record = recordFactory(identity, props, status, meta, self.name);
          const evt = self.send(ACTION_NEW_RECORD, record, [lookingGlassEngine.E_FILTER]);
          if (!evt.thrownError) {
            return self.fields.records.set(identity, evt.value);
          }
          console.warn('createRecord error:', evt.thrownError);

          return evt;
        },
        setRecord(self, identity, data, fast) {
          if (typeof identity === 'object' && !data) {
            return self.do.setRecord(identity.identity, identity);
          }
          if (fast) {
            return self.records.set(identity, data);
          }
          return self.fields.records.set(identity, new Record({ ...data, identity }));
        },
        createRecords(self, recordMap) {
          const trans = self.fields.records.trans(0);
          try {
            if (recordMap instanceof Map) {
              recordMap.forEach((data, identity) => {
                self.do.createRecord(identity, data);
              });
              trans.complete();
            } else if (Array.isArray(recordMap)) {
              recordMap.forEach((record) => {
                if (!('identity' in record)) {
                  throw new Error('each record must have an identity field');
                } if (!('props' in record)) {
                  throw new Error('each record must have an identity field');
                }
                self.do.setRecord(record);
              });
            }
          } catch (err) {
            trans.error(err);
            throw err;
          }
        },
        updateRecord(self, identity, data) {
          if (typeof data === 'function') return self.do.mutateRecord(identity, data);

          if (!self.do.hasRecord(identity)) {
            throw new Error(`update: no existing record ${identity}`);
          }
          return self.do.mutateRecord(identity, (record) => fn(record, (draft) => new Record({ ...draft, ...data, identity })));
        },
        updateRecordProps(self, identity, change, exclusive) {
          if (!self.do.hasRecord(identity)) {
            throw new Error(`update: no existing record ${identity}`);
          }

          return self.do.mutateRecord(identity, (record) => fn(record, (draft) => {
            if (typeof change === 'function') {
              draft.props = change(draft.props, draft, store);
            } else if (typeof change === 'object') {
              draft.props = exclusive ? { ...change } : { ...draft.props, ...change };
            }
          }));
        },
        updateRecordMeta(self, identity, key, value) {
          return self.do.updateRecordMetas(identity, key, value);
        },
        updateRecordMetas(self, identity, metas, value = lookingGlassEngine["Å"]) {
          if (!self.do.hasRecord(identity)) {
            throw new Error(`update: no existing record ${identity}`);
          }

          return self.do.mutateRecord(identity, (record) => fn(record, (draft) => {
            if (typeof metas === 'object') {
              draft.meta = { ...draft.meta, ...metas };
            } else if ((typeof metas === 'string') && (value !== lookingGlassEngine["Å"])) {
              draft.meta[metas] = value;
            }
          }));
        },
        updateRecordStatus(self, identity, status) {
          if (!self.do.hasRecord(identity)) {
            throw new Error(`update: no existing record ${identity}`);
          }

          return self.do.mutateRecord(identity, (record) => fn(record, (draft) => {
            draft.status = status;
          }));
        },
        mutateRecord(self, identity, mutator) {
          if (typeof mutator !== 'function') throw new Error('mutateRecord - passed non functional mutator');
          if (!self.do.hasRecord(identity)) {
            throw new Error(`update: no existing record ${identity}`);
          }
          let newRecord = self.do.record(identity);
          try {
            newRecord = fn(newRecord, mutator);
          } catch (err) {
            console.log('mutation error: ', newRecord, 'mutator:', mutator.toString(), 'subject: ', self);
            throw err;
          }
          return self.fields.records.set(identity, newRecord);
        },
        hasRecord(self, identity) {
          return self.my.records.has(identity);
        },
        removeRecord(self, identity) {
          const existing = self.do.record(identity);
          if (!existing) return null;
          // note -- self should be called AFTER a status update of a record to deleted has been communicated
          self.my.records.delete(identity);
          return existing;
        },
        record(self, identity) {
          return self.my.records.get(identity);
        },
        r(self, identity) {
          return self.do.record(identity);
        },

        /**
         * "new" in this context is new to the collection...
         * @param self
         * @param handler
         */
        onNewRecord(self, handler) {
          if (!(typeof handler === 'function')) {
            throw new Error(`store ${self.name}requires functional handler for onNewRecord`);
          }
          const appliedTo = new Set();
          function tryRecord(record, event) {
            if (!appliedTo.has(record.tag)) {
              appliedTo.add(record.tag);
              const newRecord = handler(record, event, self);
              if (newRecord && record !== newRecord) {
                event.next(newRecord);
              }
              return true;
            }
            return false;
          }
          self.on((event) => {
            const record = event.value;

            tryRecord(record, event);
          }, ACTION_NEW_RECORD, lookingGlassEngine.E_FILTER);

          // console.log('self for onNewRecord:', [...self.fieldSubjects.entries()]);

          if (self.fields.records) {
            self.fields.records.onField((event) => {
              const recordMap = event.value;
              recordMap.forEach((record) => {
                if (event.isStopped) return;
                try {
                  tryRecord(record, event, self);
                } catch (err) {
                  if (!event.isStopped) event.error(err);
                }
              });
            }, () => true);
          }
        },
      });

      const recordStream = new lookingGlassEngine.ValueMapStream({
      }, { name: `${store.name}-records` });
      store.addFieldSubject('records', recordStream);
      store.addFieldSubject('requests', new lookingGlassEngine.ValueMapStream({}));
      store.fields.records.on((evt) => {
        const map = evt.value;
        map.forEach((r, i) => {
          if (!(r instanceof Record)) {
            r.identity = i;
            map.set(i, new Record(r));
          }
        });
      }, lookingGlassEngine.A_SET, lookingGlassEngine.E_INITIAL);

      store.do.onNewRecord((record) => fn(record, (draft) => {
        draft.meta.originalProps = { ...record.props };
      }));

      return store;
    };

    var baseFactory = (name, transport) => {
      const base = lookingGlassEngine.addActions(new lookingGlassEngine.ValueMapStream({
        name,
        stores: new Map(),
        transport,
        views: new Map(),
      }), {
        addStore(self, storeName, store) {
          self.my.stores.set(storeName, store);
        },
      });

      base.addFieldSubject('stores', new lookingGlassEngine.ValueMapStreamFast({}));
      base.addFieldSubject('views', new lookingGlassEngine.ValueMapStreamFast({}));
      return base;
    };

    var index = {
      ...constants,
      requestFactory,
      storeFactory,
      recordFactory,
      baseFactory,
      produce: fn,
    };

    return index;

})));
