import ToggleTheme from "../../Register/js/ToggleTheme.js";
import logIn from "./Login.js";
import validationLogIn from "./logInValidation.js";

const signUpLink = document.getElementById("signUpLink");
const LogInBtn = document.getElementById("LogInBtn");
const email = document.getElementById("email");
const password = document.getElementById("password");
const currentTheme = localStorage.getItem("theme");
const toggleBtn = document.getElementById("themeToggle");
//////////////////////////////////////////////////Toggle Mode/////////////////////////////////////////////////
if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "dark");
}
document.body.classList.add(`${currentTheme}-mode`);

if (currentTheme === "dark") {
    themeIcon.classList.add("bi-brightness-high");
} else {
    themeIcon.classList.add("bi-moon");
}
toggleBtn.addEventListener("click", () => {
   ToggleTheme()
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
signUpLink.addEventListener("click", () => {
  window.open("../../Register/Register.html", "_self");
});

LogInBtn.addEventListener("click", (e) => {
  if (
    validationLogIn(email, "emailReq") &&
    validationLogIn(password, "passReq")
  ) {
    logIn(email, password);
  } else {
    e.preventDefault();
  }
});
email.addEventListener("blur", () => {
  validationLogIn(email, "emailReq");
});
password.addEventListener("blur", () => {
  validationLogIn(password, "passReq");
});
