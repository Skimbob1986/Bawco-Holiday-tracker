# Holiday Tracker - Full Stack Application

A modern web application for tracking holidays and vacations with authentication and a responsive UI.

## Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Create, Read, Update, Delete Holidays
- ✅ Holiday duration calculation
- ✅ User-specific holiday management
- ✅ Responsive design
- ✅ Type-safe TypeScript implementation
- ✅ SQLite database with Prisma ORM
- ✅ Comprehensive API with CRUD endpoints
- ✅ Unit tests for backend
- ✅ Docker support

## Tech Stack

### Frontend
- React 18
- TypeScript
- Axios for API calls
- CSS3 with responsive design

### Backend
- Node.js/Express
- TypeScript
- Prisma ORM
- SQLite database
- JWT authentication
- bcryptjs for password hashing

## Project Structure

```
.
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── api.ts         # API integration
│   │   ├── App.tsx        # Main app component
│   │   └── index.css      # Global styles
│   └── public/
├── backend/               # Express backend server
│   ├── src/
│   │   ├── auth-routes.ts # Authentication endpoints
│   │   ├── holiday-routes.ts # Holiday CRUD endpoints
│   │   ├── auth.ts        # JWT utilities
│   │   ├── password.ts    # Password hashing utilities
│   │   ├── middleware.ts  # Authentication middleware
│   │   └── index.ts       # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── migrations/    # Database migrations
│   └── jest.config.js     # Test configuration
├── docker-compose.yml     # Docker Compose configuration
└── Dockerfile             # Backend Docker image

```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- (Optional) Docker & Docker Compose

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   npm install --prefix frontend
   npm install --prefix backend
   ```

2. **Setup database:**
   ```bash
   cd backend
   npx prisma migrate dev
   cd ..
   ```

### Development

> Prisma v7 note

If you use the bundled Prisma client (v7) with SQLite locally, install the SQLite adapter before generating
the client to satisfy the runtime engine requirements:

```bash
cd backend
npm install @prisma/adapter-better-sqlite3
npx prisma generate
```

This repository includes `backend/src/prisma-client.ts` which configures the adapter for local runs.


**Run in development mode (both frontend and backend):**
```bash
npm run dev
```

**Run services separately:**

Frontend:
```bash
npm run dev --prefix frontend
```

Backend:
```bash
npm run dev --prefix backend
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

### Build

**Build both frontend and backend:**
```bash
npm run build
```

**Production start:**
```bash
npm start --prefix backend
serve -s frontend/build
```

### Testing

**Run backend tests:**
```bash
npm test --prefix backend
```

## API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response: 201 Created
{
  "token": "jwt_token",
  "user": { "id": 1, "email": "user@example.com", "name": "John Doe" }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "jwt_token",
  "user": { "id": 1, "email": "user@example.com", "name": "John Doe" }
}
```

### Holiday Endpoints

All endpoints require authorization header: `Authorization: Bearer <token>`

#### Get All Holidays
```
GET /api/holidays

Response: 200 OK
[
  {
    "id": 1,
    "name": "Summer Vacation",
    "startDate": "2024-07-01T00:00:00Z",
    "endDate": "2024-07-15T00:00:00Z",
    "description": "Week at the beach",
    "userId": 1
  }
]
```

#### Get Single Holiday
```
GET /api/holidays/:id

Response: 200 OK
{ "id": 1, "name": "Summer Vacation", ... }
```

#### Create Holiday
```
POST /api/holidays
Content-Type: application/json

{
  "name": "Summer Vacation",
  "startDate": "2024-07-01T00:00:00Z",
  "endDate": "2024-07-15T00:00:00Z",
  "description": "Week at the beach"
}

Response: 201 Created
{ "id": 1, "name": "Summer Vacation", ... }
```

#### Update Holiday
```
PUT /api/holidays/:id
Content-Type: application/json

{
  "name": "Updated Vacation",
  "startDate": "2024-07-01T00:00:00Z",
  "endDate": "2024-07-20T00:00:00Z"
}

Response: 200 OK
{ "id": 1, "name": "Updated Vacation", ... }
```

#### Delete Holiday
```
DELETE /api/holidays/:id

Response: 200 OK
{ "message": "Holiday deleted" }
```

## Docker Deployment

### Using Docker Compose

```bash
docker-compose up --build
```

This will start both frontend and backend services.

### Manual Docker Build

```bash
# Build the image
docker build -t holiday-tracker .

# Run the container
docker run -p 5000:5000 -e JWT_SECRET=your_secret holiday-tracker
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your_jwt_secret_key_development
```

## Database Schema

### User Model
```prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  password String
  holidays Holiday[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Holiday Model
```prisma
model Holiday {
  id    Int     @id @default(autoincrement())
  name  String
  startDate DateTime
  endDate DateTime
  description String?
  userId Int
  user  User @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

## Features Implemented

- ✅ User authentication with JWT tokens
- ✅ Secure password hashing with bcryptjs
- ✅ Full CRUD operations for holidays
- ✅ User-specific holiday isolation
- ✅ Input validation and error handling
- ✅ Responsive UI with modern design
- ✅ Loading and error states
- ✅ Holiday duration calculation
- ✅ Unit tests for authentication and password utilities
- ✅ Docker containerization
- ✅ Type-safe implementation with TypeScript

## Future Enhancements

- [ ] Email notifications for upcoming holidays
- [ ] Holiday sharing between users
- [ ] Calendar view
- [ ] Holiday templates
- [ ] Mobile app
- [ ] Advanced filtering and sorting
- [ ] Holiday statistics and reports
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@holidaytracker.com or open an issue on GitHub.