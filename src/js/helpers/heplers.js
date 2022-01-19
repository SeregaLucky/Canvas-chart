import constants from '../constants/constants';

const { CIRCLE_RADIUS, DPI_WIDTH, DPI_HEIGHT } = constants;

/*
 *
 */
export const circle = ({ ctx, xy, color }) => {
  const [x, y] = xy;

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.fillStyle = '#fff';
  ctx.arc(x, y, CIRCLE_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
};

/*
 *
 */
export const clear = ctx => {
  ctx.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT);
};

/*
 *
 */
export const isOver = ({ mouse, x, length }) => {
  if (!mouse) return false;

  const width = DPI_WIDTH / length;
  return Math.abs(x - mouse.x) < width / 2;
};

/*
 * Отдает минимальне и максимальное число по Y
 */
export const computeBoundaries = ({ columns, types }) => {
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
};

/*
 *
 */
export const css = (el, styles = {}) => {
  return Object.assign(el.style, styles);
};
