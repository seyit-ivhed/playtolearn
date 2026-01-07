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

## Backend Setup (Supabase)

The project uses Supabase for authentication, database, and edge functions.

### 1. Database Migrations
Apply the migrations in the `supabase/migrations` directory to your Supabase project:
1. `initial_schema.sql`: Sets up players and game states.
2. `payment_and_dlc.sql`: Sets up content packs and entitlements.
3. `fix_entitlements_rls.sql`: Fixes security policies for entitlements.

### 2. Edge Functions
Deploy the logic for payments and webhooks:
```bash
supabase functions deploy create-payment-intent
supabase functions deploy stripe-webhook
```

> [!IMPORTANT]
> Both functions require `verify_jwt = false` in [config.toml](file:///Users/seyitivhed/Github/playtolearn-workspaces/workspace-1/supabase/config.toml) to handle manual verification and Stripe webhooks correctly.

### 3. Environment Secrets
Set the required secrets in your Supabase project:
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```
Also ensure your frontend `.env` has the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

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

- **Check test coverage for a specific directory:**
  ```bash
  npm run test:coverage -- src/stores/game
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

### Edge Function Tests (Deno)

We use **Deno** for testing Supabase Edge Functions.

- **Run all edge function tests:**
  ```bash
  deno test --allow-all supabase/functions/
  ```

- **Run a specific edge function test:**
  ```bash
  deno test --allow-all supabase/functions/create-payment-intent/index.test.ts
  ```

## Project Structure

- `/src` - Frontend React application code
- `/server` - Backend Node.js/Express application code
- `/docs` - Project documentation and design documents
- `/e2e` - End-to-end tests
