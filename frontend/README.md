# Valora Frontend

The Valora storefront is a React 18 application built with Vite, Redux Toolkit, React Router, Tailwind CSS, and PayPal React components.

## Development

From the repository root:

```bash
npm ci --prefix frontend
npm run dev --prefix frontend
```

The development server runs on port `3000` and proxies `/api` and `/uploads` requests to the backend on port `5000`.

## Production build

```bash
npm run build --prefix frontend
```

The compiled application is written to `frontend/dist` and is served by the Express backend in production.

## Browser regression tests

```bash
cd frontend
npx playwright install chromium
npm run test:e2e
```

The browser suite verifies core catalog discovery, product navigation, cart behavior, and responsive navigation state.
