import { ValueObjectStream, Å } from '@wonderlandlabs/looking-glass-engine';
import { v4 as uuid } from '@lukeed/uuid';
import produce from 'immer';
import {
  REQUEST_STATUS_ERROR,
  REQUEST_STATUS_FINISHED,
  REQUEST_STATUS_NEW,
  REQUEST_STATUS_TIMEOUT,
  REQUEST_STATUS_WORKING,
} from './constants';

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
export default (action, params, store = '', options = {}) => {
  const name = uuid();
  const request = new ValueObjectStream({
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
      finish(self, response = Å) {
        if (self.do.isOpen()) {
          const trans = self.trans(-1);
          self.do.setOut(response);
          self.do.setStatus(REQUEST_STATUS_FINISHED);
          trans.complete();
        } else {
          console.warn('!!!!!!!!! attempt to finish a non-opened request', self);
        }
      },
      fail(self, err = Å) {
        if (self.do.isOpen()) {
          const trans = self.trans(-1);
          if (err !== Å) { self.do.setOut(err); }
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
        break;

      case REQUEST_STATUS_FINISHED:
        throw new Error('cannot change status from Finished');
        break;
    }
  }, 'status');

  if (options.time) {
    setTimeout(request.do.expire, options.time);
  }
  return request;
};
