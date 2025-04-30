/**
 * Manages data storage for the Admin Dashboard using Local Storage.
 * Handles bookings, car listings, and rental reports.
 */

// === Bookings Functions ===

/**
 * Retrieves all bookings from Local Storage.
 *  An array of bookings.
 */
export function getBookings() {
    const bookingsData = localStorage.getItem("bookings");
    if (!bookingsData) {
        return [];
    }

    const bookings = JSON.parse(bookingsData);
    if (!Array.isArray(bookings)) {
        throw new Error("Bookings data is not an array");
    }

    return bookings;
}

/**
 * Validates a booking object.
 * - The booking object to validate.
 */
function validateBooking(booking) {
    const validStatuses = ["Pending", "Confirmed", "Cancelled"];
    
    const requiredFields = ["id", "carId", "date", "returnDate", "status"];
    for (const field of requiredFields) {
        if (!booking[field] || (typeof booking[field] === "string" && booking[field].trim() === "")) {
            throw new Error(`${field} is required`);
        }
    }

    if (!validStatuses.includes(booking.status)) {
        throw new Error(`Invalid status: ${booking.status}. Must be one of ${validStatuses.join(", ")}`);
    }
}

/**
 * Updates the status of a booking.
 * - The ID of the booking to update.
 *  - The new status ("Pending", "Confirmed", "Cancelled").
 */
export function updateBookingStatus(bookingId, newStatus) {
    const validStatuses = ["Pending", "Confirmed", "Cancelled"];
    if (!validStatuses.includes(newStatus)) {
        throw new Error(`Invalid status: ${newStatus}. Must be one of ${validStatuses.join(", ")}`);
    }

    const bookings = getBookings();
    const bookingIndex = bookings.findIndex(booking => booking.id === bookingId);
    if (bookingIndex === -1) {
        throw new Error("Booking not found");
    }

    bookings[bookingIndex].status = newStatus;
    localStorage.setItem("bookings", JSON.stringify(bookings));
}

// === Car Listings Functions ===

/**
 * Retrieves all car listings from Local Storage.
 *  An array of cars.
 */
export function getCars() {
    const carsData = localStorage.getItem("cars");
    if (!carsData) {
        return [];
    }

    const cars = JSON.parse(carsData);
    if (!Array.isArray(cars)) {
        throw new Error("Cars data is not an array");
    }

    return cars;
}

/**
 * Validates a car object.
 *  - The car object to validate.
 */
function validateCar(car) {
    const requiredFields = ["id", "model", "year", "passengers", "price_per_day", "available", "image", "transmission", "fuel_type", "mileage"];
    const optionalFields = ["features", "rating"];

    // Validate required fields
    for (const field of requiredFields) {
        if (car[field] === undefined || car[field] === null || (typeof car[field] === "string" && car[field].trim() === "")) {
            throw new Error(`${field} is required`);
        }
    }

    // Validate types and ranges
    if (typeof car.year !== "number" || car.year < 1900 || car.year > new Date().getFullYear() + 1) {
        throw new Error("Year must be a valid number between 1900 and next year");
    }

    if (typeof car.passengers !== "number" || car.passengers <= 0) {
        throw new Error("Passengers must be a positive number");
    }

    if (typeof car.price_per_day !== "number" || car.price_per_day <= 0) {
        throw new Error("Price per day must be a positive number");
    }

    if (typeof car.available !== "boolean") {
        throw new Error("Available must be a boolean");
    }

    if (typeof car.mileage !== "number" || car.mileage < 0) {
        throw new Error("Mileage must be a non-negative number");
    }

    // Validate image as a Base64 string
    if (!car.image.startsWith("data:image/")) {
        throw new Error("Image must be a valid Base64 string starting with 'data:image/'");
    }

    if (car.features && !Array.isArray(car.features)) {
        throw new Error("Features must be an array");
    }

    if (car.rating !== undefined && (typeof car.rating !== "number" || car.rating < 0 || car.rating > 5)) {
        throw new Error("Rating must be a number between 0 and 5");
    }
}

/**
 * Adds a new car listing to Local Storage.
 *   - The car object to add.
 *  The added car.
 */
export function addCar(car) {
    validateCar(car);

    const cars = getCars();
    cars.push(car);
    localStorage.setItem("cars", JSON.stringify(cars));

    return car;
}

/**
 * Updates an existing car listing.
 *  - The ID of the car to update.
 *  - The updated car object.
 */
export function updateCar(carId, updatedCar) {
    const cars = getCars();
    const carIndex = cars.findIndex(car => car.id.toString() === carId.toString());
    if (carIndex === -1) {
        throw new Error("Car not found");
    }

    validateCar(updatedCar);
    cars[carIndex] = { ...cars[carIndex], ...updatedCar, id: carId };
    localStorage.setItem("cars", JSON.stringify(cars));
}

/**
 * Removes a car listing from Local Storage.
 *  - The ID of the car to remove.
 */
export function removeCar(carId) {
    const cars = getCars();
    const carIndex = cars.findIndex(car => car.id.toString() === carId.toString());
    if (carIndex === -1) {
        throw new Error("Car not found");
    }

    cars.splice(carIndex, 1);
    localStorage.setItem("cars", JSON.stringify(cars));
}

// === Rental Reports Functions ===

/**
 * Generates a report of bookings per month.
 *  An object with months as keys and booking counts as values.
 */
export function getBookingsPerMonth() {
    const bookings = getBookings();
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
 */
export function getPeakHours() {
    const bookings = getBookings();
    const peakHours = {};

    bookings.forEach(booking => {
        const date = new Date(booking.date);
        const hour = date.getHours();
        peakHours[hour] = (peakHours[hour] || 0) + 1;
    });

    return peakHours;
}