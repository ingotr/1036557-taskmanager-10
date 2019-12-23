import MainMenuComponent from './components/mainMenu.js';
import BoardComponent from './components/board.js';
import FilterComponent from './components/filter.js';
import TasksModel from './models/tasks.js';
import BoardController from './controllers/board.js.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from './utils/render.js';

const TASK_COUNT = 22;

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

render(headerElement, new MainMenuComponent(), RenderPosition.BEFOREEND);

const filters = generateFilters();

render(mainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const boardController = new BoardController(boardComponent, tasksModel);

boardController.render(filters);

