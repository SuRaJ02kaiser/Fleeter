
document.addEventListener("DOMContentLoaded", fetchDrivers);

function displayNoDriversMessage() {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = `
        <div class="no-drivers-message">
            <p>No drivers under you.</p>
        </div>
    `;
}


async function fetchDrivers() {
    const storedData = localStorage.getItem("fleeterToken");
    try {
        const authData = JSON.parse(storedData);
        const response = await fetch("https://b43-web-181-web-project-176-4.onrender.com/user/drivers", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authData.token}`
            }
        });

        if (response.status === 404 || !response.ok) {
            displayNoDriversMessage();
            return;
        }

        const drivers = await response.json();

        if (!drivers || drivers.length === 0) {
            displayNoDriversMessage();
            return;
        }

        const cardContainer = document.getElementById("card-container");
        cardContainer.innerHTML = "";
    
        drivers.forEach(driver => {
            const card = document.createElement("div");
            card.className = "card";
            const userName = driver.username.toUpperCase();
    
            if (driver.status === "available") {
                card.innerHTML = `
                    <i class="fas fa-user"></i>
                    <h3>${userName}</h3>
                    <p><span class="static-text">Age:</span> <span class="dynamic-data">${driver.age}</span></p>
                    <p><span class="static-text">Experience:</span> <span class="dynamic-data">${driver.experience} years</span></p>
                    <p><span class="static-text">From:</span> <span class="dynamic-data">${driver.from}</span></p>
                    <p><span class="static-text">Mobile:</span> <span class="dynamic-data">${driver.mobile}</span></p>
                    <p><span class="static-text">Status:</span> <span class="dynamic-data">${driver.status}</span></p>
                    <p><span class="static-text">Can Drive:</span> <span class="dynamic-data">${driver.canDrive.join(", ")}</span></p>
                    <p><span class="static-text">Role:</span> <span class="dynamic-data">Driver</span></p>
                    <button onclick="deleteDriver('${driver._id}')">Delete</button>
                    <button onclick="changeStatus('${driver._id}', '${driver.status}', '${userName}')">Appoint</button>
                `;
            } else {
                card.innerHTML = `
                    <i class="fas fa-user"></i>
                    <h3>${userName}</h3>
                    <p><span class="static-text">Age:</span> <span class="dynamic-data">${driver.age}</span></p>
                    <p><span class="static-text">Experience:</span> <span class="dynamic-data">${driver.experience} years</span></p>
                    <p><span class="static-text">From:</span> <span class="dynamic-data">${driver.from}</span></p>
                    <p><span class="static-text">Mobile:</span> <span class="dynamic-data">${driver.mobile}</span></p>
                    <p><span class="static-text">Status:</span> <span class="dynamic-data">${driver.status}</span></p>
                    <p><span class="static-text">Can Drive:</span> <span class="dynamic-data">${driver.canDrive.join(", ")}</span></p>
                    <p><span class="static-text">Role:</span> <span class="dynamic-data">Driver</span></p>
                    <button onclick="deleteDriver('${driver._id}')">Delete</button>
                    <button onclick="changeStatus('${driver._id}', '${driver.status}', '${userName}')">Dismiss</button>
                `;
            }
            cardContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error fetching drivers:", error);
        displayNoDriversMessage();
    }
}


async function deleteDriver(driverId) {
    const storedData = localStorage.getItem("fleeterToken");
    const confirmDelete = confirm("Are you sure you want to delete this driver?");
    if (confirmDelete) {
        try {
            const authData = JSON.parse(storedData);
            const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/user/deleteDriver/${driverId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `bearer ${authData.token}`
                }
            });

            if (response.ok) {
                alert("Driver deleted successfully!");
                fetchDrivers(); 
            } else {
                alert("Failed to delete driver.");
            }
        } catch (error) {
            console.error("Error deleting driver:", error);
        }
    }
}


async function changeStatus(id, Status, name) {
    const storedData = localStorage.getItem("fleeterToken");
    let BODY;
    let confirmUpdate;

    if(Status === "available"){
        BODY = "not available";
        confirmUpdate = confirm(`Are you sure you want to appoint ${name} for your next job?`);
    } else{
        BODY = "available";
        confirmUpdate = confirm(`Are you sure you want to Dismiss ${name} for your next job?`);
    }

    if(confirmUpdate){
        try {
            const authData = JSON.parse(storedData);
            console.log(id,Status,name)
            const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/user/updateDriver/${id}`, {
                method: "PATCH", 
                headers: {
                    "Authorization": `Bearer ${authData.token}`,
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify({status: BODY})
            });

            if (response.ok) {
                alert(`Driver status updated to ${BODY} successfully!`);
                fetchDrivers();
            } else {
                alert("Failed to update driver status.");
            }
        } catch (error) {
            console.error("Error updating driver status:", error);
        }
    }
}


function openAddDriverModal() {
    const modal = document.getElementById("addDriverModal");
    modal.style.display = "flex"; 
    document.body.classList.add("modal-open"); 
}


function closeAddDriverModal() {
    const modal = document.getElementById("addDriverModal");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");
}


document.getElementById("addDriverForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const driverData = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        age: parseInt(formData.get("age")),
        experience: parseInt(formData.get("experience")),
        from: formData.get("from"),
        mobile: formData.get("mobile"),
        canDrive: formData.get("canDrive").split(",").map(item => item.trim())
    };

    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const response = await fetch("https://b43-web-181-web-project-176-4.onrender.com/user/createDriver", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authData.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(driverData)
        });

        if (response.ok) {
            alert("Driver added successfully!");
            closeAddDriverModal();
            fetchDrivers();
            e.target.reset();
        } else {
            const errorData = await response.json();
            alert(`Failed to add driver: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error adding driver:", error);
        alert("Something went wrong. Please try again.");
    }
});


function toggleTheme() {
    console.log("Theme toggle clicked!"); 
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


async function searchByName() {
    const name = document.getElementById("searchByName").value.trim().toLowerCase();
    if (!name) {
        alert("Please enter a name to search.");
        return;
    }

    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/user/getDriverByName/${name}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authData.token}`
            }
        });

        if (response.ok) {
            const drivers = await response.json();
            displayDrivers(drivers);
        } else {
            alert("No drivers found with this name.");
            fetchDrivers(); 
        }
    } catch (error) {
        console.error("Error searching by name:", error);
        alert("Something went wrong. Please try again.");
    }
}


async function searchByExp() {
    const exp = document.getElementById("searchByExp").value.trim();
    if (!exp || isNaN(exp)) {
        alert("Please enter a valid experience value.");
        return;
    }

    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/user/getDriverByExp/${exp}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authData.token}`
            }
        });

        if (response.ok) {
            const drivers = await response.json();
            displayDrivers(drivers);
        } else {
            alert("No drivers found with this experience.");
            fetchDrivers();
        }
    } catch (error) {
        console.error("Error searching by experience:", error);
        alert("Something went wrong. Please try again.");
    }
}


async function searchByStatus() {
    const status = document.getElementById("searchByStatus").value;
    if (!status) {
        fetchDrivers();
        return;
    }

    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/user/getDriverByStatus/${status}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authData.token}`
            }
        });

        if (response.ok) {
            const drivers = await response.json();
            displayDrivers(drivers);
        } else {
            alert("No drivers found with this status.");
            fetchDrivers(); 
        }
    } catch (error) {
        console.error("Error searching by status:", error);
        alert("Something went wrong. Please try again.");
    }
}


async function combineFilters() {
    const name = document.getElementById("searchByName").value.trim().toLowerCase();
    const exp = document.getElementById("searchByExp").value.trim();
    const status = document.getElementById("searchByStatus").value;

    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const params = new URLSearchParams();
        if (name) params.append("name", name);
        if (exp) params.append("exp", exp);
        if (status) params.append("status", status);

        const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/user/filteredDrivers?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authData.token}`
            }
        });

        if (response.ok) {
            const drivers = await response.json();
            displayDrivers(drivers);
        } else {
            alert("No drivers found with the specified filters.");
            fetchDrivers();
        }
    } catch (error) {
        console.error("Error combining filters:", error);
        alert("Something went wrong. Please try again.");
    }
}



function displayDrivers(drivers) {
    const cardContainer = document.getElementById("card-container");
    cardContainer.innerHTML = "";

    if (!drivers || drivers.length === 0) {
        displayNoDriversMessage();
        return;
    }

    drivers.forEach(driver => {
        const card = document.createElement("div");
        card.className = "card";
        const userName = driver.username.toUpperCase();

        if(driver.status === "available"){
            card.innerHTML = `
                <i class="fas fa-user"></i>
                <h3>${userName}</h3>
                <p><span class="static-text">Age:</span> <span class="dynamic-data">${driver.age}</span></p>
                <p><span class="static-text">Experience:</span> <span class="dynamic-data">${driver.experience} years</span></p>
                <p><span class="static-text">From:</span> <span class="dynamic-data">${driver.from}</span></p>
                <p><span class="static-text">Mobile:</span> <span class="dynamic-data">${driver.mobile}</span></p>
                <p><span class="static-text">Status:</span> <span class="dynamic-data">${driver.status}</span></p>
                <p><span class="static-text">Can Drive:</span> <span class="dynamic-data">${driver.canDrive.join(", ")}</span></p>
                <p><span class="static-text">Role:</span> <span class="dynamic-data">Driver</span></p>
                <button onclick="deleteDriver('${driver._id}')">Delete</button>
                <button onclick="changeStatus('${driver._id}', '${driver.status}', '${userName}')">Appoint</button>
            `;
        } else {
            card.innerHTML = `
                <i class="fas fa-user"></i>
                <h3>${userName}</h3>
                <p><span class="static-text">Age:</span> <span class="dynamic-data">${driver.age}</span></p>
                <p><span class="static-text">Experience:</span> <span class="dynamic-data">${driver.experience} years</span></p>
                <p><span class="static-text">From:</span> <span class="dynamic-data">${driver.from}</span></p>
                <p><span class="static-text">Mobile:</span> <span class="dynamic-data">${driver.mobile}</span></p>
                <p><span class="static-text">Status:</span> <span class="dynamic-data">${driver.status}</span></p>
                <p><span class="static-text">Can Drive:</span> <span class="dynamic-data">${driver.canDrive.join(", ")}</span></p>
                <p><span class="static-text">Role:</span> <span class="dynamic-data">Driver</span></p>
                <button onclick="deleteDriver('${driver._id}')">Delete</button>
                <button onclick="changeStatus('${driver._id}', '${driver.status}', '${userName}')">Dismiss</button>
            `;
        }
        cardContainer.appendChild(card);
    });
}


document.querySelector(".theme-toggle").addEventListener("click", toggleTheme);


document.addEventListener("DOMContentLoaded", initializeTheme);