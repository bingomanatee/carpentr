/* eslint-disable camelcase */
import { createStore, combineReducers } from 'redux';

const tap = require('tap');
const p = require('./../../package.json');

const { changes, status, actions } = require('./../../lib/index');

tap.test(p.name, (suite) => {
  suite.test('changes -- requests', (tChanges) => {
    const chInstance = changes();

    const rootReducer = combineReducers({
      changes: chInstance.reducer,
    });

    const store = createStore(rootReducer);

    //  console.log('store: ', store);
    store.dispatch(chInstance.actions[actions.REQUEST_NEW]({
      view: 'alpha',
      form: 'all users',
    }));

    const currentSnapshot = store.getState();
    tChanges.same(currentSnapshot.changes.requests.size, 1);
    const [req] = Array.from(currentSnapshot.changes.requests.values());
    tChanges.same(req.status, status.NEW);
    tChanges.same(req.form, 'all users');

    store.dispatch(chInstance.actions[actions.REQUEST_UPDATE]({
      uuid: req.uuid,
      update: (newReq) => {
        newReq.status = status.DONE;
      },
    }));
    const nextState = store.getState();
    
    tChanges.same(nextState.changes.requests.size, 1);
    const [req2] = Array.from(nextState.changes.requests.values());
    tChanges.same(req2.status, status.DONE);
    tChanges.same(req2.form, 'all users');
    tChanges.end();
  });

  suite.test('changes -- questions', (ChQ) => {
    const chInstance = changes();

    const rootReducer = combineReducers({
      changes: chInstance.reducer,
    });

    const store = createStore(rootReducer);

    //  console.log('store: ', store);
    store.dispatch(chInstance.actions[actions.REQUEST_NEW]({
      view: 'alpha',
      form: 'all',
      collection: 'users',
    }));

    const currentSnapshot = store.getState();
    const [req] = Array.from(currentSnapshot.changes.requests.values());
    ChQ.same(req.collection, 'users');

    store.dispatch(chInstance.actions[actions.QUESTION_NEW]({
      request: req,
    }));

    const nextSnapshot = store.getState();
    const [question] = Array.from(nextSnapshot.changes.questions.values());

    // form and collection are defaulted to values from the request
    ChQ.same(question.collection, 'users');
    ChQ.same(question.form, 'all');
    ChQ.same(question.request, req.uuid);

    ChQ.end();
  });

  suite.end();
});
