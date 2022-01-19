'use strict';

const WIDTH = 600;
const HEIGHT = 200;
const PADDING = 40;
const DPI_WIDTH = WIDTH * 2;
const DPI_HEIGHT = HEIGHT * 2;
const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2;
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
  const yRatio = VIEW_HEIGHT / (yMax - yMin);

  {
    /* y axis */
    const step = VIEW_HEIGHT / ROWS_COUNT;
    const textStep = (yMax - yMin) / ROWS_COUNT;

    ctx.beginPath();

    ctx.font = 'normal 20px sans-serif';
    ctx.fillStyle = '#96a2aa';
    ctx.strokeStyle = '#bbb';

    for (let i = 1; i <= ROWS_COUNT; i += 1) {
      const y = step * i;
      const text = yMax - textStep * i;
      ctx.fillText(text, 0, y + PADDING);
      ctx.moveTo(0, y + PADDING); // Начало и конец линии x & y
      ctx.lineTo(DPI_WIDTH, y + PADDING); // 1 - на всю ширину, 2 - сдвиг по y
    }

    ctx.stroke();
    ctx.closePath();
  }

  {
    ctx.beginPath();
    for (const [x, y] of data) {
      ctx.lineTo(x, DPI_HEIGHT - PADDING - y * yRatio);
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'salmon';
    ctx.stroke();
    ctx.closePath();
  }
};

chart(document.querySelector('canvas'), [
  [0, 0],
  [200, 200],
  [400, 100],
  [600, 380],
  [1200, 0],
]);

/* Отдает минимальне и максимальное число по Y */
function computeBoundaries(data) {
  let min = data[0][1];
  let max = data[0][1];

  for (let i = 1; i < data.length; i += 1) {
    const y = data[i][1];
    if (min > y) min = y;
    if (max < y) max = y;
  }

  return [min, max];
}
