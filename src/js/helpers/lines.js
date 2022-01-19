import constants from '../constants/constants';

const { DPI_HEIGHT, PADDING } = constants;

export const toCoords = (xRatio, yRatio) => {
  return col => {
    return col
      .map((y, idx) => [
        Math.floor((idx - 1) * xRatio),
        Math.floor(DPI_HEIGHT - PADDING - y * yRatio),
      ])
      .filter((_, idx) => idx !== 0);
  };
};

export const line = (ctx, coords, { color }) => {
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
};
