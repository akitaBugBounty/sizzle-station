/* Game state for Sizzle Station: orders, plates, hearts, score and timers. */
/* This module owns the shape of the state and order spawning only; the */
/* station rules live in kitchen.js and all drawing lives in render.js. */

import { DISHES, TUNING } from './config.js';
import { createRng } from './rng.js';

export function patienceFor(elapsedSeconds) {
  const shrunk = TUNING.patienceBase - elapsedSeconds * TUNING.patienceShrinkPerSecond;
  return Math.max(TUNING.patienceMin, Math.round(shrunk));
}

export function createState(seed) {
  const rng = createRng(seed === undefined ? 20261125 : seed);
  return {
    seed: seed === undefined ? 20261125 : seed,
    rng: rng,
    elapsed: 0,
    shiftLeft: TUNING.shiftSeconds,
    hearts: TUNING.maxHearts,
    score: 0,
    coins: 0,
    combo: 0,
    bestCombo: 0,
    serves: 0,
    mistakes: 0,
    orders: [],
    nextOrderId: 1,
    spawnIn: 4,
    rushIn: TUNING.rushEverySeconds,
    rushLeft: 0,
    rushActive: false,
    rushCount: 0,
    plate: { base: null, items: [] },
    prepared: { patty: 0, lettuce: 0, tomato: 0, onion: 0, cheese: 0 },
    pans: [
      { status: 'empty', t: 0, notified: false },
      { status: 'empty', t: 0, notified: false },
      { status: 'empty', t: 0, notified: false }
    ],
    board: { item: null, chops: 0, bounce: 0 },
    passPlates: [],
    particles: [],
    popups: [],
    focused: 'board',
    paused: false,
    over: false,
    overReason: '',
    muted: false,
    frozen: false,
    animTime: 0,
    shake: 0,
    message: '',
    messageTime: 0
  };
}

export function resetState(state, seed) {
  const fresh = createState(seed === undefined ? state.seed : seed);
  const keys = Object.keys(fresh);
  for (const key of keys) {
    state[key] = fresh[key];
  }
  return state;
}

export function spawnOrder(state) {
  if (state.orders.length >= TUNING.maxOrders) {
    return null;
  }
  let dish = state.rng.pick(DISHES);
  for (let attempt = 0; attempt < 3; attempt++) {
    const alreadyOpen = state.orders.some(function (order) {
      return order.dishId === dish.id;
    });
    if (!alreadyOpen || state.orders.length >= DISHES.length - 1) {
      break;
    }
    dish = state.rng.pick(DISHES);
  }
  const patience = patienceFor(state.elapsed);
  const order = {
    id: state.nextOrderId,
    dishId: dish.id,
    dishName: dish.name,
    recipe: dish.recipe.slice(),
    total: patience,
    remaining: patience
  };
  state.nextOrderId += 1;
  state.orders.push(order);
  return order;
}

export function addPopup(state, x, y, text, color) {
  state.popups.push({ x: x, y: y, text: text, color: color || '#f7c948', life: 1.4, maxLife: 1.4 });
}

export function addParticles(state, x, y, count, color, kind) {
  for (let i = 0; i < count; i++) {
    const angle = state.rng.next() * Math.PI * 2;
    const speed = 24 + state.rng.next() * 60;
    state.particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 30,
      life: 0.5 + state.rng.next() * 0.5,
      maxLife: 1,
      color: color,
      size: 2 + state.rng.next() * 4,
      kind: kind || 'dot'
    });
  }
  if (state.particles.length > 220) {
    state.particles.splice(0, state.particles.length - 220);
  }
}

export function setMessage(state, text) {
  state.message = text;
  state.messageTime = 2.2;
}

export function orderIntervalNow(state) {
  return state.rushActive ? TUNING.rushOrderInterval : TUNING.orderInterval;
}
