# Finora Project Sequence Diagram

This diagram reflects the current React + Spring Boot + JWT flow in this project.

## Run The Project (Without `.bat` Files)

Open two terminal windows:

1. Spring Boot (backend)

```powershell
cd "C:\Users\ADMIN\Downloads\Finora(springboot+react)\Finora"
.\mvnw.cmd spring-boot:run
```

2. React (frontend)

```powershell
cd "C:\Users\ADMIN\Downloads\Finora(springboot+react)\Finora_react"
npm install
npm run dev
```

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant R as React App (Vite)
    participant S as Spring Security (JwtRequestFilter)
    participant UC as UserController
    participant EC as ExpenseController
    participant AC as AccountController
    participant US as UserService
    participant ES as ExpenseService
    participant AS as AccountService
    participant UR as UserRepo
    participant ER as ExpenseRepo
    participant AR as AccountRepository
    participant DB as MySQL

    rect rgb(235, 248, 255)
    Note over U,R: Authentication
    U->>R: Submit register form
    R->>UC: POST /user/signup
    UC->>US: getUserByEmail(email)
    US->>UR: findByEmail(email)
    UR->>DB: SELECT user by email
    DB-->>UR: result
    alt Email does not exist
        UC->>US: saveUser(new user)
        US->>UR: save(user)
        UR->>DB: INSERT user
        DB-->>UR: saved user
        UC-->>R: 200 + JWT token + userId
        R->>R: Store token and userId in localStorage
    else Email exists
        UC-->>R: 409 Email already exists
    end
    end

    rect rgb(236, 253, 245)
    Note over U,R: Login
    U->>R: Submit login form
    R->>UC: POST /user/signin
    UC->>US: getUserByEmail(email)
    US->>UR: findByEmail(email)
    UR->>DB: SELECT user by email
    DB-->>UR: user row
    alt Valid password
        UC-->>R: 200 + JWT token + userId
        R->>R: Save token, navigate /dashboard
    else Invalid credentials
        UC-->>R: 401/404 error
    end
    end

    rect rgb(255, 247, 237)
    Note over R,S: Protected APIs include Authorization: Bearer <token>
    R->>S: GET /accounts/user/{userId}
    S->>S: Extract token, validate subject
    S->>US: loadUserByUsername(email)
    US->>UR: findByEmail(email)
    UR->>DB: SELECT user
    DB-->>UR: user row
    S-->>AC: SecurityContext authenticated
    AC->>US: getUserById(userId)
    US->>UR: findById(userId)
    UR->>DB: SELECT user by id
    DB-->>UR: user row
    AC->>AS: getAccountsByUser(user)
    AS->>AR: findByUser(user)
    AR->>DB: SELECT accounts
    DB-->>AR: account list
    AC-->>R: Accounts response

    R->>S: GET /expense/user/{userId}
    S-->>EC: Token accepted
    EC->>US: getUserById(userId)
    US->>UR: findById(userId)
    UR->>DB: SELECT user by id
    DB-->>UR: user row
    EC->>ES: getExpensesByUser(user)
    ES->>ER: findByUser(user)
    ER->>DB: SELECT expenses
    DB-->>ER: expense list
    EC-->>R: Expenses response
    R->>R: Render dashboard totals/charts
    end

    rect rgb(250, 245, 255)
    Note over U,R: Add expense transaction
    U->>R: Fill Add Transaction form
    R->>S: POST /expense/add (+ token)
    S-->>EC: Token accepted
    EC->>US: getUserById(userId)
    US->>UR: findById(userId)
    UR->>DB: SELECT user by id
    DB-->>UR: user row
    EC->>ES: addExpense(expense)
    ES->>ER: save(expense)
    ER->>DB: INSERT expense
    DB-->>ER: saved expense
    EC-->>R: 200 Expense added
    R->>R: Refresh local state/UI
    end

    rect rgb(254, 242, 242)
    Note over U,R: Update/Delete operations (same protected flow)
    U->>R: Edit/Delete expense or account
    R->>S: PUT/DELETE request with token
    S-->>EC: Expense update/delete routes
    S-->>AC: Account update/delete routes
    EC->>ES: updateExpense()/deleteExpense()
    AC->>AS: updateAccount()/deleteAccount()
    ES->>ER: save()/deleteById()
    AS->>AR: save()/delete()
    ER->>DB: UPDATE/DELETE expense
    AR->>DB: UPDATE/DELETE account
    DB-->>R: Operation success
    end
```
