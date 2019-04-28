import '../../css/task.css';
import Tasks from './Tasks';

class TopTask {
    constructor() {
        // type
        this.form = '[data-query=form]';
        this.counterId = 0;
        this.listTasks = [];
    }

    init() {
        this._wraperListUi(this.listTasks);

        // events form
        this.onSubmitForm();
        this.onChangeTask();
    }

    _wraperListUi(arr) {
        const form = document.querySelector(this.form);
        const div = document.createElement('div');
        const pinned = arr.filter(item => item.type === 'pinned');
        const all = arr.filter(item => item.type === 'all');

        for (const node of form.parentNode.children) {
            if (node.dataset['query'] === 'wrapper') {
                node.remove();
            }
        }

        div.className = 'task__wrapper';
        div.dataset['query'] = 'wrapper';

        this._listTaskUi(div, pinned,'pinned');
        this._listTaskUi(div, all,'all');

        form.parentNode.appendChild(div);
    }

    _listTaskUi(parent, arr, type = 'all') {
        const wrapper = document.createElement('div');
        const heading = document.createElement('h2');
        const list = document.createElement('ul');
        const emptyList = document.createElement('p');


        wrapper.className = 'task__wrapper-list';
        heading.className = 'task__heading';
        emptyList.className = 'task__empty-list';
        list.className = `task__list task__list-${type}`;

        if (type === 'pinned') {
            heading.innerText = 'Pinned:';
            emptyList.innerText = 'No pinned tasks';
        }
        if (type === 'all') {
            heading.innerText = 'All Tasks:';
            emptyList.innerText = 'No tasks found';
        }

        wrapper.appendChild(heading);

        if (arr.map(item => item.type === type).length === 0) {
            wrapper.appendChild(emptyList);
        } else {
            wrapper.appendChild(list);
            arr.forEach(item => this._itemTaskUi(list, item));
        }
        parent.appendChild(wrapper);
    }

    _itemTaskUi(parent, item) {
        const li = document.createElement('li');
        const p = document.createElement('p');
        const button = document.createElement('button');

        li.className = 'task__item';
        p.className = 'task__description';
        p.innerHTML = item.description;

        if (item.type === 'pinned') {
            button.className = 'task__button task__button-pinned';
        } else {
            button.className = 'task__button';
        }

        button.addEventListener('click', () => {
            item.type = (item.type === 'pinned')? 'all' : 'pinned';
            this._wraperListUi(this.listTasks);
        });

        li.appendChild(p);
        li.appendChild(button);
        parent.appendChild(li);
    }

    onChangeTask() {
        const form = document.querySelector(this.form);
        const task = form.elements['task'];

        task.addEventListener('input', () => {
            if (task.value.trim() !== '') {
                this._wraperListUi(this.listTasks.filter(item => {
                    if (item.type === 'all') {
                        const regExp = new RegExp('^('+ task.value +')');
                        return regExp.test(item.description);
                    }

                    return true;
                }));
            } else {
                this._wraperListUi(this.listTasks);
            }
        })
    }

    onSubmitForm() {
        const form = document.querySelector(this.form);
        const task = form.elements['task'];

        form.addEventListener('submit', e => {
            const wrapper = task.parentNode.querySelector('.task_error');

            e.preventDefault();
            if (wrapper !== null) wrapper.remove();
            if (task.value.trim() !== '') {
                this.counterId += 1;

                this.listTasks.push(new Tasks(this.counterId, 'all', task.value));
                task.value = '';
                this._wraperListUi(this.listTasks);
            } else {
                TopTask.returnErrorUi({
                    el: task.parentNode,
                    dataError: 'task',
                    classWrapper: 'task_error',
                    message: '* Поле вода пустое!'
                })
            }
        });
    }

    static returnErrorUi(obj) {
        if (typeof obj === 'object') {
            const p = document.createElement('p');

            p.className = obj.classWrapper;
            p.innerHTML = obj.message || 'Ошибка!';
            p.dataset['error'] = obj.dataError;
            obj.el.prepend(p);
        } else {
            throw new TypeError('this config is not object!!!');
        }
    }
}

export default TopTask;
