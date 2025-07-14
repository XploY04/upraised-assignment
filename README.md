# 🕶️ IMF Gadget API

> **Your mission, should you choose to accept it, is to manage the most advanced gadgets in the world.**

A secure Node.js API for managing Impossible Missions Force (IMF) gadgets, built with Express, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with role-based access control
- **Gadget Management**: Full CRUD operations for mission-critical gadgets
- **Random Codenames**: Auto-generated unique codenames using `unique-names-generator`
- **Mission Success Probability**: Each gadget gets a randomly calculated success rate
- **Self-Destruct Sequence**: Secure gadget destruction with confirmation codes
- **Soft Delete**: Gadgets are decommissioned, not permanently deleted
- **Rate Limiting**: API protection against abuse
- **Security Headers**: Helmet.js for enhanced security

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, CORS, Rate Limiting
- **Random Generation**: unique-names-generator

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database (local or hosted)
- npm or yarn

## ⚡ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd imf-gadget-api
npm install
```

### 2. Environment Setup

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/imf_gadgets"

# JWT
JWT_SECRET="your-super-secret-jwt-key-for-imf-mission-impossible"
JWT_EXPIRES_IN="24h"

# Server
PORT=3000
NODE_ENV="development"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Start the Server

```bash
# Development with auto-reload
npm run dev

# Production build and start
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## 🔐 Test Credentials

After seeding the database, you can use these credentials:

- **Admin**: `admin@imf.gov` / `admin123`
- **Agent**: `agent@imf.gov` / `agent123`

## 📚 API Endpoints

### Authentication

| Method | Endpoint             | Description        | Access  |
| ------ | -------------------- | ------------------ | ------- |
| POST   | `/api/auth/register` | Register new agent | Public  |
| POST   | `/api/auth/login`    | Login agent        | Public  |
| GET    | `/api/auth/profile`  | Get agent profile  | Private |

### Gadgets

| Method | Endpoint                         | Description            | Access     |
| ------ | -------------------------------- | ---------------------- | ---------- |
| GET    | `/api/gadgets`                   | Get all gadgets        | Private    |
| GET    | `/api/gadgets?status=Available`  | Filter by status       | Private    |
| GET    | `/api/gadgets/:id`               | Get specific gadget    | Private    |
| POST   | `/api/gadgets`                   | Create new gadget      | Admin only |
| PATCH  | `/api/gadgets/:id`               | Update gadget          | Admin only |
| DELETE | `/api/gadgets/:id`               | Decommission gadget    | Admin only |
| POST   | `/api/gadgets/:id/self-destruct` | Self-destruct sequence | Private    |

### System

| Method | Endpoint  | Description     | Access |
| ------ | --------- | --------------- | ------ |
| GET    | `/health` | Health check    | Public |
| GET    | `/`       | API information | Public |

## 🔧 Usage Examples

### Register a New Agent

```bash
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "ethan.hunt@imf.gov",
    "password": "missionimpossible",
    "role": "agent"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "admin@imf.gov",
    "password": "admin123"
  }'
```

### Create a New Gadget (Admin Only)

```bash
curl -X POST http://localhost:3000/api/gadgets \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{
    "name": "Quantum Encryption Device",
    "description": "Advanced encryption with quantum entanglement"
  }'
```

### Get All Gadgets

```bash
curl -X GET http://localhost:3000/api/gadgets \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Self-Destruct a Gadget

```bash
# Step 1: Initiate self-destruct (generates confirmation code)
curl -X POST http://localhost:3000/api/gadgets/GADGET_ID/self-destruct \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Step 2: Confirm with the code
curl -X POST http://localhost:3000/api/gadgets/GADGET_ID/self-destruct \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{"confirmationCode": "ABCD-1234"}'
```

## 🎯 Gadget Features

### Random Codenames

Each gadget automatically receives a unique codename like:

- "The Stealth Phantom Protocol"
- "The Quantum Neural Matrix"
- "The Titanium Shadow Strike"

### Mission Success Probability

Every gadget displays a realistic success probability:

```json
{
  "codename": "The Nightingale",
  "missionSuccessProbability": 87,
  "probabilityText": "The Nightingale - 87% success probability"
}
```

### Status Management

Gadgets can have the following statuses:

- **Available**: Ready for deployment
- **Deployed**: Currently in use
- **Destroyed**: Self-destructed or damaged
- **Decommissioned**: Retired from service

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin and Agent roles with different permissions
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: Helmet.js for various security headers
- **Input Validation**: Request validation and sanitization
- **Password Hashing**: bcrypt with salt rounds
- **CORS**: Configurable cross-origin resource sharing

## 📂 Project Structure

```
imf-gadget-api/
├── src/
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Authentication, error handling
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   └── app.ts             # Main application file
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts           # Database seeding
│   └── migrations/       # Database migrations
├── dist/                 # Compiled JavaScript
└── docs/                # API documentation
```

## 🚀 Deployment

### Heroku Deployment

1. Create a new Heroku app
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy:

```bash
git push heroku main
heroku run npm run db:migrate
heroku run npm run db:seed
```

### Railway Deployment

1. Connect your GitHub repository
2. Add PostgreSQL service
3. Set environment variables
4. Deploy automatically

### Render Deployment

1. Connect repository
2. Add PostgreSQL database
3. Configure build and start commands
4. Set environment variables

## 🧪 Testing

Test the API using the included Postman collection or create your own tests:

```bash
# Health check
curl http://localhost:3000/health

# API information
curl http://localhost:3000/
```

## 📊 Monitoring

The API includes built-in health monitoring:

```json
{
  "status": "operational",
  "message": "IMF Gadget API is running smoothly",
  "timestamp": "2025-01-14T10:30:00.000Z",
  "environment": "development"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## ⚠️ Disclaimer

This is a demonstration project for the IMF Gadget API challenge. In a real-world scenario, additional security measures, comprehensive testing, and production-grade infrastructure would be required.

---

**Mission Status**: ✅ **COMPLETE**

_This message will self-destruct in... just kidding! 😄_
