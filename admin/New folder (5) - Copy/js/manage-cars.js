import { getCars, addCar, updateCar, removeCar } from "../js/modules/storage.js";

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const carsTableBody = document.getElementById("cars-table");
    const carErrorDiv = document.getElementById('car-error');
    const carForm = document.getElementById("car-form");
    const carIdInput = document.getElementById("car-id");
    const carImageInput = document.getElementById("car-image");
    const carImageBase64Input = document.getElementById("car-image-base64");
    const imagePreview = document.getElementById("image-preview");
    const submitCarBtn = document.getElementById("submit-car-btn");
    const carModal = new bootstrap.Modal(document.getElementById("carModal"));
    const openCarModalBtn = document.getElementById("open-car-modal");

    
    const showError = (message) => {
        carErrorDiv.innerHTML = `
            ${message}
        `;
        carErrorDiv.classList.remove('d-none');
    };

    // Show modal when clicking "Add New Car"
    openCarModalBtn.addEventListener("click", () => {
        carForm.reset();
        carIdInput.value = "";
        carImageBase64Input.value = "";
        imagePreview.style.display = "none";
        submitCarBtn.textContent = "Add Car";
        carModal.show();
    });

    // Preview image and store as base64
    carImageInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64String = e.target.result;
                carImageBase64Input.value = base64String;
                imagePreview.src = base64String;
                imagePreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });

    // Create table row for a car
    const tableRow = (car) => {
        let newTr = document.createElement("tr");

        // تنسيق الخصائص الخاصة
        let formattedCar = {
            image: `<img src="${car.image}" alt="${car.model}" style="max-width: 60px;">`,
            model: car.model,
            year: car.year,
            passengers: car.passengers,
            price_per_day: `$${car.price_per_day}`,
            available: car.available === 'true' ? 'Yes' : 'No',
            transmission: car.transmission,
            fuel_type: car.fuel_type,
            mileage: car.mileage,
            features: car.features ? car.features.join(', ') : 'N/A',
            rating: car.rating || 'N/A'
        };

        // إنشاء الخلايا بناءً على الخصائص المُنسقة
        for (let prop in formattedCar) {
            let newTd = document.createElement("td");
            newTd.innerHTML = formattedCar[prop];
            if (['transmission', 'fuel_type', 'mileage', 'features', 'rating'].includes(prop)) {
                newTd.classList.add('d-none', 'd-md-table-cell');
            }
            newTr.appendChild(newTd);
        }

        // إضافة خلية الأزرار
        let actionsTd = document.createElement("td");
        actionsTd.innerHTML = `
            <button class="btn btn-sm btn-warning edit-car me-1" data-id="${car.id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-car" data-id="${car.id}">Delete</button>
        `;
        newTr.appendChild(actionsTd);

        return newTr;
    };

    // Render all cars in table
    const renderCars = (carsToDisplay = getCars()) => {
        if (carsToDisplay.error) {
            showError(carsToDisplay.error);
            return;
        }
        carsTableBody.innerHTML = "";
        carsToDisplay.forEach(car => carsTableBody.appendChild(tableRow(car)));
        attachActionListeners();
    };

    // Search and filter functionality
    const filterCars = () => {
        const searchTerm = document.getElementById('search-cars').value.toLowerCase();
        const showAvailableOnly = document.getElementById('filter-available').checked;
        let cars = getCars();
        if (cars.error) {
            showError(cars.error);
            return;
        }

        if (searchTerm) {
            cars = cars.filter(car =>
                car.model.toLowerCase().includes(searchTerm) ||
                car.year.toString().includes(searchTerm)
            );
        }

        if (showAvailableOnly) {
            cars = cars.filter(car => car.available === 'true');
        }

        renderCars(cars);
    };

    // Search and filter event listeners
    document.getElementById('search-cars').addEventListener('input', filterCars);
    document.getElementById('filter-available').addEventListener('change', filterCars);

    // Add/Edit Form Submit
    carForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(carForm);
        const car = {
            id: carIdInput.value || Date.now().toString(),
            model: formData.get("model"),
            year: parseInt(formData.get("year")) || 0,
            passengers: parseInt(formData.get("passengers")) || 0,
            price_per_day: parseFloat(formData.get("price_per_day")) || 0,
            available: formData.get("available"),
            transmission: formData.get("transmission"),
            fuel_type: formData.get("fuel_type"),
            mileage: parseInt(formData.get("mileage")) || 0,
            features: formData.get("features") ? formData.get("features").split(",").map(f => f.trim()) : [],
            rating: formData.get("rating") ? parseFloat(formData.get("rating")) : undefined,
            image: carImageBase64Input.value
        };

        let result;
        if (carIdInput.value) {
            result = updateCar(car.id, car);
        } else {
            result = addCar(car);
        }

        if (result.error) {
            showError(result.error);
        } else {
            carErrorDiv.classList.add('d-none');
            carForm.reset();
            carIdInput.value = "";
            carImageBase64Input.value = "";
            imagePreview.style.display = "none";
            carModal.hide();
            renderCars();
        }
    });

    // Attach event listeners for Edit/Delete buttons
    const attachActionListeners = () => {
        document.querySelectorAll(".edit-car").forEach(button => {
            button.addEventListener("click", () => {
                const carId = button.dataset.id;
                const car = getCars().find(c => c.id.toString() === carId.toString());
                if (car) {
                    carIdInput.value = car.id;
                    document.getElementById("car-model").value = car.model;
                    document.getElementById("car-year").value = car.year;
                    document.getElementById("car-passengers").value = car.passengers;
                    document.getElementById("car-price").value = car.price_per_day;
                    document.getElementById("car-available").value = car.available;
                    document.getElementById("car-transmission").value = car.transmission;
                    document.getElementById("car-fuel-type").value = car.fuel_type;
                    document.getElementById("car-mileage").value = car.mileage;
                    document.getElementById("car-features").value = car.features?.join(", ") || "";
                    document.getElementById("car-rating").value = car.rating || "";
                    carImageBase64Input.value = car.image;
                    imagePreview.src = car.image;
                    imagePreview.style.display = "block";
                    submitCarBtn.textContent = "Update Car";
                    carModal.show();
                }
            });
        });

        document.querySelectorAll('.delete-car').forEach(button => {
            button.addEventListener('click', () => {
                const carId = parseInt(button.getAttribute('data-id'));
                const result = removeCar(carId);
                if (result.error) {
                    showError(result.error);
                } else {
                    renderCars();
                }
            });
        });
    };

    renderCars();
});