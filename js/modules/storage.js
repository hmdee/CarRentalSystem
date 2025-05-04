/**
 * Manages data storage for the Admin Dashboard using Local Storage.
 * Handles bookings, car listings, users, and rental reports.
 */

// === Bookings Functions ===

/**
 * Retrieves all bookings from Local Storage.
 */
export function getBookings() {
    const bookingsData = localStorage.getItem("bookings");
    if (!bookingsData) {
        return [];
    }

    const bookings = JSON.parse(bookingsData);
    if (!Array.isArray(bookings)) {
        return { error: "Bookings data is not an array" };
    }

    return bookings;
}

/**
 * Validates a booking object.
 * @param {Object} booking - The booking object to validate.
 * @returns {string|null} Error message if validation fails, null otherwise.
 */
function validateBooking(booking) {
    const validStatuses = ["Pending", "Confirmed", "Cancelled"];
    
    const requiredFields = ["id", "carId", "date", "returnDate", "status", "userId"];
    for (const field of requiredFields) {
        if (!booking[field] || (typeof booking[field] === "string" && booking[field].trim() === "")) {
            return `${field} is required`;
        }
    }

    if (!validStatuses.includes(booking.status)) {
        return `Invalid status: ${booking.status}. Must be one of ${validStatuses.join(", ")}`;
    }

    return null;
}

/**
 * Updates the status of a booking.
 * @param {number} bookingId - The ID of the booking to update.
 * @param {string} newStatus - The new status ("pending", "confirmed", "cancelled").
 * @returns {Object} Result object with error message if any.
 */
export function updateBookingStatus(bookingId, newStatus) {
    const validStatuses = ["Pending", "Confirmed", "Cancelled"];
    if (!validStatuses.includes(newStatus)) {
        return { error: `Invalid status: ${newStatus}. Must be one of ${validStatuses.join(", ")}` };
    }

    const bookings = getBookings();
    if (bookings.error) return bookings;

    const bookingIndex = bookings.findIndex(booking => {
        console.log(booking.id);
        return booking.id === bookingId;
    });
    console.log(bookingIndex);
    if (bookingIndex === -1) {
        return { error: "Booking not found" };
    }

    bookings[bookingIndex].status = newStatus;
    localStorage.setItem("bookings", JSON.stringify(bookings));
    return { success: true };
}

// === Car Listings Functions ===

/**
 * Imports all cars from cars.json and stores them in Local Storage.
 * @returns {Promise<void>}
 */
export async function importAllCars() {
    try {
        const res = await fetch('../cars.json');
        if (!res.ok) {
            throw new Error(`Failed to fetch cars.json: ${res.statusText}`);
        }
        const response = await res.json();
        
        // Check if response has a 'cars' field and it's an array
        if (response.cars && Array.isArray(response.cars)) {
            localStorage.setItem("cars", JSON.stringify(response.cars));
            console.log("Cars imported successfully from cars.json:", response.cars);
        } else if (Array.isArray(response)) {
            localStorage.setItem("cars", JSON.stringify(response));
            console.log("Cars imported directly from cars.json:", response);
        } else {
            throw new Error("Invalid data format in cars.json: Expected an array or object with 'cars' array");
        }
    } catch (error) {
        console.error("Error importing cars from cars.json:", error.message);
        localStorage.setItem("cars", JSON.stringify([])); // Set empty array to avoid further issues
    }
}

/**
 * Retrieves all car listings from Local Storage, imports from cars.json if empty.
 * @returns {Array|Object} An array of cars or an error object.
 */
export async function getCars() {
    let carsData = localStorage.getItem("cars");
    if (!carsData) {
        await importAllCars(); // Import from cars.json if not in localStorage
        carsData = localStorage.getItem("cars");
        if (!carsData) {
            return { error: "No cars data available after import attempt" };
        }
    }

    try {
        const cars = JSON.parse(carsData);
        if (!Array.isArray(cars)) {
            console.warn("Parsed cars data is not an array:", cars);
            return { error: "Cars data is not an array. Data: " + JSON.stringify(cars) };
        }
        return cars;
    } catch (error) {
        console.error("Error parsing cars data from localStorage:", error.message, "Raw data:", carsData);
        return { error: "Failed to parse cars data from localStorage. Raw data: " + carsData };
    }
}

/**
 * Validates a car object.
 * @param {Object} car - The car object to validate.
 * @returns {string|null} Error message if validation fails, null otherwise.
 */
function validateCar(car) {
    const requiredFields = ["id", "model", "year", "passengers", "price_per_day", "available", "image", "transmission", "fuel_type", "mileage"];
    const optionalFields = ["features", "rating"];

    // Validate required fields
    for (const field of requiredFields) {
        if (car[field] === undefined || car[field] === null || (typeof car[field] === "string" && car[field].trim() === "")) {
            return `${field} is required`;
        }
    }

    // Validate types and ranges
    if (typeof car.year !== "number" || car.year < 1900 || car.year > new Date().getFullYear() + 1) {
        return "Year must be a valid number between 1900 and next year";
    }

    if (typeof car.passengers !== "number" || car.passengers <= 0) {
        return "Passengers must be a positive number";
    }

    if (typeof car.price_per_day !== "number" || car.price_per_day <= 0) {
        return "Price per day must be a positive number";
    }

    if (typeof car.available !== "boolean") {
        return "Available must be 'true' or 'false'";
    }

    if (typeof car.mileage !== "number" || car.mileage < 0) {
        return "Mileage must be a non-negative number";
    }

    // Validate image as a Base64 string
    // if (!car.image.startsWith("data:image/")) {
    //     return "Image must be a valid Base64 string starting with 'data:image/'";
    // }

    if (car.features && !Array.isArray(car.features)) {
        return "Features must be an array";
    }

    if (car.rating !== undefined && (typeof car.rating !== "number" || car.rating < 0 || car.rating > 5)) {
        return "Rating must be a number between 0 and 5";
    }

    return null;
}


/**
 * Adds a new car listing to Local Storage.
 * @param {Object} car - The car object to add.
 * @returns {Object} Result object with the added car or an error message.
 */
export async function addCar(car) {
    const validationError = validateCar(car);
    if (validationError) {
        return { error: validationError };
    }

    const cars = await getCars(); // Use await since getCars is async
    if (!Array.isArray(cars)) {
        return { error: cars.error || "Cannot add car: Existing cars data is not an array" };
    }

    cars.push(car);
    localStorage.setItem("cars", JSON.stringify(cars));
    return { success: true, car };
}

/**
 * Updates an existing car listing.
 * @param {number} carId - The ID of the car to update.
 * @param {Object} updatedCar - The updated car object.
 * @returns {Object} Result object with success status or an error message.
 */
export async function updateCar(carId, updatedCar) {
    const cars = await getCars(); // Use await since getCars is async
    if (!Array.isArray(cars)) {
        return { error: cars.error || "Cannot update car: Existing cars data is not an array" };
    }

    const carIndex = cars.findIndex(car => car.id === carId);
    if (carIndex === -1) {
        return { error: "Car not found" };
    }

    const validationError = validateCar(updatedCar);
    if (validationError) {
        return { error: validationError };
    }

    cars[carIndex] = { ...cars[carIndex], ...updatedCar, id: carId };
    localStorage.setItem("cars", JSON.stringify(cars));
    return { success: true };
}

/**
 * Removes a car listing from Local Storage.
 * @param {number} carId - The ID of the car to remove.
 * @returns {Object} Result object with success status or an error message.
 */
export async function removeCar(carId) {
    const cars = await getCars(); // Use await since getCars is async
    if (!Array.isArray(cars)) {
        return { error: cars.error || "Cannot remove car: Existing cars data is not an array" };
    }

    const carIndex = cars.findIndex(car => car.id.toString() === carId.toString());
    if (carIndex === -1) {
        return { error: "Car not found" };
    }

    cars.splice(carIndex, 1);
    localStorage.setItem("cars", JSON.stringify(cars));
    return { success: true };
}

// === Users Functions ===

/**
 * Retrieves all users from Local Storage.
 * @returns {Array|Object} An array of users or an error object.
 */
export function getUsers() {
    const usersData = localStorage.getItem("users");
    if (!usersData) {
        return [];
    }

    const users = JSON.parse(usersData);
    if (!Array.isArray(users)) {
        return { error: "Users data is not an array" };
    }

    return users;
}

/**
 * Validates a user object.
 * @param {Object} user - The user object to validate.
 * @returns {string|null} Error message if validation fails, null otherwise.
 */
function validateUser(user) {
    const requiredFields = ["id", "name", "email", "phone", "address"];

    for (const field of requiredFields) {
        if (!user[field] || (typeof user[field] === "string" && user[field].trim() === "")) {
            return `${field} is required`;
        }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
        return "Invalid email format";
    }

    // Validate phone format (basic check for digits and optional dashes)
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(user.phone)) {
        return "Invalid phone number format. Must be exactly 11 digits.";
    }

    return null;
}

/**
 * Adds a new user to Local Storage.
 * @param {Object} user - The user object to add.
 * @returns {Object} Result object with the added user or an error message.
 */
export function addUser(user) {
    const validationError = validateUser(user);
    if (validationError) {
        return { error: validationError };
    }

    const users = getUsers();
    if (users.error) return users;

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    return { success: true, user };
}

/**
 * Updates an existing user.
 * @param {number} userId - The ID of the user to update.
 * @param {Object} updatedUser - The updated user object.
 * @returns {Object} Result object with success status or an error message.
 */
export function updateUser(userId, updatedUser) {
    const users = getUsers();
    if (users.error) return users;

    const userIndex = users.findIndex(user => user.id.toString() === userId.toString());
    if (userIndex === -1) {
        return { error: "User not found" };
    }

    const validationError = validateUser(updatedUser);
    if (validationError) {
        return { error: validationError };
    }

    users[userIndex] = { ...users[userIndex], ...updatedUser, id: userId };
    localStorage.setItem("users", JSON.stringify(users));
    return { success: true };
}

/**
 * Removes a user from Local Storage.
 * @param {number} userId - The ID of the user to remove.
 * @returns {Object} Result object with success status or an error message.
 */
export function removeUser(userId) {
    const users = getUsers();
    if (users.error) return users;

    const userIndex = users.findIndex(user => user.id.toString() === userId.toString());
    if (userIndex === -1) {
        return { error: "User not found" };
    }

    users.splice(userIndex, 1);
    localStorage.setItem("users", JSON.stringify(users));
    return { success: true };
}

// === Rental Reports Functions ===

/**
 * Generates a report of bookings per month.
 * @returns {Object} An object with months as keys and booking counts as values or an error.
 */
export function getBookingsPerMonth() {
    const bookings = getBookings();
    if (bookings.error) return bookings;

    const bookingsPerMonth = {};
    bookings.forEach(booking => {
        const date = new Date(booking.date);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format: YYYY-MM
        bookingsPerMonth[monthYear] = (bookingsPerMonth[monthYear] || 0) + 1;
    });

    return bookingsPerMonth;
}

/**
 * Generates a report of peak hours for bookings.
 * @returns {Object} An object with hours as keys and booking counts as values or an error.
 */
export function getPeakHours() {
    const bookings = getBookings();
    if (bookings.error) return bookings;

    const peakHours = {};
    bookings.forEach(booking => {
        const date = new Date(booking.date);
        const hour = date.getHours();
        peakHours[hour] = (peakHours[hour] || 0) + 1;
    });

    return peakHours;
}