import { immerable } from 'immer';
import { CLASSTYPE_SOURCE } from '../constants';
import { io, kn, m, p } from '../utils';
import {Subject} from "rxjs";

/**
 * a Source is the class-type of the sources map of the sources slice.
 */
export default class Source {
  /**
   * initializes with the following parameter
   * @param name -- a unique key (pref a string).
   * @param members -- any pre-loaded data
   * @param params -- any configuration
   * @param hooks -- any behavior overrides
   */
  constructor(name, members, params, hooks) {
    this.name = name;
    this.key = name;
    this.CLASSTYPE = CLASSTYPE_SOURCE;
    this.members = m(members);
    this.hooks = m(hooks);
    this.params = p(params);
    this.quests = new Subject();
    this._p = null;
  }

  get(key) {
    if (!this.members.has(key) && (typeof key === 'number')) {
      return this.members.get(`${key}`);
    }
    return this.members.get(key);
  }
  has(key) {
    return this.members.has(key);
  }
  set(key, member) {
    this.members.set(key, member);
  }
  del(key) {
    this.members.delete(key);
  }

  /**
   * this is a shorthand for get; its very efficient if proxies are present
   * -- but very NOT efficient if they aren't.
   * @returns {{}|V}
   */
  get my() {
    if (typeof Proxy !== 'undefined') {
      if (!this._p) {
        this._p = new Proxy(this, {
          get(source, getName) {
            return source.get(getName);
          }
        });
      }
    }
    const stub = {};
    this.members.forEach((v, k) => {
      stub[k] = v;
    });
    return stub;
  }

  get size() {
    return this.members.size;
  }
}

Source.fromPayload = (params = {}) => {
  const { members, hooks, params : eParams, ...rest } = params;
  const myParams = { ...rest };
  if (io(eParams)) {
    Object.assign(myParams, eParams);
  }
  return new Source(kn(params, true), members, myParams, hooks);
};

Source[immerable] = true;
