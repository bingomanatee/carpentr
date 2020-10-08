/* eslint-disable arrow-body-style */
import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';
import {
  NEW_QUESTION, NEW_REQUEST, UPDATE_REQUEST, UPDATE_QUESTION, NEW_ANSWER, UPDATE_ANSWER,
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
    [NEW_REQUEST]: (state, action) => {
      const { view } = action.payload;
      if (!(view && (typeof view === 'string'))) {
        throw new Error('REQUEST requires a string view');
      }
      return addToMap(state, 'requests', request(action.payload));
    },
    [UPDATE_REQUEST]: (state, action) => {
      return updateMap(state, 'requests', action.payload);
    },

    [NEW_QUESTION]: (state, action) => {
      return addToMap(state, 'questions', question(action.payload));
    },
    [UPDATE_QUESTION]: (state, action) => {
      return updateMap(state, 'questions', action.payload);
    },

    [NEW_ANSWER]: (state, action) => {
      const myAnswer = answer(action.payload);
      const nextState = addToMap(state, 'answers', myAnswer);
      // note that the question has been answered.
      return updateMap(nextState, 'questions', myAnswer.question, (quest) => {
        quest.status = myAnswer.status;
        quest.answer = myAnswer.uuid;
      });
    },
    [UPDATE_ANSWER]: (state, action) => {
      return updateMap(state, 'answers', action.payload);
    },
  },
});
