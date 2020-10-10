/* eslint-disable arrow-body-style */
import { createSlice } from '@reduxjs/toolkit';
import { VIEW_NEW, VIEW_UPDATE, VIEW_DELETE, VIEW_CLOSE } from '../actions';
import view from './view';
import { addToMap, updateMap } from '../utils';
import * as status from './../status';

const doUpdate = (item, update) => {
  const next = {...item};
  update(next);
  return next;
}

/**
 * returns a slice that contains a map of maps that store view definitions.
 * views is a "map of maps"; each view is stored in the root map,
 * and is itself a map of records.
 */
export default () => createSlice({
  name: 'views',
  initialState: new Map(),
  reducers: {
    [VIEW_NEW]: (state, action) => {
      const newView = view(action.payload);
      state.set(newView.uuid, newView);
      if (action.payload.callback) {
        action.payload.callback(newView);
      }
      return state;
    },

    [VIEW_DELETE]: (state, action) => {
      const {uuid} = action.payload;
      state.delete(uuid);
      return state;
    },

    [VIEW_CLOSE]: (state, action) => {
      const {uuid, filter, callback} = action.payload;

      let changed = [];
      if (uuid) {
        let oldView = state.get(uuid);
        oldView.status = status.DONE;
        state.set(uuid, oldView);
        changed.push(oldView);
      } else if (typeof filter === 'function') {
        state.forEach((view) => {
          if (filter(view)) {
            view.status = status.DONE;
            changed.push(view);
          }
        });
      }
      if (callback) callback(changed);
      return state;
    },

    [VIEW_UPDATE]: (state, action) => {
      const {uuid, update, filter, callback} = action.payload;
      if (uuid) {
        if (!state.has(uuid)) {
          console.log('no view ' + uuid);
          return state;
        }
        state.set(uuid, doUpdate(state.get(uuid), update));
      } else if (typeof filter === 'function') {
        let snapshot = new Map();
        state.forEach(view => {
          if (filter(view)) {
            snapshot.set(view.uuid, doUpdate(view, update));
          }
        });
        snapshot.forEach((view, uuid) => state.set(uuid, view));
        if (callback) {
          callback(snapshot);
        }
        return state;
      }
      return state;
    }
  },
});
