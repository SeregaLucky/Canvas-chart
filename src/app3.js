'use strict';

import { chart } from './js/helpers/chart';
import { data } from './js/data/data';

// const tgChart = chart(document.querySelector('canvas'), data[0]);
const tgChart = chart(data[0]);
tgChart.init();
