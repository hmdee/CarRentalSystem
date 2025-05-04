import ToggleTheme from "../../Register/js/ToggleTheme.js";
import addBooking, { calcTotalPrice } from "./AddBooking.js";
import validateAllInputs, { DateValidation } from "./bookingValidation.js";

const rightColDiv = document.getElementById("rightColDiv");
const selectedCar = JSON.parse(localStorage.getItem("selectedCar"));
const bookBtn = document.getElementById("bookBtn");
const pickUpDate = document.getElementById("pickUpDate");
const DropOffDate = document.getElementById("DropOffDate");
const pickUpTime = document.getElementById("pickUpTime");
const dropOffTime = document.getElementById("dropOffTime");
const bookingError = document.getElementById("bookingError");
const price = document.getElementById("price");
const modalBody = document.getElementById("bookingModalBody");
const user = JSON.parse(localStorage.getItem("currentUser"));
const currentTheme = localStorage.getItem("theme");
const toggleBtn = document.getElementById("themeToggle");
const bookings = JSON.parse(localStorage.getItem("bookings"))||[];
if (!user) {
  document.getElementById("bookingRow").innerHTML = `
  <div class="d-flex logInAlert flex-column align-items-center justify-content-center py-5 bg-light rounded shadow-sm">
    <i class="bi bi-exclamation-triangle-fill text-danger display-4 mb-3"></i>
    <h2 class="text-danger text-center mb-3">Login Required</h2>
    <p class="text-muted text-center mb-4">Please log in to continue with your booking process.</p>
    <a href="../../Login/Login.html" class="btn btn-outline-primary px-4 py-2 rounded-pill">
      <i class="bi bi-box-arrow-in-right me-2"></i>Go to Login
    </a>
  </div>
`;
} else if (!selectedCar) {
  document.getElementById(
    "bookingRow"
  ).innerHTML = `<h1 class="text-center text-danger py-5">Please select a car</h1>`;
}
// Create image Col

const imageContainer = document.createElement("div");
imageContainer.className = "image-container w-100 ";
const carImage = document.createElement("img");
carImage.classList.add("img-fluid");
carImage.src = `${selectedCar.image.startsWith("data") ? "" : "../"}${
  selectedCar.image
}`;
carImage.alt = selectedCar.model;

imageContainer.appendChild(carImage);
rightColDiv.appendChild(imageContainer);

/******************************************************************************************************/
price.textContent = `${selectedCar.price_per_day}$/Day`;

/******************************************************************************************************/
bookings.forEach((book) => {
  if (book.carId === selectedCar.id && book.status === "pending") {
    disableBtn();
    bookingError.innerHTML='This car is already booked'
  }
});

/*********************************************************************************************/
pickUpDate.addEventListener("change", () => {
  DateValidation(
    pickUpDate.value,
    pickUpTime.value,
    DropOffDate.value,
    dropOffTime.value
  );
  displayTotalPriceAndDuration();
});
DropOffDate.addEventListener("change", () => {
  DateValidation(
    pickUpDate.value,
    pickUpTime.value,
    DropOffDate.value,
    dropOffTime.value
  );
  displayTotalPriceAndDuration();
});
dropOffTime.addEventListener("change", () => {
  displayTotalPriceAndDuration();
});
pickUpTime.addEventListener("change", () => {
  displayTotalPriceAndDuration();
});
bookBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const isAllInputsValid = validateAllInputs(
    pickUpDate.value,
    DropOffDate.value,
    pickUpTime.value,
    dropOffTime.value
  );
  if (
    isAllInputsValid &&
    DateValidation(
      pickUpDate.value,
      pickUpTime.value,
      DropOffDate.value,
      dropOffTime.value
    )
  ) {
    let { totalDays, extraHours, totalPrice } = addBooking(
      pickUpDate.value,
      DropOffDate.value,
      pickUpTime.value,
      dropOffTime.value
    );
    bookingError.innerText = ``;
    modalBody.innerHTML = `
  <p class="mb-2"><strong>Name:</strong> ${user.name}</p>
  <p class="mb-2"><strong>Email:</strong> ${user.email}</p>
  <p class="mb-2"><strong>Car:</strong> ${selectedCar.model}</p>
  <p class="mb-2"><strong>Pick-up:</strong> ${pickUpDate.value} at ${
      pickUpTime.value
    }</p>
  <p class="mb-2"><strong>Drop-off:</strong> ${DropOffDate.value} at ${
      dropOffTime.value
    }</p>
  <p class="mb-2"><strong>Duration:</strong> ${totalDays} days and ${extraHours} hours</p>
  <p class="mb-2"><strong>Total Price:</strong> ${totalPrice.toFixed(2)} $</p>
`;
    const bookingModal = new bootstrap.Modal(
      document.getElementById("bookingModal")
    );
    bookingModal.show();
    disableBtn();
  } else {
    bookingError.innerText = `All Inputs Are Required`;
  }
});
/******************************************************************************************************/
function disableBtn() {
  bookBtn.disabled = true;
  if (bookBtn.disabled === true) {
    bookBtn.style.pointerEvents = "none";
    bookBtn.style.opacity = ".7";
  }
}
/******************************************************************************************************/

function displayTotalPriceAndDuration() {
  const { totalPrice, totalDays, extraHours } = calcTotalPrice(
    pickUpDate.value,
    DropOffDate.value,
    pickUpTime.value,
    dropOffTime.value
  );
  const isAllInputsValid = validateAllInputs(
    pickUpDate.value,
    DropOffDate.value,
    pickUpTime.value,
    dropOffTime.value
  );
  if (
    isAllInputsValid &&
    DateValidation(
      pickUpDate.value,
      pickUpTime.value,
      DropOffDate.value,
      dropOffTime.value
    )
  ) {
    totalDuration.innerText = `${totalDays} Days and ${extraHours} Hours`;

    price.innerText = `${totalPrice.toFixed(2)}$`;
  }
}

/****************************************Toggle Theme*******************************************************/
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
  ToggleTheme();
});
