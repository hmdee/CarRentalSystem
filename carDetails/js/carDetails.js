document.addEventListener("DOMContentLoaded", () => {

    const carDetailsContainer = document.getElementById('carDetailsContainer');
    const carData = JSON.parse(localStorage.getItem('selectedCar'));

    if (!carDetailsContainer || !carData) return;
    console.log(carData.features);
    carDetailsContainer.innerHTML = `
        <div class="row g-5 mr-0">
            <!-- Left side (car image) -->
            <div class="col-md-6">
                <img src="${carData.image.startsWith('data')?'':'../'}${carData.image}" class="img-fluid rounded" alt="${carData.model}">

            </div>
            <!-- Right side: (Car info and booking link) -->
            <div class="col-md-6">
                <h2 class='mb-3 fw-bold'>${carData.model} ${carData.year}</h2>
                <p class='desc'>

                    This <span>${carData.fuel_type}</span>-powered vehicle offers a fuel-efficient drive with a robust 
                    <span>${carData.transmission}</span> transmission, making it ideal for drivers who enjoy full control 
                    on the road. With just <span>${carData.mileage}</span> miles on the clock and seating for up 
                    to <span>${carData.passengers}</span> passengers, it’s a practical and reliable choice 

                    for both city commutes and longer journeys."
                </p>
                <h4 class='fw-bold'>Features</h4>
                <p class='features'>
                    ${carData.features.join(" - ")}
                </p>
                <div class='d-flex justify-content-between align-items-center'>

                    <h4 class='fw-bold'>${carData.available ? 'Available' : 'Not Available'}</h4>
                    <p class='price'>$${carData.price_per_day} <span>/Per Day</span></p>
                </div>
                <a ${carData.available ? 'href="../../Booking/booking.html"' : ''} class="btn fw-bold book-btn custom-btn mt-3 w-full d-block ${carData.available ? 'pe-auto' : 'pe-none opacity-50'}">Book Now</a>
            </div>
        </div>
    `;
});

