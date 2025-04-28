const loginError = document.getElementById("loginError");
export default function logIn(userEmail, userPassword) {
  let users = JSON.parse(localStorage.getItem("usersList")) || [];
  if (userEmail.value === "admin" && userPassword.value === "admin") {
    console.log("welcome Admin");
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
    // window.open('../../Home/Home.html', '_self');
  } else {
    loginError.classList.remove("d-none");
  }
}
