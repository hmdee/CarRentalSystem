import { getCars, addCar, updateCar, removeCar } from "../js/modules/storage.js";

window.onload = () => {
    // Load navbar and footer
    fetch("../components/navbar.html")
        .then(res => res.ok ? res.text() : Promise.reject("Failed to load navbar"))
        .then(html => document.getElementById("navbar-placeholder").innerHTML = html)
        .catch(err => document.getElementById("navbar-placeholder").innerHTML = "<p>Failed to load navbar.</p>");

    fetch("../components/footer.html")
        .then(res => res.ok ? res.text() : Promise.reject("Failed to load footer"))
        .then(html => document.getElementById("footer-placeholder").innerHTML = html)
        .catch(err => document.getElementById("footer-placeholder").innerHTML = "<p>Failed to load footer.</p>");

    // DOM Elements
    const carsTableBody = document.getElementById("cars-table");
    const carForm = document.getElementById("car-form");
    const carIdInput = document.getElementById("car-id");
    const carImageInput = document.getElementById("car-image");
    const carImageBase64Input = document.getElementById("car-image-base64");
    const imagePreview = document.getElementById("image-preview");
    const submitCarBtn = document.getElementById("submit-car-btn");
    const carModal = new bootstrap.Modal(document.getElementById("carModal"));
    const openCarModalBtn = document.getElementById("open-car-modal");

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
        const tr = document.createElement("tr");
        const formated={
            car
        }
        tr.innerHTML = `
            <td><img src="${car.image}" alt="${car.model}" style="width: 50px;"></td>
            <td>${car.model}</td>
            <td>${car.year}</td>
            <td>${car.passengers}</td>
            <td>$${car.price_per_day}</td>
            <td>${car.available ? "Yes" : "No"}</td>
            <td class="d-none d-md-table-cell">${car.transmission}</td>
            <td class="d-none d-md-table-cell">${car.fuel_type}</td>
            <td class="d-none d-md-table-cell">${car.mileage}</td>
            <td class="d-none d-md-table-cell">${car.features?.join(", ") || "N/A"}</td>
            <td class="d-none d-md-table-cell">${car.rating ?? "N/A"}</td>
            <td>
                <button class="btn btn-sm btn-warning edit-car" data-id="${car.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-car" data-id="${car.id}">Delete</button>
            </td>
        `;
        return tr;
    };

    // Render all cars in table
    const renderCars = () => {
        carsTableBody.innerHTML = "";
        getCars().forEach(car => carsTableBody.appendChild(tableRow(car)));
        attachActionListeners();
    };

    // Add/Edit Form Submit
    carForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(carForm);
        const car = {
            id: carIdInput.value || Date.now().toString(),
            model: formData.get("model"),
            year: parseInt(formData.get("year")),
            passengers: parseInt(formData.get("passengers")),
            price_per_day: parseFloat(formData.get("price_per_day")),
            available: formData.get("available") === "true",
            transmission: formData.get("transmission"),
            fuel_type: formData.get("fuel_type"),
            mileage: parseInt(formData.get("mileage")),
            features: formData.get("features") ? formData.get("features").split(",").map(f => f.trim()) : [],
            rating: formData.get("rating") ? parseFloat(formData.get("rating")) : undefined,
            image: formData.get("image")
        };

        if (carIdInput.value) {
            updateCar(car.id, car);
            alert("Car updated successfully!");
        } else {
            addCar(car);
            alert("Car added successfully!");
        }

        carForm.reset();
        carIdInput.value = "";
        carImageBase64Input.value = "";
        imagePreview.style.display = "none";
        carModal.hide();
        renderCars(); // refresh the DOM only, not the page
    });

    // Attach event listeners for Edit/Delete buttons
    const attachActionListeners = () => {
        document.querySelectorAll(".edit-car").forEach(button => {
            button.addEventListener("click", () => {
                const carId = button.dataset.id;
                const car = getCars().find(c => c.id === carId);
                if (car) {
                    carIdInput.value = car.id;
                    document.getElementById("car-model").value = car.model;
                    document.getElementById("car-year").value = car.year;
                    document.getElementById("car-passengers").value = car.passengers;
                    document.getElementById("car-price").value = car.price_per_day;
                    document.getElementById("car-available").value = car.available ? "true" : "false";
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

        document.querySelectorAll(".delete-car").forEach(button => {
            button.addEventListener("click", () => {
                if (confirm("Are you sure you want to delete this car?")) {
                    removeCar(button.dataset.id);
                    renderCars();
                }
            });
        });
    };

    renderCars();
};
