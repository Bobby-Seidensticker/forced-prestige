import * as _ from 'underscore';

var PI = Math.PI;
var TAU = Math.PI * 2;

export function PointFromEvent(event) {
  return new Point(event.pageX, event.pageY);
}

export function Point(x, y) {
  this.x = x;
  this.y = y;
  if (isNaN(this.x)) {
    throw ('shoot: some point isnt number');
  }
}

Point.prototype.clone = function() { return new Point(this.x, this.y); };

Point.prototype.add = function(
  p) { return new Point(this.x + p.x, this.y + p.y); };

Point.prototype.abs =
  function() { return new Point(Math.abs(this.x), Math.abs(this.y)); };

Point.prototype.dadd = function(p) {
  this.x += p.x;
  this.y += p.y;
  return this;
};

Point.prototype.sub = function(
  p) { return new Point(this.x - p.x, this.y - p.y); };

Point.prototype.flip = function() { return new Point(this.y, this.x); };

Point.prototype.mult = function(
  scalar) { return new Point(this.x * scalar, this.y * scalar); };

Point.prototype.floor = function() {
  return new Point(Math.floor(this.x), Math.floor(this.y));
}

Point.prototype.dist = function(p) { return Math.sqrt(this.dist2(p)); };

Point.prototype.dist2 = function(p) {
  var x = this.x - p.x;
  var y = this.y - p.y;
  return x * x + y * y;
};

Point.prototype.len =
  function() { return Math.sqrt(this.x * this.x + this.y * this.y); };

Point.prototype.len2 = function() { return this.x * this.x + this.y * this.y; };

Point.prototype.within = function(
  p, radius) { return this.sub(p).len2() < (radius * radius); };

Point.prototype.rawDist = function(p) {
  return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
};

Point.prototype.equal = function(
  p) { return this.x === p.x && this.y === p.y; };

Point.prototype.angle = function() { return Math.atan2(this.y, this.x); };

Point.prototype.closer = function(dest, speed, stop) {
  var diff = dest.sub(this);
  var distance = this.dist(dest);
  var ratio;
  if (distance > stop) {
    if (distance - speed < stop) {
      speed = distance - stop;
    }
    ratio = 1 - (distance - speed) / distance;
  } else {
    if (distance + speed > stop) {
      speed = stop - distance;
    }
    ratio = 1 - (distance + speed) / distance;
  }
  return this.add(diff.mult(ratio));
};

Point.prototype.pctCloser = function(
  dest, pct) { return this.add(dest.sub(this).mult(pct)); };

Point.prototype.toIso =
  function() { return new Point(this.x - this.y, (this.x + this.y) / 2); };

Point.prototype.toString =
  function() { return '(' + this.x + ', ' + this.y + ')'; };

Point.prototype.dot = function(v) { return this.x * v.x + this.y * v.y; };

Point.prototype.unitVector = function() {
  var len = this.len();
  if (!len) {
    return this;
  } else {
    return this.mult(1 / len);
  }
};

Point.prototype.rotate = function(degrees) {
  var angle = degrees / 180 * Math.PI;
  var sn = Math.sin(angle);
  var cs = Math.cos(angle);

  return new Point(this.x * cs - this.y * sn, this.x * sn + this.y * cs);
};

Point.prototype.inBounds = function(size) {
  var p = this.clone();
  if (p.x < 0) {
    p.x = 0;
  }
  if (p.x > size.x) {
    p.x = size.x;
  }
  if (p.y < 0) {
    p.y = 0;
  }
  if (p.y > size.y) {
    p.y = size.y;
  }
  return p;
};

export function hit(s, e, t, r1, r2) {
  var r = r1 + r2;
  var r2 = r * r;

  var st = t.sub(s);
  var et = t.sub(e);
  var se = e.sub(s);

  if (st.len2() < r2 || et.len2() < r2) {
    return true;
  }

  var sd = st.dot(se);
  var ed = et.dot(se);

  if (sd < 0 || ed > 0) {
    return false;
  }

  var closest = Math.sin(Math.acos(sd / (st.len() * se.len()))) * st.len();
  if (closest <= r) {
    return true;
  }
  return false;
}

export function coneHit(start, diff, angle, tpos, trad) {
  var arcDist = diff.len();
  var tDist = tpos.sub(start).len();
  if (arcDist < tDist - trad || arcDist > tDist + trad) {
    // Too close or too far away
    return false;
  }

  var leftVector = diff.rotate(angle / 2);
  var leftPoint = start.add(leftVector);
  if (leftPoint.within(tpos, trad)) {
    return true;
  }

  var rightVector = diff.rotate(-angle / 2);
  var rightPoint = start.add(rightVector);
  if (rightPoint.within(tpos, trad)) {
    return true;
  }

  var tv = tpos.sub(start);
  var angleDiff = degrees(Math.abs(tv.angle() - diff.angle()));
  if (angleDiff > 180) {
    angleDiff = 360 - angleDiff;
  }
  if (angleDiff < angle / 2) {
    return true;
  }
  return false;
}

function degrees(x) { return x / Math.PI * 180; }

export function getDistances(p1, p2s) {
  return _.map(p2s, function(p2) { return p1.dist(p2); });
}

/* exports.extend({
 *   Point : Point,
 *   PointFromEvent : PointFromEvent,
 *   hit : hit,
 *   coneHit : coneHit,
 *   getDistances : getDistances
 * });*/
