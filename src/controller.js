var key = require('keymaster');

import {PathBuilder} from './model';
import {pixelToCoord} from './utils';
import {Point} from './vectorutils';


function coordFromEvent(e, el) {
  let top = el.offsetTop;
  let left = el.offsetLeft;
  let mousePos = new Point(e.clientX, e.clientY);
  let canvasPos = new Point(left, top);
  return pixelToCoord(mousePos.sub(canvasPos));
}


export class Controller {
  constructor(model) {
    this.model = model;

    key('enter', function() { console.warn('enter was pressed'); });
    key('esc', function() { console.warn('esc was pressed'); });
    key('a', function() { console.warn('a was pressed'); });
  }

  handleMouseMove(e, el) {
    let coord = coordFromEvent(e, el);

    console.info(`Hover over tile ${coord} ` +
                 `${this.model.tiles[coord]}`);
  }

  startPath() {
    this.model.startPath();
  }

  handleMouseDown(e, el) {
    let coord = coordFromEvent(e, el);
    let didClickOrigin = coord.equal(new Point(0, 0));
    let isBuildingPath = this.model.pathBuilder !== null;

    console.info(
      `handling mouse down, didClickOrigin: ${didClickOrigin} ` +
      `isBuildingPath ${isBuildingPath}`);

    if (isBuildingPath) {
      let hasDoubleClicked = coord.equal(this.model.pathBuilder.lastClickedNode);
      console.info(`hasDoubleClicked ${hasDoubleClicked}`);

      if (didClickOrigin) {
        this.model.pathBuilder.saveNoGather();
        this.model.pathBuilder = null;
      } else if (hasDoubleClicked) {
        this.model.pathBuilder.saveGather(coord);
        this.model.pathBuilder = null;
      } else {
        this.model.pathBuilder.addNode(coord);
        this.model.pathBuilder.lastClickedNode = coord;
      }
    } else {
      if (didClickOrigin) {
        this.model.pathBuilder = new PathBuilder(this.model.workers[0]);
      }
    }
  }
}
