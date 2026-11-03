var list = document.getElementById("myUL");
var emptyState = document.getElementById("emptyState");
var taskForm = document.getElementById("taskForm");
var pageName = window.location.pathname.split("/").pop() || "tasks.html";
var storageKey = "independentProjectTasks:" + pageName;
var legacyStorageKey = "independentProjectTasks";

var legacyTasks = localStorage.getItem(legacyStorageKey);
if (legacyTasks !== null) {
  var homeStorageKey = "independentProjectTasks:tasks.html";
  if (localStorage.getItem(homeStorageKey) === null) {
    localStorage.setItem(homeStorageKey, legacyTasks);
  }
  localStorage.removeItem(legacyStorageKey);
}

var oldHomeStorageKey = "independentProjectTasks:index.html";
var newHomeStorageKey = "independentProjectTasks:tasks.html";
if (localStorage.getItem(newHomeStorageKey) === null && localStorage.getItem(oldHomeStorageKey) !== null) {
  localStorage.setItem(newHomeStorageKey, localStorage.getItem(oldHomeStorageKey));
  localStorage.removeItem(oldHomeStorageKey);
}

function formatTaskValue(field, value) {
  if (!value) {
    return "Not set";
  }
  if (field === "duration") {
    return value + " minutes";
  }
  return value;
}

function renderTask(task) {
  var li = document.createElement("li");
  li.dataset.duration = task.duration || "";
  li.dataset.importance = task.importance || "2";
  li.dataset.notes = task.notes || "";

  var completeCheckbox = document.createElement("input");
  completeCheckbox.type = "checkbox";
  completeCheckbox.className = "complete-task";
  completeCheckbox.setAttribute("aria-label", "Mark " + task.text + " as finished");
  li.appendChild(completeCheckbox);

  var title = document.createElement("button");
  title.type = "button";
  title.className = "task-title";
  title.setAttribute("aria-expanded", "false");
  title.textContent = task.text;
  li.appendChild(title);

  var controls = document.createElement("div");
  controls.className = "task-controls";
  controls.hidden = true;

  var closeEditButton = document.createElement("button");
  closeEditButton.type = "button";
  closeEditButton.className = "close-task-details";
  closeEditButton.setAttribute("aria-label", "Finish editing " + task.text);
  closeEditButton.title = "Finish editing";
  closeEditButton.textContent = "✓";

  [
    { field: "duration", label: "Work time (minutes)", type: "number", value: task.duration, min: "1", step: "1" }
  ].forEach(function(field) {
    var label = document.createElement("label");
    label.className = "task-detail";

    var valueButton = document.createElement("button");
    valueButton.type = "button";
    valueButton.className = "task-value";
    valueButton.dataset.editField = field.field;
    valueButton.textContent = field.label + ": " + formatTaskValue(field.field, field.value);
    label.appendChild(valueButton);

    var input = document.createElement("input");
    input.type = field.type;
    input.dataset.field = field.field;
    input.value = field.value || "";
    input.hidden = true;
    input.setAttribute("aria-label", field.label);
    if (field.min) {
      input.min = field.min;
      input.step = field.step;
    }

    label.appendChild(input);
    controls.appendChild(label);
  });

  var importance = document.createElement("div");
  importance.className = "task-importance";
  importance.setAttribute("role", "group");
  importance.setAttribute("aria-label", "Importance for " + task.text);

  var importanceLabel = document.createElement("span");
  importanceLabel.textContent = "Importance:";
  importance.appendChild(importanceLabel);

  [1, 2, 3].forEach(function(level) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "importance-button";
    button.dataset.importance = String(level);
    button.setAttribute("aria-pressed", String(Number(li.dataset.importance) === level));
    button.classList.toggle("is-selected", level === Number(li.dataset.importance));
    button.setAttribute("aria-label", "Importance " + level + " of 3");
    button.title = "Importance " + level + " of 3";
    button.textContent = "★".repeat(level);
    importance.appendChild(button);
  });
  controls.appendChild(importance);

  var notes = document.createElement("section");
  notes.className = "task-notes";

  var notesTitle = document.createElement("h3");
  notesTitle.textContent = "Notes";
  notes.appendChild(notesTitle);

  var notesButton = document.createElement("button");
  notesButton.type = "button";
  notesButton.className = "task-value notes-value";
  notesButton.textContent = task.notes || "Add notes";
  notesButton.setAttribute("aria-label", "Edit notes for " + task.text);
  notes.appendChild(notesButton);

  var notesEditor = document.createElement("textarea");
  notesEditor.className = "task-notes-editor";
  notesEditor.value = task.notes || "";
  notesEditor.hidden = true;
  notesEditor.setAttribute("aria-label", "Notes for " + task.text);
  notes.appendChild(notesEditor);
  controls.appendChild(notes);

  var editFooter = document.createElement("div");
  editFooter.className = "task-edit-footer";
  editFooter.appendChild(closeEditButton);
  controls.appendChild(editFooter);

  li.appendChild(controls);

  var removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove-task";
  removeButton.setAttribute("aria-label", "Remove " + task.text);
  removeButton.textContent = "×";
  li.appendChild(removeButton);

  list.appendChild(li);
  updateEmptyState();
}

function saveTasks() {
  var tasks = Array.from(list.children).map(function(li) {
    return {
      text: li.querySelector(".task-title").textContent,
      duration: li.dataset.duration,
      importance: li.dataset.importance,
      notes: li.dataset.notes
    };
  });
  localStorage.setItem(storageKey, JSON.stringify(tasks));
  updateEmptyState();
}

function updateEmptyState() {
  emptyState.hidden = list.children.length !== 0;
}

var savedTasks = localStorage.getItem(storageKey);
if (savedTasks !== null) {
  JSON.parse(savedTasks).forEach(function(task) {
    renderTask(task);
  });
}

updateEmptyState();

taskForm.addEventListener("submit", function(event) {
  event.preventDefault();

  var text = document.getElementById("myInput").value.trim();
  if (text === "") {
    alert("You must write something!");
    return;
  }

  renderTask({
    text: text,
    duration: document.getElementById("taskDuration").value,
    importance: document.getElementById("taskImportance").value,
    notes: document.getElementById("taskNotes").value.trim()
  });
  saveTasks();
  taskForm.reset();
});

list.addEventListener("click", function(event) {
  var task = event.target.closest("li");
  if (!task) {
    return;
  }

  if (event.target.classList.contains("task-title")) {
    var controls = task.querySelector(".task-controls");
    controls.hidden = !controls.hidden;
    event.target.setAttribute("aria-expanded", String(!controls.hidden));
    return;
  }

  if (event.target.classList.contains("close-task-details")) {
    var controls = task.querySelector(".task-controls");
    controls.hidden = true;
    task.querySelector(".task-title").setAttribute("aria-expanded", "false");
    return;
  }

  if (event.target.classList.contains("task-value")) {
    if (event.target.classList.contains("notes-value")) {
      event.target.hidden = true;
      var notesEditor = task.querySelector(".task-notes-editor");
      notesEditor.hidden = false;
      notesEditor.focus();
      return;
    }

    var fieldInput = task.querySelector('[data-field="' + event.target.dataset.editField + '"]');
    event.target.hidden = true;
    fieldInput.hidden = false;
    fieldInput.focus();
    return;
  }

  if (event.target.classList.contains("remove-task")) {
    task.remove();
    saveTasks();
    return;
  }

  if (event.target.classList.contains("importance-button")) {
    task.dataset.importance = event.target.dataset.importance;
    task.querySelectorAll(".importance-button").forEach(function(button) {
      var selectedImportance = Number(task.dataset.importance);
      var buttonImportance = Number(button.dataset.importance);
      button.setAttribute("aria-pressed", String(buttonImportance === selectedImportance));
      button.classList.toggle("is-selected", buttonImportance === selectedImportance);
    });
    saveTasks();
  }
});

list.addEventListener("change", function(event) {
  var task = event.target.closest("li");
  if (event.target.classList.contains("task-notes-editor")) {
    task.dataset.notes = event.target.value.trim();
    var notesButton = task.querySelector(".notes-value");
    notesButton.textContent = task.dataset.notes || "Add notes";
    notesButton.hidden = false;
    event.target.hidden = true;
    saveTasks();
    return;
  }

  if (event.target.classList.contains("complete-task")) {
    if (!event.target.checked || task.classList.contains("task-completed")) {
      return;
    }
    task.classList.add("task-completed");
    window.setTimeout(function() {
      task.remove();
      saveTasks();
    }, 250);
    return;
  }

  var field = event.target.dataset.field;
  if (!field) {
    return;
  }

  task.dataset[field] = event.target.value;
  var valueButton = task.querySelector('[data-edit-field="' + field + '"]');
  valueButton.textContent = valueButton.textContent.split(":")[0] + ": " + formatTaskValue(field, event.target.value);
  valueButton.hidden = false;
  event.target.hidden = true;
  saveTasks();
});
