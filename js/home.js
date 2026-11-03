var taskPages = [
  { file: "tasks.html", label: "To Do List" },
  { file: "important.html", label: "Important List" },
  { file: "school.html", label: "School Homework" },
  { file: "random.html", label: "Random (low priority)" },
  { file: "extra.html", label: "Extra" }
];
var taskList = document.getElementById("allTasksList");
var emptyState = document.getElementById("homeEmptyState");
var taskForm = document.getElementById("homeTaskForm");

function getTasksForPage(page) {
  var savedTasks = localStorage.getItem("independentProjectTasks:" + page.file);
  return savedTasks === null ? [] : JSON.parse(savedTasks);
}

function renderAllTasks() {
  taskList.replaceChildren();

  taskPages.forEach(function(page) {
    getTasksForPage(page).forEach(function(task) {
      var item = document.createElement("li");
      item.className = "home-task-item";

      var title = document.createElement("a");
      title.href = page.file;
      title.className = "home-task-title";
      title.textContent = task.text;
      item.appendChild(title);

      var category = document.createElement("span");
      category.className = "home-task-category";
      category.textContent = page.label;
      item.appendChild(category);

      var details = [];
      if (task.duration) {
        details.push(task.duration + " min");
      }
      if (task.importance) {
        details.push("Importance: " + task.importance + "/3");
      }
      if (task.notes) {
        details.push(task.notes);
      }
      if (details.length > 0) {
        var metadata = document.createElement("p");
        metadata.className = "home-task-details";
        metadata.textContent = details.join(" · ");
        item.appendChild(metadata);
      }

      taskList.appendChild(item);
    });
  });

  emptyState.hidden = taskList.children.length !== 0;
}

taskForm.addEventListener("submit", function(event) {
  event.preventDefault();

  var title = document.getElementById("homeTaskTitle").value.trim();
  if (!title) {
    document.getElementById("homeTaskTitle").focus();
    return;
  }

  var page = document.getElementById("homeTaskPage").value;
  var tasks = getTasksForPage({ file: page });
  tasks.push({
    text: title,
    duration: document.getElementById("homeTaskDuration").value,
    importance: document.getElementById("homeTaskImportance").value,
    notes: document.getElementById("homeTaskNotes").value.trim()
  });
  localStorage.setItem("independentProjectTasks:" + page, JSON.stringify(tasks));
  taskForm.reset();
  renderAllTasks();
});

window.addEventListener("storage", function(event) {
  if (event.key === null || event.key.indexOf("independentProjectTasks:") === 0) {
    renderAllTasks();
  }
});

renderAllTasks();
