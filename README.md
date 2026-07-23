# Authentication API

A secure Node.js authentication backend built with Express, MongoDB, JWT, and email-based OTP verification. This project provides user registration, login, session management, token refresh, logout, and email verification endpoints.

## Features

- User registration with duplicate check
- Email verification using OTP
- Login with JWT access and refresh tokens
- Refresh token rotation
- Logout and logout from all sessions
- Cookie-based refresh token handling
- MongoDB persistence with Mongoose
- SMTP email sending via Nodemailer

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Token (JWT)
- Cookie Parser
- Nodemailer
- dotenv

## Project Structure


src/
  app.js
  controllers/
  models/
  routes/
  services/
  config/
  utils/
server.js
package.json


## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- MongoDB database connection available
- A Gmail account or SMTP provider configured for email sending

## Installation

1. Clone the repository
2. Install dependencies:

git bash
npm install
```

3. Create a `.env` file in the project root and add the following variables:

in the .env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER=your_email_address
```

## Running the Server

Start the development server:

git bash
npm run dev
```

The server will run on:


## API Endpoints

### Auth Routes

Base URL: `/api/auth`

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| POST   | `/api/auth/register`      | Register a new user            |
| POST   | `/api/auth/login`         | Log in a user                  |
| GET    | `/api/auth/get-me`        | Get current authenticated user |
| GET    | `/api/auth/refresh-token` | Generate a new access token    |
| GET    | `/api/auth/logout`        | Logout the current session     |
| GET    | `/api/auth/logout-all`    | Logout all sessions            |
| GET    | `/api/auth/verify-email`  | Verify email using OTP         |

## Example Requests

### Register


curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "secret123"
  }'


### Login


curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secret123"
  }'


## Notes

- Passwords are hashed before storage.
- Refresh tokens are stored in hashed form for security.
- Email verification is required before login.
- The app uses cookies for refresh token storage.

## License

This project is licensed under the ISC License.
