import produce from 'immer';
import { nanoid } from 'nanoid';


export default (payload) => {
  const {
    request, // the request object that the question should (at least partly) satisfy
    collection, // a string name of the collection
    form, // the information requested from the collection
  } = payload;
  return produce({
    collection, request: request.uuid, form,
  }, (q) => {
    q.uuid = nanoid();
    // default absent properties to those of the request.
    if (!q.form && request.form) {
      q.form = request.form;
    }
    if (!q.collection && request.collection) {
      q.collection = request.collection;
    }
  });
};
