'use strict';

import '../../css/partReset.css';
import '../../css/startStyles.scss';

import constants from '../constants/constants';
import { xAxis, yAxis } from './axis';
import { isOver, clear, circle, computeBoundaries, css } from './heplers';
import { line, toCoords } from './lines';
import { tooltip } from './tooltip';
import { sliderChart } from './sliderChart';

const {
  WIDTH,
  HEIGHT,
  DPI_WIDTH,
  DPI_HEIGHT,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  canvas,
  ctx,
  canvasSlider,
  ctxSlider,
} = constants;

export function chart(data) {
  // console.log(111, data);

  const slider = sliderChart(data);

  css(canvas, { width: WIDTH + 'px', height: HEIGHT + 'px' });
  canvas.width = DPI_WIDTH;
  canvas.height = DPI_HEIGHT;

  let rafID = null;

  const proxy = new Proxy(
    {},
    {
      set(...args) {
        const result = Reflect.set(...args);
        rafID = requestAnimationFrame(paint);
        return result;
      },
    },
  );

  slider.subscribe(pos => {
    proxy.pos = pos;
  });

  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseleave', onMouseLeave);

  function onMouseMove({ clientX, clientY }) {
    const { left, top } = canvas.getBoundingClientRect();

    proxy.mouse = {
      x: (clientX - left) * 2,

      tooltip: {
        left: clientX - left,
        top: clientY - top,
      },
    };
  }
  function onMouseLeave() {
    proxy.mouse = null;
    tooltip().hide();
  }

  function paint() {
    clear(ctx);

    const length = data.columns[0].length;
    const leftIndex = Math.round((length * proxy.pos[0]) / 100);
    const rightIndex = Math.round((length * proxy.pos[1]) / 100);

    const columns = data.columns.map(col => {
      const res = col.slice(leftIndex, rightIndex);
      if (typeof res[0] !== 'string') {
        res.unshift(col[0]);
      }
      return res;
    });

    // const [yMin, yMax] = computeBoundaries(data);
    // const xRatio = DPI_WIDTH / (data.columns[0].length - 2);
    // const yRatio = DPI_HEIGHT / (yMax - yMin);
    // const xData = data.columns.filter(col => data.types[col[0]] === 'line')[0];
    // const yData = data.columns.filter(col => data.types[col[0]] === 'line');
    // const xDates = data.columns.filter(col => data.types[col[0]] !== 'line')[0];
    // console.log('1111111 yData', yData);

    const [yMin, yMax] = computeBoundaries({ columns, types: data.types });
    const xRatio = VIEW_WIDTH / (columns[0].length - 2);
    // const yRatio = VIEW_HEIGHT / (yMax - yMin);
    const yRatio = (yMax - yMin) / VIEW_HEIGHT;
    const xData = columns.filter(col => data.types[col[0]] === 'line')[0];
    const yData = columns.filter(col => data.types[col[0]] === 'line');
    const xDates = columns.filter(col => data.types[col[0]] !== 'line')[0];

    xAxis({
      ctx,
      xData,
      xDates: xDates.slice(1),
      yData,
      allData: data,
      xRatio,
      proxy,
    });
    /* y axis */
    yAxis({ ctx, yMin, yMax });

    yData.map(toCoords(xRatio, yRatio, yMin)).forEach((coords, idx) => {
      const color = data.colors[yData[idx][0]];

      line(ctx, coords, { color });

      for (const [x, y] of coords) {
        if (isOver({ mouse: proxy.mouse, x, length: coords.length })) {
          circle({ ctx, xy: [x, y], color });
          break;
        }
      }
    });
  }

  return {
    init() {
      paint();
    },
    destroy() {
      rafID && cancelAnimationFrame(rafID);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    },
  };
}
