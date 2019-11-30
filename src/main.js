import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {createMainMenuTemplate} from './components/mainMenu.js';
import {createFilterTemplate} from './components/filter.js';
import {createBoardTemplate} from './components/board.js';
import {createTaskEditTemplate} from './components/task-edit.js';
import {createTaskTemplate} from './components/task';
import {createLoadMoreButtonTemplate} from './components/showMoreButton.js';

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const render = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

render(headerElement, createMainMenuTemplate());

const filters = generateFilters();
render(mainElement, createFilterTemplate(filters));
render(mainElement, createBoardTemplate());

const taskListElement = mainElement.querySelector(`.board__tasks`);
const tasks = generateTasks(TASK_COUNT);

render(taskListElement, createTaskEditTemplate(tasks[0]));
let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
tasks.slice(1, showingTasksCount).forEach((task) => render(taskListElement, createTaskTemplate(task)));

const boardElement = mainElement.querySelector(`.board`);
render(boardElement, createLoadMoreButtonTemplate());

const loadMoreButton = boardElement.querySelector(`.load-more`);
loadMoreButton.addEventListener(`click`, () => {
  const prevTaskCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTaskCount, showingTasksCount)
    .forEach((task) => render(taskListElement, createTaskTemplate(task)));

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});

