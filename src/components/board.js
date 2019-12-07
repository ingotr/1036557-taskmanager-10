import AbstractComponent from './abstractComponent.js';

const createBoardTemplate = () => (
  `<section class="board container"></section>`
);

export default class Board extends AbstractComponent {
  getTemplate() {
    return createBoardTemplate();
  }
}
