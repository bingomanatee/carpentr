import {
  addActions, ValueMapStream, A_NEXT, A_SET, e, E_COMPLETE, E_FILTER, E_INITIAL, Å,
} from '@wonderlandlabs/looking-glass-engine';
import { Subject } from 'rxjs';
import { distinct } from 'rxjs/operators';
import cloneDeep from 'lodash/cloneDeep';
import produce from 'immer';
import recordFactory from './recordFactory';
import { ACTION_NEW_RECORD, ACTION_NEW_REQUEST, REQUEST_STATUS_NEW } from './constants';
import requestFactory from './requestFactory';
import Record from './Record';

export default (name, schema = {}, transport = false) => {
  const store = addActions(new ValueMapStream({
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
      }, ACTION_NEW_REQUEST, E_COMPLETE);
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
      const evt = self.send(ACTION_NEW_RECORD, record, [E_FILTER]);
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
      return self.do.mutateRecord(identity, (record) => produce(record, (draft) => new Record({ ...draft, ...data, identity })));
    },
    updateRecordProps(self, identity, change, exclusive) {
      if (!self.do.hasRecord(identity)) {
        throw new Error(`update: no existing record ${identity}`);
      }

      return self.do.mutateRecord(identity, (record) => produce(record, (draft) => {
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
    updateRecordMetas(self, identity, metas, value = Å) {
      if (!self.do.hasRecord(identity)) {
        throw new Error(`update: no existing record ${identity}`);
      }

      return self.do.mutateRecord(identity, (record) => produce(record, (draft) => {
        if (typeof metas === 'object') {
          draft.meta = { ...draft.meta, ...metas };
        } else if ((typeof metas === 'string') && (value !== Å)) {
          draft.meta[metas] = value;
        }
      }));
    },
    updateRecordStatus(self, identity, status) {
      if (!self.do.hasRecord(identity)) {
        throw new Error(`update: no existing record ${identity}`);
      }

      return self.do.mutateRecord(identity, (record) => produce(record, (draft) => {
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
        newRecord = produce(newRecord, mutator);
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
      function purge() {
      }
      function tryRecord(record, event) {
        if (!appliedTo.has(record.tag)) {
          appliedTo.add(record.tag);
          if (appliedTo.size > 100) purge();
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
      }, ACTION_NEW_RECORD, E_FILTER);

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

  const recordStream = new ValueMapStream({
  }, { name: `${store.name}-records` });
  store.addFieldSubject('records', recordStream);
  store.addFieldSubject('requests', new ValueMapStream({}));
  store.fields.records.on((evt) => {
    const map = evt.value;
    map.forEach((r, i) => {
      if (!(r instanceof Record)) {
        r.identity = i;
        map.set(i, new Record(r));
      }
    });
  }, A_SET, E_INITIAL);

  store.do.onNewRecord((record) => produce(record, (draft) => {
    draft.meta.originalProps = { ...record.props };
  }));

  return store;
};
