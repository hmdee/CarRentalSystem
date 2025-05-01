let carsContainer = document.getElementById("carsList");
let originalCars = []; // Store the original cars array for filtering

// Async function to fetch cars data from local JSON file
async function fetchCars() {
    try {
        // Show loading spinner
        if (carsContainer) {
            carsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `;
        }
        let res = await fetch('./cars.json');
        let cars = await res.json();
        return cars;
    } catch (error) {
        console.error("Fetching cars data fails: ", error);
        if (carsContainer) {
            carsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-danger">Failed to load cars. Please try again later.</p>
                </div>
            `;
        }
        return [];
    }
}

// Function to build car list DOM
function buildCarLists(arr) {
    // Clear existing content with fade-out
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

            arr.forEach((car, index) => {
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
                // Handle click for every car
                carDiv.addEventListener('click', function () {
                    let car_id = this.id;
                    let targettedCar = arr.find(car => car.id === Number(car_id));
                    localStorage.setItem('selectedCar', JSON.stringify(targettedCar));
                    window.location.href = './details.html';
                });
            });
        }, 300); // Match fade-out duration
    }
}

// Function to apply filters and update car list
function applyFilters() {
    let searchInput = document.getElementById("searchInput")?.value.toLowerCase() || '';
    let minPrice = parseFloat(document.getElementById("minPrice")?.value) || 0;
    let maxPrice = parseFloat(document.getElementById("maxPrice")?.value) || Infinity;
    let availableOnly = document.getElementById("availableOnly")?.checked || false;

    let filteredCars = originalCars.filter(car => {
        // Search by model
        let matchesSearch = car.model.toLowerCase().includes(searchInput);
        // Filter by price range
        let matchesPrice = car.price_per_day >= minPrice && car.price_per_day <= maxPrice;
        // Filter by availability
        let matchesAvailability = availableOnly ? car.available : true;

        return matchesSearch && matchesPrice && matchesAvailability;
    });

    buildCarLists(filteredCars);
}

// initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // display cars
    fetchCars().then(cars => {
        if (cars && cars.cars) {
            originalCars = cars.cars; // store original data
            buildCarLists(originalCars);
        }
    });

    document.getElementById("searchInput")?.addEventListener('input', applyFilters);
    document.getElementById("minPrice")?.addEventListener('input', applyFilters);
    document.getElementById("maxPrice")?.addEventListener('input', applyFilters);
    document.getElementById("availableOnly")?.addEventListener('change', applyFilters);
});