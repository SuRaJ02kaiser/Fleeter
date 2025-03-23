
document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1); 
            const targetSection = document.getElementById(targetId);

            if(targetSection){
                targetSection.scrollIntoView({ behavior: "smooth" });

                setTimeout(() => {
                    targetSection.classList.add("visible");
                }, 200); 
            }
        });
    });

    const sections = document.querySelectorAll(".section-animate");

    const checkVisibility = () => {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionBottom = section.getBoundingClientRect().bottom;

            if(sectionTop < window.innerHeight * 0.8 && sectionBottom > 0){
                section.classList.add("visible");
            } else{
                section.classList.remove("visible");
            }
        });
    };

    window.addEventListener("load", checkVisibility);
    window.addEventListener("scroll", checkVisibility);

});


document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", function () {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function () {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });
});


const getStarted = async () => {
    const getToken = localStorage.getItem('fleeterToken');
    if(getToken){
        window.location.href='/driver_page/driver.html';
    } else{
       window.location.href='/login_signup/login.html';
    }
}


document.addEventListener("DOMContentLoaded", async function () {
    const storedData = localStorage.getItem("fleeterToken");
    const shouldReload = sessionStorage.getItem("fleeterReload");

    if (shouldReload === "true") {
        sessionStorage.removeItem("fleeterReload");
        window.location.reload();
        return;
    }

    if (storedData){
        try {
            const authData = JSON.parse(storedData);
            const currentTime = new Date().getTime();

            if (authData.expiry < currentTime) {
                console.log("Token expired, removing from localStorage.");
                localStorage.removeItem("fleeterToken");
                return;
            }

            const loginBttn = document.querySelector(".login-button");
            const hamLoginButton = document.querySelector(".ham-login-button");
            const name = document.querySelector(".login-name");
            const hamName = document.querySelector('.ham-login-name');
            const logoutButton = document.querySelector(".logout-button");
            const hamLogoutButton = document.querySelector(".ham-logout-button");

            const response = await fetch("https://b43-web-181-web-project-176-4.onrender.com/user/getUser", {
                method: "GET",
                headers: {
                    "Authorization": `bearer ${authData.token}`
                }
            });

            if (response.ok) {
                const data = await response.json();

                loginBttn.style.display = "none";
                name.style.display = "block";
                logoutButton.style.display = "block";
                name.textContent = data.username;


                hamLoginButton.style.display = "none";
                hamName.style.display = "block";
                hamName.textContent = data.username;

                logoutButton.addEventListener("click", function () {
                    const confirmLogout = confirm("Are you sure you want to logout?");
                    if (confirmLogout) {
                        localStorage.removeItem("fleeterToken");
                        window.location.reload();
                    }
                });

                hamLogoutButton.addEventListener("click", function () {
                    const confirmLogout = confirm("Are you sure you want to logout?");
                    if (confirmLogout) {
                        localStorage.removeItem("fleeterToken");
                        window.location.reload();
                    }
                });

            }
        } catch (error) {
            console.error("Error parsing token or fetching user:", error);
        }
    } else{
        const hamLogoutButton = document.querySelector(".ham-logout-button");
        hamLogoutButton.style.display = "none"
    }
});


document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");
    const number = document.getElementById("phone");

    if (name.value.trim() !== "" && email.value.trim() !== "" && message.value.trim() !== "") {
        alert("Message Sent");
        name.value = "";
        email.value = "";
        message.value = "";
        number.value = "";
    } else {
        alert("Please fill out all required fields.");
    }
});


function takeToDrivers(){
    const getToken = localStorage.getItem('fleeterToken');
    if(getToken){
        window.location.href='/driver_page/driver.html';
    } else{
       window.location.href='/login_signup/login.html';
    }
}


function takeToVehicles(){
    const getToken = localStorage.getItem('fleeterToken');
    if(getToken){
        window.location.href='/vehicle_page/vehicle.html';
    } else{
       window.location.href='/login_signup/login.html';
    }
}


function takeToRoutes(){
    const getToken = localStorage.getItem('fleeterToken');
    if(getToken){
        window.location.href='/route_page/route.html';
    } else{
       window.location.href='/login_signup/login.html';
    }
}