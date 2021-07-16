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
