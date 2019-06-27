require('./test-base');

import {getImages, expandLayout} from '../instagram';
import {sampleInstagramData} from './instagram-data';

var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1,2,3].indexOf(4), -1);
    });
  });
});


describe('Instagram', function() {
  describe('getImages', function() {
    it('should give correct urls', function() {
      var urls = getImages(sampleInstagramData, 1);
      assert.equal(urls[0], "https:\/\/scontent.cdninstagram.com\/vp\/4482052d05d9c9cdc92a2870a2be659d\/5C626DDB\/t51.2885-15\/e35\/p320x320\/41621787_312704289505358_9459154790316370_n.jpg");
      assert.equal(urls.length, 1);
    });
  });

  describe('layout expander', function() {
    it('should work', function() {
      var expanded = expandLayout('aiai');
      assert.deepEqual(expanded[0], ['kat', 0]);
    });
  });
});

