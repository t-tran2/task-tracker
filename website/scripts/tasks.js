$(document).ready(function () {
  const params = parseQuery(window.location.search);
  getUserInfo(params.id).catch(handleError);
  loadTasks(params.id);
});

function getUserInfo(id) {
  return $.get(`${API_URL}/user/${id}`);
}

// Create cards from json returned from DB data.
function createCards(tasks) {
    var taskIdOnPage = 1;
  for (let task of tasks) {
    var cardDiv = document.createElement("div");
    cardDiv.id = "card-" + taskIdOnPage;
    cardDiv.classList.add("task", "card", "my-2");

    var cardBody = document.createElement("div");
    cardBody.id = "card-body-" + taskIdOnPage;
    cardBody.classList.add("card-body");

    var cardTitle = document.createElement("h5");
    cardTitle.id = "card-title-" + taskIdOnPage;
    cardTitle.classList.add("card-title");
    cardTitle.appendChild(document.createTextNode(task.title));

    var cardTitleEditor = document.createElement("h5");
    var cardTitleEditorInput = document.createElement("input");
    cardTitleEditorInput.type = "text";
    cardTitleEditorInput.id = "card-title-editor-" + taskIdOnPage;
    cardTitleEditorInput.classList.add("form-control", "d-none");
    cardTitleEditorInput.value = "";

    var cardText = document.createElement("p");
    cardText.id = "card-text-" + taskIdOnPage;
    cardText.classList.add("card-text");
    cardText.appendChild(document.createTextNode(task.text));

    var cardTextEditor = document.createElement("textarea");
    cardTextEditor.id = "card-text-editor-" + taskIdOnPage;
    cardTextEditor.classList.add("form-control", "d-none");

    // Append card body together, then append card body into card div.
    cardBody.appendChild(cardTitle);
    cardTitleEditor.appendChild(cardTitleEditorInput);
    cardBody.appendChild(cardTitleEditor);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardTextEditor);
    cardDiv.appendChild(cardBody);

    // Add event listeners.
    cardTitle.addEventListener("click", editText);
    cardTitleEditor.addEventListener("keydown", changeText);
    cardText.addEventListener("click", editText);
    cardTextEditor.addEventListener("keydown", changeText);

    var createTaskElem = document.getElementById("create-task-todo");
    createTaskElem.before(cardDiv);
    taskIdOnPage++;
  }
}

// Load tasks from DB.
function loadTasks(id) {
  $.get(`${API_URL}/tasks/${id}`, function (results) {
      createCards(results);
  });
}

function handleError(error) {
  window.location = "/login.html";
}

function parseQuery(query) {
  return query
    .substr(1)
    .split("&")
    .reduce((params, keyValue) => {
      const parts = keyValue.split("=");
      params[parts[0]] = parts[1];
      return params;
    }, {});
}
