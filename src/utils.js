import * as _ from 'underscore';

import {Point} from './vectorutils';


// 3 digit colors as input, returns a valid color;
export function logColorShift(rawStart, rawEnd, lvl) {
  if (lvl === 0) return rawStart;

  let start = segment(rawStart);
  let end = segment(rawEnd);
  let diff = [end[0] - start[0], end[1] - start[1], end[2] - start[2]];
  let otherDiff = [start[0] - end[0], start[1] - end[1], start[2] - end[2]];

  return unsegment([
    start[0] + diff[0] - diff[0] / (lvl + 1),
    start[1] + diff[1] - diff[1] / (lvl + 1),
    start[2] + diff[2] - diff[2] / (lvl + 1),
  ]);
}

// Must be of the form '#fff'
function segment(color) {
  return color.slice(1).split('').map((c) => parseInt(c, 16) * 17);
}

function unsegment(color) {
  return `rgb(${color[0]},${color[1]},${color[2]})`;
}

export function circle(ctx, center, size, color) {
  ctx.fillStyle = color;
  ctx.arc(center.x, center.y, size, 0, Math.PI * 2);
  ctx.fill();
}

export function coordToPixel(c) {
  // the center is currently fixed.
  let center = new Point(10 * 22, 10 * 22);
  let unshifted = new Point(c.x * 22, c.y * 22);
  return center.add(unshifted);
}

// Takes a point
export function pixelToCoord(p) {
  // the center is currently fixed.
  let center = new Point(10 * 22, 10 * 22);
  let shifted = p.sub(center);
  return shifted.mult(1 / 22).floor();
}

// Draw a line on a canvas from COORD 1 to COORD 2
export function lineCenterToCenter(ctx, c1, c2, color) {
  let p1 = coordToPixel(c1).add(new Point(11, 11));
  let p2 = coordToPixel(c2).add(new Point(11, 11));

  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.closePath();
}
