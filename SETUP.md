# Keycloak POC Setup Guide

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start all services:
```bash
docker compose up --build -d
```

3. Configure Keycloak (first-time setup):
   - Access Keycloak admin console: http://localhost:8080
   - Login with admin/admin123
   - Create a new realm called "myrealm"
   - Create a new client:
     - Client ID: nextjs-client
     - Client authentication: OFF (public client)
     - Valid redirect URIs: http://localhost:3000/*
     - Web origins: http://localhost:3000

4. Access the application:
   - Open http://localhost:3000
   - Click "Sign Up" to create a new user
   - Login with the created user

## Useful Commands

```bash
docker compose up -d         # Start services
docker compose down          # Stop services
docker compose logs -f       # View logs
docker compose ps            # Check status
```

## Services

- **Next.js**: http://localhost:3000
- **Keycloak**: http://localhost:8080
- **PostgreSQL**: localhost:5432

## Default Credentials

- Keycloak Admin: admin / admin123
- PostgreSQL: keycloak / keycloak123
