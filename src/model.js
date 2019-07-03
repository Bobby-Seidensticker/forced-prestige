import * as _ from 'underscore';

import {pick} from './prob';
import {moveSpeedLvlFromXp} from './leveling';
import {Point} from './vectorutils';
import {DEFAULT_TIME_TO_RESET} from './constants';

let gl = {};


export class Model {
  constructor() {
    this.t = 0;
    this.tr = DEFAULT_TIME_TO_RESET;
    this.gl = gl;

    gl.workers = [
      new Worker()
    ];
    this.workers = gl.workers;

    gl.tiles = {};
    fillFrom(gl.tiles, new Point(0, 0), 10);

    this.pathBuilder = null;
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

    console.info(`resetting`);

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

  level() {
    return moveSpeedLvlFromXp(this.time);
  }

  // The time it takes for a worker to move off of this tile.
  moveTime() {
    // Movement speed increases logarithmically to time spent.
    let lvl = this.level();
    return 1000 / (lvl + 1);
  }

  toString() {
    return `Tile(pos: ${this.pos}, time: ${this.time} moveTime: ${this.moveTime()})`;
  }
}


class Worker {
  constructor() {
    this.path = [new Point(0, 0),
                 new Point(1, 0),
                 new Point(2, 0),
                 new Point(3, 0),
                 new Point(4, 0),
                 new Point(4, 1)];
    // set instance vars i, t, tArrival
    this.reset();
  }

  work(dt) {
    this.t += dt;
    let tile = this.curTile();

    tile.improve(dt);

    if (this.i === this.path.length - 1) {
      console.debug(`sitting at end of path, index: ${this.i}`);
      return;  // End of the path
    }

    let tArrive = this.tArrival + tile.moveTime();
    if (this.t >= tArrive) {
      this.tArrival = this.t;
      this.i++;
      console.info(`worker has arrived at pos ${this.i}, tile ${gl.tiles['' + this.path[this.i]]}`);
    }
  }

  isAtEnd() {
    return this.i === this.path.length - 1;
  }

  curTile() {
    return gl.tiles['' + this.path[this.i]];
  }

  nextTile() {
    if (this.isAtEnd()) {
      return this.curTile();
    }

    return gl.tiles['' + this.path[this.i + 1]];
  }

  // Prop = proportion = percent / 100
  propToNext() {
    if (this.isAtEnd()) return 0;

    let tSinceArrival = this.t - this.tArrival;
    return tSinceArrival / this.curTile().moveTime();
  }

  reset() {
    console.log('reset worker');
    this.i = 0;
    this.t = 0;
    this.tArrival = 0;
  }
}


export class PathBuilder {
  constructor(worker) {
    this.rawNodes = [new Point(0, 0)];
    this.cursorCoord = new Point(0, 0);
    this.worker = worker;
  }

  addNode(c) {
    this.rawNodes.push(c);
  }

  save() {
    let path = connectNodes(this.rawNodes);

    this.worker.reset();
    this.worker.path = path;
  }
}


// Visible for testing
export function connectNodes(rawNodes) {
  let nodes = dedupNodes(rawNodes);

  let path = nodes.slice(0, 1);
  for (let i = 1; i < nodes.length; i++) {
    let prev = nodes[i - 1];
    let cur = nodes[i];

    while (!prev.equal(cur)) {
      let bestDir = allDirs[0];
      let bestDist = prev.add(allDirs[0]).dist2(cur);
      for (let j = 1; j < allDirs.length; j++) {
        let dist = prev.add(allDirs[j]).dist2(cur);
        if (dist < bestDist) {
          bestDir = allDirs[j];
          bestDist = dist;
        }
      }

      prev = prev.add(bestDir);
      path.push(prev);
    }
  }
  return path;
}


// Visible for testing
export function dedupNodes(nodes) {
  if (nodes.length === 0) return nodes;

  let result = [nodes[0]];
  for (let i = 0; i < nodes.length - 1; i++) {
    if (!nodes[i].equal(nodes[i + 1])) {
      result.push(nodes[i + 1]);
    }
  }
  return result;
}

let allDirs = [
  new Point(1, 0),
  new Point(-1, 0),
  new Point(0, 1),
  new Point(0, -1)
];
