import { createStore, combineReducers } from 'redux';
import carpentr from './carpentr-redux';
const { changes, views, collections } = carpentr;

export default () => {
  const chInstance = changes();
  const vInstance = views();
  const collInstance = collections();

  const rootReducer = combineReducers({
    changes: chInstance.reducer,
    views: vInstance.reducer,
    collections: collInstance.reducer,
  });

  const store = createStore(rootReducer);

  const actions = { changes: chInstance.actions, views: vInstance.actions, collections: collInstance.actions };

  console.log('store!', store);
  return {
    store,
    actions,
  };
};
