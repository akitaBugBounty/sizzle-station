/* All canvas drawing for Sizzle Station: kitchen, order board, food, */
/* ingredients, particles, HUD and the end screen. Procedural art only. */

import { COLORS, DISH_BY_ID, INGREDIENT_BY_ID, LAYOUT, TUNING, binRect, ticketRect } from './config.js';
import { grillStatus } from './kitchen.js';

export function roundRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export function fillRoundRect(ctx, x, y, w, h, r, color) {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawHeart(ctx, x, y, size, filled) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size / 20, size / 20);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-11, -4, -7, -13, 0, -7);
  ctx.bezierCurveTo(7, -13, 11, -4, 0, 6);
  ctx.closePath();
  ctx.fillStyle = filled ? '#e74c3c' : '#5a3a28';
  ctx.fill();
  ctx.strokeStyle = '#2b1a0e';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.restore();
}

export function drawFoodIcon(ctx, id, x, y, scale) {
  const s = scale || 1;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#2b1a0e';
  if (id === 'bun') {
    ctx.fillStyle = '#e8a94e';
    ctx.beginPath();
    ctx.arc(0, -6, 17, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f7d98a';
    ctx.beginPath();
    ctx.ellipse(0, 8, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fff6e5';
    const dots = [[-9, -12], [0, -16], [9, -12], [-4, -8], [5, -8]];
    for (const dot of dots) {
      ctx.beginPath();
      ctx.arc(dot[0], dot[1], 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === 'shell') {
    ctx.fillStyle = '#f2c94c';
    ctx.beginPath();
    ctx.moveTo(-18, 12);
    ctx.quadraticCurveTo(0, -24, 18, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#c99a1e';
    ctx.beginPath();
    ctx.moveTo(-11, 8);
    ctx.quadraticCurveTo(0, -12, 11, 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-5, 9);
    ctx.quadraticCurveTo(0, -4, 5, 9);
    ctx.stroke();
  } else if (id === 'bowl') {
    ctx.fillStyle = '#e8e4da';
    ctx.beginPath();
    ctx.moveTo(-19, -4);
    ctx.quadraticCurveTo(-17, 14, 0, 15);
    ctx.quadraticCurveTo(17, 14, 19, -4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#b8b2a6';
    ctx.beginPath();
    ctx.ellipse(0, -4, 17, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9a948a';
    ctx.fillRect(-19, -6, 38, 4);
  } else if (id === 'patty') {
    ctx.fillStyle = '#8a4b2a';
    roundRectPath(ctx, -18, -9, 36, 18, 9);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#5e3018';
    ctx.beginPath();
    ctx.moveTo(-12, -4);
    ctx.lineTo(-12, 4);
    ctx.moveTo(0, -4);
    ctx.lineTo(0, 4);
    ctx.moveTo(12, -4);
    ctx.lineTo(12, 4);
    ctx.stroke();
  } else if (id === 'lettuce') {
    ctx.fillStyle = '#5cb85c';
    for (const leaf of [[-10, 2], [0, -4], [10, 2]]) {
      ctx.beginPath();
      ctx.arc(leaf[0], leaf[1], 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = '#7ed67e';
    ctx.beginPath();
    ctx.arc(0, -2, 6, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'tomato') {
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(0, 2, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f1948a';
    ctx.beginPath();
    ctx.arc(-5, -3, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(-6, -18);
    ctx.lineTo(0, -15);
    ctx.lineTo(6, -18);
    ctx.closePath();
    ctx.fill();
  } else if (id === 'onion') {
    ctx.fillStyle = '#efe6f2';
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#7d5a8a';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#c39bd3';
    ctx.beginPath();
    ctx.arc(-9, -9, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === 'cheese') {
    ctx.fillStyle = '#f7c948';
    ctx.beginPath();
    ctx.moveTo(-16, -12);
    ctx.lineTo(16, -12);
    ctx.lineTo(14, 12);
    ctx.lineTo(-14, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#d9a416';
    for (const hole of [[-7, -3], [6, 2], [0, 7]]) {
      ctx.beginPath();
      ctx.arc(hole[0], hole[1], 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

export function drawDishIcon(ctx, dishId, x, y, scale) {
  const dish = DISH_BY_ID[dishId];
  if (!dish) {
    return;
  }
  const s = scale || 1;
  ctx.save();
  ctx.translate(x, y);
  if (dishId === 'burger') {
    drawFoodIcon(ctx, 'tomato', 0, 8 * s, 0.8 * s);
    drawFoodIcon(ctx, 'lettuce', 0, 0, 0.9 * s);
    drawFoodIcon(ctx, 'patty', 0, -8 * s, 0.9 * s);
    drawFoodIcon(ctx, 'bun', 0, -14 * s, s);
  } else if (dishId === 'taco') {
    drawFoodIcon(ctx, 'shell', 0, 4 * s, 1.15 * s);
    drawFoodIcon(ctx, 'patty', -4 * s, -6 * s, 0.7 * s);
    drawFoodIcon(ctx, 'cheese', 5 * s, -8 * s, 0.7 * s);
    drawFoodIcon(ctx, 'onion', 0, -12 * s, 0.6 * s);
  } else {
    drawFoodIcon(ctx, 'bowl', 0, 8 * s, 1.05 * s);
    drawFoodIcon(ctx, 'lettuce', -7 * s, -6 * s, 0.7 * s);
    drawFoodIcon(ctx, 'tomato', 7 * s, -6 * s, 0.7 * s);
    drawFoodIcon(ctx, 'cheese', 0, -12 * s, 0.65 * s);
  }
  ctx.restore();
}

function patienceColor(fraction) {
  if (fraction > 0.5) {
    return COLORS.green;
  }
  if (fraction > 0.25) {
    return COLORS.amber;
  }
  return COLORS.red;
}

function drawTicket(ctx, order, rect, index) {
  const dish = DISH_BY_ID[order.dishId];
  fillRoundRect(ctx, rect.x, rect.y, rect.w, rect.h, 12, '#fff6e5');
  ctx.strokeStyle = '#2b1a0e';
  ctx.lineWidth = 2;
  roundRectPath(ctx, rect.x, rect.y, rect.w, rect.h, 12);
  ctx.stroke();
  ctx.fillStyle = '#2b1a0e';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('#' + order.id + ' ' + (dish ? dish.name : 'Dish'), rect.x + 14, rect.y + 30);
  drawDishIcon(ctx, order.dishId, rect.x + rect.w - 40, rect.y + 38, 0.85);
  let iconX = rect.x + 16;
  for (const ingredientId of order.recipe) {
    drawFoodIcon(ctx, ingredientId, iconX + 18, rect.y + 72, 0.85);
    iconX += 46;
  }
  const fraction = Math.max(0, order.remaining / order.total);
  const barY = rect.y + rect.h - 30;
  fillRoundRect(ctx, rect.x + 14, barY, rect.w - 28, 14, 7, '#d8cfc0');
  fillRoundRect(ctx, rect.x + 14, barY, (rect.w - 28) * fraction, 14, 7, patienceColor(fraction));
  ctx.fillStyle = '#2b1a0e';
  ctx.font = 'bold 14px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(Math.ceil(order.remaining) + 's', rect.x + rect.w - 14, barY - 6);
  ctx.textAlign = 'left';
}

function drawOrderBoard(ctx, state) {
  fillRoundRect(ctx, LAYOUT.board.x - 8, LAYOUT.board.y - 8, LAYOUT.board.w + 16, LAYOUT.board.h + 16, 14, COLORS.panel);
  ctx.fillStyle = '#f7c948';
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('ORDER BOARD', LAYOUT.board.x + 4, LAYOUT.board.y - 14);  if (state.orders.length === 0) {
    ctx.fillStyle = '#fff6e5';
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillText('No orders yet — the next ticket is coming…', LAYOUT.board.x + 16, LAYOUT.board.y + 78);
    return;
  }
  for (let i = 0; i < state.orders.length; i++) {
    drawTicket(ctx, state.orders[i], ticketRect(i), i);
  }
}

function drawTimerRing(ctx, x, y, r, fraction, color) {
  ctx.beginPath();
  ctx.arc(x, y, r + 7, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, Math.min(1, fraction)));
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.stroke();
}

function drawStove(ctx, state) {
  const area = LAYOUT.stove;
  fillRoundRect(ctx, area.x, area.y, area.w, area.h, 14, COLORS.panelLight);
  ctx.strokeStyle = '#2b1a0e';
  ctx.lineWidth = 2;
  roundRectPath(ctx, area.x, area.y, area.w, area.h, 14);
  ctx.stroke();
  ctx.fillStyle = '#fff6e5';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('STOVE  ·  3 PANS', area.x + 16, area.y + 32);
  if (state.focused === 'stove') {
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 3;
    roundRectPath(ctx, area.x + 3, area.y + 3, area.w - 6, area.h - 6, 12);
    ctx.stroke();
  }
  fillRoundRect(ctx, area.x + 14, area.y + 52, area.w - 28, 130, 10, '#3d3d3d');
  for (let i = 0; i < state.pans.length; i++) {
    const pan = state.pans[i];
    const pos = LAYOUT.pans[i];
    const status = grillStatus(pan);
    ctx.fillStyle = '#1c1c1c';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, pos.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = COLORS.steel;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#2e2e2e';
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, pos.r - 8, 0, Math.PI * 2);
    ctx.fill();
    if (status === 'cooking' || status === 'ready') {
      const sizzle = 0.6 + 0.4 * Math.sin(state.animTime * 9 + i * 2);
      ctx.globalAlpha = 0.35 + 0.3 * sizzle;
      ctx.fillStyle = '#ff8c42';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.r - 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      drawFoodIcon(ctx, 'patty', pos.x, pos.y, 1.15);
      const fraction = Math.min(1, pan.t / TUNING.grillCookSeconds);
      drawTimerRing(ctx, pos.x, pos.y, pos.r, fraction, '#f7c948');
      if (pan.t > TUNING.grillCookSeconds) {
        const burnFraction = (pan.t - TUNING.grillCookSeconds) / (TUNING.grillBurnSeconds - TUNING.grillCookSeconds);
        drawTimerRing(ctx, pos.x, pos.y, pos.r + 14, Math.min(1, burnFraction), '#e74c3c');
      }
      ctx.fillStyle = '#fff6e5';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(status === 'ready' ? 'READY!' : Math.ceil(TUNING.grillCookSeconds - pan.t) + 's', pos.x, pos.y + pos.r + 22);
    } else if (status === 'burned') {
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.r - 14, 0, Math.PI * 2);
      ctx.fill();
      drawFoodIcon(ctx, 'patty', pos.x, pos.y, 1.1);
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff6e5';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BURNED — click to clear', pos.x, pos.y + pos.r + 22);
    } else {
      ctx.fillStyle = '#9aa3ad';
      ctx.font = '15px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('empty pan', pos.x, pos.y + 4);
    }
    ctx.textAlign = 'left';
  }
  ctx.fillStyle = '#fff6e5';
  ctx.font = '15px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Click a Patty bin to grill · click a ready pan to collect', area.x + 16, area.y + area.h - 16);
  ctx.fillText('Grilled patties ready: ' + state.prepared.patty, area.x + 16, area.y + area.h - 38);
}

function drawChopBoard(ctx, state) {
  const area = LAYOUT.chop;
  fillRoundRect(ctx, area.x, area.y, area.w, area.h, 14, COLORS.panelLight);
  ctx.strokeStyle = '#2b1a0e';
  ctx.lineWidth = 2;
  roundRectPath(ctx, area.x, area.y, area.w, area.h, 14);
  ctx.stroke();
  ctx.fillStyle = '#fff6e5';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('CHOPPING BOARD', area.x + 16, area.y + 32);
  if (state.focused === 'board') {
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 3;
    roundRectPath(ctx, area.x + 3, area.y + 3, area.w - 6, area.h - 6, 12);
    ctx.stroke();
  }
  const board = LAYOUT.chopBoard;
  const bounce = state.board.bounce;
  const lift = bounce * 8;
  ctx.save();
  ctx.translate(0, -lift);
  fillRoundRect(ctx, board.x, board.y, board.w, board.h, 10, '#c98d4b');
  ctx.strokeStyle = '#7a5222';
  ctx.lineWidth = 3;
  roundRectPath(ctx, board.x, board.y, board.w, board.h, 10);
  ctx.stroke();
  ctx.strokeStyle = '#a8763a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(board.x + 20, board.y + 50);
  ctx.lineTo(board.x + board.w - 20, board.y + 44);
  ctx.moveTo(board.x + 30, board.y + 110);
  ctx.lineTo(board.x + board.w - 30, board.y + 116);
  ctx.stroke();
  if (state.board.item) {
    const item = INGREDIENT_BY_ID[state.board.item];
    const pieces = state.board.chops;
    for (let i = 0; i < 3; i++) {
      const px = board.x + 62 + i * 68;
      const py = board.y + 84;
      if (i < pieces) {
        drawFoodIcon(ctx, state.board.item, px + 14, py + 6, 0.72);
        drawFoodIcon(ctx, state.board.item, px - 14, py - 4, 0.72);
      } else {
        drawFoodIcon(ctx, state.board.item, px, py, 1.05);
      }
    }
    ctx.fillStyle = '#2b1a0e';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText((item ? item.name : '') + '  ·  ' + pieces + ' / ' + TUNING.chopsNeeded + ' chops', board.x + board.w / 2, board.y + board.h - 14);
  } else {
    ctx.fillStyle = '#5e3d1c';
    ctx.font = '16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Click Lettuce, Tomato or Onion', board.x + board.w / 2, board.y + 76);
    ctx.fillText('to place it here, then chop!', board.x + board.w / 2, board.y + 100);
  }
  ctx.restore();
  if (state.board.item && bounce > 0.25) {
    ctx.save();
    ctx.translate(board.x + board.w - 52, board.y - 6 - lift);
    ctx.rotate(-0.5 + bounce * 0.35);
    ctx.fillStyle = '#d8dde2';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(34, -16);
    ctx.lineTo(40, 6);
    ctx.lineTo(6, 18);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2b1a0e';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#2b1a0e';
    ctx.fillRect(-34, 4, 36, 8);
    ctx.restore();
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff6e5';
  ctx.font = '15px system-ui, sans-serif';
  ctx.fillText('Chopped ready: lettuce ' + state.prepared.lettuce + ' · tomato ' + state.prepared.tomato + ' · onion ' + state.prepared.onion, area.x + 16, area.y + area.h - 16);
  ctx.fillText('Click the board or press Space to chop.', area.x + 16, area.y + area.h - 38);
}

function drawAssembly(ctx, state) {
  const area = LAYOUT.assembly;
  fillRoundRect(ctx, area.x, area.y, area.w, area.h, 14, COLORS.counter);
  ctx.strokeStyle = '#2b1a0e';
  ctx.lineWidth = 2;
  roundRectPath(ctx, area.x, area.y, area.w, area.h, 14);
  ctx.stroke();
  fillRoundRect(ctx, area.x, area.y, 44, area.h, 14, COLORS.counterTop);
  ctx.fillStyle = '#fff6e5';
  ctx.font = 'bold 19px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('ASSEMBLY', area.x + 14, area.y + 30);
  const plate = LAYOUT.plate;
  const shakeX = state.shake > 0 ? Math.sin(state.animTime * 40) * 4 * state.shake : 0;
  ctx.save();
  ctx.translate(shakeX, 0);
  ctx.fillStyle = '#e8e4da';
  ctx.beginPath();
  ctx.ellipse(plate.x, plate.y + 34, 78, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#9a948a';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(plate.x, plate.y + 30, 58, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  if (state.plate.base) {
    const items = state.plate.items;
    for (let i = 0; i < items.length; i++) {
      const id = items[i];
      const y = plate.y + 22 - i * 15;
      drawFoodIcon(ctx, id, plate.x, y, 1.25);
    }
    const steamY = plate.y - 18 - items.length * 12;
    ctx.globalAlpha = 0.35 + 0.2 * Math.sin(state.animTime * 3);
    ctx.fillStyle = '#ffffff';
    for (const sx of [-16, 0, 16]) {
      ctx.beginPath();
      ctx.arc(plate.x + sx, steamY + Math.sin(state.animTime * 3 + sx) * 3, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = '#9a948a';
    ctx.font = '15px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('empty plate', plate.x, plate.y + 8);
    ctx.textAlign = 'left';
  }
  ctx.restore();
  const serve = LAYOUT.serveButton;
  const trash = LAYOUT.trashButton;
  const match = state.plate.base && state.orders.some(function (order) {
    const dish = DISH_BY_ID[order.dishId];
    if (!dish) {
      return false;
    }
    return state.plate.items.slice().sort().join(',') === dish.recipe.slice().sort().join(',') && state.plate.base === dish.base;
  });
  fillRoundRect(ctx, serve.x, serve.y, serve.w, serve.h, 10, match ? '#5cb85c' : '#3f7a3f');
  ctx.strokeStyle = '#2b1a0e';
  ctx.lineWidth = 2;
  roundRectPath(ctx, serve.x, serve.y, serve.w, serve.h, 10);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SERVE', serve.x + serve.w / 2, serve.y + 28);
  fillRoundRect(ctx, trash.x, trash.y, trash.w, trash.h, 10, '#a03a2e');
  roundRectPath(ctx, trash.x, trash.y, trash.w, trash.h, 10);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.fillText('TRASH', trash.x + trash.w / 2, trash.y + 28);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff6e5';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Enter = serve · T = trash', area.x + 14, area.y + area.h - 14);
}

function drawPass(ctx, state) {
  const area = LAYOUT.pass;
  fillRoundRect(ctx, area.x, area.y, area.w, area.h, 14, COLORS.panelLight);
  ctx.strokeStyle = '#2b1a0e';
  ctx.lineWidth = 2;
  roundRectPath(ctx, area.x, area.y, area.w, area.h, 14);
  ctx.stroke();
  ctx.fillStyle = '#fff6e5';
  ctx.font = 'bold 19px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('SERVING PASS', area.x + 14, area.y + 30);
  fillRoundRect(ctx, area.x + 12, area.y + 44, area.w - 24, 8, 4, COLORS.steel);
  if (state.passPlates.length === 0) {
    ctx.fillStyle = '#d8cfc0';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('Finished plates wait', area.x + 16, area.y + 96);
    ctx.fillText('here when served.', area.x + 16, area.y + 118);
  }
  for (let i = 0; i < state.passPlates.length; i++) {
    const slot = state.passPlates[i];
    const y = area.y + 96 + i * 78;
    ctx.fillStyle = '#e8e4da';
    ctx.beginPath();
    ctx.ellipse(area.x + area.w / 2, y + 22, 62, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#9a948a';
    ctx.lineWidth = 2;
    ctx.stroke();
    drawDishIcon(ctx, slot.dishId, area.x + area.w / 2, y, 0.95);
    const dish = DISH_BY_ID[slot.dishId];
    ctx.fillStyle = '#2b1a0e';
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('READY · ' + (dish ? dish.short.toUpperCase() : ''), area.x + area.w / 2, y + 52);
    ctx.textAlign = 'left';
  }
  ctx.fillStyle = '#fff6e5';
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Serve a matching plate', area.x + 14, area.y + area.h - 34);
  ctx.fillText('to send it to the pass.', area.x + 14, area.y + area.h - 14);
}

function drawBins(ctx, state) {
  const area = LAYOUT.bins;
  fillRoundRect(ctx, area.x - 8, area.y - 8, area.w + 16, area.h + 16, 14, COLORS.panel);
  ctx.fillStyle = '#f7c948';
  ctx.font = 'bold 17px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('INGREDIENT COUNTER  ·  click a bin (or press 1–8)', area.x + 4, area.y - 14);
  const names = ['bun', 'shell', 'bowl', 'patty', 'lettuce', 'tomato', 'onion', 'cheese'];
  for (let i = 0; i < names.length; i++) {
    const id = names[i];
    const item = INGREDIENT_BY_ID[id];
    const rect = binRect(i);
    fillRoundRect(ctx, rect.x, rect.y, rect.w, rect.h, 12, '#fff6e5');
    ctx.strokeStyle = '#2b1a0e';
    ctx.lineWidth = 2;
    roundRectPath(ctx, rect.x, rect.y, rect.w, rect.h, 12);
    ctx.stroke();
    fillRoundRect(ctx, rect.x + 6, rect.y + 6, rect.w - 12, 86, 8, '#f3e8d2');
    drawFoodIcon(ctx, id, rect.x + rect.w / 2, rect.y + 50, 1.35);
    ctx.fillStyle = '#2b1a0e';
    ctx.font = 'bold 17px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, rect.x + rect.w / 2, rect.y + 116);
    ctx.font = '14px system-ui, sans-serif';
    let hint = 'ready';
    if (item.kind === 'base') {
      hint = 'starts a plate';
    } else if (item.kind === 'grill') {
      hint = 'grill first · ready ' + state.prepared.patty;
    } else if (item.kind === 'chop') {
      hint = 'chop first · ready ' + state.prepared[id];
    }
    ctx.fillText(hint, rect.x + rect.w / 2, rect.y + 138);
    ctx.fillStyle = '#6b4423';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(String(i + 1), rect.x + 10, rect.y + 22);
    ctx.textAlign = 'left';
  }
}

function drawHud(ctx, state) {
  const hud = LAYOUT.hud;
  ctx.fillStyle = '#160b04';
  ctx.fillRect(hud.x, hud.y, hud.w, hud.h);
  ctx.fillStyle = '#f7c948';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('SIZZLE STATION', 24, 35);
  ctx.fillStyle = '#ff8c42';
  ctx.font = 'bold 15px system-ui, sans-serif';
  ctx.fillText('STREET FOOD STALL', 250, 34);
  ctx.fillStyle = '#fff6e5';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText('Score ' + state.score, 470, 35);
  ctx.fillStyle = '#f7c948';
  ctx.fillText('Coins ' + state.coins, 620, 35);
  ctx.fillStyle = '#fff6e5';
  ctx.fillText('Combo x' + state.combo, 770, 35);
  for (let i = 0; i < TUNING.maxHearts; i++) {
    drawHeart(ctx, 920 + i * 30, 30, 24, i < state.hearts);
  }
  const minutes = Math.floor(state.shiftLeft / 60);
  const seconds = Math.floor(state.shiftLeft % 60);
  const timeText = minutes + ':' + String(seconds).padStart(2, '0');
  ctx.fillStyle = state.shiftLeft < 30 ? '#e74c3c' : '#fff6e5';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('⏱ ' + timeText, 1256, 35);
  const barW = 110;
  fillRoundRect(ctx, 1090, 42, barW, 6, 3, '#5a3a28');
  fillRoundRect(ctx, 1090, 42, barW * (state.shiftLeft / TUNING.shiftSeconds), 6, 3, '#f7c948');
  ctx.textAlign = 'left';
  if (state.rushActive) {
    const pulse = 0.7 + 0.3 * Math.sin(state.animTime * 8);
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#ff8c42';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('RUSH ' + Math.ceil(state.rushLeft) + 's', 1080, 22);
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }
  if (state.muted) {
    ctx.fillStyle = '#d8cfc0';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillText('Muted (M)', 1010, 35);
  }
}

function drawHelpBar(ctx, state) {
  const area = LAYOUT.help;
  fillRoundRect(ctx, area.x, area.y, area.w, area.h, 12, '#160b04');
  ctx.fillStyle = '#fff6e5';
  ctx.font = '16px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('How to play:  1) Click a base bin to start a plate.  2) Grill patties on the stove, chop veg on the board.', area.x + 16, area.y + 28);
  ctx.fillText('3) Click bins to add ready ingredients.  4) Press Enter / SERVE when the plate matches a ticket.', area.x + 16, area.y + 52);
  ctx.fillStyle = '#f7c948';
  ctx.textAlign = 'right';
  ctx.fillText('P pause · R restart · M mute', area.x + area.w - 16, area.y + 52);
  ctx.textAlign = 'left';
  if (state.message) {
    ctx.fillStyle = '#f7c948';
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(state.message, 640, area.y + area.h - 8);
    ctx.textAlign = 'left';
  }
}

function drawParticles(ctx, state) {
  for (const p of state.particles) {
    const alpha = Math.max(0, p.life / p.maxLife);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    if (p.kind === 'steam') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size + 4, 0, Math.PI * 2);
      ctx.fillStyle = '#e8e8e8';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
}

function drawPopups(ctx, state) {
  ctx.textAlign = 'center';
  for (const popup of state.popups) {
    const alpha = Math.max(0, Math.min(1, popup.life / popup.maxLife));
    ctx.globalAlpha = alpha;
    ctx.fillStyle = popup.color;
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.strokeStyle = '#2b1a0e';
    ctx.lineWidth = 4;
    ctx.strokeText(popup.text, popup.x, popup.y);
    ctx.fillText(popup.text, popup.x, popup.y);
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
}

function drawEndScreen(ctx, state) {
  ctx.fillStyle = 'rgba(10, 5, 2, 0.82)';
  ctx.fillRect(0, 0, 1280, 800);
  fillRoundRect(ctx, 340, 170, 600, 430, 18, '#fff6e5');
  ctx.strokeStyle = '#2b1a0e';
  ctx.lineWidth = 3;
  roundRectPath(ctx, 340, 170, 600, 430, 18);
  ctx.stroke();
  ctx.fillStyle = '#2b1a0e';
  ctx.font = 'bold 44px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SHIFT OVER', 640, 240);
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText(state.overReason, 640, 280);
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.fillStyle = '#b97c2e';
  ctx.fillText('Score  ' + state.score + '   ·   Coins  ' + state.coins, 640, 340);
  ctx.fillStyle = '#2b1a0e';
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText('Dishes served: ' + state.serves, 640, 384);
  ctx.fillText('Best combo: x' + state.bestCombo, 640, 416);
  ctx.fillText('Mistakes: ' + state.mistakes + '   ·   Rush hours: ' + state.rushCount, 640, 448);
  ctx.fillStyle = '#ff8c42';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText('Press R to play again', 640, 520);
  drawDishIcon(ctx, 'burger', 560, 560, 1);
  drawDishIcon(ctx, 'taco', 640, 560, 1);
  drawDishIcon(ctx, 'bowl', 720, 560, 1);
  ctx.textAlign = 'left';
}

function drawPauseScreen(ctx) {
  ctx.fillStyle = 'rgba(10, 5, 2, 0.6)';
  ctx.fillRect(0, 0, 1280, 800);
  ctx.fillStyle = '#fff6e5';
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', 640, 380);
  ctx.font = '22px system-ui, sans-serif';
  ctx.fillText('Press P to keep cooking', 640, 420);
  ctx.textAlign = 'left';
}

export function drawGame(ctx, state) {
  ctx.clearRect(0, 0, 1280, 800);
  const wall = ctx.createLinearGradient(0, 0, 0, 220);
  wall.addColorStop(0, '#3a2113');
  wall.addColorStop(1, '#241209');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, 1280, 220);
  ctx.fillStyle = '#2e1a0e';
  ctx.fillRect(0, 200, 1280, 340);
  ctx.fillStyle = '#4a2c18';
  ctx.fillRect(0, 520, 1280, 280);
  drawHud(ctx, state);
  drawOrderBoard(ctx, state);
  drawStove(ctx, state);
  drawChopBoard(ctx, state);
  drawAssembly(ctx, state);
  drawPass(ctx, state);
  drawBins(ctx, state);
  drawHelpBar(ctx, state);
  drawParticles(ctx, state);
  drawPopups(ctx, state);
  if (state.over) {
    drawEndScreen(ctx, state);
  } else if (state.paused) {
    drawPauseScreen(ctx);
  }
}
