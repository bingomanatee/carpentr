import {
  Å,
} from '@wonderlandlabs/looking-glass-engine';
import { RECORD_STATE_NEW } from './constants';
import Record from './Record';

export default (identity, props = {}, status = RECORD_STATE_NEW, meta = {}, storeName) => {
  if (status === Å) status = RECORD_STATE_NEW;
  if (meta === Å) meta = {};

  return new Record({
    identity,
    status,
    props,
    meta,
    store: storeName,
  });
};
