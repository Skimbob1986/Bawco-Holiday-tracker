# Quick Start Guide - Holiday Tracker

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

### 2. Setup Database
```bash
cd backend
npx prisma migrate dev
cd ..
```

### 3. Run in Development Mode

**Option A: Run both frontend and backend together**
```bash
npm run dev
```

**Option B: Run them separately in different terminals**

Terminal 1 (Frontend):
```bash
npm run dev --prefix frontend
```

Terminal 2 (Backend):
```bash
npm run dev --prefix backend
```

Access the app at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 4. Create Your First Holiday

1. Open http://localhost:3000
2. Click "Register" to create a new account
3. Enter your email and password
4. Click "+ Add Holiday" button
5. Fill in the holiday details:
   - Holiday name (e.g., "Summer Vacation")
   - Start date
   - End date
   - Description (optional)
6. Click "Save"

## 🏗️ Build for Production

```bash
npm run build
```

This will create:
- `frontend/build/` - Optimized React build
- `backend/dist/` - Compiled TypeScript backend

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

This starts both services:
- Frontend at http://localhost:3000
- Backend at http://localhost:5000

## 📝 Available Scripts

> Note about Prisma v7

Prisma v7 uses a runtime engine that may require an adapter for certain datasources such as SQLite.
If you are using the bundled Prisma client and SQLite locally, install the better-sqlite3 adapter before
generating the client:

```bash
cd backend
npm install @prisma/adapter-better-sqlite3
npx prisma generate
```

This repository already includes a small `prisma-client.ts` helper that configures the adapter when
running the server. If you change the Prisma version or the datasource, regenerate the client and
ensure the correct adapter is installed.


### Root Level
- `npm run dev` - Run both services in development mode
- `npm run build` - Build both frontend and backend

### Frontend
- `npm run dev --prefix frontend` - Start development server
- `npm run build --prefix frontend` - Create production build
- `npm start --prefix frontend` - Serve production build

### Backend
- `npm run dev --prefix backend` - Start development server with hot reload
- `npm run build --prefix backend` - Compile TypeScript
- `npm start --prefix backend` - Run production server
- `npm test --prefix backend` - Run tests

## 🔐 Authentication

The app uses JWT tokens stored in localStorage. Authentication is handled automatically via axios interceptors.

### Register
```
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### Login
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

## 📋 Features

✅ User Registration & Login
✅ Create/Edit/Delete Holidays
✅ Holiday Duration Calculation
✅ User-Specific Data Isolation
✅ Responsive Design
✅ Error Handling
✅ Loading States
✅ JWT Authentication
✅ Secure Password Storage

## 🧪 Testing

```bash
npm test --prefix backend
```

## 📚 Database Schema

The app uses SQLite with the following models:

**User**
- id (autoincrement)
- email (unique)
- name
- password (hashed)

**Holiday**
- id (autoincrement)
- name
- startDate
- endDate
- description
- userId (foreign key)

## 🔒 Environment Variables

Create `.env` in the backend directory:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=your_secret_key_here
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Holidays (requires authentication)
- `GET /api/holidays` - Get all holidays
- `GET /api/holidays/:id` - Get single holiday
- `POST /api/holidays` - Create holiday
- `PUT /api/holidays/:id` - Update holiday
- `DELETE /api/holidays/:id` - Delete holiday

## 🐛 Troubleshooting

### Database migration fails
```bash
cd backend
rm -rf prisma/dev.db
npx prisma migrate dev
```

### Port already in use
Change PORT in `.env` file (backend) or set REACT_APP_PORT for frontend

### Connection refused error
Make sure backend is running on port 5000 before starting frontend

## 🎨 Customization

- Modify `frontend/src/App.css` for styling
- Update `backend/prisma/schema.prisma` for database changes
- Add new API routes in `backend/src/*-routes.ts`

## 📞 Support

For issues or questions, check the README.md for comprehensive documentation.
