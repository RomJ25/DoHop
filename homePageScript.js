document.addEventListener('DOMContentLoaded', () => {
    let addTaskButton = document.getElementById('add-task');
    let toDoInput = document.getElementById('to-do-input');
    let toDoList = document.getElementById('to-do-list');
    let doneList = document.getElementById('done-list');
    let trashModeButton = document.getElementById('trash-mode');
    let clearCompletedButton = document.getElementById('clear-completed');

    let isDeleteMode = false;

    function addTask(event) {
        event.preventDefault();

        let taskText = toDoInput.value.trim();
        if (taskText !== '') {
            let newTask = document.createElement('li');
            let taskCheckbox = document.createElement('input');
            taskCheckbox.type = 'checkbox';

            taskCheckbox.addEventListener('change', function () {
                if (this.checked) {
                    // Move the task to the 'Done' section
                    let parentItem = this.parentElement;
                    parentItem.removeChild(taskCheckbox);
                    parentItem.classList.add('completed');
                    doneList.appendChild(parentItem);
                    addApprovalMark(parentItem);
                } else {
                    // Move the task back to the 'To Do' section
                    let parentItem = this.parentElement;
                    parentItem.removeChild(taskCheckbox);
                    parentItem.classList.remove('completed');
                    toDoList.appendChild(parentItem);
                    removeApprovalMark(parentItem);
                }
            });

            let taskLabel = document.createElement('label');
            taskLabel.textContent = taskText;

            newTask.appendChild(taskCheckbox);
            newTask.appendChild(taskLabel);
            toDoList.appendChild(newTask);
            toDoInput.value = '';
        }
    }

    function addApprovalMark(taskItem) {
        let approvalMark = document.createElement('span');
        approvalMark.classList.add('approval-mark');
        approvalMark.textContent = '✓';
        taskItem.appendChild(approvalMark);
    }

    function removeApprovalMark(taskItem) {
        let approvalMark = taskItem.querySelector('.approval-mark');
        if (approvalMark) {
            taskItem.removeChild(approvalMark);
        }
    }

    function toggleDeleteMode() {
        isDeleteMode = !isDeleteMode;
        toDoList.classList.toggle('delete-mode');
        trashModeButton.classList.toggle('active');
    }

    function deleteTask(event) {
        let target = event.target;
        let taskItem = target.closest('li');

        if (taskItem) {
            let parentList = taskItem.parentElement;

            // Display confirmation dialog
            let confirmDelete = confirm('Are you sure you want to delete this task?');
            if (confirmDelete) {
                parentList.removeChild(taskItem);
            }
        }
    }

    function clearCompletedTasks() {
        let completedTasks = document.querySelectorAll('.completed');

        completedTasks.forEach(task => {
            doneList.removeChild(task);
        });
    }

    function handleTaskClick(event) {
        let target = event.target;
        if (isDeleteMode) {
            deleteTask(event);
        }
    }

    addTaskButton.addEventListener('click', addTask);
    trashModeButton.addEventListener('click', toggleDeleteMode);
    toDoList.addEventListener('click', handleTaskClick);
    doneList.addEventListener('click', handleTaskClick);
    clearCompletedButton.addEventListener('click', clearCompletedTasks);
});
