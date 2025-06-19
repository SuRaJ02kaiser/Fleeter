# Fleeter

## Introduction
Fleeter is a fleet management system designed to streamline vehicle tracking, driver management, and route optimization. It helps logistics and transportation businesses operate efficiently by providing a structured way to manage their fleet.

## Project Type
Full-stack Web Application

## Deployed Application
- **Frontend:** [Fleeter Frontend](https://flee-ter.netlify.app/)
- **Backend:** [Fleeter Backend](https://b43-web-181-web-project-176.onrender.com)
- **Database:** MongoDB (via Mongoose)

## Directory Structure
### **Backend**
```
Backend/
│── config/
│   ├── db.js
│
│── controllers/
│   ├── user.controller.js
│   ├── vehicle.controller.js
│
│── middleware/
│   ├── auth.middleware.js
│
│── models/
│   ├── route.model.js
│   ├── user.model.js
│   ├── vehicle.model.js
│
│── routes/
│   ├── route.route.js
│   ├── user.route.js
│   ├── vehicle.route.js
│
│── node_modules/       # Dependencies installed via npm
│── .env.examples       # Example environment file
│── .gitignore          # Files to ignore in Git
│── index.js            # Entry point of the server
│── package-lock.json   # Dependency lock file
│── package.json        # Project metadata & dependencies
```

### **Frontend**
```
Frontend/
│── driver_page/
│   ├── driver.css
│   ├── driver.html
│   ├── driver.js
│
│── images/
│   ├── new-fleeter-bg.PNG
│
│── login_signup/
│   ├── login.css
│   ├── login.html
│   ├── login.js
│
│── route_page/
│   ├── route.css
│   ├── route.html
│   ├── route.js
│
│── vehicle_page/
│   ├── vehicle.css
│   ├── vehicle.html
│   ├── vehicle.js
│
│── index.html       # Main entry point
│── main.css         # Global styles
│── main.js          # Global JavaScript logic
│── README.md        # Documentation
```

## Features
- **Driver Management** – Add, update, and delete driver details.
- **Vehicle Management** – Manage vehicle details such as make, model, and status.
- **Route Management** – Assign and optimize routes for vehicles.

## Installation & Getting Started
To run the project locally, follow these steps:

### **Backend Setup**
1. **Clone the repository:**
   ```bash
   git clone https://github.com/SuRaJ02kaiser/B43_WEB_181_Web-Project-176.git
   ```
2. **Navigate to the backend directory:**
   ```bash
   cd Backend
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up environment variables:**
   - Create a `.env` file in the root of `Backend/`
   - Copy the contents of `.env.examples` and update values accordingly
5. **Start the backend server:**
   ```bash
   node index.js
   ```

### **Frontend Setup**
1. Navigate to the `Frontend/` directory.
2. Open `index.html` in your browser to run the application.

## APIs Used
- **Google Maps API** – Used for map visualization and navigation-related functionality.

## API Endpoints
### **User Routes**
- `POST /user/signup` – User signup
- `POST /user/login` – User login
- `GET /user/getUser` – Get user details (Auth: Admin/Manager)
- `GET /user/drivers` – Get all drivers (Auth: Admin/Manager)
- `POST /user/createDriver` – Create a new driver (Auth: Admin/Manager)
- `DELETE /user/deleteDriver/:id` – Delete a driver (Auth: Admin/Manager)
- `PATCH /user/updateDriver/:id` – Update driver details (Auth: Admin/Manager)
- `GET /user/getDriverByName/:name` – Search driver by name (Auth: Admin/Manager)
- `GET /user/getDriverByExp/:exp` – Filter drivers by experience (Auth: Admin/Manager)
- `GET /user/getDriverByStatus/:status` – Filter drivers by status (Auth: Admin/Manager)

### **Vehicle Routes**
- `GET /getVehicles` – Get all vehicles (Auth: Admin/Manager)
- `POST /create` – Create a vehicle entry (Auth: Admin/Manager)
- `PATCH /update/:id` – Update vehicle details (Auth: Admin/Manager)
- `DELETE /delete/:id` – Delete a vehicle (Auth: Admin/Manager)
- `GET /getVehicleByName/:make/:model` – Get vehicle by make and model (Auth: Admin/Manager)
- `GET /getVehicleByStatus/:status` – Filter vehicles by status (Auth: Admin/Manager)
- `GET /getVehicleByMileage/:mileage` – Filter vehicles by mileage (Auth: Admin/Manager)

## Technology Stack
### **Backend**
- **Node.js** – JavaScript runtime for building the backend.
- **Express.js** – Minimalist framework for handling API requests.
- **Mongoose** – ODM for interacting with MongoDB.

### **Frontend**
- **HTML** – Structure for web pages.
- **CSS** – Styling for the frontend.
- **JavaScript** – Adds interactivity to the user interface.

This stack ensures a **full-stack JavaScript development approach**, making the project efficient and scalable. 🚀
