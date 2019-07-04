import {PathBuilder, dedupNodes, connectNodes, mirror} from '../model';
import {Point} from '../vectorutils';

var assert = require('assert');


describe('dedupNodes', function() {
  it('Point arrs should be equal', function() {
    assert.deepEqual(
      [new Point(0, 0), new Point(1, 0)],
      [new Point(0, 0), new Point(1, 0)]
    );
  });

  it('Point arrs should be not equal', function() {
    assert.notDeepEqual(
      [new Point(0, 0), new Point(0, 0), new Point(1, 0)],
      [new Point(0, 0), new Point(1, 0)]
    );
  });

  it('should work basic', function() {
    assert.deepEqual(
      dedupNodes([new Point(0, 0), new Point(0, 0), new Point(1, 0)]),
      [new Point(0, 0), new Point(1, 0)]
    );
  });

  it('should work with multiple', function() {
    assert.deepEqual(
      dedupNodes([new Point(0, 0), new Point(0, 0), new Point(1, 0), new Point(1, 0), new Point(1, 0)]),
      [new Point(0, 0), new Point(1, 0)]
    );
  });
});

describe('connectNodes', function() {
  it('should work basic', function() {
    assert.deepEqual(
      connectNodes([new Point(0, 0), new Point(3, 0)]),
      [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(3, 0)]
    );
  });
});

describe('mirror', function() {
  it('should work basic', function() {
    assert.deepEqual(
      mirror([1, 2, 3]),
      [1, 2, 3, 2, 1]
    );
  });

  it('returns [] for []', function() {
    assert.deepEqual(
      mirror([]),
      []
    );
  });
});
