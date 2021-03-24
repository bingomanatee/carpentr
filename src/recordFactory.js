import {
  Å,
} from '@wonderlandlabs/looking-glass-engine';
import { v4 as uuid } from '@lukeed/uuid';
import produce from 'immer';
import NOOP from 'lodash/identity';
import Record from './Record';
import { RECORD_STATE_NEW } from './constants';

export default (identity, props = {}, status = RECORD_STATE_NEW, meta = {}, storeName) => {
  if (status === Å) status = RECORD_STATE_NEW;
  if (meta === Å) meta = {};
  const tag = uuid();

  try {
    return produce(new Record({
      identity,
      status,
      props,
      meta,
      tag,
      store: storeName,
    }), NOOP);
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
