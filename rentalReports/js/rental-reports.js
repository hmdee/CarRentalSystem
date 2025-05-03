import adminLogOut from "../../LogOut/AdminLogOut.js";

const userName = document.getElementById("userName");
const userImage = document.getElementById("userImage");

const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const admin = localStorage.getItem("admin");
if (!admin) {
    window.location.href = "../../index.html";
}

document.getElementById('adminLogout').addEventListener('click',()=>{
    adminLogOut()
})

const STORAGE_KEY_BOOKINGS = 'bookings';

const getBookings = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_BOOKINGS) || '[]');
};

document.addEventListener('DOMContentLoaded', () => {
    const bookings = getBookings();

    // Bookings Per Month (Text)
    const bookingsPerMonthList = document.getElementById('bookings-per-month');
    const byMonth = bookings.reduce((acc, b) => {
        const month = new Date(b.pickupDate).toLocaleString('default', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});
    bookingsPerMonthList.innerHTML = '';
    Object.entries(byMonth).forEach(([month, count]) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${month}: ${count}`;
        bookingsPerMonthList.appendChild(li);
    });

    // Peak Hours (Text)
    const peakHoursList = document.getElementById('peak-hours');
    const byHour = bookings.reduce((acc, b) => {
        const hour = new Date(b.createdAt).getHours();
        console.log();
        
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
    }, {});
    peakHoursList.innerHTML = '';
    Object.entries(byHour).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([hour, count]) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${hour}:00 - ${count}`;
        peakHoursList.appendChild(li);
    });

    // Revenue Per Month (Text)
    const revenuePerMonthList = document.getElementById('revenue-per-month');
    const revenueByMonth = bookings.reduce((acc, b) => {
        if (b.status.toLowerCase() !== 'confirmed') return acc; // Only confirmed bookings
        const month = new Date(b.pickupDate).toLocaleString('default', { month: 'short', year: 'numeric' });
        acc[month] = (acc[month] || 0) + (b.totalPrice || 0);
        return acc;
    }, {});
    revenuePerMonthList.innerHTML = '';
    Object.entries(revenueByMonth).forEach(([month, revenue]) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${month}: $${revenue.toFixed(2)}`;
        revenuePerMonthList.appendChild(li);
    });

    // Bookings Per Month Chart
    const bookingsPerMonthCtx = document.getElementById('bookingsPerMonthChart').getContext('2d');
    new Chart(bookingsPerMonthCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(byMonth),
            datasets: [{
                label: 'Bookings Per Month',
                data: Object.values(byMonth),
                backgroundColor: '#FF6B00',
                borderColor: '#FF6B00',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#FF6B00' },
                    grid: { color: '#3A3A3C' }
                },
                x: {
                    ticks: { color: '#FF6B00' },
                    grid: { color: '#3A3A3C' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#FF6B00' }
                }
            }
        }
    });

    // Peak Hours Chart
    const peakHoursCtx = document.getElementById('peakHoursChart').getContext('2d');
    const sortedHours = Object.entries(byHour).sort((a, b) => b[1] - a[1]).slice(0, 5);
    new Chart(peakHoursCtx, {
        type: 'bar',
        data: {
            labels: sortedHours.map(([hour]) => `${hour}:00`),
            datasets: [{
                label: 'Peak Hours',
                data: sortedHours.map(([, count]) => count),
                backgroundColor: '#FF6B00',
                borderColor: '#FF6B00',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#FF6B00' },
                    grid: { color: '#3A3A3C' }
                },
                x: {
                    ticks: { color: '#FF6B00' },
                    grid: { color: '#3A3A3C' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#FF6B00' }
                }
            }
        }
    });

    // Revenue Per Month Chart
    const revenuePerMonthCtx = document.getElementById('revenuePerMonthChart').getContext('2d');
    new Chart(revenuePerMonthCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(revenueByMonth),
            datasets: [{
                label: 'Revenue Per Month',
                data: Object.values(revenueByMonth),
                backgroundColor: '#28A745',
                borderColor: '#28A745',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#28A745' },
                    grid: { color: '#3A3A3C' }
                },
                x: {
                    ticks: { color: '#28A745' },
                    grid: { color: '#3A3A3C' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#28A745' }
                }
            }
        }
    });
});