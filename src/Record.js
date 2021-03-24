import { v4 as uuid } from '@lukeed/uuid';
import { immerable } from 'immer';
import { RECORD_STATE_NEW } from './constants';

export default class Record {
  constructor(params) {
    const {
      identity, props, meta = {}, status = RECORD_STATE_NEW, store, tag,
    } = params;
    this.identity = identity;
    this.props = props;
    this.meta = meta;
    this.status = status;
    this.store = store;
    this.tag = tag || uuid();

    this[immerable] = true; // Option 2
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
