import Quest from './classes/Quest';

/**
 *
 * @param params {Object}
 * @returns {Quest}
 */
export default function makeQuest(params) {
  return new Quest(params);
}
