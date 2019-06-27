import {pick} from './prob';
import {moveSpeedLvlFromXp} from './leveling';


export class Model {
  constructor() {
    this.t = 0;
 
    this.workers = [
      new Worker()
    ];
    this.tiles = new Tiles(this.workers);
  }

  updateModel(dt) {
    this.t += dt;
  }
}


class Tiles {
  constructor(workers) {
    this.workers = workers;
    this.tiles = {};
    this.fillFrom(new Point(0, 0), 10);
  }

  fillFrom(start, distance) {
    for (let i = start.x - distance; i <= start.x + distance; i++) {
      for (let j = start.y - distance; j <= start.y + distance; j++) {
        let p = new Point(i, j);
        this.tiles[p.str()] = new Tile(p);
      }
    }
  }
}


// blank, forest, mountain, animal, vegetable
let TILE_TYPES =   ['', 'f', 'm', 'a', 'v'];
let TILE_WEIGHTS = [15,  2,   2,   1,   3];


class Tile {
  constructor(pos) {
    this.pos = pos;
    this.type = TILE_TYPES[pick(TILE_WEIGHTS)];
    this.time = 0;  // improvement time
  }

  improve(dt) {
    this.time += dt;
  }

  moveSpeed() {
    // Movement speed increases logarithmically to time spent.
    return moveSpeedLvlFromXp(this.time);
  }
}


class Worker {
  constructor() {
    this.path = [new Point(0, 0), new Point(1, 0)];
    this.pos = new Point(0, 0);
  }
}


class Point {
  static sstr(x, y) {
    return '' + this.x + ',' + this.y;
  }
  
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  str() {
    return Point.sstr(this.x, this.y);
  }
}
