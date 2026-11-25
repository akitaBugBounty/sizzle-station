/* Station logic for Sizzle Station: grill, chopping board, assembly, */
/* serving, trash, order matching, rush and the per-frame update. */

import { DISH_BY_ID, INGREDIENT_BY_ID, TUNING } from './config.js';
import { addParticles, addPopup, orderIntervalNow, setMessage, spawnOrder } from './state.js';

export function grillStatus(pan) {
  if (pan.status === 'empty') {
    return 'empty';
  }
  if (pan.status === 'burned') {
    return 'burned';
  }
  if (pan.t >= TUNING.grillCookSeconds) {
    return 'ready';
  }
  return 'cooking';
}

export function plateMatchesDish(plate, dish) {
  if (plate.base !== dish.base) {
    return false;
  }
  if (plate.items.length !== dish.recipe.length) {
    return false;
  }
  const have = plate.items.slice().sort().join(',');
  const want = dish.recipe.slice().sort().join(',');
  return have === want;
}

export function findMatchingOrder(state) {
  for (const order of state.orders) {
    const dish = DISH_BY_ID[order.dishId];
    if (dish && plateMatchesDish(state.plate, dish)) {
      return order;
    }
  }
  return null;
}

function plateCanTake(state, ingredientId) {
  if (!state.plate.base) {
    return false;
  }
  return state.plate.items.indexOf(ingredientId) < 0;
}

function addToPlate(state, ingredientId) {
  state.plate.items.push(ingredientId);
}

function startGrill(state, sounds) {
  for (let i = 0; i < state.pans.length; i++) {
    const pan = state.pans[i];
    if (pan.status === 'empty') {
      pan.status = 'cooking';
      pan.t = 0;
      pan.notified = false;
      if (sounds) {
        sounds.sizzle();
      }
      setMessage(state, 'Patty on the grill — watch the ring!');
      return true;
    }
  }
  setMessage(state, 'All pans are busy!');
  return false;
}

function collectReadyPan(state, panIndex, sounds) {
  const pan = state.pans[panIndex];
  if (!pan) {
    return false;
  }
  if (grillStatus(pan) === 'ready') {
    if (state.prepared.patty >= TUNING.maxPrepared) {
      setMessage(state, 'Patty tray is full — serve or plate one first.');
      return false;
    }
    state.prepared.patty += 1;
    pan.status = 'empty';
    pan.t = 0;
    pan.notified = false;
    if (sounds) {
      sounds.ready();
    }
    addPopup(state, 224, 250, 'Patty ready!', '#f7c948');
    return true;
  }
  if (grillStatus(pan) === 'burned') {
    pan.status = 'empty';
    pan.t = 0;
    pan.notified = false;
    if (sounds) {
      sounds.buzzer();
    }
    addPopup(state, 224, 250, 'Burned!', '#e74c3c');
    setMessage(state, 'That patty burned. Start a fresh one.');
    return true;
  }
  return false;
}

export function binAction(state, ingredientId, sounds) {
  if (state.over || state.paused || state.frozen) {
    return false;
  }
  const item = INGREDIENT_BY_ID[ingredientId];
  if (!item) {
    return false;
  }
  if (item.kind === 'base') {
    if (state.plate.base) {
      if (state.plate.base === ingredientId) {
        return false;
      }
      setMessage(state, 'Trash the current plate first to change base.');
      if (sounds) {
        sounds.click();
      }
      return false;
    }
    state.plate.base = ingredientId;
    state.plate.items = [ingredientId];
    if (sounds) {
      sounds.click();
    }
    addParticles(state, 907, 372, 6, item.color, 'dot');
    return true;
  }
  if (item.kind === 'ready') {
    if (!plateCanTake(state, ingredientId)) {
      setMessage(state, 'Start a plate with a base first.');
      return false;
    }
    addToPlate(state, ingredientId);
    if (sounds) {
      sounds.click();
    }
    addParticles(state, 907, 360, 8, item.color, 'dot');
    return true;
  }
  if (item.kind === 'grill') {
    if (plateCanTake(state, ingredientId) && state.prepared.patty > 0) {
      state.prepared.patty -= 1;
      addToPlate(state, ingredientId);
      if (sounds) {
        sounds.click();
      }
      return true;
    }
    for (let i = 0; i < state.pans.length; i++) {
      if (grillStatus(state.pans[i]) === 'ready') {
        if (collectReadyPan(state, i, sounds)) {
          if (plateCanTake(state, ingredientId) && state.prepared.patty > 0) {
            state.prepared.patty -= 1;
            addToPlate(state, ingredientId);
          }
          return true;
        }
      }
    }
    return startGrill(state, sounds);
  }
  if (state.board.item === ingredientId) {
    return false;
  }
  if (plateCanTake(state, ingredientId) && state.prepared[ingredientId] > 0) {
    state.prepared[ingredientId] -= 1;
    addToPlate(state, ingredientId);
    if (sounds) {
      sounds.click();
    }
    return true;
  }
  if (!state.board.item) {
    state.board.item = ingredientId;
    state.board.chops = 0;
    state.board.bounce = 0;
    if (sounds) {
      sounds.click();
    }
    setMessage(state, item.name + ' on the board — chop it 3 times.');
    return true;
  }
  setMessage(state, 'The board is busy — finish chopping first.');
  return false;
}

export function panAction(state, panIndex, sounds) {
  if (state.over || state.paused || state.frozen) {
    return false;
  }
  state.focused = 'stove';
  return collectReadyPan(state, panIndex, sounds);
}

export function boardAction(state, sounds) {
  if (state.over || state.paused || state.frozen) {
    return false;
  }
  state.focused = 'board';
  if (!state.board.item) {
    return false;
  }
  state.board.chops += 1;
  state.board.bounce = 1;
  if (sounds) {
    sounds.chop();
  }
  const item = INGREDIENT_BY_ID[state.board.item];
  addParticles(state, 609, 330, 7, item ? item.color : '#ffffff', 'chop');
  if (state.board.chops >= TUNING.chopsNeeded) {
    if (state.prepared[state.board.item] < TUNING.maxPrepared) {
      state.prepared[state.board.item] += 1;
    }
    addPopup(state, 609, 260, (item ? item.name : 'Veg') + ' chopped!', '#5cb85c');
    state.board.item = null;
    state.board.chops = 0;
  }
  return true;
}

export function spaceAction(state, sounds) {
  if (state.focused === 'stove') {
    for (let i = 0; i < state.pans.length; i++) {
      const status = grillStatus(state.pans[i]);
      if (status === 'ready' || status === 'burned') {
        return collectReadyPan(state, i, sounds);
      }
    }
    return false;
  }
  return boardAction(state, sounds);
}

export function serveAction(state, sounds) {
  if (state.over || state.paused || state.frozen) {
    return false;
  }
  if (!state.plate.base) {
    setMessage(state, 'No plate to serve — start with a base.');
    if (sounds) {
      sounds.buzzer();
    }
    return false;
  }
  const order = findMatchingOrder(state);
  if (!order) {
    state.combo = 0;
    state.mistakes += 1;
    state.shake = 1;
    setMessage(state, 'No open order matches this plate. Trash it or finish it.');
    if (sounds) {
      sounds.buzzer();
    }
    addPopup(state, 907, 300, 'No match', '#e74c3c');
    return false;
  }
  const dish = DISH_BY_ID[order.dishId];
  const patienceBonus = Math.round((order.remaining / order.total) * TUNING.patienceBonusMax);
  const multiplier = 1 + TUNING.comboBonusStep * state.combo;
  const earned = Math.round((dish.price + patienceBonus) * multiplier);
  state.score += earned;
  state.coins += earned;
  state.serves += 1;
  state.combo += 1;
  if (state.combo > state.bestCombo) {
    state.bestCombo = state.combo;
  }
  state.orders.splice(state.orders.indexOf(order), 1);
  state.passPlates.push({ dishId: dish.id, t: 6 });
  state.plate = { base: null, items: [] };
  addPopup(state, 1150, 300, '+' + earned, '#f7c948');
  addParticles(state, 1150, 330, 22, '#f7c948', 'serve');
  addParticles(state, 907, 360, 12, dish.color, 'dot');
  if (sounds) {
    sounds.ding();
  }
  setMessage(state, dish.name + ' served! +' + earned + ' coins.');
  return true;
}

export function trashAction(state, sounds) {
  if (state.over || state.paused || state.frozen) {
    return false;
  }
  if (!state.plate.base && state.plate.items.length === 0) {
    return false;
  }
  state.plate = { base: null, items: [] };
  state.score = Math.max(0, state.score - TUNING.trashPenalty);
  state.combo = 0;
  state.mistakes += 1;
  addPopup(state, 907, 300, '-' + TUNING.trashPenalty, '#e74c3c');
  if (sounds) {
    sounds.trash();
  }
  setMessage(state, 'Plate trashed (-' + TUNING.trashPenalty + ').');
  return true;
}

export function updateGame(state, dt, sounds) {
  if (state.paused || state.over || state.frozen) {
    return;
  }
  state.animTime += dt;
  state.elapsed += dt;
  state.shiftLeft -= dt;
  if (state.shake > 0) {
    state.shake = Math.max(0, state.shake - dt * 3);
  }
  if (state.messageTime > 0) {
    state.messageTime -= dt;
    if (state.messageTime <= 0) {
      state.message = '';
    }
  }
  if (state.board.bounce > 0) {
    state.board.bounce = Math.max(0, state.board.bounce - dt * 2.4);
  }
  if (state.shiftLeft <= 0) {
    state.shiftLeft = 0;
    state.over = true;
    state.overReason = 'Shift complete!';
    return;
  }
  if (!state.rushActive) {
    state.rushIn -= dt;
    if (state.rushIn <= 0) {
      state.rushActive = true;
      state.rushLeft = TUNING.rushLengthSeconds;
      state.rushCount += 1;
      addPopup(state, 640, 120, 'RUSH HOUR!', '#ff8c42');
      if (sounds) {
        sounds.ding();
      }
    }
  } else {
    state.rushLeft -= dt;
    if (state.rushLeft <= 0) {
      state.rushActive = false;
      state.rushIn = TUNING.rushEverySeconds;
    }
  }
  state.spawnIn -= dt;
  if (state.spawnIn <= 0) {
    spawnOrder(state);
    state.spawnIn = orderIntervalNow(state);
  }
  for (const pan of state.pans) {
    if (pan.status === 'cooking') {
      pan.t += dt;
      if (pan.t >= TUNING.grillCookSeconds && !pan.notified) {
        pan.notified = true;
        if (sounds) {
          sounds.sizzle();
        }
        addParticles(state, 224, 300, 8, '#ffb347', 'steam');
      }
      if (pan.t >= TUNING.grillBurnSeconds) {
        pan.status = 'burned';
        if (sounds) {
          sounds.buzzer();
        }
      }
    }
  }
  for (let i = state.orders.length - 1; i >= 0; i--) {
    const order = state.orders[i];
    order.remaining -= dt;
    if (order.remaining <= 0) {
      state.orders.splice(i, 1);
      state.hearts -= 1;
      state.combo = 0;
      state.mistakes += 1;
      state.shake = 1;
      addPopup(state, 640, 130, 'Order expired!', '#e74c3c');
      if (sounds) {
        sounds.buzzer();
      }
      if (state.orders.length === 0) {
        state.spawnIn = Math.min(state.spawnIn, 3);
      }
      setMessage(state, 'An order walked out. ' + state.hearts + ' hearts left.');
      if (state.hearts <= 0) {
        state.hearts = 0;
        state.over = true;
        state.overReason = 'Out of hearts — the stall closed early.';
        return;
      }
    }
  }
  for (let i = state.passPlates.length - 1; i >= 0; i--) {
    state.passPlates[i].t -= dt;
    if (state.passPlates[i].t <= 0) {
      state.passPlates.splice(i, 1);
    }
  }
  for (let i = state.popups.length - 1; i >= 0; i--) {
    const popup = state.popups[i];
    popup.life -= dt;
    popup.y -= dt * 26;
    if (popup.life <= 0) {
      state.popups.splice(i, 1);
    }
  }
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 40 * dt;
    if (p.life <= 0) {
      state.particles.splice(i, 1);
    }
  }
}
