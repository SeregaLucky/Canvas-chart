import constants from '../constants/constants';
import { computeBoundaries, css } from './heplers';
import { line } from './lines';

const toCoords = (xRatio, yRatio) => {
  return col => {
    return col
      .map((y, idx) => [
        Math.floor((idx - 1) * xRatio),
        Math.floor(DPI_HEIGHT - -5 - y * yRatio),
      ])
      .filter((_, idx) => idx !== 0);
  };
};

const {
  rootSlider,
  canvasSlider,
  ctxSlider,
  leftMove,
  rightMove,
  area,
  MIN_WIDTH,
  WIDTH,
  DPI_WIDTH,
  VIEW_WIDTH,
  VIEW_HEIGHT,
  PADDING,
} = constants;

function noop() {}

const HEIGHT = 40;
const DPI_HEIGHT = HEIGHT * 2;
let nextFn = noop;

function next() {
  nextFn(getPosition());
}

function onMouseDown(e) {
  const type = e.target.dataset.type;

  const dimensions = {
    left: parseInt(area.style.left),
    right: parseInt(area.style.right),
    width: parseInt(area.style.width),
  };

  if (type === 'window') {
    const startX = e.pageX;
    document.onmousemove = e => {
      const delta = startX - e.pageX;
      if (delta === 0) {
        return;
      }

      const left = dimensions.left - delta;
      const right = WIDTH - left - dimensions.width;

      setPosition(left, right);
      next();
    };
  } else if (type === 'left' || type === 'right') {
    const startX = e.pageX;
    document.onmousemove = e => {
      const delta = startX - e.pageX;
      if (delta === 0) {
        return;
      }

      if (type === 'left') {
        const left = WIDTH - (dimensions.width + delta) - dimensions.right;
        const right = WIDTH - (dimensions.width + delta) - left;
        setPosition(left, right);
      } else {
        const right = WIDTH - (dimensions.width - delta) - dimensions.left;
        setPosition(dimensions.left, right);
      }
      next();
    };
  }
}

function onMouseUp() {
  document.onmousemove = null;
}

rootSlider.addEventListener('mousedown', onMouseDown);
document.addEventListener('mouseup', onMouseUp);

const defaultWidth = WIDTH * 0.3;
setPosition(0, WIDTH - defaultWidth);

function setPosition(left, right) {
  const w = WIDTH - right - left;

  if (w < MIN_WIDTH) {
    css(area, { width: MIN_WIDTH + 'px' });
    return;
  }

  if (left < 0) {
    css(area, { left: '0px' });
    css(leftMove, { width: '0px' });
    return;
  }

  if (right < 0) {
    css(area, { right: '0px' });
    css(rightMove, { width: '0px' });
    return;
  }

  css(area, {
    width: w + 'px',
    left: left + 'px',
    right: right + 'px',
  });

  css(rightMove, { width: right + 'px' });
  css(leftMove, { width: left + 'px' });
}

function getPosition() {
  const left = parseInt(leftMove.style.width);
  const right = WIDTH - parseInt(rightMove.style.width);

  return [(left * 100) / WIDTH, (right * 100) / WIDTH];
}

/*
 *
 */
export function sliderChart(data) {
  css(canvasSlider, { width: WIDTH + 'px', height: HEIGHT + 'px' });
  canvasSlider.width = DPI_WIDTH;
  canvasSlider.height = DPI_HEIGHT;

  const [yMin, yMax] = computeBoundaries(data);
  const xRatio = DPI_WIDTH / (data.columns[0].length - 2);
  const yRatio = DPI_HEIGHT / (yMax - yMin);

  const yData = data.columns.filter(col => data.types[col[0]] === 'line');
  // console.log('1111111 yData', yData);

  yData.map(toCoords(xRatio, yRatio)).forEach((coords, idx) => {
    const color = data.colors[yData[idx][0]];

    line(ctxSlider, coords, { color });
  });

  return {
    subscribe(fn) {
      nextFn = fn;
      fn(getPosition());
    },
  };
}
