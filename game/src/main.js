/* Boot and game loop for Sizzle Station. */
/* Wires state, input, audio, kitchen updates and rendering together. */

import { createSounds } from './audio.js';
import { attachInput } from './input.js';
import { updateGame } from './kitchen.js';
import { drawGame } from './render.js';
import { applyShot, shotFromUrl } from './shots.js';
import { createState } from './state.js';

export function boot() {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const state = createState(20261125);
  const sounds = createSounds(state);
  attachInput(canvas, function () {
    return state;
  }, sounds, null);
  const shot = shotFromUrl();
  if (shot > 0) {
    applyShot(state, shot);
  } else {
    state.spawnIn = 4;
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && !state.over && !state.frozen) {
      state.paused = true;
    }
  });
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    updateGame(state, dt, sounds);
    drawGame(ctx, state);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  return { canvas: canvas, state: state, sounds: sounds };
}

boot();
