$.ajaxSetup({
  crossDomain: true,
  xhrFields: {
    withCredentials: true,
  },
});

const API_URL = "http://localhost:3000";
const AUTH_URL = `${API_URL}/auth`;

function getUserFromForm() {
  const email = $("#email").val();
  const password = $("#password").val();

  const user = {
    email,
    password,
  };
  return user;
}

function showErrorMessage(message) {
  const $errorMessage = $("#errorMessage");
  $errorMessage.text(message);
  $errorMessage.show();
}

function redirectIfLoggedIn() {
  if (localStorage.user_id && document.cookie.length !== 0) {
    window.location = `/?id=${localStorage.user_id}`;
  } else {
    localStorage.removeItem("user_id");
  }
}

function setIdRedirect(result) {
  localStorage.user_id = result.id;
  window.location = `/?id=${result.id}`;
}

function logout() {
  localStorage.removeItem("user_id");
  $.get(`${AUTH_URL}/logout`).then(result => {
    window.location = `/login.html`;
  });
}