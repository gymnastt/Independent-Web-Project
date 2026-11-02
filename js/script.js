var list = document.getElementById("myUL");
var emptyState = document.getElementById("emptyState");
var pageName = window.location.pathname.split("/").pop() || "index.html";
var storageKey = "independentProjectTasks:" + pageName;
var legacyStorageKey = "independentProjectTasks";

var legacyTasks = localStorage.getItem(legacyStorageKey);
if (legacyTasks !== null) {
  var homeStorageKey = "independentProjectTasks:index.html";
  if (localStorage.getItem(homeStorageKey) === null) {
    localStorage.setItem(homeStorageKey, legacyTasks);
  }
  localStorage.removeItem(legacyStorageKey);
}

function saveTasks() {
  var tasks = Array.from(list.children).map(function(li) {
    return {
      text: li.firstChild.textContent
    };
  });
  localStorage.setItem(storageKey, JSON.stringify(tasks));
  updateEmptyState();
}

function updateEmptyState() {
  emptyState.hidden = list.children.length !== 0;
}

function addTask(text) {
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(text));
  list.appendChild(li);
  updateEmptyState();
}

var savedTasks = localStorage.getItem(storageKey);
if (savedTasks !== null) {
  JSON.parse(savedTasks).forEach(function(task) {
    addTask(task.text);
  });
}

updateEmptyState();

list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.remove();
    saveTasks();
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var inputValue = document.getElementById("myInput").value.trim();
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    addTask(inputValue);
    saveTasks();
  }
  document.getElementById("myInput").value = "";
}