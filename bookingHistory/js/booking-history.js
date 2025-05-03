const pendingOrders = document.getElementById("pendingOrders");
const confirmedOrders = document.getElementById("confirmedOrders");
const cancelledOrders = document.getElementById("cancelledOrders");
const signOutBtn = document.querySelectorAll(".btn-signout");

const users = JSON.parse(localStorage.getItem("usersList")) || [];
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
const cars = JSON.parse(localStorage.getItem("carsList") || localStorage.getItem("cars")) || [];

if (!currentUser) {
  window.location.href = "../../index.html";
}
// userName.textContent = currentUser.name || "User";
// if (userImage) {
//   userImage.src = currentUser.profileImage || "https://via.placeholder.com/30";
//   userImage.onerror = function() {
//     this.src = "https://via.placeholder.com/30";
//   };
// }

signOutBtn.forEach(btn => {
  btn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "../../index.html";
  });
});

if (cars.length === 0) {
  console.error("No cars found in localStorage. Please ensure 'carsList' or 'cars' is populated.");
}

if (bookings.length === 0) {
  console.error("No bookings found in localStorage. Please ensure 'bookings' is populated.");
}

// Helper function to get car model
const getCarModelById = (carId) => {
  const car = cars.find(c => Number(c.id) === Number(carId));
  return car ? car.model : "Unknown";
};

const userBookings = bookings.filter(b => Number(b.userId) === Number(currentUser.id));

if (userBookings.length === 0) {
  console.warn("No bookings found for the current user. User ID:", currentUser.id);
}

userBookings.forEach(booking => {
  if (!booking.carId) {
    console.error(`Invalid carId for booking ID ${booking.id}`);
  }

  const vehicleName = getCarModelById(booking.carId);

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${booking.id}</td>
    <td>${vehicleName}</td>
    <td>${booking.pickupDate}</td>
    <td>${booking.dropOffDate}</td>
    <td>$${booking.totalPrice.toFixed(2)}</td>
    <td><span class="status ${booking.status.toLowerCase()}">${booking.status}</span></td>
  `;

  const status = booking.status.toLowerCase();
  if (status === "pending") {
    pendingOrders.appendChild(row);
  } else if (status === "confirmed") {
    confirmedOrders.appendChild(row);
  } else if (status === "cancelled") {
    cancelledOrders.appendChild(row);
  }
});