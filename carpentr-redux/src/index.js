import { enableMapSet } from 'immer';
import collections from './collections';
import changes from './changes';
import views from './views';

import * as actions from './actions';
import * as status from './status';
import * as utils from './utils';
// In your application's entrypoint
enableMapSet();

export default {
  collections,

  actions,
  changes,
  status,
  views,
  ...utils,
};
