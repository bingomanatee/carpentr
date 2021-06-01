import lGet from 'lodash/get';
import { QS_NEW } from '../constants';
import { immerable } from 'immer';
import { nanoid } from '@reduxjs/toolkit';

/**
 * an immutable value type for quests.
 */
export default class QuestValue {
  /**
   *
   * @param initial {Object?}
   */
  constructor(initial) {
    this.source = lGet(initial, 'source', null);
    this._key = lGet(initial, 'key') || nanoid();
    this.question = lGet(initial, 'question', null);
    this.status = QS_NEW;
    this.meta = lGet(initial, 'meta', {});
  }

  get key() {
    return this._key;
  }
}

QuestValue[immerable] = true;
