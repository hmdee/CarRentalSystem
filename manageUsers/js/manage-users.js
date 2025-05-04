import adminLogOut from "../../LogOut/AdminLogOut.js";

const usersTableBody = document.getElementById('users-table');
const userErrorDiv = document.getElementById('user-error');
const searchInput = document.getElementById('search-users');
const userName = document.getElementById("userName");
const userImage = document.getElementById("userImage");
const messagesBody = document.getElementById("messagesBody");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const admin = localStorage.getItem("admin");

if (!admin) {
    window.location.href = "../../index.html";
}

document.getElementById('adminLogout').addEventListener('click',()=>{
    adminLogOut()
})
// Update Navbar with user info
// if (currentUser) {
//     userName.textContent = currentUser.name || "Admin";
//     if (userImage) {
//         userImage.src = currentUser.profileImage || "https://via.placeholder.com/30";
//         userImage.onerror = function() {
//             this.src = "https://via.placeholder.com/30";
//         };
//     }
// }

const showError = (message) => {
    if (!userErrorDiv) {
        console.error('Error: user-error div not found in the DOM');
        return;
    }
    
    userErrorDiv.textContent = message;
    userErrorDiv.classList.remove('d-none');
    setTimeout(() => {
        userErrorDiv.classList.add('d-none');
        userErrorDiv.textContent = '';
    }, 5000);
};

// Helper function to get users from localStorage
const getUsersList = () => {
    const usersData = localStorage.getItem("usersList");
    if (!usersData) {
        return [];
    }
    try {
        const users = JSON.parse(usersData);
        if (!Array.isArray(users)) {
            showError("Users data is not an array");
            return [];
        }
        return users;
    } catch (error) {
        showError("Error parsing users data");
        return [];
    }
};

// Helper function to save users to localStorage
const saveUsersList = (users) => {
    localStorage.setItem("usersList", JSON.stringify(users));
};

const tableRow = (userObject) => {
    let newTr = document.createElement("tr");
newTr.className='users-data'
    let formattedUser = {
        name: userObject.name || 'N/A',
        email: userObject.email || 'N/A',
        phone: userObject.phone || 'N/A',
        address: userObject.address || 'Not Provided',
        role: userObject.role || 'N/A',
        profileImage: userObject.profileImage ? `<img src="${userObject.profileImage}" alt="Profile" style="max-width: 50px;">` : 'N/A'
    };

    for (let prop in formattedUser) {
        let newTd = document.createElement("td");
        newTd.innerHTML = formattedUser[prop];
        if (prop === 'address' || prop === 'role') {
            newTd.classList.add('d-none', 'd-md-table-cell');
        }
        newTr.appendChild(newTd);
    }

    let actionsTd = document.createElement("td");
    actionsTd.innerHTML = `
        <button class="btn btn-sm btn-warning edit-user me-1" data-id="${userObject.id}">Edit</button>
        <button class="btn btn-sm btn-danger delete-user" data-id="${userObject.id}">Delete</button>
    `;
    newTr.appendChild(actionsTd);

    return newTr;
};

const attachActionListeners = () => {
    document.querySelectorAll('.edit-user').forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-id');
            const users = getUsersList();
            const user = users.find(u => u.id.toString() === userId);
            if (user) {
                document.getElementById('user-id').value = user.id;
                document.getElementById('user-name').value = user.name || '';
                document.getElementById('user-email').value = user.email || '';
                document.getElementById('user-phone').value = user.phone || '';
                document.getElementById('user-address').value = user.address || '';
                document.getElementById('user-password').value = user.password || '';
                document.getElementById('user-role').value = user.role || 'user';
                document.getElementById('user-profile-image').value = user.profileImage || '';
                document.getElementById('userModalLabel').textContent = 'Edit User';
                const modalElement = document.getElementById('userModal');
                if (!modalElement) {
                    console.error('Error: userModal element not found in the DOM');
                    showError('Unable to open modal. Please try again.');
                    return;
                }
                const modal = new bootstrap.Modal(modalElement);
                if (!modal) {
                    console.error('Error: Failed to initialize Bootstrap Modal');
                    showError('Unable to initialize modal. Please check if Bootstrap is loaded.');
                    return;
                }
                modal.show();
            } else {
                showError('User not found.');
            }
        });
    });

    document.querySelectorAll('.delete-user').forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-id');
            if (currentUser && currentUser.id.toString() === userId) {
                showError('You cannot delete the currently logged-in user.');
                return;
            }
            const users = getUsersList();
            const userIndex = users.findIndex(u => u.id.toString() === userId);
            if (userIndex === -1) {
                showError('User not found.');
                return;
            }
            users.splice(userIndex, 1);
            saveUsersList(users);
            renderUsers();
        });
    });
};

const renderUsers = (usersToDisplay = getUsersList()) => {
    if (!usersTableBody) {
        console.error('Error: users-table element not found in the DOM');
        return;
    }
    if (!usersToDisplay || usersToDisplay.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No users found.</td></tr>';
        return;
    }
    usersTableBody.innerHTML = "";
    usersToDisplay.forEach(user => usersTableBody.appendChild(tableRow(user)));
    attachActionListeners();
};

// Load and display support messages
const loadSupportMessages = () => {
    const messages = JSON.parse(localStorage.getItem("supportMessages")) || [];
    const users = getUsersList(); // Get the latest users list

    if (!messagesBody) {
        console.error('Error: messagesBody element not found in the DOM');
        return;
    }
    if (messages.length === 0) {
        messagesBody.innerHTML = '<tr><td colspan="8" class="text-center msg-support">No support messages found.</td></tr>';
        return;
    }
    messagesBody.innerHTML = "";
    messages.forEach(msg => {
        // Find the user associated with this message
        const user = users.find(u => u.id === msg.userId) || {};
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${msg.id}</td>
            <td>${user.name || msg.name || "Unknown"}</td>
            <td>${user.email || msg.email || "No email"}</td>
            <td>${user.phone || msg.phone || "No phone"}</td>
            <td>${user.address || msg.address || "No address"}</td>
            <td>${msg.subject || "No subject"}</td>
            <td>${msg.message}</td>
            <td>${new Date(msg.date).toLocaleString()}</td>
        `;
        messagesBody.appendChild(row);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    if (!searchInput) {
        console.error('Error: search-users input not found in the DOM');
    }
    const openUserModalBtn = document.getElementById('open-user-modal');
    if (!openUserModalBtn) {
        console.error('Error: open-user-modal button not found in the DOM');
        return;
    }

    renderUsers();
    loadSupportMessages(); // Load support messages

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const users = getUsersList();
        let filteredUsers = users.filter(user =>
            (user.name && user.name.toLowerCase().includes(searchTerm)) ||
            (user.email && user.email.toLowerCase().includes(searchTerm))
        );
        renderUsers(filteredUsers);
    });

    // Open modal for adding a new user
    openUserModalBtn.addEventListener('click', () => {
        const modalElement = document.getElementById('userModal');
        if (!modalElement) {
            console.error('Error: userModal element not found in the DOM');
            showError('Unable to open modal. Please try again.');
            return;
        }
        const modal = new bootstrap.Modal(modalElement);
        if (!modal) {
            console.error('Error: Failed to initialize Bootstrap Modal');
            showError('Unable to initialize modal. Please check if Bootstrap is loaded.');
            return;
        }
        document.getElementById('userModalLabel').textContent = 'Add User';
        document.getElementById('user-form').reset();
        document.getElementById('user-id').value = '';
        modal.show();
    });

    // Handle form submission for adding or editing a user
    const userForm = document.getElementById('user-form');
    if (!userForm) {
        console.error('Error: user-form element not found in the DOM');
        return;
    }
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userId = document.getElementById('user-id').value;

        const userData = {
            id: userId ? parseInt(userId) : Date.now(),
            name: document.getElementById('user-name').value.trim(),
            email: document.getElementById('user-email').value.trim(),
            phone: document.getElementById('user-phone').value.trim(),
            address: document.getElementById('user-address').value.trim() || undefined,
            password: document.getElementById('user-password').value.trim(),
            profileImage: document.getElementById('user-profile-image').value.trim() || "../../imgs/profImg.jpg",
            role: document.getElementById('user-role').value.trim() || "user"
        };

        const users = getUsersList();
        if (userId) {
            // Edit existing user
            const userIndex = users.findIndex(u => u.id.toString() === userId);
            if (userIndex === -1) {
                showError('User not found.');
                return;
            }
            users[userIndex] = userData;
            // Update currentUser if the edited user is the logged-in user
            if (currentUser.id.toString() === userId) {
                localStorage.setItem("currentUser", JSON.stringify(userData));
                userName.textContent = userData.name || "Admin";
            }
        } else {
            // Add new user
            const emailExists = users.some(u => u.email === userData.email);
            if (emailExists) {
                showError('This email is already registered.');
                return;
            }
            users.push(userData);
        }

        saveUsersList(users);
        renderUsers();

        // Close the modal
        const modalElement = document.getElementById('userModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        } else {
            console.error('Error: Failed to close modal');
        }
    });
});


