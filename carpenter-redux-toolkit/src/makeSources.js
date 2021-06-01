import { createSlice } from '@reduxjs/toolkit';
import Source from './classes/Source';
import { kn } from './utils';
import { Subject } from 'rxjs';
import makeQuest from './makeQuest';
import { QS_NEW } from './constants';

export default function (nameKey = 'sources') {
  return createSlice({
    name: nameKey,
    initialState: {
      sources: new Map(),
      quests: new Subject()
    },
    reducers: {
      add(state, action) {
        const k = kn(action.payload);
        if (state.sources.has(k)) {
          throw new Error('cannot redefine source ' + k);
        }
        state.sources.set(action.payload.name, Source.fromPayload(action.payload));
      },
      /**
       * this action does three things:
       *
       * 1. creates a new quest from the payload
       * 2. broadcasts the new quest to subscribers to state.quests, hopefully, triggering listeners to resolve it
       * 3. a) if there is a callback, return the quest stream
       * 3. b) if there is an obs (observer), subscribe to the payload.obs to watch for updates
       *
       * note -- NOT INITIAL CHANGES/WRITES TO THE STORE is done by this action; instead an ephemeral quest is passed to streams.
       *
       * it responds to '[sliceName]/quest'.  (usu. slices/quest);
       *
       * @param state {Object}
       * @param action {Action}
       */
      quest(state, action) {
        const { payload } = action;
        const { $cb, $obs } = payload;

        const quest = makeQuest(payload);
        /**
         * if the quest has a specific source give that source's listeners
         * first shot at performing the quest.
         */
        if (quest.source) {
          const targetSource = state.sources.get(quest.source);
          if (targetSource) {
            targetSource.quests(quest);
          }
        }
        if (quest.status === QS_NEW) {
          state.quests.next(quest);
        }

        if ($obs) {
          quest.subscribe($obs);
        }
        if ($cb) {
          $cb(quest);
        }
      },

      onQuest(state, action) {
        const { payload } = action;
        let handler = payload;
        let source = null;

        if (typeof payload === 'object') {
          handler = payload.handler;
          source = payload.source;
        }

        state.quests.subscribe({
          error(e) {
            console.log('error in quest sub: ', e);
          },
          next(quest) {
            if (
              quest.isClaimed
              || (source && source !== quest.source)
            ) {
              return;
            }

            handler(quest);
          }
        });
      },
      set(state, action) {
        const { payload } = action;
        const { source: sourceKey, value } = payload;
        if (!state.sources.has(sourceKey)) {
          state.sources.set(sourceKey, new Source(sourceKey));
        }

        state.sources.get(sourceKey).set(kn(payload), value);
      },
      del(state, action) {
        const { payload } = action;
        if (!state.sources.has(payload.source)) {
          console.warn('attempt to remove a record from non-existent source: ', +payload.sources);
          return;
        }
        state.sources.get(payload.source).del(kn(payload));
      }
    }
  });
}
