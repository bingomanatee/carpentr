/* eslint-disable camelcase */

const tap = require('tap');
const p = require('../package.json');

const { storeFactory, RECORD_STATE_NEW, RECORD_STATE_PERSISTED } = require('../lib/index');

tap.test(p.name, (suite) => {
  suite.test('storeFactory', (storeTests) => {
    storeTests.test('creation', (rfc) => {
      const store = storeFactory('widgets');

      rfc.same(store.name, 'widgets');

      rfc.end();
    });

    storeTests.test('createRecord', (cr) => {
      const store = storeFactory('widgets');
      store.do.createRecord('alpha', { name: 'Bob', age: 20 });
      cr.same(store.my.records.get('alpha').props.name, 'Bob');

      store.do.createRecord('beta', { name: 'Sally', age: 30 });
      cr.same(store.my.records.get('beta').props.name, 'Sally');

      cr.same(store.my.records.size, 2, 'store has two records');
      cr.end();
    });

    storeTests.test('updateRecordFields', (ur) => {
      const store = storeFactory('widgets');

      store.do.createRecord('alpha', { name: 'Bob', age: 20 });
      store.do.updateRecordProps('alpha', { age: 30 });

      ur.same(store.my.records.get('alpha').props.name, 'Bob');
      ur.same(store.my.records.get('alpha').props.age, 30);

      ur.end();
    });

    storeTests.test('updateRecordStatus', (cr) => {
      const store = storeFactory('widgets');

      store.do.createRecord('alpha', { name: 'Bob', age: 20 });
      cr.same(store.my.records.get('alpha').status, RECORD_STATE_NEW);

      store.do.updateRecordStatus('alpha', RECORD_STATE_PERSISTED);
      cr.same(store.my.records.get('alpha').status, RECORD_STATE_PERSISTED);

      cr.end();
    });

    storeTests.test('removeRecord', (cr) => {
      const store = storeFactory('widgets');

      store.do.createRecord('alpha', { name: 'Bob', age: 20 });
      cr.ok(store.do.hasRecord('alpha'));

      store.do.removeRecord('alpha');
      cr.notOk(store.do.hasRecord('alpha'));

      cr.end();
    });

    storeTests.test('setMeta', (meta) => {
      const store = storeFactory('widgets');

      store.do.createRecord('alpha', { name: 'Bob', age: 20 });
      store.do.updateRecordMeta('alpha', 'a', 3);

      meta.same(store.do.record('alpha'), {
        identity: 'alpha',
        props: { name: 'Bob', age: 20 },
        store: 'widgets',
        status: RECORD_STATE_NEW,
        meta: { a: 3, originalProps: { name: 'Bob', age: 20 } },
      });
      store.do.updateRecordMeta('alpha', 'b', 6);

      meta.same(store.do.record('alpha'), {
        identity: 'alpha',
        props: { name: 'Bob', age: 20 },
        store: 'widgets',
        status: RECORD_STATE_NEW,
        meta: { a: 3, b: 6, originalProps: { name: 'Bob', age: 20 } },
      });

      meta.end();
    });

    storeTests.test('onNewRecord', (onr) => {
      const store = storeFactory('widgets');
      //  store._eventSubject.subscribe((e) => console.log('create -- subject event', e.toString()));
      //  store.fields.records._eventSubject.subscribe((e) => console.log('create -- records event', e.toString()));
      //  store.fields.records.debug = true;
      store.do.onNewRecord((record) => {
        Object.keys(record.props).forEach((name) => {
          const newVal = record.props[name];
          switch (name) {
            case 'name':
              if (!(newVal && typeof newVal === 'string')) {
                throw (new Error('name must be nonempty string'));
              }
              break;
            case 'age':
              if (!(typeof newVal === 'number' && newVal > 0)) {
                throw (new Error('age must be a positive number'));
              }
              break;
          }
        });
      });

      store.do.createRecord('alpha', { name: 'Bob', age: 20 });
      onr.same(store.do.record('alpha').props, { name: 'Bob', age: 20 });

      const { thrownError } = store.do.createRecord('beta', { name: '' });
      onr.same(thrownError.message, 'name must be nonempty string');

      onr.notOk(store.do.hasRecord('beta'));

      onr.end();
    });

    storeTests.test('onNewRecord - with raw adds', (onr) => {
      const store = storeFactory('widgets');

      store.do.onNewRecord((record) => {
        try {
          Object.keys(record.props).forEach((name) => {
            const newVal = record.props[name];
            switch (name) {
              case 'name':
                if (!(newVal && typeof newVal === 'string')) {
                  throw (new Error('name must be nonempty string'));
                }
                break;
              case 'age':
                if (!(typeof newVal === 'number' && newVal > 0)) {
                  throw (new Error('age must be a positive number'));
                }
                break;
            }
          });
        } catch (err) {
          console.log('error setting filters: ', err);
        }
      });

      // console.log('thrown error on basic set', te2);
      // console.log('--- records are now', store.my.records);
      onr.end();
    });

    storeTests.test('request', (req) => {
      const store = storeFactory('widgets');

      store.do.request('get', 100);
      const [request] = [...store.my.requests.values()];

      req.same(request.action, 'get');
      req.same(request.params, 100);

      req.end();
    });

    storeTests.test('watchForRequests', (req) => {
      const store = storeFactory('widgets', { debug: true });

      const observedRequests = [];
      const observedStreams = [];

      store.do.onRequest((r, s) => {
        observedRequests.push(r);
        observedStreams.push(s);
      });

      req.same(observedRequests.length, 0);

      store.do.request('get', 100);

      req.same(observedRequests.length, 1);
      req.same(observedRequests[0].params, 100);
      req.same(observedRequests[0].action, 'get');

      store.do.request('delete', 100);

      req.same(observedRequests.length, 2);
      req.same(observedRequests[1].params, 100);
      req.same(observedRequests[1].action, 'delete');

      req.end();
    });

    storeTests.end();
  });

  suite.end();
});
