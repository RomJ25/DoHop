document.addEventListener('DOMContentLoaded', () => {
    let addTaskButton = document.getElementById('add-task');
    let toDoInput = document.getElementById('to-do-input');
    let toDoList = document.getElementById('to-do-list');
    let doneList = document.getElementById('done-list');
    let deleteModeButton = document.getElementById('delete-mode');
    let cancelModeButton = document.getElementById('cancel-mode');

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
                    parentItem.removeChild(this);
                    parentItem.classList.add('completed');
                    doneList.appendChild(parentItem);
                    addApprovalMark(parentItem);
                } else {
                    // Move the task back to the 'To Do' section
                    let parentItem = this.parentElement;
                    parentItem.removeChild(this);
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

    function enableDeleteMode() {
        isDeleteMode = true;
        deleteModeButton.disabled = true;
        cancelModeButton.disabled = false;
        toDoList.classList.add('delete-mode');
    }

    function disableDeleteMode() {
        isDeleteMode = false;
        deleteModeButton.disabled = false;
        cancelModeButton.disabled = true;
        toDoList.classList.remove('delete-mode');
    }

    function deleteTask(taskItem) {
        let parentList = taskItem.parentElement;

        // Display confirmation dialog
        let confirmDelete = confirm("Are you sure you want to delete this task?");
        if (confirmDelete) {
            parentList.removeChild(taskItem);

            // Remove the task from local storage if needed
            if (parentList === toDoList) {
                removeTaskFromLocalStorage(taskItem);
            }
        }
    }

    function removeTaskFromLocalStorage(taskItem) {
        let taskText = taskItem.querySelector('label').textContent;
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        let updatedTasks = tasks.filter((task) => task !== taskText);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }

    function handleTaskClick(event) {
        let target = event.target;
        if (isDeleteMode) {
            let taskItem = target.closest('li');
            if (taskItem) {
                deleteTask(taskItem);
            }
        }
    }

    addTaskButton.addEventListener('click', addTask);
    deleteModeButton.addEventListener('click', enableDeleteMode);
    cancelModeButton.addEventListener('click', disableDeleteMode);
    toDoList.addEventListener('click', handleTaskClick);
    doneList.addEventListener('click', handleTaskClick);
});
