import { toDate } from './toDate.js';
import constants from '../constants/constants.js';
import { isOver } from './heplers';
import { tooltip } from './tooltip.js';

const { PADDING, DPI_WIDTH, DPI_HEIGHT, VIEW_HEIGHT, ROWS_COUNT } = constants;

export const xAxis = ({
  ctx,
  xData,
  xRatio,
  xDates,
  yData,
  allData,
  proxy,
}) => {
  // console.log('xData', xData);
  // console.log('xDates', xDates);
  const { mouse } = proxy;

  const colsCount = 6;
  const step = Math.round(xData.length / colsCount);
  ctx.font = 'normal 20px sans-serif';
  ctx.fillStyle = '#96a2aa';

  ctx.beginPath();

  for (let i = 1; i < xData.length; i += 1) {
    const x = i * xRatio;

    if ((i - 1) % step === 0) {
      const text = toDate(xDates[i]);
      ctx.fillText(text, x, DPI_HEIGHT - 2);
    }

    if (isOver({ mouse, x, length: xData.length })) {
      // ctx.save();
      ctx.moveTo(x, PADDING / 2);
      ctx.lineTo(x, DPI_HEIGHT - PADDING);
      // ctx.restore();

      tooltip().show(mouse.tooltip, {
        title: toDate(xDates[i]),
        items: yData.map(col => ({
          color: allData.colors[col[0]],
          name: allData.names[col[0]],
          value: col[i + 1],
        })),
      });
    }
  }

  ctx.stroke();
  ctx.closePath();
};

export const yAxis = ({ ctx, yMin, yMax }) => {
  const step = VIEW_HEIGHT / ROWS_COUNT;
  const textStep = (yMax - yMin) / ROWS_COUNT;

  ctx.beginPath();

  ctx.font = 'normal 20px sans-serif';
  ctx.fillStyle = '#96a2aa';
  ctx.strokeStyle = '#bbb';
  ctx.lineWidth = 1;

  for (let i = 1; i <= ROWS_COUNT; i += 1) {
    const y = step * i;
    const text = Math.round(yMax - textStep * i);
    ctx.fillText(text, 0, y + PADDING);
    ctx.moveTo(0, y + PADDING); // Точка начала старта для линии
    ctx.lineTo(DPI_WIDTH, y + PADDING); // 1 - на всю ширину, 2 - сдвиг по y
  }

  ctx.stroke();
  ctx.closePath();
};
