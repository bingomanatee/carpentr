import storeFactory from './storeFactory';
import recordFactory from './recordFactory';
import baseFactory from './baseFactory';
import requestFactory from './requestFactory';
import * as constants from './constants';

export default {
  ...constants,
  requestFactory,
  storeFactory,
  recordFactory,
  baseFactory,
};
