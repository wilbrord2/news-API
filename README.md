# News API

A RESTful API for managing and serving news articles, built with Node.js, Express, and PostgreSQL. Supports user authentication via JWT and full CRUD operations on articles.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Technology Choices](#technology-choices)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [PostgreSQL](https://www.postgresql.org/) v14 or higher

---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/wilbrord2/news-API.git
   cd news-API
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up the database**

   Create a PostgreSQL database, then run the migration/seed scripts:

   ```bash
   npm run migrate
   npm run seed
   ```

4. **Configure environment variables**

   Copy the example file and fill in the values (see [Environment Variables](#environment-variables)):

   ```bash
   cp .env.example .env
   ```

---

## Environment Variables

Create a `.env` file in the root of the project with the following keys:

| Variable        | Description                                               | Example                                      |
|-----------------|-----------------------------------------------------------|----------------------------------------------|
| `PORT`          | Port the server listens on                                | `3000`                                       |
| `DATABASE_URL`  | PostgreSQL connection string                              | `postgresql://user:your_password@localhost:5432/newsdb` |
| `JWT_SECRET`    | Secret key used to sign and verify JSON Web Tokens        | `your_super_secret_key`                      |
| `JWT_EXPIRES_IN`| Token expiry duration (optional, defaults to `7d`)        | `7d`                                         |
| `NODE_ENV`      | Application environment (`development`, `production`)     | `development`                                |

> **Never commit your `.env` file.** It is listed in `.gitignore` by default.

---

## Running the Project

### Development (with auto-reload)

```bash
npm run dev
```

### Production

```bash
npm start
```

### Running Tests

```bash
npm test
```

---

## API Endpoints

| Method | Endpoint              | Auth Required | Description                    |
|--------|-----------------------|---------------|--------------------------------|
| POST   | `/api/auth/register`  | No            | Register a new user            |
| POST   | `/api/auth/login`     | No            | Login and receive a JWT token  |
| GET    | `/api/articles`       | No            | Get all published articles     |
| GET    | `/api/articles/:id`   | No            | Get a single article by ID     |
| POST   | `/api/articles`       | Yes           | Create a new article           |
| PUT    | `/api/articles/:id`   | Yes           | Update an existing article     |
| DELETE | `/api/articles/:id`   | Yes           | Delete an article              |

Protected routes require an `Authorization: Bearer <token>` header.

---

## Technology Choices

| Technology     | Reason                                                                                         |
|----------------|-----------------------------------------------------------------------------------------------|
| **Node.js**    | Non-blocking, event-driven runtime ideal for building fast, scalable HTTP APIs.               |
| **Express**    | Minimal and flexible web framework with a large ecosystem and simple routing model.           |
| **PostgreSQL** | Robust, ACID-compliant relational database well-suited for structured article and user data.  |
| **JWT**        | Stateless authentication that scales well and avoids server-side session storage.             |
| **dotenv**     | Loads environment variables from a `.env` file, keeping secrets out of source code.          |
| **bcrypt**     | Industry-standard password hashing to securely store user credentials.                       |
