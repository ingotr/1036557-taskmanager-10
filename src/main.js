const TASK_COUNT = 3;

import {createMainMenuTemplate} from './components/mainMenu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createEditingCardTemplate} from './components/editingCard.js';
import {createDefaultCardTemplate} from './components/card.js';
import {createLoadMoreButtonTemplate} from './components/showMoreButton.js';

const render = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

render(headerElement, createMainMenuTemplate());
render(mainElement, createFilterTemplate());
render(mainElement, createBoardTemplate());

const boardTasksElement = mainElement.querySelector(`.board__tasks`);

render(boardTasksElement, createEditingCardTemplate(), `afterBegin`);

new Array(TASK_COUNT)
  .fill(``)
  .forEach(
      () => render(boardTasksElement, createDefaultCardTemplate())
  );

const boardElement = mainElement.querySelector(`.board`);
render(boardElement, createLoadMoreButtonTemplate());
