/* eslint-disable camelcase */
import { createStore, combineReducers } from 'redux';
import { VIEW_UPDATE }                  from "../../src/actions";

const tap = require('tap');
const p = require('./../../package.json');

const { views, status, actions } = require('./../../lib/index');

tap.test(p.name, (suite) => {
  suite.test('views', (tViews) => {
    console.log('----- views is ', views);
    const chInstance = views();

    const rootReducer = combineReducers({
      views: chInstance.reducer,
    });

    const store = createStore(rootReducer);
    console.log('store state: ', store.getState());

    //  console.log('store: ', store);
    store.dispatch(chInstance.actions[actions.VIEW_NEW]({
      name: 'userList',
    }));

    const currentSnapshot = store.getState();
    tViews.same(currentSnapshot.views.size, 1);
    const [view] = Array.from(currentSnapshot.views.values());
    tViews.same(view.status, status.NEW);
    tViews.same(view.name, 'userList');

    store.dispatch(chInstance.actions[actions.VIEW_UPDATE]({
      uuid: view.uuid,
      update: (v) => {
        v.status = status.DONE;
      },
    }));
    const nextState = store.getState();
    tViews.same(nextState.views.size, 1);
    const [nextView] = Array.from(nextState.views.values());
    tViews.same(nextView.status, status.DONE);
    tViews.same(nextView.name, 'userList');
    tViews.end();
  });

  suite.end();
});
