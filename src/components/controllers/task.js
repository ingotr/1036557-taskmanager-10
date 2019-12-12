import TaskComponent from '../task.js';
import TaskEditComponent from '../taskEdit.js';
import {render, replace, RenderPosition} from '../utils/render.js';

export default class TaskController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
  }

  render(task) {
    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
      if (isEscKey) {
        replaceEditToTask();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    }

    const replaceEditToTask = () => {
      replace(taskComponent, taskEditComponent);
    };

    const replaceTaskToEdit = () => {
      replace(taskEditComponent, taskComponent);
    };

    const editButtonHandler = () => {
      replaceTaskToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const taskComponent = new TaskComponent(task);
    taskComponent.setEditButtonClickHandler(editButtonHandler);

    const taskEditComponent = new TaskEditComponent(task);
    taskEditComponent.setSubmitHandler(replaceEditToTask);
    render(this._container, taskComponent, RenderPosition.BEFOREEND);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }
}
