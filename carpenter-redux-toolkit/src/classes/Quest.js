import { BehaviorSubject } from 'rxjs';
import { produce } from 'immer';
import identity from 'lodash/identity';
import QuestValue from './QuestValue';
import {QS_COMPLETED, QS_FAILED, QS_NEW, QS_RETURNED, QS_WORKING} from '../constants';
import { nanoid } from '@reduxjs/toolkit';

/**
 * a stream of updates for a specific request.
 * note -- NOT IMMERABLE or immutable in any way and NOT INTENDED
 * to be kept in a store. It flows through handlers and prompts store updates,
 * but its a message mechanic not a value to be directly shared.
 *
 * however - its value IS an Immer product.. though that may change.
 */
export default class Quest extends BehaviorSubject {
  constructor(initial) {
    const key = nanoid();
    super(produce(new QuestValue({ ...initial, key }), identity));
    this._key = key;
    this._question = this.value.question;
  }

  get key() {
    return this._key;
  }

  /**
   * caches question from value; after the quest is stopped, remembers last question
   * the question should not change -- if it did, should be subscribed to
   * @returns {*}
   */
  get question() {
    if (!this.isStopped) {
      this._question = this.value.question;
    }
    return this._question;
  }
  start() {
    const value = this.value;
    if (this.isClaimed) {
      throw new Error('already handled');
    }
    const nextValue = produce(value, (d) => void(d.status = QS_WORKING));
    Quest.startedRegistry.add(nextValue.key);
    this.next(nextValue);
    return nextValue;
  }

  meta(meta) {
    this.next(produce(this.value, (draft) => void(draft.meta = meta)));
  }

  get isClaimed() {
    if (this.status !== QS_NEW) {
      return true;
    }
    return Quest.startedRegistry.has(this.key);
  }

  get status() {
    if (this.hasError) {
      return QS_FAILED;
    }
    if (this.isStopped) {
      return QS_COMPLETED;
    }
    return this.value.status;
  }

  /**
   * some quests are source-specific
   * @returns {null|*}
   */
  get source() {
    if (this.isStopped) {
      return null;
    }
    return this.value.source;
  }

  finish(answer) {
    if (this.status !== QS_WORKING) {
      throw new Error(
        'cannot finish a quest unless its status is working'
      );
    }
    // broadcast twice; once notifying the return value
    this.next(produce(this.value, (d) => {
      d.state = QS_RETURNED;
      d.answer = answer;
    }));
    // .... and once notifying that the quest is completed.
    this.next(produce(this.value, (d) => void(d.state = QS_COMPLETED)));
    this.complete();
  }
  fail(error) {
    const value = this.value;
    this.next(produce(value, (d) => {
      d.state = QS_FAILED;
      d.answer = error;
    }));
    this.complete();
  }
}

/**
 * to ensure that no more than one handler can claim a single quest,
 * each quest when started (claimed) by a handler puts its key in startedRegistry.
 * start checks this registry and throws if more than one handler calls start.
 */

Quest.startedRegistry = new Set();
