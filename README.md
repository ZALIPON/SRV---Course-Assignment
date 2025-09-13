# Noroff  
## Back-end Development – Year 1  
### **Server Deployment – Census API** <sup>Course Assignment</sup>

> _In this assignment we build a Census back-office API that lets an **Admin** capture participants, their home address and employment data.  
> The solution is **back-end only** – every endpoint is exercised through Postman._

---

## 1 Hosted app (Render)

<https://srv-course-assignment-ghn4.onrender.com>

---

## 2 Run locally

Fill out .env (will follow in the .txt file on moodle submission), place in ROOT dir.

```bash
HOST=
ADMIN_USERNAME=
ADMIN_PASSWORD=
DATABASE_NAME=
DIALECT=
DIALECTMODEL=
PORT=
DB_PORT=
```

### Installing and running

```bash
mkdir census-api
cd census-api
git clone https://github.com/ZALIPON/SRV---Course-Assignment.git
npm install
npm start
```

---

## 3 Endpoints

| Method & Path                      | Description                                                  | Auth      |
| ---------------------------------- | ------------------------------------------------------------ | --------- |
| `POST /populate`                   | One-shot seeding of admin user                               | —         |
| `POST /participants/add`           | Create participant + work + home (single transaction)        | **Basic** |
| `GET /participants`                | List all participants incl. work + home                      | **Basic** |
| `GET /participants/details`        | firstname + lastname + email of everyone                     | **Basic** |
| `GET /participants/details/:email` | firstname + lastname + dob                                   | **Basic** |
| `GET /participants/work/:email`    | Non-deleted work block                                       | **Basic** |
| `GET /participants/home/:email`    | Non-deleted home block                                       | **Basic** |
| `PUT /participants/:email`         | Update participant (same JSON as `/add`, single transaction) | **Basic** |
| `DELETE /participants/:email`      | Hard delete participant (FK **ON DELETE CASCADE**)           | **Basic** |

All error cases return JSend-style JSON, e.g.
```json
{
  "statusCode": 400,
  "errors": [
    { "field": "participant.email", "msg": "Invalid e-mail" }
  ]
}
```

---

## 4 JSON Payload
```json
{
  "participant": {
    "email":     "alice@example.com",
    "firstname": "Alice",
    "lastname":  "Smith",
    "dob":       "1990-05-17"
  },
  "work": {
    "companyname": "Innotech",
    "salary":      72000,
    "currency":    "USD"
  },
  "home": {
    "country": "Norway",
    "city":    "Oslo"
  }
}
```

Exactly the same structure is required for POST /add and PUT /:email.

---

## 5 Main libraries

| Package                               | Use                                  |
| ------------------------------------- | ------------------------------------ |
| `express`                             | Core HTTP framework                  |
| `sequelize` + `mysql2`                | ORM + MySQL 8 driver                 |
| `express-validator`                   | Body / param validation              |
| `crypto` (Node core)                  | PBKDF2 hashing + `timingSafeEqual`   |
| `dotenv`                              | Loads `.env`                         |
| `morgan`, `cookie-parser`             | Dev / cookie helpers                 |
| `express-session` & `connect-sqlite3` | Minimal session store (future-proof) |

### 5.1 Validation

`express-validator` is used to validate both route parameters and request bodies.

- **Route params** – every `/:email` endpoint (details, work, home, PUT, DELETE) is passed through `isEmail` in `middlewares/participantValidator.js`, which rejects malformed e-mails before the handler runs.
- **Request body** – `participantRules` in the same file validates the nested JSON for POST `/participants/add` and PUT `/participants/:email`:
  - correct e-mail format
  - dob must be a real date in YYYY-MM-DD
  - currency exactly three-four letters
  - salary is numeric
  - every string field is present and non-empty

The helper `handleValidationErrors` collects any failures and returns:

```json
{
  "statusCode": 400,
  "errors": [
    { "field": "participant.email", "msg": "Invalid e-mail" },
    { "field": "work.salary",       "msg": "Invalid value" }
  ]
}
```

### 5.2 Transactions

Both POST `/participants/add` and PUT `/participants/:email` wrap their three inserts/updates in a single `sequelize.transaction(...)`, guaranteeing atomic writes and preventing partial data on failure.

---

## 6 DB schema

```text
Participants (email PK)
 - firstname
 - lastname
 - dob

Works  (id PK)               Homes  (id PK)
 - ParticipantEmail  FK      - ParticipantEmail  FK
 - companyname               - country
 - salary                    - city
 - currency                  - deleted (soft)
 - deleted (soft)

 
```

