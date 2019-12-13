import TasksComponent from '../tasks.js';
import SortComponent, {SortType} from '../sort.js';
import NoTaskComponent from '../no-tasks.js';
import TaskController from './task.js';
import {render, renderFilter, remove, RenderPosition} from '../utils/render.js';
import ShowMoreButton from '../showMoreButton.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange, onFiltersChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange, onFiltersChange);
    taskController.render(task);
    return taskController;
  });
};

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._tasks = [];
    this._showedTaskControllers = [];
    this._noTasksComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._showMoreButtonComponent = new ShowMoreButton();
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFiltersChange = this._onFiltersChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tasks, filters) {
    this._tasks = tasks;
    this._filters = filters;

    const container = this._container.getElement();
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, this._tasks.slice(0, showingTasksCount),
        this._onDataChange, this._onViewChange, this._onFiltersChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderShowMoreButton();
  }

  _renderShowMoreButton() {
    if (showingTasksCount >= this._tasks.length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
    this._showMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      const taskListElement = this._tasksComponent.getElement();

      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      const newTasks = renderTasks(taskListElement, this._tasks.slice(prevTasksCount, showingTasksCount), this._onDataChange, this._onViewChange, this._onFiltersChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (showingTasksCount >= this._tasks.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _onFiltersChange(filterType, filterChanged) {
    const filterAllCount = document.querySelector(`.filter__all-count`);
    const filterFavoritesCount = document.querySelector(`.filter__favorites-count`);
    const filterArchiveCount = document.querySelector(`.filter__archive-count`);

    const FilterNamesIndex = {
      ALL: 0,
      OVERDUE: 1,
      TODAY: 2,
      FAVORITES: 3,
      REPEATING: 4,
      TAGS: 5,
      ARCHIVE: 6,
    };

    switch (filterType) {
      case `archive`:
        if (filterChanged) {
          renderFilter(this._filters, FilterNamesIndex.ALL, filterAllCount, true);
          renderFilter(this._filters, FilterNamesIndex.ARCHIVE, filterArchiveCount, true);
        } else {
          renderFilter(this._filters, FilterNamesIndex.ALL, filterAllCount, false);
          renderFilter(this._filters, FilterNamesIndex.ARCHIVE, filterArchiveCount, false);
        }
        break;
      case `favorites`:
        if (filterChanged) {
          renderFilter(this._filters, FilterNamesIndex.ALL, filterAllCount, true);
          renderFilter(this._filters, FilterNamesIndex.FAVORITES, filterFavoritesCount, true);
        } else {
          renderFilter(this._filters, FilterNamesIndex.ALL, filterAllCount, false);
          renderFilter(this._filters, FilterNamesIndex.FAVORITES, filterFavoritesCount, false);
        }
        break;
    }
  }

  _onDataChange(taskController, oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    taskController.render(this._tasks[index]);
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = [];

    switch (sortType) {
      case SortType.DATE_UP:
        sortedTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case SortType.DATE_DOWN:
        sortedTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case SortType.DEFAULT:
        sortedTasks = this._tasks.slice(0, showingTasksCount);
        break;
    }

    const taskListElement = this._tasksComponent.getElement();

    taskListElement.innerHTML = ``;

    const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange, this._onFiltersChange);
    this._showedTaskControllers = newTasks;

    if (sortType === SortType.DEFAULT) {
      this._renderShowMoreButton();
    } else {
      remove(this._showMoreButtonComponent);
    }
  }
}

