/* Mouse and keyboard input for Sizzle Station. */
/* Clicks are hit-tested against the layout rects from config.js; keys */
/* mirror the same actions so the whole game plays from the keyboard. */

import { INGREDIENTS, LAYOUT, binRect } from './config.js';
import { binAction, boardAction, panAction, serveAction, spaceAction, trashAction } from './kitchen.js';
import { resetState } from './state.js';

function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function pointInCircle(x, y, circle) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  return dx * dx + dy * dy <= (circle.r + 8) * (circle.r + 8);
}

export function canvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

export function attachInput(canvas, getState, sounds, onRestart) {
  canvas.addEventListener('click', function (event) {
    const state = getState();
    sounds.ensure();
    if (state.over || state.frozen) {
      return;
    }
    if (state.paused) {
      return;
    }
    const point = canvasPoint(canvas, event);
    if (pointInRect(point.x, point.y, LAYOUT.serveButton)) {
      serveAction(state, sounds);
      return;
    }
    if (pointInRect(point.x, point.y, LAYOUT.trashButton)) {
      trashAction(state, sounds);
      return;
    }
    for (let i = 0; i < LAYOUT.pans.length; i++) {
      if (pointInCircle(point.x, point.y, LAYOUT.pans[i])) {
        panAction(state, i, sounds);
        return;
      }
    }
    if (pointInRect(point.x, point.y, LAYOUT.chopBoard)) {
      boardAction(state, sounds);
      return;
    }
    if (pointInRect(point.x, point.y, LAYOUT.stove)) {
      state.focused = 'stove';
      return;
    }
    if (pointInRect(point.x, point.y, LAYOUT.chop)) {
      state.focused = 'board';
      return;
    }
    for (let i = 0; i < INGREDIENTS.length; i++) {
      if (pointInRect(point.x, point.y, binRect(i))) {
        binAction(state, INGREDIENTS[i].id, sounds);
        return;
      }
    }
  });

  window.addEventListener('keydown', function (event) {
    const state = getState();
    if (event.key === 'm' || event.key === 'M') {
      sounds.toggleMute();
      return;
    }
    if (event.key === 'p' || event.key === 'P') {
      if (!state.over && !state.frozen) {
        state.paused = !state.paused;
      }
      return;
    }
    if (event.key === 'r' || event.key === 'R') {
      resetState(state, state.seed);
      if (onRestart) {
        onRestart();
      }
      return;
    }
    if (state.over || state.paused || state.frozen) {
      return;
    }
    sounds.ensure();
    if (event.key >= '1' && event.key <= '8') {
      const index = Number(event.key) - 1;
      binAction(state, INGREDIENTS[index].id, sounds);
      return;
    }
    if (event.key === ' ') {
      event.preventDefault();
      spaceAction(state, sounds);
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      serveAction(state, sounds);
      return;
    }
    if (event.key === 't' || event.key === 'T') {
      trashAction(state, sounds);
      return;
    }
    if (event.key === 'f' || event.key === 'F') {
      state.focused = state.focused === 'board' ? 'stove' : 'board';
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      state.focused = state.focused === 'board' ? 'stove' : 'board';
    }
  });
}
