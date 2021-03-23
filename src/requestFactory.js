import { ValueObjectStream, ValueMapStreamFast } from '@wonderlandlabs/looking-glass-engine';
import { v4 as uuid } from '@lukeed/uuid';
import {
  REQUEST_STATUS_ERROR,
  REQUEST_STATUS_FINISHED, REQUEST_STATUS_NEW, REQUEST_STATUS_TIMEOUT, REQUEST_STATUS_WORKING,
} from './constants';

export default (action, params, store = '', options = {}) => {
  const name = uuid();
  const request = new ValueObjectStream({
    action,
    params,
    store,
    name,
    status: REQUEST_STATUS_NEW,
    options,
  },
  {
    name,
    actions: {
      expire(self) {
        if ([REQUEST_STATUS_NEW, REQUEST_STATUS_WORKING].includes(self.my.status)) {
          self.do.setStatus(REQUEST_STATUS_TIMEOUT);
        }
      },
    },
  });

  request.onField((event, target) => {
    const { status } = event.value;
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
