const registered = document.getElementById("registered");
export default function signUp(userName, userEmail, userPass) {
  let user = {
    name: userName,
    email: userEmail,
    password: userPass,
    role: "user",
  };
  localStorage.setItem("user", JSON.stringify(user));
  registered.classList.remove("d-none");
  setTimeout(()=>{
    window.open('../../Login/Login.html','_self')
  },3000)
}
