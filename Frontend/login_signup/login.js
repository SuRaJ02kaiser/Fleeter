function toggleForm() {
    document.getElementById("login-form").style.display = 
        document.getElementById("login-form").style.display === "none" ? "block" : "none";
    document.getElementById("signup-form").style.display = 
        document.getElementById("signup-form").style.display === "none" ? "block" : "none";
}

function toggleTheme() {
    let root = document.documentElement;
    let currentBg = getComputedStyle(root).getPropertyValue('--primary-bg').trim();
    
    if(currentBg === '#51f5dc'){
        root.style.setProperty('--primary-bg', '#484545');
        root.style.setProperty('--secondary-bg', '#222');
        root.style.setProperty('--primary-color', '#ffcc00');
        root.style.setProperty('--secondary-color', '#ff9900');
        root.style.setProperty('--button-color', '#ffcc00');
        root.style.setProperty('--button-hover', '#ff9900');
        root.style.setProperty('--text-dark', '#fff');
        root.style.setProperty('--text-light', '#000');
        document.querySelector('.theme-toggle i').classList.replace('fa-moon', 'fa-sun');
    } else{
        root.style.setProperty('--primary-bg', '#51f5dc');
        root.style.setProperty('--secondary-bg', '#ffffff');
        root.style.setProperty('--primary-color', '#00796b');
        root.style.setProperty('--secondary-color', '#004d40');
        root.style.setProperty('--button-color', '#00897b');
        root.style.setProperty('--button-hover', '#004d40');
        root.style.setProperty('--text-dark', '#333');
        root.style.setProperty('--text-light', '#ffffff');
        document.querySelector('.theme-toggle i').classList.replace('fa-sun', 'fa-moon');
    }
}


const logIn = async () => {
    const emailInput = document.querySelector("#login-form input[placeholder='Enter your email']");
    const passwordInput = document.querySelector("#login-form input[placeholder='Enter your password']");

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch("https://b43-web-181-web-project-176-4.onrender.com/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(data);

        if(response.ok){
            const token = data.token;
            if(token){
                const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
                const authData = { token, expiry: expiryTime };
        
                localStorage.setItem("fleeterToken", JSON.stringify(authData));
        
                sessionStorage.setItem("fleeterReload", "true");
        
                alert("Login successful!");
                window.location.href = "/Frontend/main_page/main.html";
            } else {
                alert("Login failed: No token received.");
            }
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
    }
};


const signUp = async () => {
    const email = document.querySelector("#signup-form input[placeholder='Enter your email']").value;
    const password = document.querySelector("#signup-form input[placeholder='Create a password']").value; 
    const username = document.querySelector("#signup-form input[placeholder='Enter your name']").value;
    
    try {
        const response = await axios.post("https://b43-web-181-web-project-176-4.onrender.com/user/signup", {
            username, email, password
        });

        console.log(response.data);

        if (response.status === 409) {
            alert("User already exists, please login.");
            return;
        }

        alert("Signup successful!");
        window.location.href = "/Frontend/login_signup/login.html";

    } catch (err) {
        alert(err.response?.data?.message || "Signup failed. Please try again.");
    }
};


function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}