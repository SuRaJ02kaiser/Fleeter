let map;
let directionsService;
let directionsRenderer;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 28.6139, lng: 77.2090 },
        zoom: 12,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    window.addEventListener("resize", () => {
        const center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center); 
    });
}

function showRoute() {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;

    if (!from || !to) {
        alert("Please enter both 'From' and 'To' locations.");
        return;
    }

    const request = {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);

            const route = result.routes[0].legs[0];
            const distance = route.distance.text;
            const distanceInfo = document.getElementById("distance-info");
            distanceInfo.innerText = `Distance: ${distance}`;
            distanceInfo.style.display = "block";
        } else {
            alert("Could not calculate the route. Please check the locations.");
            document.getElementById("distance-info").innerText = ""; 
        }
    });
}


async function startJourney() {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;

    if (!from || !to) {
        alert("Please enter both 'From' and 'To' locations.");
        return;
    }

    const journeyData = {
        start: from,
        destination: to,
    };

    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const response = await fetch("https://b43-web-181-web-project-176-4.onrender.com/route/create", { 
            method: "POST",
            headers: {
                "Authorization": `Bearer ${authData.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(journeyData)
        });

        if (response.ok) {
            const result = await response.json();
            alert("Journey saved successfully!");
            fetchJourneyHistory();
        } else {
            const errorData = await response.json();
            alert(`Failed to save journey: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error saving journey:", error);
        alert("Something went wrong. Please try again.");
    }
}


async function fetchJourneyHistory() {
    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const response = await fetch("https://b43-web-181-web-project-176-4.onrender.com/route/get", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${authData.token}`
            }
        });

        if (!response.ok) {
            console.error("Failed to fetch journey history.");
            return;
        }

        const history = await response.json();

        if(history.length === 0) {
            displayJourneyHistory([], true); 
        } else{
            displayJourneyHistory(history, false); 
        }
    } catch(error){
        console.error("Error fetching journey history:", error);
    }
}


function displayJourneyHistory(history, flag) {
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = ""; 

    if (flag){
        const listItem = document.createElement("li");
        listItem.textContent = "No History";
        historyList.appendChild(listItem);
    } else{

        history.forEach(journey => {
            const listItem = document.createElement("li");
            listItem.textContent = `From: ${journey.start}  To: ${journey.destination}`;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", () => deleteJourney(journey._id));

            listItem.appendChild(deleteButton);
            historyList.appendChild(listItem);
        });
    }
}


async function deleteJourney(journeyId) {
    const confirmDelete = confirm("Are you sure you want to delete this route history?");
    if(confirmDelete){
    try {
        const storedData = localStorage.getItem("fleeterToken");
        const authData = JSON.parse(storedData);

        const response = await fetch(`https://b43-web-181-web-project-176-4.onrender.com/route/delete/${journeyId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${authData.token}`
            }
        });

        if (response.ok) {
            alert("Journey deleted successfully!");
            fetchJourneyHistory(); 
        } else {
            const errorData = await response.json();
            alert(`Failed to delete journey: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error deleting journey:", error);
        alert("Something went wrong. Please try again.");
    }
  }
}


document.addEventListener("DOMContentLoaded", () => {
    initMap();
    fetchJourneyHistory();
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

document.querySelector(".theme-toggle").addEventListener("click", toggleTheme);
document.addEventListener("DOMContentLoaded", initializeTheme);