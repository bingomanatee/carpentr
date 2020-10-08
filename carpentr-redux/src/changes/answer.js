import produce from 'immer';
import { nanoid } from 'nanoid';
import { DONE, ERROR } from '../status';

const ANSWER = {
  collection: '',
  question: '',
  form: '',
  status: DONE,
};

export default (payload) => {
  const {
    question, // the object of the data
    response, // whatever we get back.
    error,
  } = payload;

  let questionUUID = '';
  let questionCollection = '';
  let questionForm = '';

  if (typeof question === 'string') {
    questionUUID = question;
  } else {
    questionUUID = question.uuid;
    questionCollection = question.collection;
    questionForm = question.form;
  }
  return produce(ANSWER, (ans) => {
    ans.uuid = nanoid();
    ans.question = questionUUID;
    ans.q = question;
    ans.response = response;

    if (error) ans.status = ERROR;

    ans.form = questionForm;
    ans.collection = questionCollection;
  });
};
