/* eslint-disable camelcase */

const tap = require('tap');
const p = require('../package.json');

const {
  requestFactory, REQUEST_STATUS_NEW, REQUEST_STATUS_WORKING, REQUEST_STATUS_FINISHED, REQUEST_STATUS_TIMEOUT,
} = require('../lib/index');

tap.test(p.name, (suite) => {
  suite.test('requestFactory', (rf) => {
    rf.test('constructor', (con) => {
      const request = requestFactory('alpha', { a: 1 });

      con.same(request.my.action, 'alpha');
      con.same(request.my.params, { a: 1 });

      con.end();
    });

    rf.test('option timeout', (time) => {
      const request = requestFactory('alpha', { a: 1 }, 'alphans', { time: 500 });

      time.same(request.my.status, REQUEST_STATUS_NEW);
      setTimeout(() => {
        time.same(request.my.status, REQUEST_STATUS_TIMEOUT);
        time.end();
      }, 800);
    });

    rf.test('status transitions', (status) => {
      status.test('working and finished', (statusWF) => {
        const request = requestFactory('alpha', { a: 1 });

        statusWF.same(request.my.status, REQUEST_STATUS_NEW);
        request.do.setStatus(REQUEST_STATUS_WORKING);
        statusWF.same(request.my.status, REQUEST_STATUS_WORKING);
        request.do.setStatus(REQUEST_STATUS_FINISHED);
        statusWF.same(request.my.status, REQUEST_STATUS_FINISHED);
        statusWF.end();
      });

      status.test('a redaction to a bad status', (statusWF) => {
        const request = requestFactory('alpha', { a: 1 });

        statusWF.same(request.my.status, REQUEST_STATUS_NEW);
        request.do.setStatus(REQUEST_STATUS_WORKING);
        statusWF.same(request.my.status, REQUEST_STATUS_WORKING);
        const { thrownError } = request.do.setStatus(REQUEST_STATUS_NEW);
        statusWF.same(thrownError.message,
          'cannot transition to Symbol(request-status-new) '
          + 'from Symbol(request-status-working)');
        statusWF.same(request.my.status, REQUEST_STATUS_WORKING);
        request.do.setStatus(REQUEST_STATUS_FINISHED);
        statusWF.same(request.my.status, REQUEST_STATUS_FINISHED);
        statusWF.end();
      });

      status.end();
    });

    rf.end();
  });

  suite.end();
});
