$(document).ready(function () {
  const params = parseQuery(window.location.search);
  getUserInfo(params.id).catch(handleError);
  loadTasks(params.id);
});

function getUserInfo(id) {
  return $.get(`${API_URL}/user/${id}`);
}

/**
 * Queries involving loading, creating, updating and deleting tasks.
 */

// Load tasks from DB.
function loadTasks(id) {
  $.get(`${API_URL}/tasks/${id}`, function (results) {
    createCards(results);
  }).catch(handleError);
}

// redirect to login page if cookie does not match user id.
function handleError(error) {
  localStorage.removeItem("user_id");
  window.location = "/login.html";
}

function switchCardPUTReq(id, cardID, switchID, status) {
  console.log(cardID);
  console.log(switchID);
  console.log(status);
  $.ajax({
    url: `${API_URL}/tasks/placeholder-id/${id}`,
    type: "PUT",
    data: JSON.stringify({
      switchID: switchID,
    }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      console.log("placeholder success");
    },
    async: false
  });

  $.ajax({
    url: `${API_URL}/tasks/switch-curr-id/${id}`,
    type: "PUT",
    data: JSON.stringify({
      cardID: cardID,
      switchID: switchID,
      status: status,
    }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      console.log("switch curr success");
    },
    async: false
  });

  $.ajax({
    url: `${API_URL}/tasks/switch-other-id/${id}`,
    type: "PUT",
    data: JSON.stringify({
      cardID: cardID,
      switchID: switchID,
    }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      console.log("switch other success");
    },
    async: false
  });
}

function switchCardID(currentElem) {
  try {
    var nextElem = currentElem.nextElementSibling;
    var prevElem = currentElem.previousElementSibling;
  } catch (err) {
  }

  var currentElemCardID = parseInt(currentElem.id.substring(5), 10);
  var nextElemCardID;
  if (nextElem != null) {
    nextElemCardID = parseInt(nextElem.id.substring(5), 10);
  }
  var prevElemCardID; 
  if (prevElem != null) {
  prevElemCardID = parseInt(prevElem.id.substring(5), 10);
  }
  const params = parseQuery(window.location.search);

  // Get status of container.
  var containerID = currentElem.parentNode.id;
  var status = containerID.substring(0, containerID.indexOf("-"));
  if (status.localeCompare("in") == 0) {
    status = "in-progress";
  }
  if (currentElemCardID > nextElemCardID) {
    console.log("run THIS")
    // Switch ids
    currentElem.id = "card-" + nextElemCardID;
    nextElem.id = "card-" + currentElemCardID;
    switchCardPUTReq(params.id, currentElemCardID, nextElemCardID, status);

    // Recursively call to switch with other ids.
    switchCardID(nextElem);
  } else if (currentElemCardID < prevElemCardID) {
    // switch ids
    currentElem.id = "card-" + prevElemCardID;
    prevElem.id = "card-" + currentElemCardID;
    switchCardPUTReq(params.id, currentElemCardID, prevElemCardID, status);

    // Recurisvely call to switch with other ids.
    switchCardID(prevElem);
  }
}
// Adds 'draggable' class to target and submits POST request to DB.
function dragendListener(e) {
  var currentElem = e.target;
  // var currentElemCardID = parseInt(currentElem.id.substring(5), 10);
  // var nextElemCardID = parseInt(nextElem.id.substring(5), 10);

  switchCardID(currentElem);
  currentElem.classList.remove("dragging");
}

function createCardDiv(id, title, text) {
  var cardDiv = document.createElement("div");
  cardDiv.id = "card-" + id;
  cardDiv.classList.add("task", "card", "my-2", "draggable");

  cardDiv.setAttribute("draggable", true);

  var cardBody = document.createElement("div");
  cardBody.id = "card-body-" + id;
  cardBody.classList.add("card-body");

  var cardTitle = document.createElement("h5");
  cardTitle.id = "card-title-" + id;
  cardTitle.classList.add("card-title");
  cardTitle.appendChild(document.createTextNode(title));

  var cardTitleEditor = document.createElement("h5");
  var cardTitleEditorInput = document.createElement("input");
  cardTitleEditorInput.type = "text";
  cardTitleEditorInput.id = "card-title-editor-" + id;
  cardTitleEditorInput.classList.add("form-control", "d-none");
  cardTitleEditorInput.value = "";

  var cardText = document.createElement("p");
  cardText.id = "card-text-" + id;
  cardText.classList.add("card-text");
  cardText.appendChild(document.createTextNode(text));

  var cardTextEditor = document.createElement("textarea");
  cardTextEditor.id = "card-text-editor-" + id;
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
  cardDiv.addEventListener("dragstart", () => {
    cardDiv.classList.add("dragging");
  });
  cardDiv.addEventListener("dragend", dragendListener);

  return cardDiv;
}

// Create cards from json returned from DB data.
function createCards(tasks) {
  for (let task of tasks) {
    var columnStatus = task.status;
    cardDiv = createCardDiv(task.id, task.title, task.text);

    // Add card to correct column.
    var createTaskElem = document.getElementById(`create-task-${columnStatus}`);
    createTaskElem.before(cardDiv);
    draggables = document.getElementsByClassName("draggable");
  }
}

// Update text on card.
function updateCardTitle(cardID, updatedTitle) {
  const params = parseQuery(window.location.search);
  $.ajax({
    url: `${API_URL}/tasks/title-update/${params.id}/${cardID}`,
    type: "PUT",
    data: JSON.stringify({ title: updatedTitle }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {},
  });
}

function updateCardText(cardID, updatedText) {
  const params = parseQuery(window.location.search);
  $.ajax({
    url: `${API_URL}/tasks/text-update/${params.id}/${cardID}`,
    type: "PUT",
    data: JSON.stringify({ text: updatedText }),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {},
  });
}

function createTask(status, createTaskButton) {
  const params = parseQuery(window.location.search);
  $.post(
    `${API_URL}/tasks/create/${params.id}/${status}`,
    function (data, status) {
      // Create task card DIV
      var title = "Double-click to change task title.";
      var text = "Double-click to change task description.";
      var idNum = data[0].id;
      var cardDiv = createCardDiv(idNum, title, text);

      // Add card above create task button.
      createTaskButton.before(cardDiv);
      draggables = document.getElementsByClassName("draggable");
    }
  );
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
