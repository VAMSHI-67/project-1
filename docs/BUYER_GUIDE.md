# Kanvera Resort & Convention Handover Guide

## 1. Project Summary

Kanvera Resort & Convention is a public booking website with an admin panel.

The website is built to support one large property with multiple internal venues or sections. Examples include:
- Farmstay
- Convention area
- Mango Grove
- Event lawn
- Any future venue created by the admin

The public website allows guests to:
- view the brand, gallery, contact information, and property presentation
- choose a venue from the booking form
- submit booking details through WhatsApp

The admin panel allows the owner or manager to:
- log in securely
- create and manage venue sections
- upload hero, walkthrough, and venue-specific gallery images
- view bookings
- confirm or cancel bookings
- block dates on the calendar for maintenance or private use

## 2. Main Website Pages

### Home Page
The home page is the public-facing landing page.

It includes:
- hero section and branding
- property introduction
- walkthrough image section
- venue-based secondary gallery section
- nearby places
- footer with contact details, WhatsApp, and Instagram

Important behavior:
- Hero images are global site images
- Walkthrough images are global site images
- Secondary gallery images are grouped by venue

### Booking Page
The booking page lets the guest select which venue they want to book.

The guest can enter:
- selected venue
- name
- phone number
- check-in date and time
- check-out date and time
- number of guests
- notes

Important rules:
- minimum booking duration is 12 hours
- booking continues through WhatsApp
- booking data is also stored in Firestore

### Contact Page
The contact page shows:
- phone number
- email
- Instagram page
- map location
- WhatsApp booking action

## 3. Admin Panel Overview

Admin routes:
- `/admin/login`
- `/admin/dashboard`
- `/admin/bookings`
- `/admin/calendar`
- `/admin/walkthrough`

Main admin sections:
- Dashboard
- Bookings
- Calendar
- Media

## 4. Admin Login

### What it does
Allows the admin to sign in and access protected management pages.

### Steps
1. Open `/admin/login`
2. Enter admin email
3. Enter password
4. Click `Sign in`
5. After successful login, the admin is redirected to the dashboard

### If login fails
- check email and password
- make sure the Firebase auth user exists
- make sure the email matches the allowed admin email used by the project

## 5. Dashboard

### What it shows
The dashboard is a summary screen.

It shows:
- total bookings
- upcoming stays
- 7-day occupancy
- upcoming stays timeline
- today arrivals count

### How to use it
1. Open `Dashboard`
2. Review the booking numbers
3. Review upcoming stays
4. Use the shortcut button to go to media uploads if needed

## 6. Bookings Page

### What it does
The bookings page shows all guest bookings stored in Firestore.

For each booking, the admin can see:
- guest name
- venue selected by guest
- room label
- check-in and check-out
- guest count
- status

### Booking statuses
- `pending`
- `confirmed`
- `canceled`

### How to confirm a booking
1. Open `Bookings`
2. Find the booking row
3. Check guest name, venue, and dates
4. Click `Confirm`
5. Status changes from `pending` to `confirmed`

### How to cancel a booking
1. Open `Bookings`
2. Find the booking row
3. Click `Cancel`
4. Status changes from `pending` to `canceled`

### Important note
Only pending bookings can be changed directly from this screen.

## 7. Calendar Page

### What it does
The calendar page is used to block dates and review room availability.

It includes:
- a form to block dates
- a visual calendar grid
- booking and blocked indicators

### How to block dates
1. Open `Calendar`
2. In the `Block dates` form, choose the room
3. Select start date
4. Select end date
5. Add a reason
6. Submit the form
7. The blocked range appears on the calendar

### Why this is useful
Use blocked dates for:
- maintenance
- private owner usage
- venue preparation
- unavailable periods

## 8. Media Page

This is the most important content-management page.

It handles:
- venue creation
- venue editing
- venue deletion
- hero image uploads
- walkthrough image uploads
- venue-specific secondary image uploads

## 9. Venue Sections Explained

A venue section is a named space inside the same Kanvera property.

Examples:
- Farmstay
- Convention
- Mango Grove
- Lawn

Each venue section is reused in two places:
- booking dropdown
- secondary gallery grouping

That means when a new venue is created in admin, it can:
- appear in the booking form
- receive its own gallery images

## 10. Media Categories Explained

### Hero
Hero images are global images for the website.

Use them for:
- top banner visuals
- major brand presentation images

Hero images are not assigned to a venue.

### Walkthrough
Walkthrough images are global images for the property tour section.

Use them for:
- overview visuals
- overall property tour
- signature spaces across the property

Walkthrough images are not assigned to a venue.

### Secondary
Secondary images are venue-specific gallery images.

Use them for:
- Farmstay gallery
- Mango Grove gallery
- Convention gallery
- any other specific venue

Only secondary images are assigned to a venue.

## 11. How to Create a Venue Section

1. Open `Media`
2. In `Create venue section`, enter the venue name
   Example: `Mango Grove`
3. Add optional purpose text
   Example: `Outdoor celebrations and family gatherings`
4. Click `Create venue`
5. The venue is saved in Firestore
6. That venue becomes available in the booking form and media uploads

## 12. How to Edit a Venue Section

1. Open `Media`
2. In the venue list, find the venue
3. Click `Edit`
4. Update the venue name or purpose
5. Click `Save changes`
6. The venue updates everywhere it is used

Important effect:
- the booking dropdown will show the updated venue name
- the public gallery heading will also reflect the updated venue name

## 13. How to Delete a Venue Section

1. Open `Media`
2. Find the venue in the list
3. Click `Delete`
4. Confirm deletion

Important rule:
- a venue cannot be deleted while secondary images are still linked to it

If deletion fails:
- delete or reassign that venue's secondary images first
- then delete the venue again

## 14. How to Upload a Hero Image

1. Open `Media`
2. In `Upload new image`, choose the image file
3. Add an optional caption
4. Set category to `Hero`
5. Click `Upload`

What happens:
- the image becomes a global hero image
- it is not linked to any venue

## 15. How to Upload a Walkthrough Image

1. Open `Media`
2. Choose the image file
3. Add an optional caption
4. Set category to `Walkthrough`
5. Click `Upload`

What happens:
- the image becomes part of the global walkthrough section
- it is not linked to any venue

## 16. How to Upload a Secondary Image for a Venue

1. Open `Media`
2. Choose the image file
3. Add an optional caption
4. Set category to `Secondary`
5. Select the venue section from the venue dropdown
6. Click `Upload`

What happens:
- the image is linked to that venue
- it appears under that venue on the public gallery

Example:
If category is `Secondary` and venue is `Mango Grove`, the uploaded image will appear in the `Mango Grove` gallery section on the website.

## 17. Important Admin Behavior in Media Uploads

When category is `Hero` or `Walkthrough`:
- venue selection is not used
- these uploads are global

When category is `Secondary`:
- venue selection is required
- the image is assigned to that specific venue

The admin page is already designed to make this clear:
- venue dropdown is only relevant for `Secondary`
- the form shows a note explaining that hero and walkthrough uploads are global

## 18. Image Limits by Category

Current upload limits are:
- Hero: 2 images
- Walkthrough: 8 images
- Secondary: 5 images per venue

Important note:
- the secondary image limit is applied separately for each venue

Example:
- Farmstay can have up to 5 secondary images
- Mango Grove can also have up to 5 secondary images

## 19. How to Delete an Image

1. Open `Media`
2. Choose the relevant category
3. If category is `Secondary`, select the correct venue
4. Find the image card
5. Click `Delete`

What happens:
- the image is removed from Firestore
- the system also tries to remove the Cloudinary asset

## 20. Booking Flow for the Buyer/Owner

Guest journey:
1. Guest opens the website
2. Guest opens booking page
3. Guest selects a venue
4. Guest fills in date, time, guest count, and notes
5. Guest continues on WhatsApp
6. Booking is also stored in Firestore

Admin journey:
1. Admin opens `Bookings`
2. Reviews pending booking
3. Confirms or cancels it

## 21. Contact and Social Details

Current contact details in the website:
- Phone: `+91 89092 39999`
- Email: `kanverafarms@gmail.com`
- Instagram: `@kanvera_resort`

These are centralized in:
- `src/data/site.ts`

This means future updates are easier because the main contact values are stored in one place.

## 22. Branding and Logo

The project branding now uses:
- Kanvera Resort & Convention name
- selected green logo variant
- website favicon
- footer and navbar logo placement

Main logo assets are stored in:
- `src/assets/branding/`
- `public/`

## 23. Platform Guide (What Is Used for What)

This project runs on four core platforms.

### Cloudflare Pages (Hosting and Deployment)
Cloudflare Pages hosts the frontend website that visitors open.

Used for:
- production hosting of the React/Vite site
- automatic deploys from GitHub
- branch preview deploys before publishing to production
- custom domain connection and SSL certificate management

Client should know:
- if code is merged to the production branch, Cloudflare can deploy automatically
- DNS for the live domain should be managed in the same Cloudflare account used by Pages
- build settings must stay aligned with the project (`npm run build`, output folder `dist`)

### Firebase (Authentication + Database + Security Rules)
Firebase handles secure admin access and operational data.

Used for:
- Firebase Authentication: admin login
- Firestore Database: bookings, venues, media records, blocked dates, adminUsers
- Firestore Security Rules: collection-level access controls

Client should know:
- booking records are stored in Firestore, then the guest continues on WhatsApp
- admin permissions are controlled through `adminUsers/{uid}` and the bootstrap admin email
- any rules change in `firestore.rules` requires redeploy to Firebase to go live

### Cloudinary (Image Upload and Delivery)
Cloudinary stores and serves uploaded media.

Used for:
- admin image uploads (hero, walkthrough, secondary)
- CDN delivery of optimized images to website visitors
- transformation-based image URLs for responsive loading
- delete cleanup via API route (`api/cloudinary-delete.js`)

Client should know:
- if Cloudinary credentials are missing, admin media upload will fail
- Cloudinary account ownership is important for long-term continuity
- usage/billing should be monitored in Cloudinary dashboard

### GitHub (Source Code and Release History)
GitHub is the source-of-truth for this project code.

Used for:
- source code repository
- collaboration and change history
- branch workflow and release control
- trigger source for Cloudflare Pages deployments

Client should know:
- all production code changes should be committed to GitHub first
- keep at least two maintainers with admin access to avoid lockout risk
- repository access is required for any future feature or bug fix release

## 24. Deployment Flow (Simple Version)

1. Developer pushes or merges approved code to GitHub production branch.
2. Cloudflare Pages detects the commit and runs a new deploy.
3. Site is updated after successful build.
4. If Firestore rules changed, run Firebase rules deploy separately.

Important:
- frontend deploy (Cloudflare) and rules deploy (Firebase) are separate operations.
- both must be complete for security changes to be fully live.

## 25. Environment Variables Required for Hosting

The Cloudflare Pages project should have the required variables configured.

Firebase variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Admin bootstrap variable:
- `VITE_ADMIN_EMAIL`

Cloudinary variables:
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

If any of these are missing or incorrect, affected features will fail at runtime.

## 26. Known Operational Note

On some Windows machines, `npm run dev` or `npm run build` may face a Vite/esbuild `spawn EPERM` environment issue.

This is an environment/tooling issue rather than a TypeScript code issue.

TypeScript validation is passing successfully.

## 27. Recommended Admin Workflow

For daily usage, the admin should usually follow this order:

1. Create venue sections if needed
2. Upload hero and walkthrough images for global property presentation
3. Upload secondary images under each venue
4. Check the booking page to make sure venue dropdown is correct
5. Review bookings regularly
6. Use calendar blocking when dates need to be reserved

## 28. Client Ownership Checklist (Accounts and Access)

Before final client handover, confirm all of the following are transferred and verified:

1. Cloudflare account access (Pages project + domain DNS access).
2. Firebase project access (Auth, Firestore, Rules deploy permission).
3. Cloudinary account access (media library + upload preset management).
4. GitHub repository access (admin/maintainer role).
5. Production branch and deployment process explained to client.
6. At least one backup owner/admin in each platform account.

## 29. Suggested Handover Message

This website is now set up as a venue-based booking system for one large Kanvera property.

It supports:
- venue selection during booking
- WhatsApp-first booking confirmation
- admin-controlled venue creation
- venue-based gallery management
- booking management
- availability blocking
- branding, contact, and Instagram integration

The admin can manage most day-to-day operations without code changes.