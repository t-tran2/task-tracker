$(() => {
  $("form").submit((event) => {
    event.preventDefault();
    const user = getUserFromForm();

    login(user)
      .then((result) => {
        window.location = `/?id=${result.id}`;
      })
      .catch((error) => {
        console.error(error);
        showErrorMessage(error.responseJSON.message);
      });
  });
});

function login(user) {
  return $.post(`${AUTH_URL}/login`, user);
}
