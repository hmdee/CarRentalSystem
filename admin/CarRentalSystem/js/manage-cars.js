import { getCars, addCar, updateCar, removeCar } from "../js/modules/storage.js";

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

    // دالة لإنشاء صفوف الجدول ديناميكيًا
    let tableRow = (carObject) => {
        let newTr = document.createElement("tr");

        // تنسيق الخصائص الخاصة
        let formattedCar = {
            image: `<img src="${carObject.image}" alt="${carObject.model}" style="width: 50px; height: auto;">`,
            model: carObject.model,
            year: carObject.year,
            passengers: carObject.passengers,
            price_per_day: `$${carObject.price_per_day}`,
            available: carObject.available ? "Yes" : "No",
            transmission: carObject.transmission,
            fuel_type: carObject.fuel_type,
            mileage: carObject.mileage,
            features: carObject.features ? carObject.features.join(", ") : "N/A",
            rating: carObject.rating || "N/A"
        };

        // إنشاء الخلايا بناءً على الخصائص المُنسقة
        for (let prop in formattedCar) {
            let newTd = document.createElement("td");
            newTd.innerHTML = formattedCar[prop];
            newTr.appendChild(newTd);
        }

        // إضافة خلية الأزرار
        let actionsTd = document.createElement("td");
        actionsTd.innerHTML = `
            <button class="btn btn-sm btn-warning edit-car" data-id="${carObject.id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-car" data-id="${carObject.id}">Delete</button>
        `;
        newTr.appendChild(actionsTd);

        return newTr;
    };

    // Display Cars
    const cars = getCars();
    const carsTableBody = document.querySelector("#cars-table");
    cars.forEach(car => {
        carsTableBody.appendChild(tableRow(car));
    });

    // Handle Image Upload and Preview
    const carImageInput = document.getElementById("car-image");
    const carImageBase64Input = document.getElementById("car-image-base64");
    const imagePreview = document.getElementById("image-preview");

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

    // Handle Car Form Submission
    const carForm = document.getElementById("car-form");
    const carIdInput = document.getElementById("car-id");
    const submitCarBtn = document.getElementById("submit-car-btn");
    const resetCarFormBtn = document.getElementById("reset-car-form");

    carForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(carForm);
        const car = {
            id: formData.get("id") || Date.now().toString(),
            model: formData.get("model"),
            year: parseInt(formData.get("year")),
            passengers: parseInt(formData.get("passengers")),
            price_per_day: parseFloat(formData.get("price_per_day")),
            available: formData.get("available") === "true",
            image: formData.get("image"),
            transmission: formData.get("transmission"),
            fuel_type: formData.get("fuel_type"),
            mileage: parseInt(formData.get("mileage")),
            features: formData.get("features") ? formData.get("features").split(",").map(f => f.trim()) : [],
            rating: formData.get("rating") ? parseFloat(formData.get("rating")) : undefined
        };

        try {
            if (carIdInput.value) {
                // Update existing car
                updateCar(carIdInput.value, car);
                alert("Car updated successfully!");
            } else {
                // Add new car
                addCar(car);
                alert("Car added successfully!");
            }
            carForm.reset();
            carIdInput.value = "";
            carImageBase64Input.value = "";
            imagePreview.style.display = "none";
            submitCarBtn.textContent = "Add Car";
            resetCarFormBtn.style.display = "none";
            window.location.reload();
        } catch (error) {
            alert(error.message);
        }
    });

    // Handle Edit and Delete Car
    const editButtons = carsTableBody.querySelectorAll(".edit-car");
    const deleteButtons = carsTableBody.querySelectorAll(".delete-car");

    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            const carId = button.dataset.id;
            const car = getCars().find(c => c.id.toString() === carId);
            if (car) {
                carIdInput.value = car.id;
                document.getElementById("car-model").value = car.model;
                document.getElementById("car-year").value = car.year;
                document.getElementById("car-passengers").value = car.passengers;
                document.getElementById("car-price").value = car.price_per_day;
                document.getElementById("car-available").value = car.available ? "true" : "false";
                carImageBase64Input.value = car.image;
                imagePreview.src = car.image;
                imagePreview.style.display = "block";
                document.getElementById("car-transmission").value = car.transmission;
                document.getElementById("car-fuel-type").value = car.fuel_type;
                document.getElementById("car-mileage").value = car.mileage;
                document.getElementById("car-features").value = car.features ? car.features.join(", ") : "";
                document.getElementById("car-rating").value = car.rating || "";
                submitCarBtn.textContent = "Update Car";
                resetCarFormBtn.style.display = "inline-block";
            }
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this car?")) {
                try {
                    removeCar(button.dataset.id);
                    window.location.reload();
                } catch (error) {
                    alert(error.message);
                }
            }
        });
    });

    resetCarFormBtn.addEventListener("click", () => {
        carForm.reset();
        carIdInput.value = "";
        carImageBase64Input.value = "";
        imagePreview.style.display = "none";
        submitCarBtn.textContent = "Add Car";
        resetCarFormBtn.style.display = "none";
    });
}; 