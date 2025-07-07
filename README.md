# 📚 LMS System – Full-Stack Learning Management System (MERN)

An advanced and modern Learning Management System (LMS) built using the MERN stack (MongoDB, Express, React, Node.js). This platform allows users to register, search and filter courses, purchase them via payment gateway, and access learning content — with a full-featured instructor/admin dashboard.

---

## 🚀 Demo

> 🔗 [Live Demo](https://e-learning-u1pi.onrender.com/)  

---

## ✨ Features

- ✅ User Authentication (JWT)
- ✅ Course Search with keyword + category filters
- ✅ Course purchase via Stripe integration
- ✅ Instructor dashboard to manage courses & lectures
- ✅ Cloudinary integration for video/image uploads
- ✅ Mobile responsive UI
- ✅ Dark/Light mode toggle
- ✅ Admin course controls
- ✅ Modular architecture for scalability

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Redux Toolkit Query
- TailwindCSS
- ShadCN UI
- React Router

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- Cloudinary (video/image storage)
- Stripe (payment gateway)

**Other:**
- JWT Authentication
- Dotenv for environment configs
- Render deployment

---

## 🧩 Folder Structure

```
LMS/
├── client/              # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── features/    # Redux slices + API
├── server/              # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middlewares/
├── .env
└── README.md
```

---

## ⚙️ Installation

> ⚠️ You must set up both `client` and `server` with their respective dependencies and environment variables.

### Clone the repository:
```bash
https://github.com/adityashriwas/LMS.git
cd LMS
```

### 1️⃣ Server Setup

```bash
cd server
npm install
```

Create a `.env` file in the server folder:

Start the server:
```bash
npm run dev
```

---

### 2️⃣ Client Setup

```bash
cd client
npm install
```

Create a `.env` file in the client folder:

Start the React app:
```bash
npm run dev
```

---

## 💳 Payments Integration

- ✅ Stripe: Use Stripe CLI to forward webhook events locally
```bash
stripe listen --forward-to localhost:8080/api/v1/purchase/webhook
```

---


## 🙋‍♂️ Author

- 👤 **Aditya Shriwas**
- 🧑‍💻 [GitHub](https://github.com/adityashriwas)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you would like to change.

