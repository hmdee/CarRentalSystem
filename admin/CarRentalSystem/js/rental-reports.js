import { getBookingsPerMonth, getPeakHours } from "../js/modules/storage.js";

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

    // Display Rental Reports
    const bookingsPerMonth = getBookingsPerMonth();
    const bookingsPerMonthList = document.getElementById("bookings-per-month");
    for (const [month, count] of Object.entries(bookingsPerMonth)) {
        const li = document.createElement("li");
        li.textContent = `${month}: ${count} bookings`;
        bookingsPerMonthList.appendChild(li);
    }

    const peakHours = getPeakHours();
    const peakHoursList = document.getElementById("peak-hours");
    for (const [hour, count] of Object.entries(peakHours)) {
        const li = document.createElement("li");
        li.textContent = `Hour ${hour}: ${count} bookings`;
        peakHoursList.appendChild(li);
    }
};