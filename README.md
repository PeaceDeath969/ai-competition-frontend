# AI Competition Frontend

A web client for AI competitions. The project is built using **React** and **Vite**.

## Project Structure

```
.
├── Dockerfile                – builds the frontend container
├── docker-compose.yml        – quick launch via Docker
├── nginx.conf                – sample nginx configuration
├── public/                   – static files
├── src/                      – application source code
│   ├── assets/               – images and icons
│   ├── components/           – shared React components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/                – interface pages
│   │   ├── Home.jsx, Login.jsx, Dashboard.jsx, etc.
│   ├── store/                – Zustand state stores
│   │   ├── authStore.js
│   │   └── themeStore.js
│   ├── api.js                – axios configuration
│   ├── router.jsx            – routing (React Router)
│   ├── i18n.js               – localization (i18next)
│   └── main.jsx              – React entry point
├── package.json              – dependencies and npm scripts
└── vite.config.js            – Vite configuration
```

## Running the Project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

   By default, the app will be available at `http://localhost:5173/`.

3. To build and preview the production version locally, run:

   ```bash
   npm run build
   npm run preview
   ```

4. Optionally, you can run the project using Docker:

   ```bash
   docker compose up --build
   ```

The `dev`, `build`, and `preview` scripts are defined in `package.json`.
