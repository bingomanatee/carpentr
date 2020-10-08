/* eslint-disable camelcase */
const { produce, enableMapSet } = require('immer');
const tap = require('tap');
const p = require('./../package.json');

enableMapSet();

const { addToMap, updateMap } = require('./../lib/index');

tap.test(p.name, (suite) => {
  suite.test('utils', (u) => {
    u.test('addToMap', (add) => {
      const plants = produce({ flowers: new Map() }, (a) => {});

      const nextPlants = addToMap(plants, 'flowers', { uuid: 'rose', name: 'Rose' });
      add.same(nextPlants.flowers.get('rose').name, 'Rose');

      add.end();
    });

    u.test('updateMap', (update) => {
      const plants = produce({ flowers: new Map() }, (a) => {});
      const nextPlants = addToMap(plants, 'flowers', { uuid: 'rose', name: 'Rose' });
      const pricedRose = updateMap(nextPlants, 'flowers', 'rose', (rose) => {
        rose.cost = 20;
      });
      update.same(pricedRose.flowers.get('rose').cost, 20);

      update.end();
    });

    u.end();
  });
  suite.end();
});
