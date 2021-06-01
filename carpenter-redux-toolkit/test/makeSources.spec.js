import makeSources from '../src/makeSources';
import produce, { enableMapSet, enableES5 } from 'immer';
import lGet from 'lodash/get';
import { QS_NEW } from '../src/constants';
import { Subject } from 'rxjs';

/**
 * note - in production this is called by the module's root file --
 * but in testing files in isolation, the root may not be called so we do this here.
 *
 */
enableMapSet();
enableES5();

const remoteKittens = new Map([[
  'fluffy',
  { age: 0.5, color: 'red' }
],
[
  'mittens',
  { age: 1, color: 'blue' }
],
[
  'blackie',
  { age: 0.75, color: 'black' }
]
]);

describe('carpenter-redux-toolkit', () => {
  describe('makeSources', () => {
    it('should start with an empty sources map', () => {
      const slice = makeSources();
      const defaultState = slice.reducer({ sources: new Map() }, { type: 'noop' });

      expect(defaultState.sources.size).toBe(0);
    });

    describe('add', () => {
      const slice = makeSources();
      const withStoreState = slice.reducer({ sources: new Map() }, slice.actions.add({ name: 'users' }));

      expect(withStoreState.sources.size).toBe(1);
      expect(withStoreState.sources.has('users')).toBeTruthy();
    });

    describe('setSourceKeyVal', () => {
      const slice = makeSources();
      const afterAddingMittens = slice.reducer({ sources: new Map() }, slice.actions.setSourceKeyVal({
        source: 'kittens', key: 'Mittens', value: { age: 0.5 }
      }));

      expect(afterAddingMittens.sources.get('kittens').get('Mittens').age).toBe(0.5);
    });

    describe('delSourceKey', () => {
      const slice = makeSources();
      let state = slice.reducer({ sources: new Map() }, slice.actions.setSourceKeyVal({
        source: 'kittens', key: 'Mittens', value: { age: 0.5 }
      }));
      state = slice.reducer(state, slice.actions.setSourceKeyVal({
        source: 'kittens', key: 'Furry', value: { age: 1 }
      }));
      state = slice.reducer(state, slice.actions.setSourceKeyVal({
        source: 'kittens', key: 'Doug', value: { age: 2 }
      }));

      expect(state.sources.get('kittens').size).toBe(3);
      state = slice.reducer(state, slice.actions.delSourceKey({ source: 'kittens', key: 'Furry' }));
      expect(state.sources.get('kittens').size).toBe(2);
      expect(state.sources.get('kittens').has('Furry')).toBeFalsy();

      // validate you can pass a missing key in without throwing.
      state = slice.reducer(state, slice.actions.delSourceKey({ source: 'kittens', key: 'Furry' }));
      expect(state.sources.get('kittens').size).toBe(2);
    });

    describe('quest', () => {
      it('should allow hooks to act', (done) => {
        const slice = makeSources();
        let state = slice.reducer({ sources: new Map(),
          quests: new Subject() }, { type: 'noop' });

        state = slice.reducer(state, slice.actions.onQuest(
          {
            source: 'kittens',
            handler: (q) => {
              if (lGet(q, 'question.task') === 'getOne') {
                q.start();
                const kittenKey = lGet(q, 'question.id');

                // asynchronously respond with a simulated fetch from a kitten DB

                requestAnimationFrame(() => {
                  const kitten = remoteKittens.get(kittenKey);
                  state = slice.reducer(state, slice.actions.setSourceKeyVal({
                    source: 'kittens',
                    key: kittenKey,
                    value: kitten
                  }));
                  // update the q's meta with a formal manifest of the changes
                  q.meta({
                    data: kittenKey,
                    source: 'kittens',
                    form: 'ONE_DATA'
                  });
                  // set kitten as the answer and complete the quest
                  q.finish(kitten);
                });
              } // in all other circumstances ignore the q
            }
          }
        ));
        let quest;

        // create a "get kitten" quest

        state = slice.reducer(state, slice.actions.quest({
          source: 'kittens',
          question: {
            task: 'getOne',
            id: 'mittens'
          },
          $cb(q) {
            quest = q;
            q.subscribe({
              complete() {
                // when this quest is complete there shoudl be a kitten in the store
                expect(state.sources.get('kittens').size).toBe(1);
                done();
              },
              error(e) {
                console.log('error in quest:', e, 'quest = ', quest);
                done(e);
              }
            });
          }
        }));
      });
    });
  });
});
