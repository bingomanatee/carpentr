/* eslint-disable camelcase */

const tap = require('tap');
const p = require('../package.json');

const {
  baseFactory, REQUEST_STATUS_NEW, REQUEST_STATUS_WORKING,
  REQUEST_STATUS_ERROR, REQUEST_STATUS_FINISHED, REQUEST_STATUS_TIMEOUT,
} = require('../lib/index');

tap.test(p.name, (suite) => {
  suite.test('baseFactory', (bf) => {
    bf.test('constructor', (con) => {
      const base = baseFactory('systemItems');
      con.same(base.name, 'systemItems');
      con.end();
    });

    bf.test('stores', (st) => {
      const base = baseFactory('systemItems');
      base.do.addStore('widgets');
      const store = base.do.store('widgets');

      st.same(store.name, 'widgets');

      base.do.createRecord('widgets', 'alpha', { name: 'Bob', age: 20 });
      const bob = base.do.r('widgets', 'alpha');

      st.same(bob.identity, 'alpha');
      st.same(bob.props.name, 'Bob');

      st.end();
    });
    bf.end();
  });
  suite.end();
});
