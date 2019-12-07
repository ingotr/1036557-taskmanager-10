import AbstractComponent from './abstractComponent.js';

const createShowMoreButtonTemplate = () => `<button class="load-more"
type="button">load more</button>`;

export default class ShowMoreButton extends AbstractComponent {
  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}

