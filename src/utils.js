import * as _ from 'underscore';

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
