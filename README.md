# Node.js Express TypeScript Boilerplate

A production-ready Node.js boilerplate with TypeScript, Express, and modern development tools.

## Features

- **TypeScript** - Write better code with static typing
- **Express** - Fast, unopinionated web framework
- **Modern JavaScript** - ES2022 features through TypeScript
- **Dependency Injection** - Using TypeDI for better code organization
- **Storage Abstraction** - Flexible file storage with local and S3 support
- **API Documentation** - OpenAPI/Swagger specification
- **Security** - Helmet middleware for security headers
- **Validation** - Request validation using celebrate/Joi
- **Error Handling** - Centralized error handling
- **Logging** - Using Winston for better debugging
- **Authentication** - JWT-based authentication
- **Development Tools**
  - ESLint for code linting
  - Prettier for code formatting
  - Husky for Git hooks
  - Jest for testing
  - Nodemon for development

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd nodejs-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Storage
STORAGE_PROVIDER=local  # or 's3'
STORAGE_LOCAL_ROOT=storage

# AWS S3 (if using S3 storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET=your_bucket

# JWT
JWT_SECRET=your_jwt_secret

# Logging
LOG_LEVEL=debug
```

## API Routes

### File Upload

```bash
# Upload a file
curl -X POST -F "file=@test.txt" http://localhost:3000/api/files/upload

# Download a file
curl http://localhost:3000/api/files/filename.txt

# Delete a file
curl -X DELETE http://localhost:3000/api/files/filename.txt
```

## Project Structure

```
src/
├── api/              # API routes and controllers
├── config/           # Configuration
├── interfaces/       # TypeScript interfaces
├── loaders/         # Application loaders
├── middlewares/     # Express middlewares
├── models/          # Data models
├── services/        # Business logic
│   └── storage/     # Storage providers
└── types/           # Type definitions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Running Tests

To run the tests for this project, follow these steps:

1. Ensure all dependencies are installed by running:
   ```bash
   npm install
   ```

2. Run the tests using Jest:
   ```bash
   npm test
   ```

This will execute all test suites and provide a summary of the results.

## Storage Providers

The application supports multiple storage providers through a clean abstraction:

### Local Storage
Files are stored in the local filesystem. Configure with:
```env
STORAGE_PROVIDER=local
STORAGE_LOCAL_ROOT=storage
```

### S3 Storage
Files are stored in AWS S3. Configure with:
```env
STORAGE_PROVIDER=s3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region
AWS_BUCKET=your_bucket
```

## Adding New Storage Providers

1. Create a new provider in `src/services/storage/providers/`
2. Implement the `IStorageProvider` interface
3. Update the `StorageService` to use the new provider


## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License.
