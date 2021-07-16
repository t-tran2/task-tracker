$(document).ready(function () {
    const params = parseQuery(window.location.search);
    console.log(params.id);
    getUserInfo(params.id).catch(handleError);
    loadTasks(params.id).catch(handleError);
})

function getUserInfo(id) {
    return $.get(`${API_URL}/user/${id}`);
}

function loadTasks(id) {
    return $.get(`${API_URL}/tasks/${id}`)
}

function handleError(error) {
    window.location = '/login.html';
}

function parseQuery(query) {
    return query.substr(1).split('&').reduce((params, keyValue) => {
      const parts = keyValue.split('=');
      params[parts[0]] = parts[1];
      return params
    }, {});
  }