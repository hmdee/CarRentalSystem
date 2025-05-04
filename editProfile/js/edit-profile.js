const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const addressInput = document.getElementById("address");
const phoneInput = document.getElementById("phone");
const imageInput = document.getElementById("profileImage");
const imagePreview = document.getElementById("profileImagePreview");
const saveBtn = document.getElementById("saveBtn");
const signOutBtn = document.querySelectorAll(".btn-signout");
const userName = document.getElementById("userName");
const userImage = document.getElementById("userImage");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

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

// Populate form with current user data
nameInput.value = currentUser.name || "";
emailInput.value = currentUser.email || "";
addressInput.value = currentUser.address || "";
phoneInput.value = currentUser.phone || "";
if (currentUser.profileImage) {
  imagePreview.src = currentUser.profileImage;
  imagePreview.style.display = "block";
}

// Preview the selected image
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreview.src = event.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Save updated data
saveBtn.addEventListener("click", () => {
  let updatedProfileImage = currentUser.profileImage; // Keep existing image by default

  // If a new image is selected, update the profileImage
  if (imageInput.files.length > 0) {
    updatedProfileImage = imagePreview.src; // Use the Base64 string from the preview
  }

  const updatedUser = {
    ...currentUser,
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    address: addressInput.value.trim(),
    phone: phoneInput.value.trim(),
    profileImage: updatedProfileImage
  };

  localStorage.setItem("currentUser", JSON.stringify(updatedUser));

  // Update usersList if exists
  const users = JSON.parse(localStorage.getItem("usersList")) || [];
  const userIndex = users.findIndex(u => Number(u.id) === Number(currentUser.id));
  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
    localStorage.setItem("usersList", JSON.stringify(users));
  }

  alert("Profile updated successfully!");
  window.location.href = "../../bookingHistory/booking-history.html";
});

// Sign out functionality
signOutBtn.forEach(btn => {
  btn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "../../index.html";
  });
});