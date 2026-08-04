# To-Do List Web Application (Firebase Firestore)

A simple, clean, and responsive **To-Do List** reminder web application powered by **Google Firebase Firestore**, **Vite**, and **Vanilla JavaScript**.

---

## 📌 Project Overview
The To-Do List application is a real-time task reminder system. All tasks are synchronized live with a **Cloud Firestore database** (`tasks` collection), allowing tasks to persist seamlessly across browser sessions and devices.

---

## 🔒 Security Notice
Firebase API credentials are **secured using environment variables** (`.env`) and are **not hardcoded** in the source code.

---

## 📂 Project Structure
```
noteapp/
│
├── .env             # Environment variables containing actual Firebase credentials (ignored by git)
├── .env.example     # Template file with placeholder environment variables
├── .gitignore       # Git ignore rules (.env, node_modules, dist)
├── index.html       # HTML5 structure with ES module script import
├── style.css        # Custom CSS design system and responsive layout
├── firebase.js      # Firebase SDK initialization reading from environment variables
├── script.js        # Firestore CRUD operations using async/await & real-time snapshot listener
├── package.json     # Project dependencies (Vite & Firebase SDK)
└── README.md        # Project documentation and setup guide
```

---

## ⚙️ Environment Variables Setup

1. Copy `.env.example` to create `.env` (if not already created):
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in your actual credentials from **Firebase Console** (*Project Settings -> General -> Your Apps*):

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 💻 How to Run the Project locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```
