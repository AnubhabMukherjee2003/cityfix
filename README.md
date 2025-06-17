# CityFix - Community Issue Tracking Platform : Prototype version

A full-stack application for tracking and managing community issues with separate client and admin interfaces.

## Project Structure

```
cityfix/
├── server/          # Backend API (Node.js + Express + MongoDB)
├── client/          # User frontend (React)
└── admin/           # Admin frontend (React)
```
---
## Features

### Client Application
- **Home Page**: Welcome page with platform overview
- **Dashboard**: View all issues and report new ones
- **Issue Reporting**: Form to submit new issues with title, description, and location
- **Issue Viewing**: Display all issues with status indicators

### Admin Application
- **Admin Dashboard**: Complete issue management interface
- **Status Management**: Update issue status (New → In Progress → Resolved)
- **Status Filtering**: Filter issues by status with counts
- **Statistics Overview**: Quick stats on issue counts by status

### Server API
- **GET /api/issues**: Fetch all issues
- **GET /api/issues/:id**: Fetch specific issue
- **POST /api/issues**: Create new issue
- **PATCH /api/issues/:id**: Update issue status
---
## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Start the Server**
#### Environment Variables

Create a `.env` file in the server directory:
   ```
   MONGODB_CONNECTION_STRING=your_mongodb_connection_string
   PORT=5000
   ```
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Start the Client**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Start the Admin Panel**
   ```bash
   cd admin
   npm install
   npm run dev
   ```




## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/issues` | Get all issues |
| GET | `/api/issues/:id` | Get specific issue |
| POST | `/api/issues` | Create new issue |
| PATCH | `/api/issues/:id` | Update issue status |

## Issue Status Flow

1. **New** - Newly reported issues
2. **In Progress** - Issues being worked on
3. **Resolved** - Completed issues

## Technology Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React, Vite, Axios
- **Styling**: CSS3 with modern layouts
- **Database**: MongoDB Atlas

## Development

### Client Features
- Responsive design
- Modern UI with gradient backgrounds
- Form validation
- Real-time issue updates
- Status indicators with color coding

### Admin Features
- Comprehensive dashboard
- Real-time statistics
- Status filtering
- Bulk status management
- Responsive admin interface

### Server Features
- RESTful API design
- Error handling
- CORS enabled
- MongoDB integration
- Environment configuration

## No Authentication

Currently, the application runs without authentication for simplicity. Both client and admin interfaces are publicly accessible.