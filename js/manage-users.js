import { getUsers, addUser, updateUser, removeUser } from "../js/modules/storage.js";

const usersTableBody = document.getElementById('users-table');
const userErrorDiv = document.getElementById('user-error');
const searchInput = document.getElementById('search-users');
const filterAvailableCheckbox = document.getElementById('filter-available');

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

const tableRow = (userObject) => {
    let newTr = document.createElement("tr");

    // تنسيق الخصائص الخاصة
    let formattedUser = {
        name: userObject.name || 'N/A',
        email: userObject.email || 'N/A',
        phone: userObject.phone || 'N/A',
        address: userObject.address || 'Not Provided'
    };

    // إنشاء الخلايا بناءً على الخصائص المُنسقة
    for (let prop in formattedUser) {
        let newTd = document.createElement("td");
        newTd.textContent = formattedUser[prop];
        if (prop === 'address') {
            newTd.classList.add('d-none', 'd-md-table-cell');
        }
        newTr.appendChild(newTd);
    }

    // إضافة خلية الأزرار
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
            const users = getUsers();
            if (users.error) {
                showError(users.error);
                return;
            }
            const user = users.find(u => u.id.toString() === userId);
            if (user) {
                document.getElementById('user-id').value = user.id;
                document.getElementById('user-name').value = user.name || '';
                document.getElementById('user-email').value = user.email || '';
                document.getElementById('user-phone').value = user.phone || '';
                document.getElementById('user-address').value = user.address || '';
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
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser && currentUser.id.toString() === userId) {
                showError('You cannot delete the currently logged-in user.');
                return;
            }
            const result = removeUser(userId);
            if (result.error) {
                showError(result.error);
            } else {
                renderUsers();
            }
        });
    });
};

const renderUsers = (usersToDisplay = getUsers()) => {
    if (!usersTableBody) {
        console.error('Error: users-table element not found in the DOM');
        return;
    }
    if (usersToDisplay.error) {
        showError(usersToDisplay.error);
        return;
    }
    if (!usersToDisplay || usersToDisplay.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="5" class="text-center">No users found.</td></tr>';
        return;
    }
    usersTableBody.innerHTML = "";
    usersToDisplay.forEach(user => usersTableBody.appendChild(tableRow(user)));
    attachActionListeners();
};

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    /*const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please log in to access this page.');
        window.location.href = 'index.html';
        return;
    }*/

    // Check if required elements exist
    if (!searchInput) {
        console.error('Error: search-users input not found in the DOM');
    }
    if (!filterAvailableCheckbox) {
        console.error('Error: filter-available checkbox not found in the DOM');
    }
    const openUserModalBtn = document.getElementById('open-user-modal');
    if (!openUserModalBtn) {
        console.error('Error: open-user-modal button not found in the DOM');
        return;
    }

    renderUsers();

    // Search functionality
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const showAvailableOnly = filterAvailableCheckbox.checked;
        const users = getUsers();
        if (users.error) {
            showError(users.error);
            return;
        }
        let filteredUsers = users.filter(user =>
            (user.name && user.name.toLowerCase().includes(searchTerm)) ||
            (user.email && user.email.toLowerCase().includes(searchTerm))
        );
        if (showAvailableOnly) {
            filteredUsers = filteredUsers.filter(user => user.available === true);
        }
        renderUsers(filteredUsers);
    });

    // Filter functionality (Show Available Only)
    filterAvailableCheckbox.addEventListener('change', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const showAvailableOnly = filterAvailableCheckbox.checked;
        const users = getUsers();
        if (users.error) {
            showError(users.error);
            return;
        }
        let filteredUsers = users.filter(user =>
            (user.name && user.name.toLowerCase().includes(searchTerm)) ||
            (user.email && user.email.toLowerCase().includes(searchTerm))
        );
        if (showAvailableOnly) {
            filteredUsers = filteredUsers.filter(user => user.available === true);
        }
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
            id: userId ? userId : Date.now().toString(),
            name: document.getElementById('user-name').value.trim(),
            email: document.getElementById('user-email').value.trim(),
            phone: document.getElementById('user-phone').value.trim(),
            address: document.getElementById('user-address').value.trim() || undefined,
            available: true // Default to true for new users
        };

        let result;
        if (userId) {
            // Edit existing user
            result = updateUser(userId, userData);
        } else {
            // Add new user
            result = addUser(userData);
        }

        if (result.error) {
            showError(result.error);
        } else {
            renderUsers();
            // Close the modal
            const modalElement = document.getElementById('userModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            } else {
                console.error('Error: Failed to close modal');
            }
        }
    });
});