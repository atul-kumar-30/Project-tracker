# Project Portfolio Tracker

A beautifully designed, full-stack application for managing and visualizing your high-level projects, built with the MERN stack (MongoDB, Express.js, React.js, and Node.js). 

This application serves as a central hub for your project portfolio. It allows you to maintain a dashboard of your ongoing and completed projects, tracking their statuses, start/end dates, and external links (like Figma designs or GitHub repos).

## Features
- **Clean Dashboard**: A responsive, grid-based dashboard showcasing your projects as beautiful cards.
- **Search & Filtering**: Quickly find projects using the search bar or filter them by selecting predefined categories (e.g., AI/ML, Full Stack, Frontend, Backend).
- **Project Categories**: Assign one or multiple categories to your projects to keep them organized and easily discoverable.
- **Visual Timeline**: A chronological timeline view that plots your projects based on their Start and End dates.
- **Dedicated Integrations**: Add your GitHub repository links and Live Deployment URLs to quickly access your code and live projects directly from the dashboard.
- **Status & Date Tracking**: Easily label projects as `Planning`, `Active`, or `Completed` and track their timelines.
- **Profile Statistics**: A beautifully designed profile page that displays your live project statistics.
- **Authentication**: Secure user login and signup to ensure your portfolio is private.
- **Premium Dark Mode**: A sleek, modern dark mode UI built with TailwindCSS.

## Tech Stack
- **Frontend**: React.js, TailwindCSS, HeadlessUI, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Joi, JSONWebToken

## Setup Instructions

### Step 1: Install Dependencies
- Open a terminal in the `/backend` directory and run:
  ```bash
  npm install
  ```
- Open a terminal in the `/frontend` directory and run:
  ```bash
  npm install
  ```

### Step 2: Configure Environment Variables
Go to the `backend` directory and create a `.env` file. Add your MongoDB connection string and a JWT secret:
```env
MONGODB_PATH=your-mongodb-connection-url
JWT_SECRET=your-secret-key
```

### Step 3: Change Server Port and CORS (Optional)
By default, the server runs on port `9000` and the client runs on `3000`. You can change these in your `.env` file:
```env
PORT=your-port
CORS_ORIGIN=your-client-origin
```

### Step 4: Run the Application
Open two separate terminals:

**Backend Terminal**:
```bash
cd backend
npm run serve
```

**Frontend Terminal**:
```bash
cd frontend
npm start
```

The application will now be running at `http://localhost:3000`!

## Deployment

**1. Deploy Backend (Render)**
- Host the `/backend` folder on Render.
- Add your `MONGODB_PATH` and `JWT_SECRET` environment variables.
- Add a `CORS_ORIGIN` variable matching your live Vercel frontend URL.

**2. Deploy Frontend (Vercel)**
- Host the `/frontend` folder on Vercel.
- Add a `REACT_APP_API_URL` environment variable pointing to your live Render backend URL.
