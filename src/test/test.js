import {PathBuilder, dedupNodes, connectNodes} from '../model';
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
