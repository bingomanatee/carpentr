import {
  addActions, ValueMapStream, A_NEXT, A_SET, e, E_COMPLETE, E_FILTER, Å,
} from '@wonderlandlabs/looking-glass-engine';
import { Subject } from 'rxjs';
import { distinct } from 'rxjs/operators';
import cloneDeep from 'lodash/cloneDeep';
import recordFactory from './recordFactory';
import { ACTION_NEW_RECORD, ACTION_NEW_REQUEST, REQUEST_STATUS_NEW } from './constants';
import requestFactory from './requestFactory';
import Record from './Record';

export default (name, schema = {}, transport = false) => {
  const store = addActions(new ValueMapStream({
    schema,
    transport,
    records: new Map(),
    requests: new Map(),
  }, { name }), {
    request(self, action, params, options) {
      const request = requestFactory(action, params, self.name, options);
      // console.log('---- request factory returned ', request);
      self.fields.requests.addFieldSubject(request.name, request);
      self.fields.requests.send(ACTION_NEW_REQUEST, request.value);
      self.send(ACTION_NEW_REQUEST, request.value);
      return request;
    },
    /**
     *
     * @param self
     * @param handler {function} for every new request, recieves(requestValue, requestStream, store, event);
     * @returns {Subscription}
     */
    onRequest(self, handler) {
      const stream = new Subject();
      self.on((event) => {
        stream.next(event.value);
      }, ACTION_NEW_REQUEST, E_COMPLETE);
      const subject = stream.pipe(distinct((request) => request.name));

      subject.subscribe({
        error(er) {
          console.log('error in subject:', er);
        },
        next(request) {
          const { name } = request;
          try {
            const currentRequest = self.do.getRequest(name);
            handler(currentRequest, self.do.getRequestStream(name), self);
          } catch (err) {
            self.error(e(err, {
              name,
              handler: handler.toString(),
            }));
          }
        },
      });

      return subject;
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
        console.warn('createRecord record -- ', identity, 'exists');
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
      return evt;
    },
    setRecord(self, identity, data) {
      if (typeof identity === 'object' && !data) {
        return self.do.setRecord(identity.identity, identity);
      }
      const { props, status = Å, meta = Å } = data;
      return self.do.createRecord(identity, props, status, meta);
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
        console.log('error creating records:', err);
        trans.error(err);
        throw err;
      }
    },
    updateRecord(self, identity, data) {
      if (typeof data === 'function') return self.do.mutateRecord(identity, data);
      if (!self.do.hasRecord(identity)) {
        throw new Error(`update: no existing record ${identity}`);
      }

      self.do.mutateRecord(identity, (record) => new Record({ ...record, ...data }));
    },
    updateRecordProps(self, identity, change, exclusive) {
      if (!self.do.hasRecord(identity)) {
        throw new Error(`update: no existing record ${identity}`);
      }

      return self.do.mutateRecord(identity, (record) => {
        if (typeof change === 'function') {
          record.props = change(record.props, record, store);
        } else if (typeof change === 'object') {
          record.props = exclusive ? { ...change } : { ...record.props, ...change };
        }
      });
    },
    updateRecordMeta(self, identity, key, value) {
      return self.do.updateRecordMetas(identity, key, value);
    },
    updateRecordMetas(self, identity, metas, value = Å) {
      if (!self.do.hasRecord(identity)) {
        throw new Error(`update: no existing record ${identity}`);
      }

      return self.do.mutateRecord(identity, (record) => {
        if (typeof metas === 'object') {
          record.meta = { ...record.metas, ...metas };
        } else if ((typeof metas === 'string') && (value !== Å)) {
          record.meta[metas] = value;
        }
      });
    },
    updateRecordStatus(self, identity, status) {
      if (!self.do.hasRecord(identity)) {
        throw new Error(`update: no existing record ${identity}`);
      }

      return self.do.mutateRecord(identity, (record) => {
        record.status = status;
      });
    },
    mutateRecord(self, identity, mutator) {
      if (typeof mutator !== 'function') throw new Error('mutateRecord - passed non functional mutator');
      if (!self.do.hasRecord(identity)) {
        throw new Error(`update: no existing record ${identity}`);
      }
      let newRecord = new Record(self.do.record(identity));
      try {
        const change = mutator(newRecord);
        if (change) newRecord = change;
      } catch (err) {
        console.log('mutation error: ', newRecord, 'mutator:', mutator.toString(), 'subject: ', self);
        throw err;
      }
      return self.fields.records.set(identity, mutator(newRecord) || newRecord);
    },
    hasRecord(self, identity) {
      return self.my.records.has(identity);
    },
    removeRecord(self, identity) {
      // note -- self should be called AFTER a status update of a record to deleted has been communicated
      self.my.records.delete(identity);
    },
    record(self, identity) {
      return self.my.records.get(identity);
    },

    onNewRecord(self, handler) {
      if (!(typeof handler === 'function')) {
        throw new Error(`store ${self.name}requires functional handler for onNewRecord`);
      }

      self.on((event) => {
        handler(event.value, event, self);
      }, ACTION_NEW_RECORD, E_FILTER);
    },
  });

  const recordStream = new ValueMapStream({
  }, { name: `${store.name}-records` });

  store.do.onNewRecord((record) => {
    record.meta.originalProps = { ...record.props };
  });

  store.addFieldSubject('records', recordStream);
  store.addFieldSubject('requests', new ValueMapStream({}));

  return store;
};
