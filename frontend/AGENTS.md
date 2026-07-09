# AI Agent Guidelines for Frontend

This document contains rules and guidelines for AI agents working in the `frontend` directory of this project.

## Project Context
- **Tech Stack**: React (v19), Vite, ES Modules (`type: "module"`).
- **Role**: This is the client-facing web application. It communicates with the backend (Express server) to fetch data, trigger AI processes, and authenticate users.

## Architecture & Directory Structure
When adding new features, adhere to a typical React project structure within the `src/` folder:

1. **`src/components/`**: Reusable UI components (e.g., Buttons, Inputs, Modals). Keep them as stateless as possible.
2. **`src/pages/`**: Top-level route components. These should compose smaller components and handle page-level state.
3. **`src/hooks/`**: Custom React hooks (`use...`) for encapsulating reusable stateful logic.
4. **`src/services/`**: API communication logic (e.g., Axios or Fetch calls to the backend). Do not put raw API calls directly inside components.
5. **`src/context/`**: React Context providers for global state management (if applicable).
6. **`src/utils/`**: Helper functions, formatters, and constants.

## Coding Guidelines
- **Functional Components**: Use functional components and React Hooks exclusively. Do not use class components.
- **ES Modules**: Use ES6 `import` and `export` statements.
- **Styling**: Ensure new components follow the existing styling paradigm (e.g., CSS Modules, plain CSS, or Tailwind if it's set up). Check existing components for reference.
- **Linting**: The project uses ESLint. Ensure code does not violate rules defined in `eslint.config.js`. Avoid unused variables or imports.
- **Environment Variables**: Prefix environment variables with `VITE_` if they need to be exposed to the client-side code (e.g., `VITE_API_BASE_URL`). Use `import.meta.env.VITE_VAR_NAME` to access them. Document new variables in `.env.example`.

## API Communication
- All communication with the backend should be handled in the `src/services/` directory.
- Handle loading states, error states, and success states gracefully in the UI.
- Use environment variables to define the backend API URL.

## Formatting & Style
- Keep components small and focused on a single responsibility.
- Write clean, modern JavaScript/JSX.
- Add concise comments for complex logic.
- Ensure all newly created files follow standard naming conventions (PascalCase for React components, camelCase for hooks and utilities).
