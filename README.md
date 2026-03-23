# Kanvera Farms Website

A static marketing and booking website for Kanvera Farms built with React, TypeScript, Tailwind CSS, and Framer Motion.

## Overview

- Public pages only: `/`, `/booking`, `/contact`
- WhatsApp-first whole-property booking flow
- Shared site config for brand, contact details, maps, and gallery content
- Vercel-friendly static deployment target

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env.local` file with your Firebase credentials and admin email:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_ADMIN_EMAIL=you@example.com
```

Cloudinary (for image uploads without Firebase Storage):

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

## Firebase Rules (Walkthrough Uploads)

This repo includes a baseline Firestore rule template in `firestore.rules`.

1. Replace `YOUR_ADMIN_EMAIL` in the file with the same email used in `VITE_ADMIN_EMAIL`.
2. Deploy rules in the Firebase console or via Firebase CLI.

## Production Build

```bash
npm run build
```

The output is generated in `dist/`.

## Deployment

Deploy the latest `main` branch to Vercel.

Recommended production settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Production branch: `main`

## Booking Flow

Kanvera Farms uses a WhatsApp-first booking model.

- Guests submit whole-property stay details on `/booking`
- Minimum booking duration is 12 hours
- Booking CTA opens WhatsApp for `+91 89092 39999`

## Content Source

Branding, contact details, map link, WhatsApp number, and gallery content are centralized in `src/data/site.ts`.
