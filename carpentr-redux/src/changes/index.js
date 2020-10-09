/* eslint-disable arrow-body-style */
import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';
import {
  QUESTION_NEW, REQUEST_NEW, REQUEST_UPDATE, QUESTION_UPDATE, ANSWER_NEW, ANSWER_UPDATE,
} from '../actions';
import request from './request';
import question from './question';
import { addToMap, updateMap } from '../utils';
import answer from './answer';

const def = {
  requests: new Map(),
  questions: new Map(),
  answers: new Map(),
};

/**
 * returns a slice that contains a map of maps that store collection ID/values.
 * @returns {Slice<Map<string, Map>, {}, string>}
 */
export default () => createSlice({
  name: 'requests',
  initialState: produce(def, (draft) => draft),
  reducers: {
    // register a request and add it to the state
    [REQUEST_NEW]: (state, action) => {
      const { view } = action.payload;
      if (!(view && (typeof view === 'string'))) {
        throw new Error('REQUEST requires a string view');
      }
      return addToMap(state, 'requests', request(action.payload));
    },
    [REQUEST_UPDATE]: (state, action) => {
      return updateMap(state, 'requests', action.payload);
    },

    [QUESTION_NEW]: (state, action) => {
      return addToMap(state, 'questions', question(action.payload));
    },
    [QUESTION_UPDATE]: (state, action) => {
      return updateMap(state, 'questions', action.payload);
    },

    [ANSWER_NEW]: (state, action) => {
      const myAnswer = answer(action.payload);
      const nextState = addToMap(state, 'answers', myAnswer);
      // note that the question has been answered.
      return updateMap(nextState, 'questions', myAnswer.question, (quest) => {
        quest.status = myAnswer.status;
        quest.answer = myAnswer.uuid;
      });
    },
    [ANSWER_UPDATE]: (state, action) => {
      return updateMap(state, 'answers', action.payload);
    },
  },
});
