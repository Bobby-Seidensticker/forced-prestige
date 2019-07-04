import React from 'react';
import * as _ from 'underscore';

import {Controller} from './controller';
import {Point} from './vectorutils';
import {coordToPixel, lineCenterToCenter, circle, logColorShift} from './utils';
import {WORKER_ACTIONS, MOVING, GATHERING, WAITING} from './constants';

// In variable naming, a Point called point or p is in pixels.
// coord or c is a coordinate in the model's grid.
// Don't get it confused.

export let View = class extends React.Component {
  constructor(props) {
    super(props);
    this.c = React.createRef();
    this.x = 0;
    this.initialized = false;
  }

  componentDidMount() {
    this.updateView()
  }

  componentDidUpdate() {
    this.updateView()
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  clear(canvas) {
    var tileSize = 22;
    var tileCount = 21;
    canvas.width = tileSize * tileCount;
    canvas.height = tileSize * tileCount;
  }

  drawTile(ctx, tile) {
    let topLeft = coordToPixel(tile.pos);

    ctx.fillStyle = logColorShift('#0f0', '#000', tile.level());
    ctx.fillRect(topLeft.x + 2, topLeft.y + 2, 18, 18);

    ctx.fillStyle = '#000';
    ctx.font = '10px Helvetica sans-serif';
    ctx.fillText(tile.type.toUpperCase(), topLeft.x + 3, topLeft.y + 10);
  }

  drawTiles(ctx, tiles) {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 500, 500);

    // Squares are 20px with a 1px gap, so each square is 22px
    for (let i = -10; i <= 10; i++) {
      for (let j = -10; j <= 10; j++) {
        this.drawTile(ctx, tiles['' + new Point(i, j)]);
      }
    }
  }

  drawWorkers(ctx, workers) {
    _.forEach(workers, (worker) => {
      for (let i = 0; i < worker.path.length; i++) {
        let coord = worker.path[i];
        let tl = coordToPixel(coord);

        if (i > 0) {
          lineCenterToCenter(ctx,
                             worker.path[i - 1],
                             worker.path[i],
                             '#d00');
        }
      }

      let pos = coordToPixel(worker.curTile().pos);
      if (worker.curAction() === MOVING) {
        let direction = worker.nextTile().pos.sub(worker.curTile().pos);
        pos = pos.add(direction.mult(22 * worker.propToNext()));
      }
      circle(ctx, pos.add(new Point(11, 11)), 5, '#f00');
    });
  }

  updateView() {
    if (!this.c || !this.c.current) return;

    let el = this.c.current;

    if (!this.initialized) {
      this.clear(el);
      this.initialized = true;
    }

    this.clear(el);
    let ctx = el.getContext('2d');

    this.drawTiles(ctx, this.props.model.tiles);

    this.drawWorkers(ctx, this.props.model.workers);
  }

  handleMouseMove(reactEvent) {
    this.props.controller.handleMouseMove(reactEvent.nativeEvent, this.c.current);
  }

  handleMouseDown(reactEvent) {
    this.props.controller.handleMouseDown(reactEvent.nativeEvent, this.c.current);
  }

  render() {
    return (
      <canvas ref={this.c}
              onMouseMove={this.handleMouseMove.bind(this)}
              onMouseDown={this.handleMouseDown.bind(this)}>
      </canvas>
    );
  }
};
