function editText(e) {
    // Find 2nd occurance of "-".
    var nthOccur = 0;
    var indexDash = 0;
    while (nthOccur < 2) {
      indexDash = e.target.id.indexOf("-", indexDash + 1);
      nthOccur++;
    }

    var cardID = e.target.id.slice(indexDash + 1);
    var currentCardTitle = document.getElementById(e.target.id);
    var editor = document.getElementById(
      e.target.id.slice(0, indexDash + 1) + "editor-" + cardID
    );

    // Replace editor input with current text.
    // console.log(cardID);
    // console.log()
    // console.log(editor);
    editor.value = currentCardTitle.innerText;

    // hide text, show editor
    currentCardTitle.classList.add("d-none");
    editor.classList.remove("d-none");
  }

  function changeText(e) {
    if (e.keyCode === 13) {
      // Get index of second dash for id name
      var nthOccur = 0;
      var indexDash = 0;
      while (nthOccur < 2) {
        indexDash = e.target.id.indexOf("-", indexDash + 1);
        nthOccur++;
      }

      // Determine if title or text is being edited.
      var firstDash = e.target.id.indexOf("-");
      const isTitle =
        e.target.id
          .slice(firstDash + 1, indexDash)
          .localeCompare("title") == 0;

      var originalCardID = e.target.id.slice(0, indexDash + 1);

      // Get card ID.
      while (nthOccur < 3) {
        indexDash = e.target.id.indexOf("-", indexDash + 1);
        nthOccur++;
      }
      var cardIDNum = e.target.id.slice(indexDash + 1);

      // Get card title DOM.
      var currentCardTitle = document.getElementById(
        originalCardID + cardIDNum
      );
      var editor = document.getElementById(e.target.id);

      // Replace card title with input.
      currentCardTitle.innerText = editor.value;

      // PUT request to update title or text in DB.
      if (isTitle) {
        updateCardTitle(cardIDNum, editor.value);
      } else {
        updateCardText(cardIDNum, editor.value);
      }

      // hide editor, show text.
      currentCardTitle.classList.remove("d-none");
      editor.classList.add("d-none");
    }
    // TODO: Add else if for shift + enter to add line break.
  }

  function createTaskEventListener(e) {
    // Get status of card.
    var columnID = e.target.parentNode.id;
    var indexAfterStat = columnID.indexOf("-");
    var status = columnID.substring(0, indexAfterStat);
    if (status.localeCompare("in") == 0) {
      status = "in-progress";
    }

    // Post request to create task in DB and front-end.
    var createTaskButton = e.target;
    createTask(status, createTaskButton);
  }

  function deleteTask(e) {
    var cardElem = e.target.parentElement.parentElement;
    var cardID = cardElem.id.substring(5);
    cardElem.remove();
    const params = parseQuery(window.location.search);

    // Delete task in DB.
    $.ajax({
      url: `${API_URL}/tasks/delete-task/${params.id}/${cardID}`,
      type: "DELETE",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (data) {
        console.log("delete success.");
      },
    });
  }