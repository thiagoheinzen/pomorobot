// Selecting DOM elements
const btnAddTask = document.querySelector(".app__button--add-task");
const addTaskForm = document.querySelector(".app__form-add-task");
const textarea = document.querySelector(".app__form-textarea");
const tasksList = document.querySelector(".app__section-task-list");
const btnCancel = document.querySelector(".app__form-footer__button--cancel");
const taskDescriptionParagraph = document.querySelector(
  ".app__section-active-task-description"
);

// Selecting buttons for removing completed tasks and all tasks
const btnRemoveCompleted = document.querySelector("#btn-remove-completed");
const btnRemoveAll = document.querySelector("#btn-remove-all");

// Initializing tasks from localStorage or an empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let selectedTask = null;
let selectedTaskListItem = null;

// Function to update tasks in localStorage
function updateTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to create task elements dynamically
function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svg = document.createElement("svg");
  svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
                fill="#01080E"></path>
        </svg>
    `;

  const paragraph = document.createElement("p");
  paragraph.textContent = task.description;
  paragraph.classList.add("app__section-task-list-item-description");

  const button = document.createElement("button");
  button.classList.add("app__button-edit");

  // Click event to edit task description
  button.onclick = () => {
    const newDescription = prompt("Qual é o novo nome da tarefa?");
    if (newDescription) {
      paragraph.textContent = newDescription;
      task.description = newDescription;
      updateTasks();
    }
  };

  const buttonImage = document.createElement("img");
  buttonImage.setAttribute("src", "/images/edit.png");
  button.append(buttonImage);

  li.append(svg);
  li.append(paragraph);
  li.append(button);

  // Check if task is completed and set appropriate styling
  if (task.completed) {
    li.classList.add("app__section-task-list-item-complete");
    button.setAttribute("disabled", "disabled");
  } else {
    // Click event to select task and show description
    li.onclick = () => {
      document
        .querySelectorAll(".app__section-task-list-item-active")
        .forEach((element) => {
          element.classList.remove("app__section-task-list-item-active");
        });
      if (selectedTask == task) {
        taskDescriptionParagraph.textContent = "";
        selectedTask = null;
        selectedTaskListItem = null;
        return;
      }
      selectedTask = task;
      selectedTaskListItem = li;
      taskDescriptionParagraph.textContent = task.description;

      li.classList.add("app__section-task-list-item-active");
    };
  }

  return li;
}

// Click event to toggle task form visibility
btnAddTask.addEventListener("click", () => {
  addTaskForm.classList.toggle("hidden");
});

// Form submission event to add new task
addTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const task = {
    description: textarea.value,
  };
  tasks.push(task);
  const taskElement = createTaskElement(task);
  tasksList.append(taskElement);
  updateTasks();
  textarea.value = "";
  addTaskForm.classList.add("hidden");
});

// Loop through tasks and append to the tasks list
tasks.forEach((task) => {
  const taskElement = createTaskElement(task);
  tasksList.append(taskElement);
});

// Function to clear the task form
const clearForm = () => {
  textarea.value = "";
  addTaskForm.classList.add("hidden");
};

// Click event to clear the task form
btnCancel.addEventListener("click", clearForm);

// Event listener for when focus on a task finishes
document.addEventListener("FocusFinished", () => {
  if (selectedTask && selectedTaskListItem) {
    selectedTaskListItem.classList.remove("app__section-task-list-item-active");
    selectedTaskListItem.classList.add("app__section-task-list-item-complete");
    selectedTaskListItem
      .querySelector("button")
      .setAttribute("disabled", "disabled");
    selectedTask.completed = true;
    updateTasks();
  }
});

// Function to remove tasks (completed or all)
const removeTasks = (onlyCompleted) => {
  let selector = ".app__section-task-list-item";
  if (onlyCompleted) {
    selector = ".app__section-task-list-item-complete";
  }

  document.querySelectorAll(selector).forEach((element) => {
    element.remove();
  });
  tasks = onlyCompleted ? tasks.filter((task) => !task.completed) : [];
  updateTasks();
};

// Click event to remove completed tasks
btnRemoveCompleted.onclick = () => removeTasks(true);

// Click event to remove all tasks
btnRemoveAll.onclick = () => removeTasks(false);
