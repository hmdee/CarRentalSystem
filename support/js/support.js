const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
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

// Send message functionality
sendBtn.addEventListener("click", () => {
  const subject = subjectInput.value.trim();
  const message = messageInput.value.trim();

  if (!subject || !message) {
    alert("Please fill in both subject and message.");
    return;
  }

  const supportMessages = JSON.parse(localStorage.getItem("supportMessages")) || [];
  const newMessage = {
    id: supportMessages.length + 1,
    userId: currentUser.id,
    subject: subject,
    message: message,
    date: new Date().toISOString()
  };

  supportMessages.push(newMessage);
  localStorage.setItem("supportMessages", JSON.stringify(supportMessages));

  alert("Message sent successfully!");
  subjectInput.value = "";
  messageInput.value = "";
});

// Sign out functionality
signOutBtn.forEach(btn => {
  btn.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.href = "../../index.html";
  });
});