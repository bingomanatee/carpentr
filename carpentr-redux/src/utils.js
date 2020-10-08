import produce from 'immer';


/**
 * puts an object with a UUID into the map attached to a state's map property
 * note - will overwrite entry with the same uuid.
 *
 * @param state {object} an item with a map property
 * @param registryKey {String} the name of the key
 * @param element {Object} an element with a uuid string property
 * @returns {<Base extends Immutable<function(*): void>>(base?: Base, ...rest: Tail<Parameters<*>>) => Produced<Base, ReturnType<*>>}
 */
export const addToMap = (state, registryKey, element) => produce(state, (nextState) => {
  // validate parameters
  if (!(
    (nextState && (typeof nextState === 'object'))
    && (registryKey && (typeof registryKey === 'string'))
  )) {
    console.log('addToMap: bad state or registryKey', state, registryKey);
    return;
  }

  if (!(
    (element && (typeof element === 'object'))
    && (element.uuid && (typeof element.uuid === 'string'))
  )) {
    console.log('addToMap: un-addable element', element);
    return;
  }

  const reg = nextState[registryKey];
  nextState[registryKey] = produce(reg, (map) => {
    map.set(element.uuid, element);
  });
});

export const updateMap = (state, registryKey, uuid, update) => produce(state, (nextState) => {
  // deconstruct uuid if it is an object
  if (typeof uuid === 'object') {
    update = uuid.update;
    uuid = uuid.uuid;
  }

  // validate parameters
  if (!(
    (nextState && (typeof nextState === 'object'))
    && (registryKey && (typeof registryKey === 'string'))
  )) {
    console.log('updateMap: bad state or registryKey', state, registryKey);
    return;
  }
  // the UUID is missing/bad
  if (!(uuid && (typeof uuid === 'string'))) {
    console.log('empty/bad key passed to update ', registryKey, '; uuid = ', uuid);
    return;
  }
  // update is not a function;
  if (typeof update !== 'function') {
    console.log('update must be a function for ', registryKey, uuid, 'but is ', update);
    return;
  }
  const reg = nextState[registryKey];
  const base = reg.get(uuid);

  if (!base) {
    console.log('cannot find  ', uuid, 'in ', registryKey);
    return;
  }
  // alter the target with the update function;
  const next = produce(base, update);
  if (next.uuid !== uuid) {
    console.log('bad mutation of ', uuid, ':', next);
    throw new Error(`cannot mutate uuid of member of ${registryKey}`);
  }

  // append an updated map to the state
  nextState[registryKey] = produce(reg, (nextMap) => {
    nextMap.set(uuid, next);
  });
});
