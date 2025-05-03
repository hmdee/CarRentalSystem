import { getCars } from "../../js/modules/storage.js";

let carsContainer = document.getElementById("carsList");
let originalCars = []; // Store the original cars array for filtering

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
                            <img src="${car.image.startsWith('data')?'':'../'}${car.image}" class="card-img-top w-100" alt="${car.model}">
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
                    console.log(targettedCar)
                    localStorage.setItem('selectedCar', JSON.stringify(targettedCar));
                    window.location.href = '../../carDetails/details.html';
                });
            });
        }, 300);
    }
}

// Function to apply filters and update car list
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

    // console.log(filteredCars);

    buildCarLists(filteredCars);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch cars from localStorage using getCars
    try {
        const carsData = await getCars();

        // Handle errors from getCars
        if (carsData.error) {
            console.error("Error fetching cars:", carsData.error);
            if (carsContainer) {
                carsContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <p class="sorry_msg">Error loading cars. Please try again later.</p>
                    </div>
                `;
            }
            return;
        }

        // If no cars are found, display a message
        if (!carsData || carsData.length === 0) {
            if (carsContainer) {
                carsContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <p class="sorry_msg">No cars available at the moment.</p>
                    </div>
                `;
            }
            return;
        }

        // Store the cars in originalCars and render them
        originalCars = carsData;
        console.log(originalCars);
        buildCarLists(originalCars);

        // Add event listeners for filters
        document.getElementById("searchInput")?.addEventListener('input', applyFilters);
        document.getElementById("minPrice")?.addEventListener('input', applyFilters);
        document.getElementById("maxPrice")?.addEventListener('input', applyFilters);
        document.getElementById("availableOnly")?.addEventListener('change', applyFilters);
        
    } catch (error) {
        console.error("Unexpected error:", error);
        if (carsContainer) {
            carsContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="sorry_msg">Error loading cars. Please try again later.</p>
                </div>
            `;
        }
    }
});
