# IssueTracker

A fullstack issue tracking application for managing tickets with status and priority workflows, built with **Angular** and **.NET Minimal API** backed by **SQL Server**.

## Tech Stack

| Layer        | Technology                                        |
| ------------ | ------------------------------------------------- |
| **Frontend** | Angular 22, TypeScript 6, RxJS                    |
| **Backend**  | .NET 10, ASP.NET Core Minimal API, Entity Framework Core 10 |
| **Database** | SQL Server (stored procedures, views, sequences)  |
| **Tooling**  | concurrently, sqlcmd, Swagger/OpenAPI              |

## Features

- **Ticket CRUD** — Create, view, update (PATCH), and delete tickets
- **Status workflow** — TODO → IN PROGRESS → IN REVIEW → DONE
- **Priority levels** — LOW, MEDIUM, HIGH
- **Audit trail** — Every update and delete is logged in a `TicketAudit` table with full history
- **Auto-generated ticket keys** — Sequential `TK-101`, `TK-102`, etc. via a SQL Server sequence
- **Dashboard** with ticket statistics (grouped by status and priority)
- **Ticket detail view** with audit history
- **Global error handling** — Custom middleware maps SQL error codes and .NET exceptions to proper HTTP status codes (400, 404, 409, 500). Angular uses an interceptor to catch HTTP errors globally and display popup alerts.
- **Swagger UI** available in development mode at `/swagger`

## Architecture

```
IssueTracker_Fullstack/
├── Frontend/                    # Angular SPA
│   └── src/app/
│       ├── ticket-dashboard/    # Dashboard with stats
│       ├── ticket-list/         # Ticket list view
│       ├── ticket-card/         # Reusable ticket card component
│       ├── ticket-details/      # Ticket detail + audit history
│       ├── services/            # API communication (HttpClient)
│       ├── models/              # TypeScript models
│       ├── dtos/                # Data transfer objects
│       ├── enums/               # Status & priority enums
│       └── interceptors/        # Global error handler
│
├── Backend/                     # .NET solution (Clean Architecture)
│   ├── API/                     # Presentation layer — endpoints, middleware, config
│   │   ├── Endpoints/           # Minimal API route definitions
│   │   └── Middleware/          # Global exception handler
│   ├── Application/             # DTOs and contracts
│   ├── Domain/                  # Entities and enums
│   ├── Infrastructure/          # EF Core DbContext, database services
│   │   ├── Persistence/         # AppDbContext
│   │   └── Services/            # DbServices (stored procedure calls)
│   └── Database/                # SQL scripts
│       ├── InitTables.sql       # Schema + seed data (idempotent)
│       ├── ReadProcedures.sql   # Views, read SPs, indexes
│       └── WriteProcedures.sql  # Create, update, delete SPs
│
├── package.json                 # Root — unified dev command
└── .gitignore                   # Unified ignore rules
```

The backend follows **Clean Architecture** with four layers:

- **Domain** — Entities (`Ticket`, `TicketAudit`, `TicketStatus`, `TicketPriority`) and enums
- **Application** — DTOs (`TicketDto`, `CreateTicketDto`, `UpdateTicketDto`, `TicketAuditDto`, `TicketStatsDto`)
- **Infrastructure** — EF Core `AppDbContext` and `DbServices` (executes stored procedures via `SqlQueryRaw`)
- **API** — Minimal API endpoints and global exception handler middleware

> **Note:** The business logic lives primarily in SQL Server stored procedures — the .NET layer acts as a thin API gateway that validates input, calls procedures, and maps errors.

## API Endpoints

All endpoints are grouped under `/tickets`:

| Method   | Route                      | Description                          |
| -------- | -------------------------- | ------------------------------------ |
| `GET`    | `/tickets`                 | Get all tickets (via `vw_TicketDetails` view) |
| `GET`    | `/tickets/{ticketKey}`     | Get a single ticket by key (e.g. `TK-101`) |
| `GET`    | `/tickets/{ticketKey}/audit` | Get the audit history for a ticket  |
| `GET`    | `/tickets/stats`           | Get ticket count grouped by status & priority |
| `POST`   | `/tickets`                 | Create a new ticket                  |
| `PATCH`  | `/tickets/{ticketKey}`     | Partially update a ticket            |
| `DELETE` | `/tickets/{ticketKey}`     | Delete a ticket (audit log preserved) |

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+) and npm
- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) running locally on port `1433`
- [sqlcmd](https://learn.microsoft.com/en-us/sql/tools/sqlcmd/sqlcmd-utility) (comes with SQL Server or SSMS; verify with `sqlcmd -?`)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd IssueTracker_Fullstack
```

### 2. Configure the database connection

Create the file `Backend/API/appsettings.json` (it's gitignored):

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=IssueTrackerDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

> This uses Windows Authentication (`Trusted_Connection=True`). If using SQL Server Authentication, replace with `User Id=<user>;Password=<password>;` instead.

### 3. Install dependencies

From the project root:

```bash
npm install
```

This installs both root and frontend dependencies automatically.

### 4. Start the project

From the **project root**:

```bash
npm run dev
```

This single command will automatically:
1. **Initialize the database** (`npm run db:init`) — runs `InitTables.sql`, `ReadProcedures.sql`, and `WriteProcedures.sql` via `sqlcmd`. This creates the `IssueTrackerDb` database, tables, lookup/seed data, stored procedures, views, and indexes if they don't already exist.
2. **Start the .NET backend** on `http://localhost:5051`
3. **Start the Angular frontend** on `http://localhost:4200`

Both backend and frontend processes run concurrently with color-coded, labeled output (`BE` in blue, `FE` in green).

### Available scripts

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Init DB + start backend & frontend        |
| `npm run db:init`    | Run all DB init scripts (tables, views, procedures) |
| `npm run start:backend`  | Start the .NET API only               |
| `npm run start:frontend` | Start the Angular dev server only      |

## Development URLs

| Service      | URL                                  |
| ------------ | ------------------------------------ |
| Frontend     | http://localhost:4200                |
| Backend API  | http://localhost:5051                |
| Swagger UI   | http://localhost:5051/swagger        |
