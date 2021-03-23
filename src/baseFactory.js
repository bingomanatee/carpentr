import { addActions, ValueMapStream, ValueMapStreamFast } from '@wonderlandlabs/looking-glass-engine';
import recordFactory from './recordFactory';

export default (name, transport) => {
  const base = addActions(new ValueMapStream({
    name,
    stores: new Map(),
    transport,
    views: new Map(),
  }), {
    addStore(self, storeName, store) {
      self.my.stores.set(storeName, store);
    },
  });

  base.addFieldSubject('stores', new ValueMapStreamFast({}));
  base.addFieldSubject('views', new ValueMapStreamFast({}));
  return base;
};
