# Deployment Configuration

## Railway

This app is ready to deploy on Railway. Just connect your GitHub repository and set the following environment variables:

### Environment Variables

```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
PORT=3000
NODE_ENV=production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Build and Start Commands

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

## Render

For Render deployment:

1. Connect your GitHub repository
2. Set the build command: `npm run build:production`
3. Set the start command: `npm start`
4. Add a PostgreSQL database service
5. Set environment variables

**Note**: The project includes a `start.js` script that handles path resolution for deployment environments.

**Alternative build command if needed**: `npm install && npm run db:generate && npm run build && npm run db:migrate`

**Troubleshooting**: If you encounter Prisma generation issues on Windows during local development, you can use `npm run build:safe` or run `tsc` directly after the Prisma client has been generated once.

## Heroku

For Heroku deployment:

```bash
# Install Heroku CLI and login
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main

# Run migrations
heroku run npm run db:migrate
heroku run npm run db:seed
```

## Vercel (Serverless)

Note: This API is designed for traditional server deployment. For Vercel, you would need to adapt it to serverless functions.

## Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Health Check Endpoint

All deployment platforms can use `/health` for health monitoring.
