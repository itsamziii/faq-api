# FAQ API

Simple FAQ management API built with Node.js, Express, MongoDB, and Redis.

## Prerequisites

- Node.js 22+
- MongoDB
- Redis
- Docker & Docker Compose (for containerized setup)

## Local Development

1. Clone repository:
```bash
git clone https://github.com/yourusername/faq-api.git
cd faq-api
```

2. Install dependencies
```bash
pnpm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start development server:
```bash
pnpm dev
```

## Docker Deployment

1. Build and start containers
```bash
docker-compose --env-file .env up -d
```

2. Stop containers:
```bash
docker-compose down
```

## Environment Variables
Create `.env` with:
```bash
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/faqs
REDIS_URI=redis://localhost:6379
JWT_SECRET=your_secure_secret
```

## Testing
Run tests:
```bash
pnpm test
```