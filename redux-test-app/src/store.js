import camelCase from 'lodash/camelCase';
import storeFactory from './storeFactory';

const { store, actions } = storeFactory();
export default {
  store,
  actions,
  mapStore: (stateI) => ({ state: stateI }),
  mapActions: (dispatch) => {
    const mergedActions = {__subscribe: (...args) => store.subscribe(...args)};
    Object.keys(actions).forEach((key) => {
      const actionGroup = actions[key];
      const group = {};
      mergedActions[key] = group;

      // blend dispatch into each tier of actions
      Object.keys(actionGroup).forEach((actionName) => {
        const fn = actionGroup[actionName];
        group[camelCase(actionName)] = (...args) => dispatch(fn(...args));
      });
    });
    return { actions: mergedActions };
  },
};
