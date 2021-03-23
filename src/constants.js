export const RECORD_STATE_NEW = Symbol('record-state-new');
export const RECORD_STATE_SAVING = Symbol('record-state-saving');
export const RECORD_STATE_UPDATING = Symbol('record-state-updating');
export const RECORD_STATE_GETTING = Symbol('record-state-getting');
// any record that is returned from a request or has been successfully saved or updated has this status
export const RECORD_STATE_PERSISTED = Symbol('record-state-persisted');
export const RECORD_STATE_DELETING = Symbol('record-state-deleting');
export const RECORD_STATE_DELETED = Symbol('record-state-deleted');

export const REQUEST_STATUS_NEW = Symbol('request-status-new');
export const REQUEST_STATUS_WORKING = Symbol('request-status-working');
export const REQUEST_STATUS_ERROR = Symbol('request-status-error');
export const REQUEST_STATUS_FINISHED = Symbol('request-status-finished');
export const REQUEST_STATUS_TIMEOUT = Symbol('request-status-timeout');

export const ACTION_NEW_RECORD = Symbol('action-new-record');
export const ACTION_NEW_REQUEST = Symbol('action-new-request');
