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
## ScreenShots

## Register Page

<img width="1919" height="1029" alt="register" src="https://github.com/user-attachments/assets/74be1572-332a-4113-955e-c25025892f88" />

## Sign-In-Page

<img width="1919" height="1029" alt="sign in" src="https://github.com/user-attachments/assets/a5ca0ba4-a887-4c94-a3f1-709c6a59f494" />

## DashBoard

<img width="1919" height="1031" alt="dashboard" src="https://github.com/user-attachments/assets/fb352747-aec6-41fb-bfe6-a73a0fad4e7f" />

## MyBoard Page

<img width="1919" height="1030" alt="my board" src="https://github.com/user-attachments/assets/68664b07-d584-40b5-ba7d-fa8ad0b0f3b4" />

## New WorkPlace Page

<img width="1919" height="1032" alt="new worlspace" src="https://github.com/user-attachments/assets/796e54fc-4793-4ec8-9aaf-1a1f8c56e1af" />

## Add Cards

<img width="1919" height="1030" alt="add card" src="https://github.com/user-attachments/assets/a6e2951e-db31-4606-bbe8-dac327bad99c" />

## Edit Cards

<img width="1919" height="1032" alt="card edit" src="https://github.com/user-attachments/assets/9e3ea567-2add-4825-8b48-c6e3d9d9522d" />

## Delete Card

<img width="1916" height="1031" alt="delete card" src="https://github.com/user-attachments/assets/1441ec29-c7cb-4c9a-887c-b3d78dbd586f" />

## Board Settings

<img width="1919" height="1031" alt="board settings" src="https://github.com/user-attachments/assets/9ff70c9f-8fff-40b5-be70-1a1dcc020899" />

## WorkSpace Boards

<img width="1919" height="1031" alt="workspace boards" src="https://github.com/user-attachments/assets/4f93fc76-1627-4901-b220-2b3ca239fde8" />

<img width="1919" height="1032" alt="work1" src="https://github.com/user-attachments/assets/036266da-99c4-409a-a514-80057149a4f2" />


## Notifications

<img width="1919" height="1033" alt="notifications1" src="https://github.com/user-attachments/assets/8ab893b2-0177-4ddd-b7d3-1e36c646b07a" />

## Settings

<img width="1919" height="1030" alt="settings" src="https://github.com/user-attachments/assets/05f922b8-4f4a-4e2a-80fe-091a1e18ad8a" />

<img width="1919" height="1030" alt="security" src="https://github.com/user-attachments/assets/79a8da8c-de5b-407e-a18d-fdce2fba12e4" />

<img width="1919" height="1031" alt="notifications" src="https://github.com/user-attachments/assets/3db7b739-5543-4a6e-9184-06cb000b21de" />

<img width="1919" height="1033" alt="appearance" src="https://github.com/user-attachments/assets/c1e61b0c-bf77-4b9d-bd8d-9049fe742607" />

## 🏗️ Folder Structure

- `/server`: Express backend, Mongoose models, and Socket.io logic.
- `/client`: React frontend, Zustand stores, and Tailwind styles.

## 🎨 UI Preview

- **Glassmorphic Kanban Board**: Dynamic lists with draggable cards.
- **Animated Dashboards**: Real-time stats and navigation.
- **Responsive Design**: Works seamlessly on mobile and desktop.

Built with Antigravity AI Tool
