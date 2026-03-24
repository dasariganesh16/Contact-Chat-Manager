# Contact Chat Manager

A full-stack contact and chat system with a Spring Boot backend, a React (Vite) frontend, and MySQL. It is designed to feel like a mobile contacts app, with separate contact detail views and actions like favorite, block, and delete.

## What This Project Includes

- Spring Boot REST APIs for auth, contacts, and chat messages
- JWT authentication with protected endpoints
- React UI with mobile-style navigation
- MySQL persistence via Spring Data JPA
- Docker setup for local development

## Architecture

- Frontend: React (Vite)
- Backend: Spring Boot (REST + WebSocket config)
- Database: MySQL

The frontend talks to the backend over HTTP. The backend reads and writes MySQL data using JPA repositories.

## Key Modules

### 1) Auth and Accounts

Purpose: Register and log in users, return JWT tokens.

- Registration requires name, email, password, and mobile number.
- Login uses email and password.
- `userId` is the mobile number everywhere in the UI and APIs.
- <img width="1288" height="796" alt="image" src="https://github.com/user-attachments/assets/6f2a3cf9-9238-447f-9b42-f710af979498" />

- <img width="1481" height="752" alt="image" src="https://github.com/user-attachments/assets/e78509b5-78d4-4c77-bb47-1f9d2101e1a9" />


Endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`

Typical responses include:
- `token`
- `userId` (mobile number)
- `name`, `email`, `phone`, `role`
  

### 2) User Profile

Purpose: Fetch or update a user by mobile number.

Endpoints:
- `GET /api/user/profile/{mobile}`
- `PUT /api/user/update/{mobile}`

### 3) Contacts

Purpose: Store a user?s contact list and contact preferences.

Features:
- Add contact
- List contacts
- Search by name
- Update favorite or blocked status
- Delete contact
- <img width="1363" height="882" alt="image" src="https://github.com/user-attachments/assets/9269ad77-b24a-4a63-8c45-fc051ae8279e" />

<img width="995" height="633" alt="image" src="https://github.com/user-attachments/assets/a1b67d93-5f68-4ad8-9f70-067112fca95e" />

Endpoints:
- `POST /contacts/add`
- `GET /contacts/list?userId={mobile}`
- `GET /contacts/search?name=...`
- `PUT /contacts/update`
- `DELETE /contacts/{id}`

Contact fields:
- `userId` (mobile number)
- `contactId` (mobile number)
- `nickname` (contact name shown in UI)
- `favorite` (true/false)
- `blocked` (true/false)

### 4) Chat Messages

Purpose: Send and retrieve chat messages between mobile numbers.

Endpoints:
- `POST /chat/send`
- `GET /chat/history?senderId={mobile}&receiverId={mobile}`
- `DELETE /chat/message/{id}`

Message fields:
- `senderId` (mobile number)
- `receiverId` (mobile number)
- `content`
- `status`
- <img width="1051" height="892" alt="image" src="https://github.com/user-attachments/assets/0e81c757-fc8a-4827-a37b-4067aba82ebb" />


### 5) WebSocket (Scaffold)

The backend includes WebSocket configuration for `/ws` and broker topics. This is a scaffold for real-time chat but is not yet wired to message delivery.

### 6) Security

- JWT filter protects all endpoints except `/api/auth/**`, `/health`, and `/ws/**`.
- Passwords are hashed using BCrypt.

## Frontend UI

The UI is built as a mobile-style experience:
- Contacts list screen with search
- Separate contact details screen
- Favorite, block, delete actions from the details view
- Chat screen per contact
- Login and Register as separate screens

## Project Structure

- `backend/` Spring Boot project
- `frontend/` Vite React app
- `docker-compose.yml` Local Docker setup

Key backend files:
- `backend/src/main/java/com/contactchatmanager/controller/AuthController.java`
- `backend/src/main/java/com/contactchatmanager/controller/ContactController.java`
- `backend/src/main/java/com/contactchatmanager/controller/MessageController.java`
- `backend/src/main/java/com/contactchatmanager/security/JwtService.java`
- `backend/src/main/resources/application.properties`

Key frontend files:
- `frontend/src/App.jsx`
- `frontend/src/services/api.js`
- `frontend/src/styles.css`

## Local Setup

### Backend

```powershell
cd "D:\Contact Chat Manager\backend"
mvn -DskipTests package
mvn spring-boot:run
```

Health check:
```text
GET http://localhost:8080/health
```

### Frontend

```powershell
cd "D:\Contact Chat Manager\frontend"
npm install
npm run dev
```

Default frontend URL:
```text
http://localhost:5173
```

## Environment Variables

Backend defaults can be overridden with:
- `MYSQL_URL`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`

Frontend build-time variable:
- `VITE_API_BASE` (backend base URL)

## Docker

```powershell
cd "D:\Contact Chat Manager"
docker compose up --build
```

Service URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- MySQL: `localhost:3306`

## Deployment Notes

- Use a hosted MySQL for production.
- Set `JWT_SECRET` to a secure value.
- Deploy backend and frontend separately if using platforms like Render and Vercel.

## Notes

- User IDs are mobile numbers.
- Contacts and chats use mobile numbers as identifiers.
- Contact details view is a separate screen from the contacts list.
