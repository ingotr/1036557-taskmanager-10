import MainMenuComponent from './components/mainMenu.js';
import FilterComponent from './components/filter.js';
import BoardComponent from './components/board.js';
import TaskEditComponent from './components/task-edit.js';
import TaskComponent from './components/task';
import TasksComponent from './components/tasks.js';
import NoTasksComponent from './components/no-tasks.js';
import ShowMoreButtonComponent from './components/showMoreButton.js';
import SortComponent from './components/sort.js';
import {generateTasks} from './mock/task.js';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from './utils.js';

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const mainElement = document.querySelector(`.main`);
const headerElement = mainElement.querySelector(`.main__control`);

render(headerElement, new MainMenuComponent().getElement(), RenderPosition.BEFOREEND);

const filters = generateFilters();
render(mainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(mainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);

const renderTask = (taskListElement, task) => {
  const onEscKeyDown = (evt) => {
    const isEsckey = evt.key === `Escape` || evt.key === `Esv`;

    if (isEsckey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const taskComponent = new TaskComponent(task);

  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, replaceEditToTask);

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const tasks = generateTasks(TASK_COUNT);
const isAllTasksArchived = tasks.every((task) => task.isArchive);

if (isAllTasksArchived) {
  render(boardComponent.getElement(), new NoTasksComponent().getElement(), RenderPosition.BEFOREEND);
} else {
  render(boardComponent.getElement(), new SortComponent().getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new TasksComponent().getElement(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  tasks.slice(0, showingTasksCount)
    .forEach((task) => {
      renderTask(taskListElement, task);
    });

  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(boardComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevTaskCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTaskCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));

    if (showingTasksCount >= tasks.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

