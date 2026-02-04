# GreenNest Farm Stay

A premium farm stay booking demo built with **React + TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Firebase**.

## Features

- Responsive guest website with premium resort styling
- Rooms listing and detail pages with availability calendar
- Booking flow with validation and Firestore persistence
- Admin dashboard with widgets, booking management, and date blocking
- Firebase Auth guard for admin routes

## Tech Stack

- React + TypeScript
- React Router
- React Hook Form
- Tailwind CSS
- Framer Motion
- Firebase (Firestore + Auth)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_EMAIL=admin@greennestdemo.com
```

### 3. Seed demo rooms

```bash
npm run seed:rooms
```

### 4. Run the dev server

```bash
npm run dev
```

## Build for production

```bash
npm run build
```

## Firebase Setup Notes

- Enable **Email/Password** authentication in Firebase Auth.
- Create an admin user with the same email you set in `VITE_ADMIN_EMAIL`.
- Firestore collections used: `rooms`, `bookings`, `blockedDates`.

## Deployment

- **Vercel**: Import the repo, set env vars in the Vercel dashboard, deploy.
- **Firebase Hosting**: `firebase init hosting` and deploy the `dist/` directory after running `npm run build`.
