# Dynamic API Builder

A Node.js + SQLite project that allows users to **create dynamic APIs** via a web interface. Users can define new endpoints, connect them to the database, and test them instantly.

## Features

- Dynamic API route creation (GET, POST, etc.)
- Database-backed routes using SQLite
- Static response routes
- Relation between **users** and **wallets**
- Optional web UI (React + Vite)
- CORS enabled for API testing
- API definitions stored in `db.json`

## Tech Stack

- **Backend:** Node.js, Express
- **Database:** SQLite (`sqlite` + `sqlite3`)
- **Frontend:** React + Vite (optional)
- **Other:** CORS, fs for API definitions

## Project Structure

```
api-builder/
├─ index.js        # Main server file
├─ data.db         # SQLite database
├─ db.json         # API definitions
├─ package.json
├─ api-builder-ui/ # Optional React UI
└─ README.md
```

## Setup

1. Clone the repository:

```bash
git clone https://github.com/kiwabc123/api-builder.git
cd api-builder


2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
node index.js
```

Server runs on `http://localhost:4000`

## API Endpoints

### Builder APIs

#### POST /_builder/create – Create a new API route

Request body:
```json
{
  "method": "POST",
  "path": "/users",
  "type": "database",
  "query": "INSERT INTO users (name) VALUES (?)"
}
```

#### GET /_builder/list – List all created APIs

### Sample APIs

#### Users

##### POST /users – Add a new user

Request body:
```json
{
  "name": "Kiw"
}
```

Example using curl:
```bash
curl -X POST "http://localhost:4000/users" \
     -H "Content-Type: application/json" \
     -d '{"name":"Kiw"}'
```

##### GET /users – List all users

```bash
curl "http://localhost:4000/users"
```

#### Wallets

##### POST /wallets – Add a wallet for a user

Request body:
```json
{
  "user_id": 1,
  "name": "Kiw Wallet"
}
```

Example using curl:
```bash
curl -X POST "http://localhost:4000/wallets" \
     -H "Content-Type: application/json" \
     -d '{"user_id":1,"name":"Kiw Wallet"}'
```

##### GET /wallets – List all wallets with related user name

```bash
curl "http://localhost:4000/wallets"
```

Example response:
```json
[
  {
    "id": 1,
    "name": "Kiw Wallet",
    "user_name": "Kiw"
  }
]
```

## Database Schema

### Users

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | Unique user ID |
| name | TEXT | User name |

### Wallets

| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | Unique wallet ID |
| user_id | INTEGER | Foreign key to users.id |
| name | TEXT | Wallet name |

> Note: `user_id` links wallet to user. Use JOIN queries for fetching related data.

## Notes

- Database: `data.db`
- API definitions: `db.json`
- Use curl, Postman, or the frontend UI to test APIs
- Backup `data.db` before modifying schema
- Dynamic routes allow creating new APIs without changing backend code