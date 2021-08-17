  // Add Event listener for creating card onclick in each column
  var createTaskCards = document.getElementsByClassName("create-task");
  for (var i = 0; i < createTaskCards.length; i++) {
    createTaskCards[i].addEventListener("click", createTaskEventListener);
  }