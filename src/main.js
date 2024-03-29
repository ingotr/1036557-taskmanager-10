import MainMenuComponent from './components/mainMenu.js';
import BoardComponent from './components/board.js';
import FilterComponent from './components/filter.js';
import BoardController from './components/controllers/board.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from './components/utils/render.js';

const TASK_COUNT = 22;

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

render(headerElement, new MainMenuComponent(), RenderPosition.BEFOREEND);

const filters = generateFilters();

render(mainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);

const boardController = new BoardController(boardComponent);

boardController.render(tasks, filters);

