/* Sizzle Station configuration: dishes, ingredients, tuning and layout. */
/* All positions are in the 1280x800 canvas coordinate space. */

export const CANVAS_WIDTH = 1280;
export const CANVAS_HEIGHT = 800;

export const INGREDIENTS = [
  { id: 'bun', name: 'Bun', kind: 'base', color: '#e8a94e', dark: '#b97c2e', label: 'Bun' },
  { id: 'shell', name: 'Shell', kind: 'base', color: '#f2c94c', dark: '#c99a1e', label: 'Shell' },
  { id: 'bowl', name: 'Bowl', kind: 'base', color: '#e8e4da', dark: '#9a948a', label: 'Bowl' },
  { id: 'patty', name: 'Patty', kind: 'grill', color: '#8a4b2a', dark: '#5e3018', label: 'Patty' },
  { id: 'lettuce', name: 'Lettuce', kind: 'chop', color: '#5cb85c', dark: '#2e7d32', label: 'Lettuce' },
  { id: 'tomato', name: 'Tomato', kind: 'chop', color: '#e74c3c', dark: '#b03a2e', label: 'Tomato' },
  { id: 'onion', name: 'Onion', kind: 'chop', color: '#c39bd3', dark: '#7d5a8a', label: 'Onion' },
  { id: 'cheese', name: 'Cheese', kind: 'ready', color: '#f7c948', dark: '#d9a416', label: 'Cheese' }
];

export const INGREDIENT_BY_ID = {};
for (const item of INGREDIENTS) {
  INGREDIENT_BY_ID[item.id] = item;
}

export const DISHES = [
  {
    id: 'burger',
    name: 'Sizzle Burger',
    short: 'Burger',
    base: 'bun',
    recipe: ['bun', 'patty', 'lettuce', 'tomato'],
    price: 100,
    color: '#e8a94e'
  },
  {
    id: 'taco',
    name: 'Sunny Taco',
    short: 'Taco',
    base: 'shell',
    recipe: ['shell', 'patty', 'cheese', 'onion'],
    price: 110,
    color: '#f2c94c'
  },
  {
    id: 'bowl',
    name: 'Garden Bowl',
    short: 'Bowl',
    base: 'bowl',
    recipe: ['bowl', 'lettuce', 'tomato', 'cheese'],
    price: 90,
    color: '#7fbf6a'
  }
];

export const DISH_BY_ID = {};
for (const dish of DISHES) {
  DISH_BY_ID[dish.id] = dish;
}

export const TUNING = {
  shiftSeconds: 180,
  maxHearts: 3,
  maxOrders: 4,
  orderInterval: 12,
  rushOrderInterval: 6,
  patienceBase: 45,
  patienceMin: 28,
  patienceShrinkPerSecond: 0.08,
  grillCookSeconds: 6,
  grillBurnSeconds: 10,
  chopsNeeded: 3,
  rushEverySeconds: 60,
  rushLengthSeconds: 20,
  trashPenalty: 15,
  maxPrepared: 3,
  patienceBonusMax: 50,
  comboBonusStep: 0.25
};

export const COLORS = {
  bg: '#241209',
  panel: '#3a2113',
  panelLight: '#4a2c18',
  counter: '#6b4423',
  counterTop: '#8a5a30',
  steel: '#9aa3ad',
  steelDark: '#6b747d',
  cream: '#fff6e5',
  ink: '#2b1a0e',
  accent: '#ff8c42',
  gold: '#f7c948',
  green: '#5cb85c',
  amber: '#f0a020',
  red: '#e74c3c'
};

export const LAYOUT = {
  hud: { x: 0, y: 0, w: 1280, h: 52 },
  board: { x: 24, y: 70, w: 1232, h: 132 },
  stove: { x: 24, y: 224, w: 400, h: 292 },
  chop: { x: 448, y: 224, w: 322, h: 292 },
  assembly: { x: 794, y: 224, w: 226, h: 292 },
  pass: { x: 1044, y: 224, w: 212, h: 292 },
  bins: { x: 24, y: 538, w: 1232, h: 154 },
  help: { x: 24, y: 704, w: 1232, h: 84 },
  pans: [
    { x: 104, y: 318, r: 54 },
    { x: 224, y: 318, r: 54 },
    { x: 344, y: 318, r: 54 }
  ],
  chopBoard: { x: 478, y: 268, w: 262, h: 168 },
  plate: { x: 907, y: 372, r: 62 },
  serveButton: { x: 818, y: 452, w: 88, h: 44 },
  trashButton: { x: 910, y: 452, w: 88, h: 44 }
};

export function binRect(index) {
  const area = LAYOUT.bins;
  const gap = 12;
  const count = INGREDIENTS.length;
  const w = (area.w - gap * (count - 1)) / count;
  return { x: area.x + index * (w + gap), y: area.y, w: w, h: area.h };
}

export function ticketRect(index) {
  const area = LAYOUT.board;
  const gap = 14;
  const count = TUNING.maxOrders;
  const w = (area.w - gap * (count - 1)) / count;
  return { x: area.x + index * (w + gap), y: area.y, w: w, h: area.h };
}

export function dishForBase(baseId) {
  for (const dish of DISHES) {
    if (dish.base === baseId) {
      return dish;
    }
  }
  return null;
}
