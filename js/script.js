var list = document.getElementById("myUL");
var storageKey = "independentProjectTasks";

function saveTasks() {
  var tasks = Array.from(list.children).map(function(li) {
    return {
      text: li.firstChild.textContent
    };
  });
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function addTask(text) {
  var li = document.createElement("li");
  li.appendChild(document.createTextNode(text));
  list.appendChild(li);
}

var savedTasks = localStorage.getItem(storageKey);
if (savedTasks !== null) {
  JSON.parse(savedTasks).forEach(function(task) {
    addTask(task.text);
  });
}

list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.remove();
    saveTasks();
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var inputValue = document.getElementById("myInput").value;
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    addTask(inputValue);
    saveTasks();
  }
  document.getElementById("myInput").value = "";
}