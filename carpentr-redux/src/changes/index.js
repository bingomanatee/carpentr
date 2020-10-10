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

const def = ()=> ({
  requests: new Map(),
  questions: new Map(),
  answers: new Map(),
});

const doUpdate = (item, update) => {
  const next = {...item};
  update(next);
  return next;
}

/**
 * returns a slice that contains a map of maps that store collection ID/values.
 * @returns {Slice<Map<string, Map>, {}, string>}
 */
export default () => createSlice({
  name: 'requests',
  initialState: def(),
  reducers: {
    // register a request and add it to the state
    [REQUEST_NEW]: (state, action) => {
      const { view, callback } = action.payload;
      if (!(view && (typeof view === 'string'))) {
        throw new Error('REQUEST requires a string view');
      }
      const newRequest = request(action.payload);
      state.requests.set(newRequest.uuid, newRequest);
      if (callback && typeof callback === 'function') callback(newRequest);
    },
    [REQUEST_UPDATE]: (state, action) => {
      const {update, uuid, filter, callback} = action.payload;
      if (typeof update !== 'function') {
        throw new Error('REQUEST_UPDATE requires update be a function');
      }
      if (uuid) {
        const item = state.requests.get(uuid);
        if (!item) {
          if (callback) {
            callback(false);
          }
          return state;
        }

        let newItem = doUpdate(item, update);

        state.requests.set(uuid, newItem);
        if (typeof callback === 'function') {
          callback(newItem);
        }
        state.requests.set(uuid, newItem);
      } else if (typeof filter === 'function') {
        const filtered = Array.from(state.requests.values()).filter(filter);
        const frMap = new Map();
        filtered.forEach(item => {
          frMap.set(item.uuid, item);
          state.requests.set(item.uuid, item);
        });
        if (typeof callback === 'function') {
          callback(frMap);
        }
      } else {
        throw new Error('REQUEST_UPDATE requires uuid or filter');
      }
      return state;
    },

    [QUESTION_NEW]: (state, action) => {
      const q = question(action.payload);
      if (q && q.uuid) {
        state.questions.set(q.uuid, q);
        if (action.payload.callback) {
          action.payload.callback(q);
        }
      }
      return state;
    },
    [QUESTION_UPDATE]: (state, action) => {
      const {update, uuid, filter, callback} = action.payload;
      if (typeof update !== 'function') {
        throw new Error('QUESTION_UPDATE requires update be a function');
      }
      if (uuid) {
        const item = state.questions.get(uuid);
        if (!item) {
          if (callback) {
            callback(false);
          }
          return state;
        }

        let newItem = doUpdate(item, update);

        state.questions.set(uuid, newItem);
        if (typeof callback === 'function') {
          callback(newItem);
        }
        state.questions.set(uuid, newItem);
      } else if (typeof filter === 'function') {
        const filtered = Array.from(state.questions.values()).filter(filter);
        const frMap = new Map();
        filtered.forEach(item => {
          frMap.set(item.uuid, item);
          state.questions.set(item.uuid, item);
        });
        if (typeof callback === 'function') {
          callback(frMap);
        }
      } else {
        throw new Error('QUESTION_UPDATE requires uuid or filter');
      }
      return state;
    },

    [ANSWER_NEW]: (state, action) => {
      const myAnswer = answer(action.payload);
      state.answers.set(myAnswer.uuid, myAnswer);
      if (action.payload.callback) action.payload.callback(myAnswer);
      return state;
    },

    [ANSWER_UPDATE]: (state, action) => {
      const {update, uuid, filter, callback} = action.payload;
      if (typeof update !== 'function') {
        throw new Error('ANSWER_UPDATE requires update be a function');
      }
      if (uuid) {
        const item = state.answers.get(uuid);
        if (!item) {
          if (callback) {
            callback(false);
          }
          return state;
        }

        let newItem = doUpdate(item, update);

        state.answers.set(uuid, newItem);
        if (typeof callback === 'function') {
          callback(newItem);
        }
        state.answers.set(uuid, newItem);
      } else if (typeof filter === 'function') {
        const filtered = Array.from(state.answers.values()).filter(filter);
        const frMap = new Map();
        filtered.forEach(item => {
          frMap.set(item.uuid, item);
          state.answers.set(item.uuid, item);
        });
        if (typeof callback === 'function') {
          callback(frMap);
        }
      } else {
        throw new Error('ANSWER_UPDATE requires uuid or filter');
      }
      return state;
      },
  },
});
