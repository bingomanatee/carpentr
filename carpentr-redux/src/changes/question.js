import { nanoid } from 'nanoid';
import { NEW, DONE } from '../status';

export default (payload) => {
  const {
    request, // the request object that the question should (at least partly) satisfy
    collection, // a string name of the collection
    form, // the information requested from the collection
  } = payload;
  const q = {
    collection, request: request.uuid, form,
  };
  q.uuid = nanoid();
  // default absent properties to those of the request.
  if (!q.form && request.form) {
    q.form = request.form;
  }
  if (!q.collection && request.collection) {
    q.collection = request.collection;
  }
  q.status = NEW;
  return q;
};
