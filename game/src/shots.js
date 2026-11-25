/* Deterministic screenshot states for Sizzle Station. */
/* Each shot forces a fixed game state through the same state, kitchen */
/* and render code the live game uses, with a seeded RNG, and freezes */
/* the timers so the render is identical on every load. */

import { resetState, spawnOrder, addParticles, addPopup } from './state.js';

function freeze(state) {
  state.frozen = true;
  state.paused = false;
  state.animTime = 1.2;
}

function setOrderTimes(state, secondsList) {
  for (let i = 0; i < state.orders.length && i < secondsList.length; i++) {
    state.orders[i].remaining = secondsList[i];
  }
}

export function shotFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('shot');
  if (!raw) {
    return 0;
  }
  const n = Number(raw);
  if (n >= 1 && n <= 4) {
    return n;
  }
  return 0;
}

export function applyShot(state, shot) {
  if (shot === 1) {
    resetState(state, 11);
    spawnOrder(state);
    spawnOrder(state);
    state.orders[0].dishId = 'burger';
    state.orders[0].dishName = 'Sizzle Burger';
    state.orders[0].recipe = ['bun', 'patty', 'lettuce', 'tomato'];
    state.orders[1].dishId = 'taco';
    state.orders[1].dishName = 'Sunny Taco';
    state.orders[1].recipe = ['shell', 'patty', 'cheese', 'onion'];
    setOrderTimes(state, [32, 38]);
    state.plate = { base: 'bun', items: ['bun', 'patty', 'lettuce'] };
    state.prepared.patty = 1;
    state.prepared.tomato = 1;
    state.pans[0] = { status: 'cooking', t: 4.2, notified: false };
    state.passPlates = [{ dishId: 'taco', t: 5 }];
    state.score = 240;
    state.coins = 240;
    state.combo = 2;
    state.bestCombo = 2;
    state.serves = 2;
    state.shiftLeft = 132;
    state.elapsed = 48;
    state.hearts = 3;
    addParticles(state, 104, 300, 10, '#ffb347', 'steam');
    addParticles(state, 224, 300, 4, '#ffb347', 'steam');
    freeze(state);
    return true;
  }
  if (shot === 2) {
    resetState(state, 22);
    spawnOrder(state);
    spawnOrder(state);
    state.orders[0].dishId = 'bowl';
    state.orders[0].dishName = 'Garden Bowl';
    state.orders[0].recipe = ['bowl', 'lettuce', 'tomato', 'cheese'];
    state.orders[1].dishId = 'burger';
    state.orders[1].dishName = 'Sizzle Burger';
    state.orders[1].recipe = ['bun', 'patty', 'lettuce', 'tomato'];
    setOrderTimes(state, [28, 36]);
    state.board = { item: 'tomato', chops: 2, bounce: 1 };
    state.prepared.lettuce = 1;
    state.prepared.cheese = 0;
    state.plate = { base: 'bowl', items: ['bowl', 'lettuce'] };
    state.score = 120;
    state.coins = 120;
    state.combo = 1;
    state.bestCombo = 1;
    state.serves = 1;
    state.shiftLeft = 98;
    state.elapsed = 82;
    state.hearts = 3;
    state.focused = 'board';
    addParticles(state, 609, 330, 12, '#e74c3c', 'chop');
    freeze(state);
    return true;
  }
  if (shot === 3) {
    resetState(state, 33);
    spawnOrder(state);
    spawnOrder(state);
    spawnOrder(state);
    spawnOrder(state);
    state.orders[0].dishId = 'burger';
    state.orders[0].dishName = 'Sizzle Burger';
    state.orders[0].recipe = ['bun', 'patty', 'lettuce', 'tomato'];
    state.orders[1].dishId = 'taco';
    state.orders[1].dishName = 'Sunny Taco';
    state.orders[1].recipe = ['shell', 'patty', 'cheese', 'onion'];
    state.orders[2].dishId = 'bowl';
    state.orders[2].dishName = 'Garden Bowl';
    state.orders[2].recipe = ['bowl', 'lettuce', 'tomato', 'cheese'];
    state.orders[3].dishId = 'burger';
    state.orders[3].dishName = 'Sizzle Burger';
    state.orders[3].recipe = ['bun', 'patty', 'lettuce', 'tomato'];
    setOrderTimes(state, [24, 30, 35, 41]);
    state.rushActive = true;
    state.rushLeft = 14;
    state.rushCount = 1;
    state.pans[0] = { status: 'cooking', t: 2.5, notified: false };
    state.pans[1] = { status: 'cooking', t: 4.8, notified: false };
    state.pans[2] = { status: 'cooking', t: 6.5, notified: true };
    state.prepared.onion = 1;
    state.board = { item: 'onion', chops: 1, bounce: 0.4 };
    state.plate = { base: 'bun', items: ['bun', 'patty'] };
    state.score = 410;
    state.coins = 410;
    state.combo = 3;
    state.bestCombo = 3;
    state.serves = 4;
    state.shiftLeft = 75;
    state.elapsed = 105;
    state.hearts = 3;
    addParticles(state, 104, 300, 10, '#ffb347', 'steam');
    addParticles(state, 224, 300, 10, '#ffb347', 'steam');
    addParticles(state, 344, 300, 10, '#ffb347', 'steam');
    state.message = 'RUSH HOUR — orders are coming twice as fast!';
    state.messageTime = 99;
    freeze(state);
    return true;
  }
  if (shot === 4) {
    resetState(state, 44);
    spawnOrder(state);
    spawnOrder(state);
    state.orders[0].dishId = 'burger';
    state.orders[0].dishName = 'Sizzle Burger';
    state.orders[0].recipe = ['bun', 'patty', 'lettuce', 'tomato'];
    state.orders[1].dishId = 'taco';
    state.orders[1].dishName = 'Sunny Taco';
    state.orders[1].recipe = ['shell', 'patty', 'cheese', 'onion'];
    setOrderTimes(state, [30, 40]);
    state.plate = { base: 'bun', items: ['bun', 'patty', 'lettuce', 'tomato'] };
    state.passPlates = [{ dishId: 'burger', t: 5 }];
    state.score = 580;
    state.coins = 580;
    state.combo = 4;
    state.bestCombo = 4;
    state.serves = 5;
    state.shiftLeft = 54;
    state.elapsed = 126;
    state.hearts = 3;
    addPopup(state, 1150, 300, '+180', '#f7c948');
    addPopup(state, 907, 280, 'Served!', '#5cb85c');
    addParticles(state, 1150, 330, 26, '#f7c948', 'serve');
    addParticles(state, 907, 360, 14, '#e8a94e', 'dot');
    freeze(state);
    return true;
  }
  return false;
}
