export const LIB_NAME = 'Library';
export const LIB_VERSION = '1.0.0';
export const CLASSTYPE_SOURCE = Symbol('Source');

export const QS_NEW = Symbol('quest-status-new');
export const QS_WORKING = Symbol('quest-status-getting');
export const QS_RETURNED = Symbol('quest-status-returned');
export const QS_COMPLETED = Symbol('quest-status-completed');
export const QS_FAILED = Symbol('quest-status-failure');

/**
 * the expected flow of quests are:
 *
 * 1: created with a status of QS_NEW
 * 2: a listener capable of handling the quest changes the status to QS_WORKING
 * 3. makes any calls, async actions etc to do the work
 * 4. if it succeeds the worker changes the status to QS_RETURNED
 *
 * note - at this point one of two things happen:
 *
 * if the same worker that GOT the data is capable of updating the store it does so
 * --- or ---
 * if there are any subscribers to the quest that are capable of updating the store, they do so
 *
 * whichever worker translates the returned quest to store may also be responsible for
 * updating the quest and its metadata.
 *
 * 5. Now that the store has (one way or another) have had time to complete, the quest is
 *    advanced to the state of completed. This gives any observers a chance to read the quests'
 *    value right before the stream actually completes.
 * 6. The quest stream is completed, closing it.
 */
