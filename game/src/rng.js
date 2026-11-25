/* Seeded random number generator for Sizzle Station. */
/* Mulberry32: small, fast and fully deterministic for a given seed, so */
/* screenshot states and order sequences can be reproduced exactly. */

export function createRng(seed) {
  let a = seed >>> 0;
  const rng = {
    next: function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    int: function (min, max) {
      return min + Math.floor(rng.next() * (max - min + 1));
    },
    pick: function (list) {
      return list[Math.floor(rng.next() * list.length)];
    },
    chance: function (p) {
      return rng.next() < p;
    },
    range: function (min, max) {
      return min + rng.next() * (max - min);
    }
  };
  return rng;
}

export function seedFromNumber(n) {
  return (n * 2654435761) >>> 0;
}
