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
  }

  handleMouseMove(e, el) {
    let coord = coordFromEvent(e, el);
  }

  startPath() {
    this.model.startPath();
  }

  handleMouseDown(e, el) {
    let coord = coordFromEvent(e, el);
    let didClickOrigin = coord.equal(new Point(0, 0));
    let isBuildingPath = this.model.pathBuilder !== null;

    console.warn(`handling mouse down, didClickOrigin: ${didClickOrigin} isBuildingPath ${isBuildingPath}`);

    if (isBuildingPath) {
      if (didClickOrigin) {
        this.model.pathBuilder.save();
        this.model.pathBuilder = null;
      } else {
        this.model.pathBuilder.addNode(coord);
      }
    } else {
      if (didClickOrigin) {
        this.model.pathBuilder = new PathBuilder(this.model.workers[0]);
      }
    }
  }
}
