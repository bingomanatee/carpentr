/* eslint-disable camelcase */
import { createStore, combineReducers } from 'redux';

const tap = require('tap');
const p = require('./../../package.json');

const { collections, actions } = require('./../../lib/index');

tap.test(p.name, (suite) => {
  suite.test('collections', (tColl) => {
    const collInstance = collections();

    const rootReducer = combineReducers({
      collections: collInstance.reducer,
    });

    const store = createStore(rootReducer);

    //  console.log('store: ', store);
    store.dispatch(collInstance.actions[actions.COLLECTION_SET]({
      identity: 100,
      collection: 'users',
      data: { id: 100, name: 'Bob' },
    }));

    const current = store.getState();

    tColl.same(Array.from(current.collections.keys()), ['users']);
    tColl.same(Array.from(current.collections.get('users').keys()), [100]);
    tColl.same(current.collections.get('users').get(100).name, 'Bob');

    store.dispatch(collInstance.actions[actions.COLLECTION_SET]({
      identity: 200,
      collection: 'users',
      data: { id: 200, name: 'Sue' },
    }));

    const next = store.getState();

    tColl.same(Array.from(next.collections.keys()), ['users']);
    tColl.same(Array.from(next.collections.get('users').keys()), [100, 200]);
    tColl.same(next.collections.get('users').get(100).name, 'Bob');
    tColl.same(next.collections.get('users').get(200).name, 'Sue');
    // console.log('current:', current);
    tColl.end();
  });

  suite.end();
});
