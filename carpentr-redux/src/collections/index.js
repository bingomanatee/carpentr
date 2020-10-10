import { createSlice } from '@reduxjs/toolkit';
import produce from 'immer';
import { COLLECTION_SET } from '../actions';

/**
 * returns a slice that contains a map of maps that store collection ID/values.
 * collections is a "map of maps"; each collection is stored in the root map,
 * and is itself a map of records.
 */
export default () => createSlice({
  name: 'collections',
  initialState: produce(new Map(), () => {}),
  reducers: {
    [COLLECTION_SET]: (state, action) => {
      const { collection, identity, data } = action.payload;
      // validate collection
      if (!(collection && (typeof collection === 'string'))) {
        throw new Error('COLLECTION_SET requires a string for collection name');
      }
      if (!state.has(collection)) state.set(collection, new Map());
      state.get(collection).set(identity, data);
      return state;
    },
  },
});
