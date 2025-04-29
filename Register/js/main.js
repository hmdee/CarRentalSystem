import signUp from "./Register.js"
import ToggleTheme from "./ToggleTheme.js"
// import signInWithGoogle from "./signUpGoogle.js"
import inputsValidation from "./validation.js"

const nameInput=document.getElementById('name')
const emailInput=document.getElementById('email')
const passwordInput=document.getElementById('password')
const terms=document.getElementById('terms')
const signUpBtn=document.getElementById('signUpBtn')
const LoginLink=document.getElementById('LoginLink')
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
//////////////////////////////////////////////////////////////////////////////////////////////////////////// 
nameInput.addEventListener('blur',()=>
{
    inputsValidation(nameInput,'nameError','nameReq')
})
emailInput.addEventListener('blur',()=>
{
    inputsValidation(emailInput,'emailError','emailReq')
})
passwordInput.addEventListener('blur',()=>
{
    inputsValidation(passwordInput,'passError','passReq')
})
terms.addEventListener('click',()=>
{
    inputsValidation(terms, 'termsError')
})
signUpBtn.addEventListener('click',(e)=>
{let isValidName = inputsValidation(nameInput, 'nameError','nameReq');
    let isValidEmail = inputsValidation(emailInput, 'emailError','emailReq');
    let isValidPassword = inputsValidation(passwordInput, 'passError','passReq');
    let isValidTerms = inputsValidation(terms, 'termsError');
    if (isValidName&&isValidEmail&& isValidPassword&&isValidTerms) {
        signUp(nameInput.value,emailInput.value,passwordInput.value)
    } else {
        e.preventDefault()
    }
})

LoginLink.addEventListener('click',()=>
{
    window.open('../../Login/Login.html','_self')
})




