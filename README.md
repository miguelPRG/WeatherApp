# Weather App

A modern full-stack web application that displays weather data for your current location and any city you search for.  
Frontend built with **React**, **Vite**, **TailwindCSS**, and **Recharts**. Backend powered by **Express.js** and **Node.js**. Data provided by the [Tomorrow.io Weather API](https://www.tomorrow.io/weather-api/).

## 🚀 Live Demo

👉 [View the app on Vercel](https://weather-app-ruddy-iota-13.vercel.app/)

## ✨ Features

- 🌍 **Current Location Weather:** Automatically detects and displays your local weather.
- 🔎 **City Search:** Get weather data for any city worldwide.
- 📊 **Interactive Charts:** Visualize temperature, humidity, wind speed, cloud cover, UV index, and more for the next 5 days.
- ⚡ **Fast & Responsive:** Optimized for mobile, tablet, and desktop.
- 🗄️ **Secure Backend API:** Express.js server handles API requests and protects the Tomorrow.io key.

## 📷 Screenshots

![Weather App Screenshot](frontend/assets/screenshot.png)

## 🛠 Tech Stack

- **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TailwindCSS](https://tailwindcss.com/), [Recharts](https://recharts.org/)
- **Backend:** [Express.js](https://expressjs.com/), [Node.js](https://nodejs.org/)
- **API:** [Tomorrow.io Weather API](https://www.tomorrow.io/weather-api/)

## 🧑‍💻 Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/miguelPRG/WeatherApp.git
cd WeatherApp
```

### 2. Go to develop branch

Switch to the **develop** branch for local frontend-backend communication, as it points to the correct backend URL.

```sh
git switch develop
```

### 2. Creating .env file

- Create a **.env** file **inside the backend directory** and add your [Tomorrow.io API key](https://app.tomorrow.io/development/keys):
    ```
    TOMORROW_API_KEY=your_api_key_here
    ```

### Option 1: Using Docker

#### 🐳 Docker (Development Only)

This project includes Docker configuration to simplify **development setup**.  
It allows you to run both frontend and backend in isolated containers without installing Node.js or npm locally for each part.

> ⚠️ Note: Docker is configured **for development purposes only**, not for production deployment. For production, you would need to build the frontend and backend separately and deploy each one to a server or a cloud service. This project runs in [Render](https://render.com/)(backend) and [Vercel](https://vercel.com/)(frontend).  

##### 1. Start the App with Docker

From the project root, run (as administrator):

```sh
docker-compose up --build
```
This will start:

. Backend on [http://localhost:8000](http://localhost:8000)
. Frontend on [http://localhost:3000](http://localhost:3000) 

##### 2. Stop the Containers

We can also stop the container to shutdown the application as a whole.

```sh
docker-compose down
```

### Option 2: Local Setup (Node.js & npm)

#### Prerequisites

- [Node.js](https://nodejs.org/) (v22+ recommended)
- [npm](https://www.npmjs.com/)

#### 1. Setup the Backend

1. Go to the backend folder:
```sh
    cd backend
```
2. Install dependencies:
```sh
    npm install
```
3. Start the backend server:
```sh
    npm run server
```
    The backend will run on [http://localhost:8000](http://localhost:8000)

#### 3. Setup the Frontend

1. Open a new terminal and go to the frontend folder:
```sh
    cd frontend
```
2. Install dependencies:
```sh
    npm install
```
3. Start the development server:
```sh
    npm run dev
```
    The frontend will run on [http://localhost:3000](http://localhost:3000)

## Usage

- On load, the app requests your location and shows weather data automatically.
- Search for any city to get its forecast.
- Data is cached in local storage to reduce API calls.
- Explore charts for temperature, humidity, wind speed, cloud cover, evapotranspiration, and UV index.

## Error Handling

### Location Not Found

Here is a screenshot where the user's current location is not correctly fetched, weather if it's because the user's browser has not location permissions or some other problem.

![Error Screenshot](./frontend/public/locationNotFound.png)

### City Not Found

Here is a screenshot where the user's asked city was not found.

![Error Screenshot](./frontend/public/cityNotFound.png)

## Unit Tests

This project also includes unitary tests in **frontend/src/tests** directory. In order to them, run the following commands:

```sh
cd frontend
npm run test
```

## CI/CD
This project is operating in constant **integration** and **deployment**. Every time a **commit** is pushed in several diferent branches, the GitHub workflow is executed. This workflow runs 4 jobs: **install-in-cache-and-audit**, **test-frontend**, **build-app**, **deploy**

## Project Structure

```
.github/
    workflows/
        action.yml
backend/
    app.js
    package.json
    Dockerfile
    .dockerignore
    .env
frontend/
    src/
        components/
        hooks/
        styles/
        App.tsx
        main.tsx
    tests/
        components/
        hooks/
    public/
    package.json
    vite.config.ts
    Dockerfile
    .dockerignore
docker-compose.yml
LICENSE
README.md
```

## Author

Made by [Miguel Gonçalves](https://www.linkedin.com/in/miguel-gon%C3%A7alves-087195169/).