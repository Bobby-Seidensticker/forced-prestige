import * as _ from 'underscore';

import {pick} from './prob';
import {moveSpeedLvlFromXp} from './leveling';
import {Point} from './vectorutils';
import {DEFAULT_TIME_TO_RESET, WORKER_ACTIONS, MOVING, GATHERING, WAITING} from './constants';
import {assert} from './utils';

let gl = {};


export class Model {
  constructor() {
    this.t = 0;
    this.tr = DEFAULT_TIME_TO_RESET;

    this.workers = [
      new Worker()
    ];
    this.tiles = {};
    fillFrom(this.tiles, new Point(0, 0), 10);

    gl.workers = this.workers;
    gl.tiles = this.tiles;

    this.pathBuilder = null;
  }

  updateModel(dt) {
    this.t += dt;

    _.forEach(gl.workers, (w) => w.work(dt));

    this.maybeReset();
  }

  timeRemaining() {
    return this.tr - this.t;
  }

  proportionTimeRemaining() {
    return this.timeRemaining() / this.tr;
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


// forest, mountain, animal
let RESOURCES = ['f', 'm', 'a'];
let TILE_TYPES =  [''].concat(RESOURCES);
let TILE_WEIGHTS = [15,  2,   2,   1];

class Tile {
  constructor(pos) {
    this.pos = pos;
    this.type = TILE_TYPES[pick(TILE_WEIGHTS)];
    this.time = 0;  // total time this tile has been improved

    this.resources = {};
    for (let key of RESOURCES) {
      this.resources[key] = 0;
    }
  }

  improve(dt) {
    this.time += dt;
  }

  dropResource(key) {
    this.resources[key] += 1;
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

  // The time it takes for a worker to gather the resource from this tile.
  gatherTime() {
    let lvl = this.level();
    return 1000 / (lvl + 1);
  }

  toString() {
    return `Tile: pos ${this.pos}, ` +
           `time ${this.time} ` +
           `moveTime ${Math.floor(this.moveTime())} ` +
           `gatherTime ${Math.floor(this.gatherTime())} ` +
           `res: ${_.map(this.resources, (value, key) => key + ':' + value).join(', ')}`;
  }
}

class Worker {
  constructor() {
    this.path = [new Point(0, 0),
                 new Point(1, 0),
                 new Point(0, 0)];
    this.gatheringAt = null;

    // set instance vars i, t, tArrival, holding
    this.reset();
  }

  sanityCheck() {
    assert(this.path[0].equal(new Point(0, 0)), 'First point in path is not origin');
    assert(this.path[this.path.length - 1].equal(new Point(0, 0)), 'Last point in path is not origin');
    assert(this.gatheringAt === null ||
           this.gatheringAt instanceof Point ||
           [null].concat(RESOURCES).indexOf(gatheringWhat()) !== -1,
           `Invalid value for gatheringAt: ${this.gatheringAt}`);
  }

  work(dt) {
    this.sanityCheck();
    this.tryDropResources();

    this.t += dt;
    let tile = this.curTile();

    tile.improve(dt);

    switch (this.curAction()) {
      case MOVING:
        let tArrive = this.tArrival + tile.moveTime();
        if (this.t >= tArrive) {
          this.moveToNextTile();
          console.info(`worker has successfully moved, ${this}`);
        }
        break;
      case GATHERING:
        let tDoneGathering = this.tArrival + tile.gatherTime();
        if (this.t >= tDoneGathering) {
          this.tArrival = this.t;
          this.holding = tile.type;
          console.info(`worker has sucessfully gathered, ${this}`);
        }
        break;
      default:
        throw `Not sure what this worker is doing ${this.curAction()}`;
    }
  }

  tryDropResources() {
    if (this.holding === null) return;

    let tile = gl.tiles[this.path[this.i]];

    if (tile.pos.equal(new Point(0, 0))) {
      tile.dropResource(this.holding);
      this.holding = null;
    }
  }

  curAction() {
    let tile = this.curTile();
    if (this.holding === null &&
        this.gatheringAt !== null &&
        tile.pos.equal(this.gatheringAt)) {
      return GATHERING;
    }
    return MOVING;
  }

  setGather(coord) {
    this.gatheringAt = coord;
  }

  gatheringWhat() {
    if (this.gatheringAt === null) return null;

    return gl.tiles[this.gatheringAt].type;
  }

  moveToNextTile() {
    this.i++;
    if (this.i === this.path.length - 1) {
      this.i = 0;
    }
    this.tArrival = this.t;
  }

  curTile() {
    return gl.tiles[this.path[this.i]];
  }

  nextTile() {
    return gl.tiles[this.path[this.i + 1]];
  }

  // Prop = proportion = percent / 100
  propToNext() {
    let tSinceArrival = this.t - this.tArrival;
    return tSinceArrival / this.curTile().moveTime();
  }

  reset() {
    console.info('reset worker');
    this.i = 0;
    this.t = 0;
    this.tArrival = 0;
    this.holding = null;
  }

  toString() {
    return `Worker: ` +
           `at ${this.path[this.i]}, ` +
           `currently ${WORKER_ACTIONS[this.curAction()]} ` +
           `holding ${this.holding} ` +
           `gatheringAt ${this.gatheringAt} ` +
           `gatheringWhat ${this.gatheringWhat()} ` +
           `.`;
  }
}


export class PathBuilder {
  constructor(worker) {
    this.rawNodes = [new Point(0, 0)];
    this.cursorCoord = new Point(0, 0);
    this.lastClickedNode = new Point(0, 0);
    this.worker = worker;
  }

  addNode(c) {
    this.rawNodes.push(c);
  }

  // Not sure if there should be a difference between saveGather and saveNoGather
  saveNoGather() {
    let path = connectNodes(this.rawNodes);
    this.worker.setGather(null);
    this.worker.reset();
    this.worker.path = mirror(path);
  }

  saveGather(coord) {
    let path = connectNodes(this.rawNodes);
    this.worker.setGather(coord);
    this.worker.reset();
    this.worker.path = mirror(path);
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

// Visible for testing
// [1,2,3] => [1,2,3,2,1]
export function mirror(inputArray) {
  let a = inputArray;
  a.splice(a.length, 0, ...a.slice(0, a.length - 1).reverse())
  return a;
}

let allDirs = [
  new Point(1, 0),
  new Point(-1, 0),
  new Point(0, 1),
  new Point(0, -1)
];
