# AI Agent Guidelines for Backend

This document contains rules and guidelines for AI agents working in the `backend` directory of this project.

## Project Context
- **Tech Stack**: Node.js, Express.js (v5), Supabase (PostgreSQL), Axios, Multer.
- **Module System**: CommonJS (`require` and `module.exports`). Do not use ES Modules (`import`/`export`) unless explicitly requested.
- **Role**: This backend serves as a middleware/orchestrator communicating with the frontend, the AI service, and the database (Supabase).

## Architecture & Directory Structure
When adding new features or endpoints, adhere to the existing folder structure:

1. **`routes/`**: Define Express routes here. Map HTTP methods and endpoints to specific controller functions. Keep logic minimal here.
2. **`controllers/`**: Handle incoming HTTP requests, extract parameters/body, call the appropriate service functions, and send the HTTP response.
3. **`services/`**: Contain the core business logic. This layer should handle data processing, external API calls (e.g., to the AI service via Axios), and orchestrate model interactions.
4. **`models/`**: Handle database interactions (Supabase client calls). Keep Supabase queries abstracted within this layer.
5. **`middleware/`**: Express middleware functions (e.g., authentication, error handling, Multer file upload configurations).
6. **`config/`**: Configuration files (e.g., Supabase client initialization, environment variables setup).

## Coding Guidelines
- **Error Handling**: Use `try...catch` blocks in controllers and services. Ensure a consistent error response format (e.g., `{ error: "Message", details: "..." }`). Pass errors to the global error handler middleware where applicable.
- **Environment Variables**: Use `process.env` via the `dotenv` package. If adding a new environment variable, make sure to document it in `.env.example`.
- **Async/Await**: Favor `async/await` over raw Promises (`.then().catch()`) for better readability.
- **File Uploads**: Use `multer` for handling file uploads (e.g., parsing question papers or documents). Ensure file validation (size, type) in middleware or early in the controller.
- **Security & CORS**: Respect the configured CORS settings. Do not expose sensitive database keys or AI service tokens to the client.

## Database Interaction (Supabase)
- Use the `@supabase/supabase-js` client.
- Avoid writing raw SQL if the Supabase SDK provides equivalent methods (e.g., `.select()`, `.insert()`, `.update()`).
- Keep database queries in the `models/` or `services/` layer, keeping the `controllers/` clean.

## Formatting & Style
- Write clean, self-documenting code.
- Add concise comments for complex logic, especially when interacting with the AI service or parsing complex data.
- Ensure all newly created files follow standard naming conventions (camelCase or kebab-case as established in the project).
