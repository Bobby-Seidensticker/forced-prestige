let cache = {};
let N = 1000;

export function lvlFromXp(xp, base, growthFactor) {
  let lookup = getLookup(base, growthFactor);

  let lvl = 0;
  while (xp > lookup[lvl]) lvl++;
  return lvl;
}

export function moveSpeedLvlFromXp(xp) {
  return lvlFromXp(xp, 10000, 1.3);
}

function key(base, growthFactor) {
  return '' + base + ',' + growthFactor;
}

function getLookup(base, growthFactor) {
  let key = '' + base + ',' + growthFactor;
  if (!!cache[key]) {
    return cache[key];
  }

  let arr = [base];
  for (var i = 1; i < N; i++) {
    arr[i] = arr[i - 1] * growthFactor;
  }
  return cache[key] = arr;
}
