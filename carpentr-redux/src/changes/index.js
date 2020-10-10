/* eslint-disable arrow-body-style */
import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';
import {
  QUESTION_NEW, REQUEST_NEW, REQUEST_UPDATE, QUESTION_UPDATE, ANSWER_NEW, ANSWER_UPDATE, REQUEST_ADD_HANDLER,
} from '../actions';
import request from './request';
import question from './question';
import { addToMap, updateMap } from '../utils';
import answer from './answer';
import * as constants from '../constants';

const { ALL } = constants;

const def = () => ({
  requests: new Map(),
  requestHandlers: new Map(), // request handlers sorted by collection.
  // if a handler spans collections, its collecion === ALL;
  // note - this is a map of Sets - the handlers are kept in a collection of functions.
  // The functions may have a property "order" which determines
  // the order in which they are attempted.
  questions: new Map(),
  answers: new Map(),
});

const doUpdate = (item, update) => {
  const next = { ...item };
  update(next);
  console.log('doUpdate - changed ', item, 'into ', next);
  return next;
};

const getHandlerSet = (state, key) => {
  console.log('getting ', key);
  const set = new Set();
  if (state.requestHandlers.has(key)) {
    console.log('requestHandlers has ', key,
      state.requestHandlers.has(key));
    state.requestHandlers.get(key);
  } else {
    state.requestHandlers.set(key, set);
  }

  console.log('hSet returning', set);
  return set;
};

/**
 * returns a slice that contains a map of maps that store collection ID/values.
 * @returns {Slice<Map<string, Map>, {}, string>}
 */
export default () => createSlice({
  name: 'requests',
  initialState: def(),
  reducers: {
    [REQUEST_ADD_HANDLER]: (state, action) => {
      const {
        handler, collection, all, remove,
      } = action.payload;
      if (!(typeof handler === 'function')) {
        return state;
      }
      // retrieve the containing set that will/should have the handler;
      // create it if necessary
      let hSet;
      if (all) {
        hSet = getHandlerSet(state, ALL);
      } else if (collection) {
        hSet = getHandlerSet(state, collection);
      } else {
        return state;
      }

      console.log('hset: ', hSet,
        'from/all', all,
        'coll', collection);
      // add (or remove) the handler from that set.
      if (remove) {
        hSet.delete(handler);
      } else {
        hSet.add(handler);
      }
      return state;
    },
    // register a request and add it to the state
    [REQUEST_NEW]: (state, action) => {
      const { view, callback } = action.payload;
      if (!(view && (typeof view === 'string'))) {
        throw new Error('REQUEST requires a string view');
      }
      const newRequest = request(action.payload);
      state.requests.set(newRequest.uuid, newRequest);
      if (callback && typeof callback === 'function') {
        callback(newRequest);
      }
    },
    [REQUEST_UPDATE]: (state, action) => {
      console.log('----- ||||||||||||||||  REQUEST_UPDATE start: ', action);
      const {
        update, uuid, filter, callback,
      } = action.payload;
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

        const newItem = doUpdate(item, update);

        state.requests.set(uuid, newItem);
        if (typeof callback === 'function') {
          callback(newItem);
        }
        state.requests.set(uuid, newItem);
      } else if (typeof filter === 'function') {
        const filtered = Array.from(state.requests.values()).filter(filter);
        const frMap = new Map();
        filtered.forEach((item) => {
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
      console.log('new question: ', q);
      if (q && q.uuid) {
        state.questions.set(q.uuid, q);
        if (action.payload.callback) {
          action.payload.callback(q);
        }
      }
      return state;
    },
    [QUESTION_UPDATE]: (state, action) => {
      const {
        update, uuid, filter, callback,
      } = action.payload;
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

        const newItem = doUpdate(item, update);

        state.questions.set(uuid, newItem);
        if (typeof callback === 'function') {
          callback(newItem);
        }
        state.questions.set(uuid, newItem);
      } else if (typeof filter === 'function') {
        const filtered = Array.from(state.questions.values()).filter(filter);
        const frMap = new Map();
        filtered.forEach((item) => {
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
      if (action.payload.callback) {
        action.payload.callback(myAnswer);
      }
      return state;
    },

    [ANSWER_UPDATE]: (state, action) => {
      const {
        update, uuid, filter, callback,
      } = action.payload;
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

        const newItem = doUpdate(item, update);

        state.answers.set(uuid, newItem);
        if (typeof callback === 'function') {
          callback(newItem);
        }
        state.answers.set(uuid, newItem);
      } else if (typeof filter === 'function') {
        const filtered = Array.from(state.answers.values()).filter(filter);
        const frMap = new Map();
        filtered.forEach((item) => {
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
