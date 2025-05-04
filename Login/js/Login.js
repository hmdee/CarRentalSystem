const loginError = document.getElementById("loginError");
export default function logIn(userEmail, userPassword) {
  let users = JSON.parse(localStorage.getItem("usersList")) || [];
  if (userEmail.value === "admin" && userPassword.value === "admin") {
    localStorage.setItem('admin','admin')
    window.open("../../manageCars/manage-cars.html",'_self');
    return;
  }

  let foundUser = users.find(
    (user) =>
      user.email === userEmail.value && user.password === userPassword.value
  );
  if (foundUser) {
    loginError.classList.add("d-none");
    console.log(`Welcome ${foundUser.name}`);
    localStorage.setItem("currentUser", JSON.stringify(foundUser));
    window.open("../../index.html", "_self");
  } else {
    loginError.classList.remove("d-none");
  }
}
