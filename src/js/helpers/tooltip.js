import { css } from './heplers';
import constants from '../constants/constants';

const { root: el } = constants;

const template = ({ title, items }) => `
  <div class="tooltip-title">${title}</div>

  <ul class="tooltip-list">
    ${items
      .map(item => {
        return `
        <li class="tooltip-list-item">
          <div class="value" style="color: ${item.color}">${item.value}</div>
          <div class="name" style="color: ${item.color}">${item.name}</div>
        </li>`;
      })
      .join('')}
  </ul>
`;

// export const tooltip = el => {
export const tooltip = () => {
  const clear = () => (el.innerHTML = '');

  return {
    show({ left, top }, data) {
      const { height, width } = el.getBoundingClientRect();
      clear();

      css(el, {
        display: 'block',
        top: top - height + 'px',
        left: left + width / 2 - 30 + 'px',
      });
      el.insertAdjacentHTML('afterbegin', template(data));
    },

    hide() {
      css(el, { display: 'none' });
    },
  };
};
