import logOut from "./../LogOut/logOut.js";
function renderNavbar() {
   
const navContainer = document.getElementById("mainNav");
  navContainer.innerHTML = `
      <nav class="navbar navbar-expand-lg shadow fixed-top">
        <div class="container-fluid">
          <a class="navbar-brand" href="index.html">Drivee.</a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
  
          <div class="collapse text-center navbar-collapse" id="navbarText">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0 mx-lg-auto">
              <li class="nav-item">
                <a class="nav-link" href="../index.html">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="../index.html#about">About Us</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="../index.html#featuredVehicles">Featured vehicles</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="../index.html#offers">Offers</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="../carsList/carsListings.html">Cars</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="../index.html#categories">Categories</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="../support/support.html">Support</a>
              </li>
            </ul>
  
             <div id="authArea" class="d-flex align-items-center gap-2">
            <button class="btn btn-sm" id="loginBtn" onclick="window.location.href='../Login/Login.html'">Log in</button>
            <button class="btn btn-sm custom-btn" id="signupBtn" onclick="window.location.href='../Register/Register.html'">Sign Up</button>
            <div id="userArea" class="d-none  w-100 dropdown">
              <img
                id="userIcon"
                src="imgs/person-circle.svg"
                alt="User"
                width="32"
                height="32"
                class="rounded-circle mx-auto d-block  dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style="cursor: pointer;"
              />
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="../editProfile/edit-profile.html" id="profileLink">User profile</a></li>
                <li><a class="dropdown-item" href="#" id="logoutLink">Log out</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
    `;
}

function updateAuthUI() {
  const authArea = document.getElementById("authArea");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const userArea = document.getElementById("userArea");
  const userIcon = document.getElementById("userIcon");
  const profileLink = document.getElementById("profileLink");
  const logoutLink = document.getElementById("logoutLink");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser) {
    loginBtn.classList.add("d-none");
    signupBtn.classList.add("d-none");
    userArea.classList.remove("d-none");
    userIcon.src = currentUser.profileImage || "imgs/person-circle.svg";
    logoutLink.addEventListener("click", logOut);
  } else {
    loginBtn.classList.remove("d-none");
    signupBtn.classList.remove("d-none");
    userArea.classList.add("d-none");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  updateAuthUI();
});
