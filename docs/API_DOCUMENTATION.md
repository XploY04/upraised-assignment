# IMF Gadget API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### System

#### GET /

Get API information

- **Access**: Public
- **Response**: API welcome message and endpoints

#### GET /health

Health check endpoint

- **Access**: Public
- **Response**: API status and environment info

---

### Authentication

#### POST /api/auth/register

Register a new IMF agent

- **Access**: Public
- **Body**:
  ```json
  {
    "email": "agent@imf.gov",
    "password": "password123",
    "role": "agent" // optional, defaults to "agent"
  }
  ```
- **Response**: User object and JWT token

#### POST /api/auth/login

Login an existing agent

- **Access**: Public
- **Body**:
  ```json
  {
    "email": "agent@imf.gov",
    "password": "password123"
  }
  ```
- **Response**: User object and JWT token

#### GET /api/auth/profile

Get current agent profile

- **Access**: Private (requires token)
- **Response**: Current user information

---

### Gadgets

#### GET /api/gadgets

Get all gadgets with optional status filter

- **Access**: Private
- **Query Parameters**:
  - `status` (optional): Filter by status (Available, Deployed, Destroyed, Decommissioned)
- **Response**: Array of gadgets with mission success probabilities

#### GET /api/gadgets/:id

Get a specific gadget by ID

- **Access**: Private
- **Response**: Single gadget object with mission success probability

#### POST /api/gadgets

Create a new gadget (Admin only)

- **Access**: Admin only
- **Body**:
  ```json
  {
    "name": "Quantum Encryption Device",
    "description": "Advanced encryption technology" // optional
  }
  ```
- **Response**: Created gadget with auto-generated codename and success probability

#### PATCH /api/gadgets/:id

Update an existing gadget (Admin only)

- **Access**: Admin only
- **Body**:
  ```json
  {
    "name": "Updated Name", // optional
    "description": "Updated description", // optional
    "status": "Deployed" // optional: Available, Deployed, Destroyed, Decommissioned
  }
  ```
- **Response**: Updated gadget object

#### DELETE /api/gadgets/:id

Decommission a gadget (soft delete, Admin only)

- **Access**: Admin only
- **Response**: Decommissioned gadget with timestamp

#### POST /api/gadgets/:id/self-destruct

Trigger self-destruct sequence

- **Access**: Private (any authenticated user)
- **Step 1** - Generate confirmation code:
  - **Body**: Empty
  - **Response**: Confirmation code
- **Step 2** - Confirm destruction:
  - **Body**:
    ```json
    {
      "confirmationCode": "ABCD-1234"
    }
    ```
  - **Response**: Destroyed gadget confirmation

---

## Response Format

### Success Response

```json
{
  "message": "Operation successful",
  "data": {
    /* response data */
  },
  "count": 5 // for array responses
}
```

### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    /* additional error info */
  }
}
```

---

## Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **429**: Too Many Requests
- **500**: Internal Server Error

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Scope**: All `/api/*` endpoints
- **Headers**: Rate limit info included in response headers

---

## Example Workflow

1. **Register/Login** to get JWT token
2. **Get all gadgets** to see available equipment
3. **Create new gadget** (admin only) with auto-generated codename
4. **Self-destruct gadget** when mission is compromised:
   - Step 1: Get confirmation code
   - Step 2: Confirm with code to destroy gadget

---

## Sample Gadget Object

```json
{
  "id": "uuid-here",
  "name": "Facial Recognition Scanner",
  "codename": "The Stealth Phantom Protocol",
  "status": "Available",
  "description": "Advanced biometric scanner with quantum encryption",
  "missionSuccessProbability": 87,
  "probabilityText": "The Stealth Phantom Protocol - 87% success probability",
  "createdAt": "2025-01-14T10:30:00.000Z",
  "updatedAt": "2025-01-14T10:30:00.000Z",
  "decommissionedAt": null,
  "selfDestructAt": null
}
```
