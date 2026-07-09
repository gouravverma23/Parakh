# AI Agent Guidelines for Project Parakh

This is the global `AGENTS.md` file for the entire Parakh project. It provides high-level architectural rules and cross-service guidelines for AI agents working in this repository.

## Project Architecture & Monorepo Structure
This repository is organized into distinct services. When working on features that span multiple areas, keep the separation of concerns intact:

1. **`frontend/`**: The client-side web application built with React and Vite. Handles the user interface, state management, and communication with the backend.
   - *For specific frontend rules, see [`frontend/AGENTS.md`](./frontend/AGENTS.md).*
2. **`backend/`**: The core API server built with Node.js and Express. It acts as an orchestrator, managing data in Supabase, and brokering requests to the AI service.
   - *For specific backend rules, see [`backend/AGENTS.md`](./backend/AGENTS.md).*
3. **`ai-service/`**: The dedicated service handling artificial intelligence tasks (e.g., Question Paper parsing and processing).
4. **`doc/`**: Contains project documentation, system design files, and diagrams.

## Global Development Guidelines

### 1. Cross-Service Communication
- **API Contracts**: When modifying an API endpoint in the `backend/`, always update the corresponding API call in the `frontend/services/` layer. Similarly, if changing the `ai-service` interface, ensure the `backend/` is updated to handle the new payload structure.
- **Environment Variables**: Environment variables should be managed per-service. Do not hardcode URLs (like `http://localhost:3000`); always use environment variables (`.env`).
- **CORS & Ports**: By default, ensure CORS is correctly configured in the backend and AI service to accept requests from the frontend port.

### 2. Git & Version Control Workflow
- **Commit Messages**: Write clear, descriptive commit messages. Prefix commits with the service they affect (e.g., `frontend: add login form`, `backend: fix auth middleware`, `ai-service: optimize parser`).
- **File Modifications**: Try to keep changes scoped to the specific feature being worked on. Avoid unnecessary reformatting of unrelated files to keep pull requests clean.

### 3. Code Quality & Formatting
- **Documentation**: If you introduce a significant architectural change or a complex cross-service flow, update the documentation in the `doc/` folder.
- **Error Propagation**: Ensure errors from the `ai-service` bubble up correctly through the `backend` and are displayed gracefully in the `frontend`.
- **Formatting**: Respect the linting and formatting configurations within each individual service folder (e.g., ESLint in frontend, Prettier in backend).

## Agent Behavior Checklist
Before finalizing a task:
- [ ] Have I checked if this change requires updates in another service (e.g., changing a database schema in the backend requiring a UI update in the frontend)?
- [ ] Did I respect the local `AGENTS.md` rules inside the specific service folder?
- [ ] Is my code robust against network failures between the microservices?
