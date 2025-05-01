import { getBookings, updateBookingStatus, getCars } from "../js/modules/storage.js";

window.onload = async () => {
    // Load navbar and footer
    try {
        const navbarResponse = await fetch("../components/navbar.html");
        if (!navbarResponse.ok) throw new Error("Failed to load navbar");
        const navbarText = await navbarResponse.text();
        document.getElementById("navbar-placeholder").innerHTML = navbarText;
    } catch (error) {
        console.error(error.message);
        document.getElementById("navbar-placeholder").innerHTML = "<p>Failed to load navbar.</p>";
    }

    try {
        const footerResponse = await fetch("../components/footer.html");
        if (!footerResponse.ok) throw new Error("Failed to load footer");
        const footerText = await footerResponse.text();
        document.getElementById("footer-placeholder").innerHTML = footerText;
    } catch (error) {
        console.error(error.message);
        document.getElementById("footer-placeholder").innerHTML = "<p>Failed to load footer.</p>";
    }

    // Get bookings and cars
    const bookings = getBookings();
    const cars = getCars();

    // Helper function to find car model by ID
    const getCarModelById = (carId) => {
        const car = cars.find(c => c.id.toString() === carId.toString());
        return car ? car.model : "Unknown";
    };

    // Helper function to render bookings
    const renderBookings = (status, elementId) => {
        const filteredBookings = bookings.filter(booking => booking.status === status);
        const tableBody = document.getElementById(elementId);
        tableBody.innerHTML = filteredBookings.map(booking => `
            <tr>
                <td>#${booking.id}</td>
                <td>${getCarModelById(booking.carId)}</td>
                <td>Ambiorix Square, SYNT, 121</td>
                <td>${booking.date}</td>
                <td>${booking.returnDate}</td>
                <td>$${booking.payment || 500}</td>
                <td>
                    <select class="form-select status-select" data-id="${booking.id}">
                        <option value="Pending" ${booking.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Confirmed" ${booking.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
                        <option value="Cancelled" ${booking.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                </td>
            </tr>
        `).join("");
    };

    // Render bookings for each status
    renderBookings("Pending", "pending-bookings");
    renderBookings("Confirmed", "confirmed-bookings");
    renderBookings("Cancelled", "cancelled-bookings");

    // Handle status updates
    const selects = document.querySelectorAll(".status-select");
    selects.forEach(select => {
        select.addEventListener("change", (event) => {
            const bookingId = event.target.dataset.id;
            const newStatus = event.target.value;
            try {
                updateBookingStatus(bookingId, newStatus);
                window.location.reload();
            } catch (error) {
                alert(error.message);
            }
        });
    });
};