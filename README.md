# 📚 Learning Management System (LMS)

A comprehensive, full-stack Learning Management System built with the MERN stack that enables seamless online course creation, distribution, and learning. This platform provides a complete ecosystem for instructors to monetize their content and students to access high-quality educational materials.

---

## 🚀 Live Demo

> 🔗 **[View Live Application](https://e-learning-five-kappa.vercel.app/)**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 🎯 Overview

This Learning Management System is a production-ready platform that facilitates online education through a modern, scalable architecture. The application supports multiple user roles (students and instructors), secure payment processing, media management, and real-time progress tracking.

### What Makes This LMS Special?

- **Complete Course Management**: Full CRUD operations for courses and lectures
- **Secure Payments**: Integrated Stripe payment gateway with webhook support
- **Media Handling**: Cloudinary integration for efficient video and image storage
- **User Experience**: Responsive design with dark/light mode support
- **Progress Tracking**: Real-time course completion monitoring
- **Advanced Search**: Keyword and category-based course filtering
- **Role-Based Access**: Separate dashboards for students and instructors

---

## ✨ Key Features

### For Students
- **Course Discovery**: Browse and search courses with advanced filtering options
- **Secure Checkout**: Purchase courses through Stripe payment gateway
- **Learning Dashboard**: Track course progress and continue where you left off
- **Video Learning**: Stream high-quality video lectures
- **Profile Management**: Manage personal information and view purchase history

### For Instructors
- **Course Creation**: Create and publish courses with rich media content
- **Lecture Management**: Add, edit, and organize course lectures
- **Content Upload**: Upload videos and images with automatic optimization
- **Analytics Dashboard**: Monitor course performance and student enrollment
- **Course Controls**: Toggle course visibility and manage pricing

### Technical Features
- **Authentication & Authorization**: JWT-based secure authentication system
- **State Management**: Redux Toolkit with RTK Query for efficient data fetching
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Theme Support**: Dynamic dark/light mode switching
- **Protected Routes**: Role-based route protection and authentication guards
- **Real-time Updates**: Instant UI updates with optimistic responses
- **Error Handling**: Comprehensive error handling and user feedback

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite for lightning-fast development
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: TailwindCSS with custom configurations
- **UI Components**: Radix UI primitives and ShadCN UI
- **Routing**: React Router v6 with protected routes
- **Rich Text**: React Quill for course descriptions
- **Video Player**: React Player for lecture streaming
- **Icons**: Lucide React icon library
- **HTTP Client**: Axios with interceptors

### Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) and bcrypt
- **Payment Processing**: Stripe API with webhook integration
- **File Upload**: Multer for multipart form handling
- **Cloud Storage**: Cloudinary for media management
- **Security**: Cookie-parser, CORS configuration

### DevOps & Tools
- **Development**: Nodemon for auto-reloading
- **Environment Management**: dotenv for configuration
- **Deployment**: Vercel (Frontend) and Render (Backend)
- **Version Control**: Git

---

## 🏗️ Architecture

### Project Structure

```
LMS/
├── client/                      # Frontend application
│   ├── src/
│   │   ├── app/                 # Redux store configuration
│   │   ├── assets/              # Static assets
│   │   ├── components/          # Reusable React components
│   │   ├── features/            # Redux slices and API endpoints
│   │   ├── layout/              # Layout components
│   │   ├── lib/                 # Utility functions
│   │   └── pages/               # Page components
│   │       ├── admin/           # Instructor dashboard pages
│   │       └── student/         # Student-facing pages
│   └── public/                  # Public assets
│
└── server/                      # Backend application
    ├── controllers/             # Request handlers
    ├── database/                # Database connection
    ├── middlewares/             # Custom middleware
    ├── models/                  # Mongoose schemas
    ├── routes/                  # API route definitions
    ├── uploads/                 # Temporary file storage
    └── utils/                   # Helper functions
```

### API Architecture

The backend follows a RESTful API design with the following main endpoints:

- **`/api/v1/user`**: User authentication and profile management
- **`/api/v1/course`**: Course CRUD operations and search
- **`/api/v1/media`**: Media upload to Cloudinary
- **`/api/v1/purchase`**: Payment processing and webhooks
- **`/api/v1/progress`**: Course progress tracking

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **Stripe Account** for payment processing
- **Cloudinary Account** for media storage
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adityashriwas/e-learning.git
   cd LMS-main
   ```

2. **Install Server Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

#### Development Mode

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:8080`

2. **Start the Frontend Application** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   The client will start on `http://localhost:5173`

#### Production Build

```bash
# Build the client
cd client
npm run build

# Start the server (serves both API and static files)
cd ../server
npm start
```

---

## ⚙️ Environment Configuration

### Server Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Client Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:8080
```

### Stripe Webhook Setup (Local Development)

To test payment webhooks locally, use the Stripe CLI:

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhook events to your local server
stripe listen --forward-to localhost:8080/api/v1/purchase/webhook
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/user/register` | Register a new user |
| POST | `/api/v1/user/login` | User login |
| GET | `/api/v1/user/logout` | User logout |
| GET | `/api/v1/user/profile` | Get user profile |
| PUT | `/api/v1/user/profile/update` | Update user profile |

### Course Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/course` | Create a new course |
| GET | `/api/v1/course` | Get all published courses |
| GET | `/api/v1/course/search` | Search courses with filters |
| GET | `/api/v1/course/:id` | Get course by ID |
| PUT | `/api/v1/course/:id` | Update course |
| DELETE | `/api/v1/course/:id` | Delete course |
| PATCH | `/api/v1/course/:id/publish` | Toggle course publish status |

### Lecture Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/course/:id/lecture` | Create lecture |
| GET | `/api/v1/course/:id/lecture` | Get all lectures |
| PUT | `/api/v1/course/:courseId/lecture/:lectureId` | Update lecture |
| DELETE | `/api/v1/course/:courseId/lecture/:lectureId` | Delete lecture |

### Purchase Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/purchase/checkout/create-checkout-session` | Create Stripe checkout |
| POST | `/api/v1/purchase/webhook` | Stripe webhook handler |
| GET | `/api/v1/purchase/course/:id/detail-with-status` | Get course with purchase status |
| GET | `/api/v1/purchase` | Get all purchased courses |

### Progress Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/progress/:courseId` | Get course progress |
| POST | `/api/v1/progress/:courseId/lecture/:lectureId` | Update lecture progress |
| POST | `/api/v1/progress/:courseId/complete` | Mark course as complete |
| POST | `/api/v1/progress/:courseId/incomplete` | Mark course as incomplete |

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Backend Deployment (Render/Railway/Heroku)

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables
4. Configure build and start commands:
   - Build: `npm install`
   - Start: `npm start`


---

## 🤝 Contributing

We welcome contributions to improve this LMS platform! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and structure
- Write meaningful commit messages
- Test your changes thoroughly before submitting
- Update documentation as needed
- For major changes, open an issue first to discuss your proposal

---

## 👤 Author

**Aditya Shriwas**
- GitHub: [@adityashriwas](https://github.com/adityashriwas)
- Live Demo: [E-Learning Platform](https://e-learning-five-kappa.vercel.app/)



