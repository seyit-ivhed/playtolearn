# Space Math Academy (PlayToLearn)

A browser-based educational game designed to teach math concepts to children through space-themed missions and challenges.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Framer Motion, Zustand
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL, Drizzle ORM
- **Testing:** Vitest, Playwright

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd playtolearn
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    Navigate to the server directory and install dependencies:
    ```bash
    cd server
    npm install
    cd ..
    ```

## Running the Project

To run the full application, you will need to start both the client (frontend) and the server (backend) in separate terminal instances.

### 1. Start the Server (Backend)

Open a terminal and run:

```bash
cd server
npm run dev
```

This will start the backend server in watch mode using `tsx`.

### 2. Start the Client (Frontend)

Open a new terminal window (from the root directory) and run:

```bash
npm run dev
```

This will start the Vite development server. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

## Testing

### Unit Tests (Vitest)

We use **Vitest** for unit testing.

- **Run all unit tests:**
  ```bash
  npm run test
  ```

- **Run tests with UI:**
  ```bash
  npm run test:ui
  ```

- **Check test coverage:**
  ```bash
  npm run test:coverage
  ```

### End-to-End Tests (Playwright)

We use **Playwright** for end-to-end testing.

- **Run all E2E tests:**
  ```bash
  npx playwright test
  ```

- **Run E2E tests with UI mode:**
  ```bash
  npx playwright test --ui
  ```

- **View the last HTML report:**
  ```bash
  npx playwright show-report
  ```

## Project Structure

- `/src` - Frontend React application code
- `/server` - Backend Node.js/Express application code
- `/docs` - Project documentation and design documents
- `/e2e` - End-to-end tests
