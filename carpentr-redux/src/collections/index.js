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

      // ensure the presence of named collection
      const next = state.has(collection) ? state : produce(state, (nextState) => {
        nextState.set(collection, new Map());
      });

      // set the data into the map that is a value of the root collection map;
      const collectionMap = next.get(collection);
      const nextCollectionMap = produce(collectionMap, (draft) => draft.set(identity, data));
      return produce(next, (draft) => {
        draft.set(collection, nextCollectionMap);
      });
    },
  },
});
