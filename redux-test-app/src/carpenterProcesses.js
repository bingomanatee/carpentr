import * as status from './carpentr-redux/status';
import * as constants from './carpentr-redux/constants';

const { ALL } = constants;

function makeUserQuestions({
  collection,
  form,
}) {
  if (collection !== 'users') return false;

  let out = false;
  switch (form) {
    case 'all':
      out = {
        collection: 'users',
        form: {
          url: '/api/users',
          method: 'get',
        },
      };
      break;

    default:
      out = false;
  }
  return out;
}

export function handleUsers({
  actions,
}) {
  actions.changes.requestAddHandler({
    handler: makeUserQuestions,
    collection: 'users',
  });
}

function noHandlers(req, actions) {
  const info = actions.changes.requestUpdate({
    uuid: req.uuid,
    update: (draftReq) => {
      console.log(' >>>>>>>>>>>> draftReg update: ', draftReq);
      draftReq.status = status.ERROR;
      draftReq.error = `there are no handlers for request ${req.uuid}: ${req.collection || '(all)'}`;
      console.log(' >>>>>>>> AFTER draftReg update: ', draftReq);
    },
  });

  console.log('info: ', info);
  console.log('DONE ----------------- noHandlers updating ', req);
}

let newRequestIds = [];

/**
 * find any requests and see if there is a handler to transform them into one or more questions.
 * Handlers accept requests and actions as parameters; some may assert the questions manually,
 * others may return a question to be saved, or an array of questions to be saved.
 *
 * If a new request cannot be handled it is marked as error.
 *
 * @param requests {Map}
 * @param handlers {Map} a map of sets, keyed to collections; and a general "ALL" collection of handlers that
 * respond to requests regardless of their specified collection (or lack of specified collection).
 * @param actions {Object}
 */
export function requestsToActions(store, actions) {
  const { requests, requestHandlers } = store;
  const newRequests = [];
  requests.forEach((req) => {
    console.log('--- checking ', req.uuid, req.status);
    if (newRequestIds.includes(req.uuid)) {
      return;
    }
    if (req.status === status.NEW) {
      console.log('--- adding ', req.uuid, req.status);
      newRequests.push(req);
      newRequestIds.push(req.uuid);
    }
  });
  if (!newRequests.length) {
    return;
  }
  console.log('---- unprocessed requests: ', newRequests);
  /**
   * for each request that is new, either create questions via a stored handler
   * or mark the request as an error, as it is unanswerable (unquestionable?).
   */
  newRequests.forEach((req) => {
    const { collection } = req;
    const allHandlers = requestHandlers.has(ALL) ? requestHandlers.get(ALL) : new Set();
    let cHandlers = new Set();
    if (collection && requestHandlers.has(collection)) {
      cHandlers = requestHandlers.get(collection);
    }

    const potentialHandlers = [
      ...Array.from(cHandlers.values()),
      ...Array.from(allHandlers).values(),
    ];

    let handledOutput = false;
    while ((!handledOutput) && potentialHandlers.length) {
      const nextHandler = potentialHandlers.shift();
      handledOutput = nextHandler(req, actions);
    }

    if (handledOutput) {
      if (Array.isArray(handledOutput)) {
        handledOutput.forEach(actions.questionNew);
      } else if (typeof handledOutput === 'object') {
        actions.changes.questionNew({ ...handledOutput, request: req });
      }
      // else = its truthy, meaning, the handler created all the actions it needs.

      // in any case - mark the request as being worked so we don't try to re-handle it.
      actions.changes.requestUpdate({
        uuid: req.uuid,
        update: (draft) => {
          draft.status = status.WORKING;
        },
      });
    } else {
      noHandlers(req, actions);
    }
    setTimeout(() => {
      newRequestIds = newRequestIds.filter((id) => id !== req.uuid);
    });
  });
}
