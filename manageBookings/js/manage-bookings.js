import {
    getBookings,
    updateBookingStatus,
    getCars,
    updateCar
} from "../../js/modules/storage.js";
import adminLogOut from "../../LogOut/AdminLogOut.js";
const admin = localStorage.getItem("admin");
if (!admin) {
    window.location.href = "../../index.html";
}

document.getElementById('adminLogout').addEventListener('click',()=>{
    adminLogOut()
}) 

const init = async () => {
    let bookings = getBookings(); 
    let cars = await getCars();   
 
    if (!Array.isArray(cars)) {
        console.error(cars.error || "Failed to load cars");
        return;
    }

    const getCarModelById = (carId) => {
        const car = cars.find(c => c.id.toString() === carId.toString());
        return car ? car.model : "Unknown";
    };
 
    // Render bookings by status
    const renderBookings = (status, elementId) => {
        const filtered = bookings.filter(b => b.status.toLowerCase() === status.toLowerCase());
        const tbody = document.getElementById(elementId);
        tbody.innerHTML = filtered.map(booking => `
<tr>
<td>#${booking.id}</td>
<td>${getCarModelById(booking.carId)}</td>
<td>${booking.pickupDate}</td>
<td>${booking.dropOffDate}</td>
<td>$${booking.totalPrice.toFixed(2)}</td>
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
 
    const renderAll = () => {
        bookings = getBookings(); // Refresh bookings from localStorage
        renderBookings("Pending", "pending-bookings");
        renderBookings("Confirmed", "confirmed-bookings");
        renderBookings("Cancelled", "cancelled-bookings");
        attachStatusListeners();
    };
 
    const attachStatusListeners = async () => {
        const selects = document.querySelectorAll(".status-select");
        const cars = await getCars();
    
        selects.forEach(select => {
            select.addEventListener("change", async (event) => {
                const bookingId = Number(event.target.dataset.id);
                const newStatus = event.target.value;
    
                const result = updateBookingStatus(bookingId, newStatus);
                if (result.error) return alert(result.error);
    
                const updatedBooking = getBookings().find(b => b.id.toString() === bookingId.toString());
                const carId = updatedBooking?.carId;
    
                if (carId) {
                    const car = cars.find(c => c.id.toString() === carId.toString());
                    if (car) {
                        const shouldBeAvailable = newStatus !== "Confirmed";
                        car.available = shouldBeAvailable;
    
                        const updateResult = await updateCar(car.id, car);
                        if (updateResult.error) return alert(updateResult.error);
                    }
                }
                renderAll();
            });
        });
    };
 
    renderAll();
};
 
init();