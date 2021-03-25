import { ValueMapStream, ValueMapStreamFast } from '@wonderlandlabs/looking-glass-engine';
import storeFactory from './storeFactory';

export default (name, transport) => {
  const base = new ValueMapStream({
    name,
    stores: new Map(),
    transport,
    views: new Map(),
  }, {
    name,
    actions: {
      addStore(self, storeName, ...args) {
        self.fields.stores.set(storeName, storeFactory(storeName, ...args));
      },
      store(self, storeName) {
        return self.my.stores.get(storeName);
      },
      createRecord(self, storeName, ...args) {
        return self.my.stores.get(storeName).do.createRecord(...args);
      },
      r(self, storeName, ...args) {
        return self.my.stores.get(storeName).do.r(...args);
      },
      request(self, storeName, ...args) {
        return self.my.stores.get(storeName).do.request(...args);
      },
      onRequest(self, storeName, ...args) {
        return self.my.stores.get(storeName).do.onRequest(...args);
      },
    },
  });

  base.addFieldSubject('stores', new ValueMapStreamFast({}));
  base.addFieldSubject('views', new ValueMapStreamFast({}));
  return base;
};
