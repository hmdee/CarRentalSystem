const paymentHistory = document.getElementById("paymentHistory");
const signOutBtn = document.querySelectorAll(".btn-signout");
const userName = document.getElementById("userName");
const userImage = document.getElementById("userImage");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
const cars = JSON.parse(localStorage.getItem("carsList") || localStorage.getItem("cars")) || [];

if (!currentUser) {
  window.location.href = "../../index.html";
}

// Update Navbar with user info
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
  const paymentStatus = booking.status === "Confirmed" ? "Paid" : "Pending";

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${booking.id}</td>
    <td>${vehicleName}</td>
    <td class="d-none d-md-table-cell">${booking.pickupDate}</td>
    <td class="d-none d-md-table-cell">${booking.dropOffDate}</td>
    <td>$${booking.totalPrice.toFixed(2)}</td>
    <td><span class="status ${paymentStatus.toLowerCase()}">${paymentStatus}</span></td>
  `;

  paymentHistory.appendChild(row);
});