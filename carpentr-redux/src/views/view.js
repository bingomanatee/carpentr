import { nanoid } from 'nanoid';
import produce from 'immer';

import { NEW, DONE } from '../status';

const basis = {
  status: NEW,
  name: '',
  uuid: ''
};
export default (payload) => produce(basis, (view) => {
  const { name, collection } = payload;
  view.uuid = nanoid();
  view.name = name;
  if (collection) view.collection = collection;
});
