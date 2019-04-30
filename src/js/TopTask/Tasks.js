// abstract class Tasks
class Tasks {
  constructor(id, type, description) {
    this.id = id;
    this._type = type;
    this.description = description;
  }

  set type(val) {
    this._type = val;
  }

  get type() {
    return this._type;
  }
}

export default Tasks;
