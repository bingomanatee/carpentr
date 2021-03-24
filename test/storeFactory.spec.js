/* eslint-disable camelcase */

const tap = require('tap');
const p = require('../package.json');

const {
  storeFactory, RECORD_STATE_NEW, RECORD_STATE_PERSISTED,
  REQUEST_STATUS_WORKING, REQUEST_STATUS_ERROR, REQUEST_STATUS_FINISHED,
} = require('../lib/index');

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

      meta.same(store.do.record('alpha').pure, {
        identity: 'alpha',
        props: { name: 'Bob', age: 20 },
        store: 'widgets',
        status: RECORD_STATE_NEW,
        meta: { a: 3, originalProps: { name: 'Bob', age: 20 } },
      });
      store.do.updateRecordMeta('alpha', 'b', 6);

      meta.same(store.do.record('alpha').pure, {
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

    // @TODO: get raw adds to work with onNewRecord
    if (false) {
      storeTests.test('onNewRecord - with raw adds', (onr) => {
        const store = storeFactory('widgets');
        const hits = [];

        store.do.onNewRecord((record) => {
          hits.push(record);
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

        store.fields.records.set('alpha', { props: { name: 'Bob', age: 20 } });
        onr.same(hits.length, 1);
        onr.ok(store.do.hasRecord('alpha'));

        const { thrownError: te2 } = store.fields.records.set('beta', { props: { name: '', age: -2 } });
        onr.same(hits.length, 2);
        onr.notOk(store.do.hasRecord('beta'));
        //   console.log('thrown error on basic set', te2);
        onr.same(te2.message, 'name must be nonempty string');

        onr.end();
      });
    }

    storeTests.test('request', (req) => {
      const store = storeFactory('widgets');

      store.do.request('get', 100);
      const [request] = [...store.my.requests.values()];

      req.same(request.my.action, 'get');
      req.same(request.my.params, 100);

      req.end();
    });

    storeTests.test('watchForRequests', (req) => {
      const store = storeFactory('widgets');

      const observedRequests = [];

      store.do.onRequest((r) => {
        observedRequests.push(r);
      });

      req.same(observedRequests.length, 0);

      store.do.request('get', 100);

      req.same(observedRequests.length, 1);
      req.same(observedRequests[0].my.params, 100);
      req.same(observedRequests[0].my.action, 'get');

      store.do.request('delete', 100);

      req.same(observedRequests.length, 2);
      req.same(observedRequests[1].my.params, 100);
      req.same(observedRequests[1].my.action, 'delete');

      req.end();
    });

    const mockRegistry = new Map([
      ['alpha', { name: 'Bob', age: 20 }],
      ['beta', { name: 'Jane', age: 30 }],
    ]);
    const handleGet = (store) => (
      (req) => {
        try {
          if (!req.do.isOpen()) return;
          switch (req.my.action) {
            case 'get':
              req.do.work();
              setTimeout(() => {
                if (mockRegistry.has(req.my.params)) {
                  const { value: record, thrownError } = store.do.createRecord(req.my.params, mockRegistry.get(req.my.params));
                  if (!thrownError) {
                    req.do.finish(record);
                  } else {
                    req.do.fail(thrownError);
                  }
                } else {
                  req.do.fail('404');
                }
              }, 100);
              break;
          }
        } catch (err) {
          console.log('--- error in handleGet:', err.message);
        }
      }
    );
    storeTests.test('mock store - failed request', (failTest) => {
      const store = storeFactory('widgets');
      store.do.onRequest(handleGet(store));

      const req1 = store.do.request('get', 'gamma');
      failTest.same(req1.my.status, REQUEST_STATUS_WORKING);

      req1.subscribe({
        next(req) {
          if (req.status === REQUEST_STATUS_ERROR) {
            failTest.notOk(store.do.hasRecord('gamma'));
            failTest.end();
          }
        },
        error(err) {
          console.log('--- request error: ', err);
        },
      });
    });

    storeTests.test('mock store', (mockTest) => {
      const store = storeFactory('widgets');
      store.do.onRequest(handleGet(store));

      const req1 = store.do.request('get', 'alpha');
      req1.subscribe({
        next: (req) => {
          if (req.status === REQUEST_STATUS_FINISHED) {
            mockTest.ok(store.do.hasRecord('alpha'));
            mockTest.same(store.do.r('alpha').props.name, 'Bob');
            mockTest.end();
          }
        },
        error(err) {
          console.log('-error in request:', err.message);
        },
      });
      mockTest.same(req1.my.status, REQUEST_STATUS_WORKING);
    });

    storeTests.end();
  });

  suite.end();
});
