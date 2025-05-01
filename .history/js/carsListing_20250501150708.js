let carsContainer = document.getElementById("carsList");

async function fetchCars() {
    try {
        let res = await fetch('../cars.json');
        let cars = await res.json();
        return cars;
    } catch (error) {
        console.error("Fetching cars data fails: ", error);
        return;
    }
}

fetchCars().then(cars => {
    cars['cars'].forEach(car => {
        let carDiv = document.createElement("div");
        carDiv.className = "car-item col-12 col-md-6 col-lg-4";
        carDiv.id = `car-${car.id}`;
        carDiv.innerHTML = `
            <div class="card h-100 shadow-sm">
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
    });
    console.log(cars['cars'][0]);
});
