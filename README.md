# 🏠 Real Estate App

A modern full-stack **real estate platform** built with a polished UI and powerful features for buyers, sellers, and admins.

This project is designed to look and feel like a production-grade UI, with responsive layouts, smooth transitions, and everything a client needs to get started quickly.

---

## 🚀 Highlights

- **Rich listing experience** with images, search & filtering
- **User authentication** (login/signup) + protected routes
- **Role-based dashboards** (buyer, seller, admin)
- **Dark mode support** with theme persistence
- **Responsive styling** (desktop + mobile)
- **Smooth animations** and UI polish for a modern feel

---

## 🧱 Tech Stack

| Frontend | Backend | Database | Auth | Styling |
|--------|--------|--------|------|--------|
| React 19 | Node.js + Express | MongoDB | JWT + Sessions | Tailwind CSS + custom styles |

Other libs:
- `react-router-dom` for routing
- `framer-motion` for animations
- `axios` for API calls
- `react-icons` for UI icons

---

## ✅ Setup (Run Locally)

### 1) Clone & install

```bash
git clone https://github.com/someshcoder/Real-Estate-Application.git
cd client
```

### 2) Backend (API)

```bash
cd real-estate-backend
npm install
```

Create a `.env` file in `real-estate-backend` with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_cookie_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3) Frontend (Client)

In a new terminal:

```bash
cd ../client
npm install
npm run dev
```

The frontend will launch on **http://localhost:5173** (Vite default).

---

## 🗂️ Project Structure

The repo is split into two main folders: frontend (`client/`) and backend (`real-estate-backend/`). Below is a quick overview of the most important files and folders.

```txt
real-estate-app-main/
├── client/                      # React frontend (Vite)
│   ├── public/                  # Static assets (favicon, index.html)
│   ├── src/
│   │   ├── assets/              # Images + static assets used in UI
│   │   ├── components/          # Reusable UI components
│   │   │   ├── homepage/         # Landing page sections
│   │   │   ├── seller/           # Seller dashboard UI
│   │   │   └── others/           # Shared widgets (inputs, layouts, etc.)
│   │   ├── context/             # React Context providers (auth, theme)
│   │   ├── pages/               # Route pages (login, dashboard, etc.)
│   │   ├── styles/              # Custom global CSS
│   │   └── main.jsx             # App entry point
│   ├── package.json             # Frontend dependencies & scripts
│   └── vite.config.js           # Vite build config
│
└── real-estate-backend/         # Express backend
    ├── models/                  # Mongoose models (User, Property)
    ├── routes/                  # API route definitions
    ├── controllers/             # Business logic for each route
    ├── server.js                # Entry point (Express app + middleware)
    ├── testPassword.js          # Utility for validating hashed passwords
    └── package.json             # Backend dependencies & scripts
```

This structure keeps frontend and backend fully separated, which makes it easy to deploy independently (e.g., frontend on Vercel and backend on Heroku/Render).

---

## 🔧 Available Scripts

### Frontend
- `npm run dev` – start frontend in development
- `npm run build` – build production assets
- `npm run preview` – preview production build

### Backend
- `npm run dev` – start backend with nodemon (watch mode)

---

## ✅ Tips for Clients / Reviewers

- Explore the **dashboard pages** for buyer, seller, and admin functionality.
- Test the **theme switcher** to see dark mode styling (including accordion titles).
- Add/modify listings via the **seller dashboard** to see live UI updates.

---

## 📬 Contact

If you’d like enhancements, integrations, or a custom deployment, reach out:

- **Email:** someshbhatnagar535@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/somesh-bhatnagar-18b388328/

---

⭐ If you like this project, please star the repo on GitHub!


