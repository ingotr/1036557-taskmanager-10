import TasksComponent from '../components/tasks.js';
import SortComponent, {SortType} from '../components/sort.js';
import NoTaskComponent from '../components/no-tasks.js';
import TaskController, {Mode as TaskControllerMode, EmptyTask} from './task.js';
import {render, renderFilter, remove, RenderPosition} from '../utils/render.js';
import ShowMoreButton from '../components/showMoreButton.js';

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

const renderTasks = (taskListElement, tasks, onDataChange, onViewChange, onFiltersChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange, onFiltersChange);
    taskController.render(task, TaskControllerMode.DEFAUILT);
    return taskController;
  });
};

export default class BoardController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._tasks = [];
    this._showedTaskControllers = [];
    this._noTasksComponent = new NoTaskComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._showMoreButtonComponent = new ShowMoreButton();
    this._creatingTask = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  render(filters) {
    this._filters = filters;

    const container = this._container.getElement();
    const tasks = this._tasksModel.getTasks();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);
    render(container, this._tasksComponent, RenderPosition.BEFOREEND);

    this._renderTasks(tasks.slice(0, this._showingTasksCount));

    this._renderShowMoreButton();
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._tasksComponent.getElement();
    this._creatingTaskk = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  }

  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  _renderTasks(tasks) {
    const taskListElement = this._tasksComponent.getElement();

    const newTasks = renderTasks(taskListElement, tasks, this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    const container = this._container.getElement();
    render(container, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _onFilterChange() {
    this._updateTasks(SHOWING_TASKS_COUNT_ON_START);
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

  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderShowMoreButton();
  }

  _onDataChange(taskController, oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingTask = null;
      if (newData === null) {
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._tasksModel.addTask(newData);
        taskController.rendre(newData, TaskControllerMode.DEFAULT);

        const destroyedTask = this._showedTaskControllers.pop();
        destroyedTask.destroy();

        this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
        this._showingTasksCount = this._showedTaskControllers.length;
      }
    } else if (newData === null) {
      this._tasksModel.removeTask(oldData.id);
      this._updateTasks(this._showingTasksCount);
    } else {
      const isSuccess = this._tasksModel._updateTasks(oldData.id, newData);

      if (isSuccess) {
        taskController.render(newData, TaskControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedTasks = [];
    const tasks = this._tasksModel.getTasks();

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

    this._removeTasks();
    this._renderTasks(sortedTasks);

    if (sortType === SortType.DEFAULT) {
      this._renderShowMoreButton();
    } else {
      remove(this._showMoreButtonComponent);
    }
  }

  _onShowMoreButtonClick() {
    const prevTasksCount = showingTasksCount;
    const tasks = this._tasksModel.getTasks();

    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    this._renderTasks(tasks.slice(prevTasksCount, this._showingTasksCount));

    if (showingTasksCount >= tasks.length) {
      remove(this._showMoreButtonComponent);
    }
  }
}

