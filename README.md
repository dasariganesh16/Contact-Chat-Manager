# Contact Chat Manager

This project is a starter implementation based on the `skill.md` guide. It includes:

- Spring Boot backend with REST APIs and WebSocket support
- React frontend scaffold
- MySQL database and JWT-based authentication

## Backend

From `backend`:

```powershell
mvn -q -DskipTests package
mvn spring-boot:run
```

API health check: `GET http://localhost:8080/health`

### MySQL Configuration

The backend expects a MySQL server. Defaults can be overridden with env vars:

- `MYSQL_URL` (default `jdbc:mysql://localhost:3306/contactchatdb?...`)
- `MYSQL_USER` (default `root`)
- `MYSQL_PASSWORD` (default `root`)
- `JWT_SECRET` (default is a secure 32+ char string; override in production)
- `JWT_EXPIRATION_MS` (default `3600000` = 1 hour)

## Frontend

From `frontend`:

```powershell
npm install
npm run build
npm run dev
```

The dev server will print the local URL (usually `http://localhost:5173`).

## Docker

From the project root:

```powershell
docker compose up --build
```

Services:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- MySQL: `localhost:3306`

## Notes

- The backend includes demo endpoints for auth, contacts, and chat messaging.
- Auth now returns a real JWT; the frontend automatically attaches it.
- User IDs are mobile numbers; contacts and chat use mobile numbers instead of numeric IDs.
