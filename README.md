# Weather App

Weather App is a modern web application that displays weather data for your current location and any city you search for. Built with **React** and **TailwindCSS** on the frontend, and **Express.js** on the backend, it provides interactive charts and a clean user experience.

## Features

- 🌍 **Current Location Weather:** Automatically detects and shows weather for your current location.
- 🔎 **Search by City:** Search for weather data in any city worldwide.
- 📊 **Interactive Charts:** Visualize temperature, humidity, wind speed, cloud cover, UV index, and more for the next 5 days.
- ⚡ **Fast & Responsive:** Built with React and styled using TailwindCSS for a seamless experience on all devices.
- 🗄️ **Backend API:** Express.js backend fetches data from [Tomorrow.io](https://www.tomorrow.io/) API.

## Screenshots

![Weather App Screenshot](frontend/public/screenshot.png) <!-- Add your screenshot here -->

## Tech Stack

- **Frontend:** [React](https://react.dev/), [TailwindCSS](https://tailwindcss.com/), [Vite](https://vitejs.dev/), [Recharts](https://recharts.org/)
- **Backend:** [Express.js](https://expressjs.com/), [Node.js](https://nodejs.org/)
- **API:** [Tomorrow.io Weather API](https://www.tomorrow.io/weather-api/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22+ recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/weatherapp.git
cd weatherapp
```

### 2. Setup the Backend

1. Go to the backend folder:
    ```sh
    cd backend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file and add your [Tomorrow.io API key](https://app.tomorrow.io/development/keys):
    ```
    TOMORROW_API_KEY=your_api_key_here
    ```
4. Start the backend server:
    ```sh
    npm run server
    ```
    The backend will run on [http://localhost:8000](http://localhost:8000).

### 3. Setup the Frontend

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
    The frontend will run on [http://localhost:3000](http://localhost:3000).

## Usage

- On load, the app shows weather data for your current location.
- Use the search bar to get weather data for any city.
- Explore the interactive charts for temperature, humidity, wind speed, cloud cover, evapotranspiration, and UV index.

## Project Structure

```
backend/
  app.js
  package.json
  .env
frontend/
  src/
    components/
    hooks/
    styles/
    App.tsx
    main.tsx
  public/
  package.json
  tailwind.config.js
  vite.config.ts
```

## License

This project is for portfolio and educational purposes.

---

Made by [Miguel Gonçalves](https://www.linkedin.com/in/miguel-gon%C3%A7alves-087195169/)