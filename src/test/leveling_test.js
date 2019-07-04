var assert = require('assert');

import {getLookup, lvlFromXp, resetTimeFromAnimals, cumsum} from '../leveling';

describe('resetTimeFromAnimals', function() {
  it('should work', function() {
    assert.equal(resetTimeFromAnimals(0), 10000);
    assert.equal(resetTimeFromAnimals(5), 10000);
    assert.equal(resetTimeFromAnimals(10), 11000);
    assert.equal(resetTimeFromAnimals(20), 11000);
    assert.equal(resetTimeFromAnimals(21), 12000);

    assert.equal(resetTimeFromAnimals(10 + 11 + 12), 12000);
    assert.equal(resetTimeFromAnimals(10 + 11 + 13), 13000);
  });
});

describe('getLookup', function() {
  it('should work', function() {
    assert.deepEqual(getLookup(10, 1.1).slice(0, 3), [
      10,
      10 * 1.1,
      10 * 1.1 * 1.1]);
  });

  it('via cumsum', function() {
    assert.deepEqual(cumsum([1, 2, 3]), [1, 3, 6]);

    assert.deepEqual(cumsum(getLookup(100, 1.2).slice(0, 3)), [100, 220, 220 + 120 * 1.2]);
  });
});

describe('lvlFromXp', function() {
  it('should work for level 0', function() {
    assert.equal(lvlFromXp(0, 3, 1.1), 0);
    assert.equal(lvlFromXp(1, 3, 1.1), 0);
    assert.equal(lvlFromXp(2, 3, 1.1), 0);
  });

  it('should work for level 1', function() {
    assert.equal(lvlFromXp(3, 3, 1.1), 1);
    assert.equal(lvlFromXp(4, 3, 1.1), 1);
  });
});

