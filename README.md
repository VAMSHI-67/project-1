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
