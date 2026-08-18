# Valora

Valora is a full-stack ecommerce application for catalog browsing, product reviews, cart and checkout flows, PayPal payments, customer order history, and administrative product/order/user management.

## Architecture

- **Frontend:** React 18, Redux Toolkit, React Router, Tailwind CSS, Vite
- **Backend:** Node.js, Express 4, MongoDB, Mongoose
- **Authentication:** JWT stored in an HttpOnly cookie
- **Payments:** PayPal integration
- **Uploads:** authenticated administrator image uploads with type and size validation

The frontend and backend are developed together from this repository. In production, Express serves the compiled Vite application from `frontend/dist`.

## Security boundaries

- authenticated order details are restricted to the order owner or an administrator
- payment updates are restricted to the order owner or an administrator
- administrative routes use server-side authorization checks
- product image uploads require administrator access
- uploaded images are limited to JPEG, PNG, and WebP files with a 5 MB maximum size
- request bodies have explicit size limits
- passwords are hashed before persistence

## Local development

### Requirements

- Node.js 22
- npm
- MongoDB

### Setup

```bash
npm install
npm ci --prefix frontend
cp .env.example .env
npm run dev
```

The API runs on port `5000` by default. The Vite development server runs on port `3000` and proxies `/api` and `/uploads` to the backend.

## Environment variables

Use `.env.example` as the starting point.

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/valora
JWT_SECRET=replace-with-a-long-random-secret
PAYPAL_CLIENT_ID=
PAGINATION_LIMIT=8
```

Never commit real credentials or production secrets.

## Commands

```bash
npm run dev          # backend + frontend development
npm test             # backend authorization regression tests
npm run build        # production frontend build
npm run data:import  # seed catalog data
npm run data:destroy # remove seeded data
```

Frontend commands can also be run directly:

```bash
npm run dev --prefix frontend
npm run build --prefix frontend
npm run preview --prefix frontend
```

## Quality checks

Pull requests run automated checks for:

- clean backend dependency installation
- backend JavaScript syntax validation
- authorization regression tests
- backend production dependency audit
- clean frontend dependency installation
- Vite production build
- frontend production dependency audit

## Package management

npm is the canonical package manager for both the root application and the frontend. Commit both `package-lock.json` files whenever dependencies change.

## License

MIT
