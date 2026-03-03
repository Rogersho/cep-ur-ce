# 🏥 CEP UR-CE Rukara Campus - Web Platform

[![React](https://img.shields.io/badge/Frontend-React%20(Vite)-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A centralized, premium digital ecosystem designed specifically for the **CEP (Communauté des Étudiants Protestants) UR-CE Rukara Campus**. This platform facilitates prayer coordination, worship event management, announcement broadcasting, and community engagement.

---

## ✨ Core Features

- 📅 **Event Management:** full CRUD operations for prayer meetings, worship nights, and campus activities.
- 📢 **Announcements:** Real-time communication and notifications for the community.
- 🎶 **Choir Showcase:** Individual galleries and profiles for multiple choirs.
- 🛡️ **Role-Based Auth:** Secure Admin and Member access levels using JWT and Bcrypt.
- 🎨 **Premium UI:** Modern "Sky Blue" design system with glassmorphism and smooth animations.
- 📸 **Media Sharing:** Integrated image upload system for community galleries.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), React Router, TanStack Query, Framer Motion, Lucide Icons.
- **Backend:** Node.js, Express.js, RESTful API.
- **Database:** MySQL (Normalized Schema).
- **Security:** JWT Authentication, Password Hashing (Bcrypt), Multer (File Handling).

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [XAMPP](https://www.apachefriends.org/index.html) (for MySQL & Apache)
- [Git](https://git-scm.com/)

### 2. Database Setup
1. Start MySQL in XAMPP.
2. Create a database named `cep_db` in **phpMyAdmin**.
3. Import the schema found in `database/schema.sql`.

### 3. Backend Setup
```bash
cd backend
npm install
# Create a .env file based on the implementation plan
npm start
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```text
cep/
├── backend/            # Express API, JWT Auth & Local storage
├── frontend/           # React App with custom design system
├── database/           # SQL Schema and initial data
└── artifacts/          # Project design and implementation docs
```

---

## 🎨 Design System
The platform utilizes a customized **Sky Blue** theme:
- **Primary:** `#0284c7` (Sky Blue 600)
- **Background:** `#f0f9ff` (Sky Blue 50)
- **Aesthetic:** Glassmorphism, Rounded Borders, Shadows.

---

## 🤝 Contributing
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

Developed for **CEP UR-CE Rukara Campus**. ✨
