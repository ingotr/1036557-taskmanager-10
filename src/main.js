import MainMenuComponent from './components/mainMenu.js';
import BoardComponent from './components/board.js';
import FilterController from './controllers/filter.js';
import TasksModel from './models/tasks.js';
import BoardController from './controllers/board.js';
import {generateTasks} from './mock/task.js';
import {render, RenderPosition} from './utils/render.js';

const TASK_COUNT = 22;

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);
const menuComponent = new MainMenuComponent();

render(headerElement, menuComponent, RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(mainElement, boardComponent, RenderPosition.BEFOREEND);

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(mainElement, tasksModel);
filterController.render();

const boardController = new BoardController(boardComponent, tasksModel);

boardController.render();

// временное решение для работы с меню
menuComponent.getElement().querySelector(`.control__label--new-task`)
  .addEventListner(`click`, () => {
    boardController.createTask();
  });

