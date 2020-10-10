import { nanoid } from 'nanoid';
import produce from 'immer';

import { NEW, DONE } from '../status';

const basis = {
  status: NEW,
  view: null,
  form: null,
  uuid: null,
  error: false
};
export default (payload) => produce(basis, (request) => {
  const { form, view, collection = null } = payload;
  request.uuid = nanoid();
  request.view = view;
  request.form = form;
  if (collection) {
    request.collection = collection;
  }
});
