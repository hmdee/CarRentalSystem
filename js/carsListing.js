import { getCars } from "../admin/AdminDashboard/js/modules/storage.js";

// localStorage.clear();
console.log(getCars());
// this function will fetch data from json and set it in localStorage
async function setCarsToLocalStorage() {
    const existingCars = localStorage.getItem("cars");
    if (existingCars === null) {
        try {
            const res = await fetch('../cars.json');
            const data = await res.json();
            if (data.cars) {
                localStorage.setItem("cars", JSON.stringify(data.cars));
                console.log("Cars added to localStorage");
            }
        } catch (error) {
            console.log("Error in setting cars to localStorage ", error);
        }
    }
}


let carsContainer = document.getElementById("carsList");

// Function to build car list DOM
function buildCarLists(arr) {
    if (carsContainer) {
        carsContainer.classList.add('fade-out');
        setTimeout(() => {
            carsContainer.innerHTML = '';
            carsContainer.classList.remove('fade-out');

            if (arr.length === 0) {
                carsContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <p class="sorry_msg">Sorry, No cars match your search.</p>
                    </div>
                `;
                return;
            }

            arr.forEach((car) => {
                let carDiv = document.createElement("div");
                carDiv.className = "car-item col-12 col-md-6 col-lg-4 animate-card";
                carDiv.id = car.id;
                carDiv.innerHTML = `
                    <div class="card h-100 shadow-sm cursor-pointer">
                        <figure class="text-center p-3">
                            <img src="${car.image}" class="card-img-top w-100" alt="${car.model}">
                        </figure>
                        <div class="card-body">
                            <h5 class="card-title mb-3 fw-bold">${car.model}</h5>
                            <div class="row text-muted mb-3">
                                <p class="col-6 mb-2">Year: ${car.year}</p>
                                <p class="col-6 mb-2">Seats: ${car.passengers}</p>
                                <p class="col-6 mb-2">Mile Age: ${car.mileage}</p>
                                <p class="col-6 mb-2">Fuel: ${car.fuel_type}</p>
                                <p class="col-6 mb-2">Transmision: ${car.transmission}</p>
                                <p class="col-6 mb-2">${car.available ? 'Available' : 'Not Available'}</p>
                            </div>
                            <div class="mb-3">
                                <small class="d-block">Per Day</small>
                                <h5 class="fw-bold">$${car.price_per_day}</h5>
                            </div>
                        </div>
                    </div>
                `;
                carsContainer.appendChild(carDiv);
                carDiv.addEventListener('click', function () {
                    let car_id = this.id;
                    let targettedCar = arr.find(car => car.id === Number(car_id));
                    localStorage.setItem('selectedCar', JSON.stringify(targettedCar));
                    console.log(localStorage.getItem("selectedCar"));
                    window.location.href = './details.html';
                });
            });
        }, 300);
    }
}


// =================================================================================================
let originalCars = []; // store the original cars array for filtering

// function to apply filters and update car list
function applyFilters() {
    let searchInput = document.getElementById("searchInput")?.value.toLowerCase() || '';
    let minPrice = parseFloat(document.getElementById("minPrice")?.value) || 0;
    let maxPrice = parseFloat(document.getElementById("maxPrice")?.value) || Infinity;
    let availableOnly = document.getElementById("availableOnly")?.checked || false;

    let filteredCars = originalCars.filter(car => {
        let matchesSearch = car.model.toLowerCase().includes(searchInput);
        let matchesPrice = car.price_per_day >= minPrice && car.price_per_day <= maxPrice;
        let matchesAvailability = availableOnly ? car.available : true;
        return matchesSearch && matchesPrice && matchesAvailability;
    });

    buildCarLists(filteredCars);
}

// initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    await setCarsToLocalStorage(); // here if data doesn't exist for any reason, it will stored
    originalCars = getCars(); 
    buildCarLists(originalCars);

    document.getElementById("searchInput")?.addEventListener('input', applyFilters);
    document.getElementById("minPrice")?.addEventListener('input', applyFilters);
    document.getElementById("maxPrice")?.addEventListener('input', applyFilters);
    document.getElementById("availableOnly")?.addEventListener('change', applyFilters);
});
