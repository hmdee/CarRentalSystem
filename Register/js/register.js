const registered = document.getElementById("registered");
const emailExists = document.getElementById("emailExists");
export default function signUp(userName, userEmail, userPass) {
  let user = {
    id: Date.now(),
    name: userName,
    email: userEmail,
    password: userPass,
    profileImage: "../../imgs/profImg.jpg",
    role: "user",
  };
  let users = JSON.parse(localStorage.getItem("usersList")) || [];
  let userExist= users.some((user)=>user.email===userEmail)
  if(userExist)
  {
    emailExists.classList.remove('d-none')
    return
  }
  else
  { emailExists.classList.add('d-none')
    users.push(user);
    localStorage.setItem("usersList", JSON.stringify(users));
    registered.classList.remove("d-none");
  
    setTimeout(() => {
      window.open("../../Login/Login.html", "_self");
    }, 2000);
  }

}
