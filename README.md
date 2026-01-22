# Antigravity - Real-Time Project Management Tool

Antigravity is a professional, high-performance project management application similar to Trello or Jira Lite. It enables teams to collaborate in real-time with a stunning glassmorphic UI, smooth Kanban drag-and-drop, and instant updates via Socket.io.

## 🚀 Features

- **Real-Time Collaboration**: Instant updates for task creation, movement, and status changes.
- **Kanban Board**: Highly interactive drag-and-drop interface for managing tasks.
- **Role-Based Access**: Specialized permissions for Owners, Admins, and Members.
- **Workspace Management**: Organize projects into team-specific workspaces.
- **Activity Logs**: Track every action taken within a board or workspace.
- **Premium UI/UX**: Modern dark mode design with animations and responsive layout.
- **Full Stack Security**: JWT-based authentication with secure cookie storage.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Zustand, Socket.io-Client, @hello-pangea/dnd.
- **Backend**: Node.js, Express, Socket.io, MongoDB, Mongoose, JWT, Bcrypt.
- **Tools**: Axios, Lucide React, Date-fns, React Hook Form, Zod.

## 📦 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (Running locally or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd real-time-project-management-tool
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   # Create a .env file based on the provided configuration
   npm start
   ```

3. **Setup Client**
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Environment Variables

**Server (.env)**
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## 🏗️ Folder Structure

- `/server`: Express backend, Mongoose models, and Socket.io logic.
- `/client`: React frontend, Zustand stores, and Tailwind styles.

## 🎨 UI Preview

- **Glassmorphic Kanban Board**: Dynamic lists with draggable cards.
- **Animated Dashboards**: Real-time stats and navigation.
- **Responsive Design**: Works seamlessly on mobile and desktop.

---
Built with ❤️ by Antigravity AI
