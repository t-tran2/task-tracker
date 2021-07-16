$(() => {
  $("form").submit((event) => {
    event.preventDefault();
    const user = getUserFromForm();

    signup(user)
      .then((result) => {
        window.location = `/?id=${result.id}`;
      })
      .catch((error) => {
        console.log(error);
        showErrorMessage(error.responseJSON.message);
      });
  });
});

function signup(user) {
  return $.post(`${AUTH_URL}/signup`, user);
}
