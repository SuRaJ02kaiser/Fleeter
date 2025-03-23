document.addEventListener("DOMContentLoaded", fetchVehicles);


function displayNoVehiclesMessage() {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = `
        <div class="no-vehicles-message">
            <p>No vehicles available.</p>
        </div>
    `;
}


async function fetchVehicles() {
    const storedData = localStorage.getItem("fleeterToken");
    try {
        const authData = JSON.parse(storedData);
        const response = await fetch("https://b43-web-181-web-project-176-4.onrender.com/vehicle/getVehicles", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authData.token}`
            }
        });

        if (response.status === 404 || !response.ok) {
            displayNoVehiclesMessage();
            return;
        }

        const vehicles = await response.json();
        console.log(vehicles);
        if (!vehicles || vehicles.length === 0) {
            displayNoVehiclesMessage();
            return;
        }

        const cardContainer = document.getElementById("card-container");
        cardContainer.innerHTML = ""; 

        vehicles.forEach(vehicle => {
            const card = document.createElement("div");
            card.className = "card";
            const icon = vehicle.type === "light" ? "fa-car" : "fa-truck";

            const buttonText = vehicle.status === "active" ? "Send for Maintenance" : "Reactivate";

            card.innerHTML = `
                <i class="fas ${icon}"></i>
                <h3>${vehicle.make} ${vehicle.model}</h3>
                <p><span class="static-text">License Plate:</span> <span class="dynamic-data">${vehicle.licensePlate}</span></p>
                <p><span class="static-text">Year:</span> <span class="dynamic-data">${vehicle.manufacturingYear}</span></p>
                <p><span class="static-text">Type:</span> <span class="dynamic-data">${vehicle.type}</span></p>
                <p><span class="static-text">Mileage:</span> <span class="dynamic-data">${vehicle.mileage} km</span></p>
                <p><span class="static-text">Status:</span> <span class="dynamic-data">${vehicle.status}</span></p>
                <button onclick="deleteVehicle('${vehicle._id}')">Delete</button>
                <button onclick="updateVehicle('${vehicle._id}', '${vehicle.status}')">${buttonText}</button>
            `;
            cardContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching vehicles:", error);
        displayNoVehiclesMessage();
    }
}


async function deleteVehicle(vehicleId) {
    const confirmDelete = confirm("Are you sure you want to delete this vehicle?");
    if (confirmDelete) {
        try {
            const storedData = localStorage.getItem("fleeterToken");
            const authData = JSON.parse(storedData);
            const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/vehicle/delete/${vehicleId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${authData.token}`
                }
            });

            if (response.ok) {
                alert("Vehicle deleted successfully!");
                fetchVehicles();
            } else {
                alert("Failed to delete vehicle.");
            }
        } catch (error) {
            console.error("Error deleting vehicle:", error);
        }
    }
}


async function updateVehicle(vehicleId, currentStatus) {
    const newStatus = currentStatus === "active" ? "maintenance" : "active";
    const confirmUpdate = confirm(`Are you sure you want to change the status to ${newStatus}?`);
    
    if (confirmUpdate) {
        try {
            const storedData = localStorage.getItem("fleeterToken");
            const authData = JSON.parse(storedData);
            const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/vehicle/update/${vehicleId}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${authData.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                alert("Vehicle status updated successfully!");
                fetchVehicles(); 
            } else {
                alert("Failed to update vehicle status.");
            }
        } catch (error) {
            console.error("Error updating vehicle status:", error);
        }
    }
}


function openAddVehicleModal() {
    const modal = document.getElementById("addVehicleModal");
    modal.style.display = "flex";
    document.body.classList.add("modal-open");
}


function closeAddVehicleModal() {
    const modal = document.getElementById("addVehicleModal");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
}


document.getElementById("addVehicleForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const vehicleData = {
        make: formData.get("make"),
        model: formData.get("model"),
        licensePlate: formData.get("licensePlate"),
        manufacturingYear: parseInt(formData.get("manufacturingYear")),
        type: formData.get("type"),
        status: "active",
        mileage: parseInt(formData.get("mileage"))
    };

    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const response = await fetch("https://b43-web-181-web-project-176-4.onrender.com/vehicle/create", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authData.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vehicleData)
        });

        if (response.ok) {
            alert("Vehicle added successfully!");
            closeAddVehicleModal();
            fetchVehicles();
            e.target.reset();
        } else {
            const errorData = await response.json();
            alert(`Failed to add vehicle: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error adding vehicle:", error);
        alert("Something went wrong. Please try again.");
    }
});


function toggleTheme() {
    const body = document.body;
    const themeToggleIcon = document.querySelector(".theme-toggle i");

    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        themeToggleIcon.classList.remove("fa-moon");
        themeToggleIcon.classList.add("fa-sun");
    } else {
        themeToggleIcon.classList.remove("fa-sun");
        themeToggleIcon.classList.add("fa-moon");
    }

    const isDarkMode = body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}


function initializeTheme() {
    const savedTheme = localStorage.getItem("theme");
    const themeToggleIcon = document.querySelector(".theme-toggle i");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggleIcon.classList.remove("fa-moon");
        themeToggleIcon.classList.add("fa-sun");
    } else {
        document.body.classList.remove("dark-mode");
        themeToggleIcon.classList.remove("fa-sun");
        themeToggleIcon.classList.add("fa-moon");
    }
}


async function searchByMileage() {
    const mileage = document.getElementById("searchByMileage").value.trim();
    if (!mileage || isNaN(mileage)) {
        alert("Please enter a valid mileage value.");
        return;
    }

    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/vehicle/getVehicleByMileage/${mileage}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authData.token}`
            }
        });

        if (response.ok) {
            const vehicles = await response.json();
            displayVehicles(vehicles);
        } else {
            alert("No vehicles found with this mileage.");
            fetchVehicles();
        }
    } catch (error) {
        console.error("Error searching by mileage:", error);
        alert("Something went wrong. Please try again.");
    }
}



async function searchByStatus() {
    const status = document.getElementById("searchByStatus").value;
    if (!status) {
        fetchVehicles();
        return;
    }

    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/vehicle/getVehicleByStatus/${status}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authData.token}`
            }
        });

        if (response.ok) {
            const vehicles = await response.json();
            displayVehicles(vehicles);
        } else {
            alert(`No vehicles found with status: ${status}.`);
            fetchVehicles(); 
        }
    } catch (error) {
        console.error("Error searching by status:", error);
        alert("Something went wrong. Please try again.");
    }
}


async function searchByName() {
    const make = document.getElementById("searchByMake").value.trim().toLowerCase();
    const model = document.getElementById("searchByModel").value.trim().toLowerCase();
    if (!make) {
        alert("Please enter a make or model to search.");
        return;
    }

    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/vehicle/getVehicleByName/${make}/${model}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authData.token}`
            }
        });

        if (response.ok) {
            const vehicles = await response.json();
            displayVehicles(vehicles);
        } else {
            alert("No vehicles found with this name.");
            fetchVehicles(); 
        }
    } catch (error) {
        console.error("Error searching by name:", error);
        alert("Something went wrong. Please try again.");
    }
}


function displayVehicles(vehicles) {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = ""; 

    if (!vehicles || vehicles.length === 0) {
        displayNoVehiclesMessage();
        return;
    }

    vehicles.forEach(vehicle => {
        const card = document.createElement("div");
        card.className = "card";
        const icon = vehicle.type === "light" ? "fa-car" : "fa-truck";

        const buttonText = vehicle.status === "active" ? "Send for Maintenance" : "Reactivate";

        card.innerHTML = `
            <i class="fas ${icon}"></i>
            <h3>${vehicle.make} ${vehicle.model}</h3>
            <p><span class="static-text">License Plate:</span> <span class="dynamic-data">${vehicle.licensePlate}</span></p>
            <p><span class="static-text">Year:</span> <span class="dynamic-data">${vehicle.manufacturingYear}</span></p>
            <p><span class="static-text">Type:</span> <span class="dynamic-data">${vehicle.type}</span></p>
            <p><span class="static-text">Mileage:</span> <span class="dynamic-data">${vehicle.mileage} km</span></p>
            <p><span class="static-text">Status:</span> <span class="dynamic-data">${vehicle.status}</span></p>
            <button onclick="deleteVehicle('${vehicle._id}')">Delete</button>
            <button onclick="updateVehicle('${vehicle._id}', '${vehicle.status}')">${buttonText}</button>
        `;
        cardContainer.appendChild(card);
    });
}


async function combineFilters() {
    const make = document.getElementById("searchByName").value.trim().toLowerCase();
    const mileage = document.getElementById("searchByMileage").value.trim();
    const status = document.getElementById("searchByStatus").value;

    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const params = new URLSearchParams();
        if (make) params.append("make", make);
        if (mileage) params.append("mileage", mileage);
        if (status) params.append("status", status);

        const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/vehicle/filteredVehicles?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authData.token}`
            }
        });

        if (response.ok) {
            const vehicles = await response.json();
            displayVehicles(vehicles);
        } else {
            alert("No vehicles found with the specified filters.");
            fetchVehicles();
        }
    } catch (error) {
        console.error("Error combining filters:", error);
        alert("Something went wrong. Please try again.");
    }
}



document.querySelector(".theme-toggle").addEventListener("click", toggleTheme);
document.addEventListener("DOMContentLoaded", initializeTheme);