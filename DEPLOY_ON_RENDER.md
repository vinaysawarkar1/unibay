# Deploy on Render

Steps to deploy this Next.js application on Render:

1. Push this repository to GitHub (or link an existing repo) and sign in to Render.
2. Create a new Web Service and connect your repository.
3. Render will detect `render.yaml` and create the service named `unibay-custom-pc-web`.
4. Build command: `pnpm install --frozen-lockfile && pnpm build`
5. Start command: `pnpm start`
6. Ensure Node version is set to 18.x (we added an `engines.node` entry in `package.json`).
7. Add any required environment variables (API keys, etc.) via the Render dashboard.

Notes:
- The app uses `pnpm` and includes `pnpm-lock.yaml`; Render will use `pnpm` during install.
- If you prefer a custom Docker setup, create a `Dockerfile` and update the service to use it.
