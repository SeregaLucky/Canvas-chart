const WIDTH = 600;
const HEIGHT = 200;
const PADDING = 40;

const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;

// const canvas = document.querySelector('canvas');
const canvas = document.querySelector('canvas[data-el="main"]');
const canvasSlider = document.querySelector('canvas[data-el="slider"]');

export default {
  WIDTH,
  HEIGHT,
  PADDING,
  DPI_WIDTH,
  DPI_HEIGHT,
  VIEW_HEIGHT: DPI_HEIGHT - PADDING * 2,
  VIEW_WIDTH: DPI_WIDTH,
  ROWS_COUNT: 5,
  CIRCLE_RADIUS: 6,

  // Main Chart
  root: document.querySelector('[data-el="tooltip"]'),
  canvas,
  ctx: canvas.getContext('2d'),

  // Slider
  rootSlider: document.querySelector('div[data-el="slider"]'),
  canvasSlider,
  ctxSlider: canvasSlider.getContext('2d'),
  leftMove: document.querySelector('[data-el="left"]'),
  rightMove: document.querySelector('[data-el="right"]'),
  area: document.querySelector('[data-el="window"]'),

  MIN_WIDTH: WIDTH * 0.05,
};
