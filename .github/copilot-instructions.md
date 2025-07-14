<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# IMF Gadget API - Copilot Instructions

This is an Express.js TypeScript API for managing IMF (Impossible Missions Force) gadgets with the following characteristics:

## Project Structure

- **Language**: TypeScript with Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt
- **Security**: Helmet, CORS, Rate Limiting

## Key Features

- **Gadget Management**: CRUD operations for mission gadgets
- **Random Codenames**: Using `unique-names-generator` package
- **Mission Success Probability**: Random percentage generation
- **Self-Destruct Sequence**: Secure gadget destruction with confirmation codes
- **Soft Delete**: Gadgets are decommissioned, not permanently deleted
- **Role-Based Access**: Admin and Agent roles

## Code Patterns to Follow

### API Response Format

Always return consistent JSON responses:

```typescript
{
  message: string,
  data?: any,
  error?: string,
  code?: string
}
```

### Error Handling

Use the centralized error handler and proper HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

### Authentication

- All gadget endpoints require authentication
- Admin-only endpoints: CREATE, UPDATE, DELETE gadgets
- Agent access: READ gadgets, SELF-DESTRUCT

### Database Operations

- Use Prisma Client for all database operations
- Always handle Prisma errors appropriately
- Use transactions for complex operations

### Security Best Practices

- Validate all inputs
- Use parameterized queries (Prisma handles this)
- Hash passwords with bcrypt
- Use JWT for stateless authentication
- Apply rate limiting to prevent abuse

### Gadget Codename Generation

Use the GadgetService for generating unique codenames with themes like:

- Spy/Secret Agent theme
- Mythological theme
- Tech/Sci-fi theme

### Mission Success Probability

Generate realistic probabilities between 45% and 98% for gadgets.

## Environment Variables

Always use environment variables for:

- Database connection strings
- JWT secrets
- Server configuration
- Rate limiting settings

## Testing

When suggesting tests, include:

- Unit tests for services
- Integration tests for endpoints
- Authentication tests
- Error scenario tests
