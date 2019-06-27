import React from 'react';

import {Point} from './vectorutils';
import {logColorShift} from './utils';

// IN THE VIEW ALL LOCAL OR CLASS VARIABLES [Point]s ARE PIXELS, NOT MODEL COORDINATES.
// DO NOT VIOLATE.  I AM LOOKING AT *YOU* SPECIFICALLY...

var gl;

function coordToPixel(i, j) {
  // the center is currently fixed.
  let center = new Point(10 * 22, 10 * 22);
  let unshifted = new Point(i * 22, j * 22);
  return center.add(unshifted);
}

export var View = class extends React.Component {
  constructor(props) {
    super(props);
    this.c = React.createRef();
    this.x = 0;
    this.initialized = false;
    gl = this.props.model.gl;
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
    canvas.width = 500;
    canvas.height = 500;
  }

  drawTile(ctx, tile) {
    let topLeft = coordToPixel(tile.pos.x, tile.pos.y);

    ctx.fillStyle = logColorShift('#0f0', '#000', tile.level());
    ctx.fillRect(topLeft.x + 1, topLeft.y + 1, 18, 18);

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

    this.drawTiles(ctx, gl.tiles);

    this.drawWorkers(ctx, gl.workers);

    

    /* ctx.fillStyle = '#00f';
     * ctx.font = '10px Helvetica sans-serif';
     * let msg = '' + (this.props.t % 100);
     * let x = (this.x % 10) * 10;
     * let y = Math.floor((this.x % 100) / 10) * 10;
     * this.x++;
     * ctx.fillText(msg, x, y);
     * console.log('sup');*/

  }

  render() {
    return <canvas ref={this.c}></canvas>;
  }
};
