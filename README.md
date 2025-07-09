# ConnectAPI - AI-Powered API Discovery Platform

<div align="center">

![ConnectAPI Logo](https://img.shields.io/badge/ConnectAPI-AI%20Powered%20API%20Discovery-blue?style=for-the-badge&logo=api)

[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.11.0-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0.12-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-yellow?style=flat-square&logo=vite)](https://vitejs.dev/)

</div>

## 🚀 Overview

ConnectAPI is a modern, AI-powered API discovery platform that helps developers find, explore, and integrate APIs efficiently. Built with cutting-edge technologies, it provides an intuitive interface for both API providers (admins) and API consumers (users).

### ✨ Key Features

- **🔍 AI-Powered Search**: Semantic search using Google Gemini embeddings for context-aware API discovery
- **👥 Dual User System**: Separate interfaces for API providers (admins) and API consumers (users)
- **📊 Analytics & Tracking**: Comprehensive interaction tracking and usage analytics
- **⭐ Bookmark System**: Save and organize favorite APIs with custom notes and tags
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS and smooth animations
- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## 🏗️ Architecture

### Tech Stack

#### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication
- **JWT Decode** - Token management

#### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Google Gemini AI** - AI-powered embeddings and search
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

### Project Structure

```
api-search-platform/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Authentication & logging
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic (AI, embeddings)
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React application
│   ├── src/
│   │   ├── Admincomponents/ # Admin-specific components
│   │   ├── UserComponents/  # User-specific components
│   │   ├── api/            # API client configuration
│   │   ├── layout/         # Layout components
│   │   ├── pages/          # Page components
│   │   ├── userPages/      # User dashboard pages
│   │   └── App.tsx         # Main application component
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **Google Gemini API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd api-search-platform
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create `.env` files in both backend and frontend directories:

   **Backend (.env)**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/connectapi
   JWT_SECRET=your-super-secret-jwt-key
   GEMINI_API_KEY=your-google-gemini-api-key
   ```

   **Frontend (.env)**
   ```env
   VITE_API_BASE_URL=http://localhost:5000/app
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The API server will start on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The React app will start on `http://localhost:5173`

3. **Access the application**
   - Open `http://localhost:5173` in your browser
   - The landing page will guide you to sign up or log in

## 👥 User Roles & Features

### 🔐 Authentication System

The platform supports two distinct user types with different capabilities:

#### 👤 Regular Users (API Consumers)
- **Registration/Login**: Create account or sign in
- **AI-Powered Search**: Search APIs using natural language
- **API Discovery**: Browse and explore available APIs
- **Bookmarking**: Save favorite APIs with notes and tags
- **Interaction History**: Track API usage and interactions


#### 👨‍💼 Admin Users (API Providers)
- **Admin Registration/Login**: Separate admin authentication
- **API Management**: Create, update, and delete API listings
- **Dashboard**: Overview of listed APIs and analytics


### 🔍 AI-Powered Search Features

- **Semantic Search**: Uses Google Gemini embeddings for context-aware search
- **Cosine Similarity**: Advanced similarity scoring for relevant results
- **Threshold Filtering**: Only returns results above similarity threshold
- **Exact Match Fallback**: Direct keyword matching for precise searches



<div align="center">


</div> 