import * as _ from 'underscore';

import {pick} from './prob';
import {moveSpeedLvlFromXp} from './leveling';
import {Point} from './vectorutils';

let DEFAULT_TIME_TO_RESET = 1000;

let gl = {};


export class Model {
  constructor() {
    this.t = 0;
    this.tr = DEFAULT_TIME_TO_RESET;
    this.gl = gl;

    gl.workers = [
      new Worker()
    ];
    gl.tiles = {};
    fillFrom(gl.tiles, new Point(0, 0), 10);
  }

  updateModel(dt) {
    this.t += dt;

    _.forEach(gl.workers, (w) => w.work(dt));

    this.maybeReset();
  }

  maybeReset() {
    if (this.t < this.tr) {
      return;
    }

    console.log(`resetting, 0,0 tile move speed: ${gl.tiles['' + new Point(0, 0)]}, 1,0 ${gl.tiles['' + new Point(1, 0)]}`);

    this.t = 0;
    _.forEach(gl.workers, (w) => w.reset());
  }
}


function fillFrom(tiles, start, dist) {
  for (let i = start.x - dist; i <= start.x + dist; i++) {
    for (let j = start.y - dist; j <= start.y + dist; j++) {
      let p = new Point(i, j);
      tiles['' + p] = new Tile(p);
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
    this.time = 0;  // total time this tile has been improved
  }

  improve(dt) {
    this.time += dt;
  }

  // The time it takes for a worker to move off of this tile.
  moveTime() {
    // Movement speed increases logarithmically to time spent.
    let lvl = moveSpeedLvlFromXp(this.time);
    return 1000 / (lvl + 1);
  }

  toString() {
    return `Tile(pos: ${this.pos}, time: ${this.time} moveTime: ${this.moveTime()})`;
  }
}


class Worker {
  constructor() {
    this.path = [new Point(0, 0), new Point(1, 0)];
    this.reset();
  }

  work(dt) {
    this.t += dt;
    let pos = this.path[this.i];
    let tile = gl.tiles['' + pos];

    tile.improve(dt);

    if (this.i === this.path.length - 1) {
      return;  // End of the path
    }

    let tArrive = this.tArrival + tile.moveTime();
    if (this.t >= tArrive) {
      this.tArrival = this.t;
      this.i++;
      console.log(`worker has arrived at pos ${this.i}`);
    }
  }

  reset() {
    console.log('reset worker');
    this.i = 0;
    this.t = 0;
    this.tArrival = 0;
  }
}
