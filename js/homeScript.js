if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "dark");
}

const currentTheme = localStorage.getItem("theme");
document.body.classList.add(`${currentTheme}-mode`);

const toggleBtn = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

if (currentTheme === "dark") {
    themeIcon.classList.add("bi-brightness-high");
} else {
    themeIcon.classList.add("bi-moon");
}

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");

    if (themeIcon.classList.contains("bi-brightness-high")) {
        themeIcon.classList.remove("bi-brightness-high");
        themeIcon.classList.add("bi-moon");
    } else if (themeIcon.classList.contains("bi-moon")) {
        themeIcon.classList.remove("bi-moon");
        themeIcon.classList.add("bi-brightness-high");
    }
    const newTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
});






const rentCarBtn = document.getElementById("rentCarBtn");

if (rentCarBtn) {
    rentCarBtn.addEventListener("click", function () {
        window.location.href = "../carsList/carsListings.html";
    });
}

// Handle Click When login on signup
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
if(loginBtn)
{
    loginBtn.addEventListener('click', function () {
        window.location.href = '../Login/Login.html';
    });
}
if(signupBtn)
{
    signupBtn.addEventListener('click', function () {
        window.location.href = '../Register/Register.html';
    });
}




// Handle Slider (Swiper JS Library)
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 1000,
        disableOnInteraction: false,
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        512: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 3,
        },
        992: {
            slidesPerView: 4,
        },
        1200: {
            slidesPerView: 5,
        },
    }
});