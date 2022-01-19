'use strict';

import { data } from './data.js';
import { toDate } from './toDate.js';
console.log(data[0]);

const WIDTH = 600;
const HEIGHT = 200;
const PADDING = 40;
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2;
const VIEW_WIDTH = DPI_WIDTH;
const ROWS_COUNT = 5;

const chart = (canvas, data) => {
  const ctx = canvas.getContext('2d');

  {
    canvas.style.width = WIDTH + 'px';
    canvas.style.height = HEIGHT + 'px';
    canvas.width = DPI_WIDTH;
    canvas.height = DPI_HEIGHT;
  }

  const [yMin, yMax] = computeBoundaries(data);
  const xRatio = VIEW_WIDTH / (data.columns[0].length - 2);
  const yRatio = VIEW_HEIGHT / (yMax - yMin);

  const xData = data.columns.filter(col => data.types[col[0]] === 'line')[0];
  const yData = data.columns.filter(col => data.types[col[0]] === 'line');

  xAxis({ ctx, data: xData, xRatio });
  /* y axis */
  yAxis({ ctx, yMin, yMax });

  yData
    .map(toCoords(xRatio, yRatio))
    .forEach((coords, idx) =>
      line(ctx, coords, { color: data.colors[yData[idx][0]] }),
    );
};

function toCoords(xRatio, yRatio) {
  return col => {
    return col
      .map((y, idx) => [
        Math.floor((idx - 1) * xRatio),
        Math.floor(DPI_HEIGHT - PADDING - y * yRatio),
      ])
      .filter((_, idx) => idx !== 0);
  };
}

function xAxis({ ctx, data, xRatio }) {
  const colsCount = 6;
  const step = Math.round(data.length / colsCount);

  ctx.beginPath();
  for (let i = 1; i < data.length; i += step) {
    const text = toDate(data[i]);
    const x = i * xRatio;
    ctx.fillText(text, x, DPI_HEIGHT - 2);
  }
  ctx.closePath();
}

function yAxis({ ctx, yMin, yMax }) {
  const step = VIEW_HEIGHT / ROWS_COUNT;
  const textStep = (yMax - yMin) / ROWS_COUNT;

  ctx.beginPath();

  ctx.font = 'normal 20px sans-serif';
  ctx.fillStyle = '#96a2aa';
  ctx.strokeStyle = '#bbb';

  for (let i = 1; i <= ROWS_COUNT; i += 1) {
    const y = step * i;
    const text = Math.round(yMax - textStep * i);
    ctx.fillText(text, 0, y + PADDING);
    ctx.moveTo(0, y + PADDING); // Точка начала старта для линии
    ctx.lineTo(DPI_WIDTH, y + PADDING); // 1 - на всю ширину, 2 - сдвиг по y
  }

  ctx.stroke();
  ctx.closePath();
}

function line(ctx, coords, { color }) {
  ctx.beginPath();
  for (const [x, y] of coords) {
    // ctx.lineTo(x, DPI_HEIGHT - PADDING - y * yRatio);
    ctx.lineTo(x, y);
  }
  ctx.lineWidth = 4;
  // ctx.strokeStyle = 'salmon';
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.closePath();
}

chart(document.querySelector('canvas'), data[0]);

/* Отдает минимальне и максимальное число по Y */
function computeBoundaries({ columns, types }) {
  // console.log('columns', columns);
  // console.log('types', types);
  let min;
  let max;

  columns.forEach(col => {
    if (types[col[0]] !== 'line') return;

    if (typeof min !== 'number') min = col[1];
    if (typeof max !== 'number') max = col[1];

    if (min > col[1]) min = col[1];
    if (max < col[1]) max = col[1];

    for (let i = 2; i < col.length; i += 1) {
      const y = col[i];
      if (min > y) min = y;
      if (max < y) max = y;
    }
  });

  return [min, max];
}
