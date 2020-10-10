import { nanoid } from 'nanoid';
import produce from 'immer';

import { NEW, DONE } from '../status';

const basis = {
  status: NEW,
  name: '',
  uuid: ''
};

const view = (payload) => {
 if (payload.view) return view(payload.view);
  const newView = {...basis};
  newView.uuid = nanoid();
  newView.name = payload.name;
  if (payload.collection) newView.collection = payload.collection;
  return newView;
}

export default view;
