import TasksComponent from '../tasks.js';
import SortComponent, {SortType} from '../sort.js';
import NoTaskComponent from '../no-tasks.js';
import TaskControllerComponent from './taskController.js';
import {render, remove, RenderPosition} from '../utils/render.js';
import ShowMoreButton from '../showMoreButton.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._noTasksComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._showMoreButtonComponent = new ShowMoreButton();
    this._taskControllerComponent = new TaskControllerComponent(this._tasksComponent.getElement());
  }

  render(tasks) {
    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    const renderTasks = (data) => {
      data.forEach((task) => {
        this._taskControllerComponent.render(task);
      });
    };

    const renderShowMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }

      render(container, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

      this._showMoreButtonComponent.setClickHandler(() => {
        const prevTasksCount = showingTasksCount;
        showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

        renderTasks(tasks.slice(prevTasksCount, showingTasksCount));

        if (showingTasksCount >= tasks.length) {
          remove(this._showMoreButtonComponent);
        }
      });
    };

    renderTasks(tasks.slice(0, showingTasksCount));
    renderShowMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedTasks = [];

      switch (sortType) {
        case SortType.DATE_UP:
          sortedTasks = tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
          break;
        case SortType.DATE_DOWN:
          sortedTasks = tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
          break;
        case SortType.DEFAULT:
          sortedTasks = tasks.slice(0, showingTasksCount);
          break;
      }

      taskListElement.innerHTML = ``;

      renderTasks(sortedTasks);

      if (sortType === SortType.DEFAULT) {
        renderShowMoreButton();
      } else {
        remove(this._showMoreButtonComponent);
      }
    });
  }
}
