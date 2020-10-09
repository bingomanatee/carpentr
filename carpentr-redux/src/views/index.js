/* eslint-disable arrow-body-style */
import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';
import { VIEW_NEW, VIEW_UPDATE, VIEW_DELETE } from '../actions';
import view from './view';
import { addToMap, updateMap } from '../utils';

/**
 * returns a slice that contains a map of maps that store view definitions.
 * views is a "map of maps"; each view is stored in the root map,
 * and is itself a map of records.
 */
export default () => createSlice({
  name: 'views',
  initialState: produce(new Map(), () => {}),
  reducers: {
    [VIEW_NEW]: (state, action) => {
      const newView = view(action.payload);

      return produce(state, (next) => {
        next.set(newView.uuid, newView);
      });
    },
    [VIEW_DELETE]: (state, action) => {
      const { uuid } = action.payload;

      return produce(state, (next) => {
        next.delete(uuid);
      });
    },
    [VIEW_UPDATE]: (state, action) => {
      const { uuid, update, filter } = action.payload;

      // either change all the views that meet a criteria ...
      if (filter) {
        if (!(typeof filter === 'function') || (filter === true)) {
          throw new Error('filter must be true or a function');
        }
        const replacements = new Map();
        state.forEach((baseView, viewUuid) => {
          if (filter === true || filter(baseView)) {
            const nextView = produce(baseView, update);
            replacements.set(viewUuid, nextView);
          }
        });
        let nextState = state;
        replacements.forEach((nextView, viewUuid) => {
          nextState = produce(nextState, (draft) => {
            draft.set(viewUuid, nextView);
          });
        });
        return nextState;
      }

      // ... or change a single view identified by uuid
      if (!(uuid && typeof uuid === 'string')) {
        console.log('view_update called with bad selector; uuid = ', uuid, 'filter = ', filter);
        throw new Error('cannot update view without a string UUID (or filter)');
      }
      const base = state.get(uuid);
      if (!base) {
        console.log('cannnot find view:', action);
        return state;
      }

      return produce(state, (next) => {
        next.set(uuid, produce(base, update));
      });
    },
  },
});
