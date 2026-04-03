# Kanvera Resort & Convention

## Buyer Handover Guide

This document explains what the project does, how the website is structured, how the admin panel works, and what the buyer or operator needs to know to manage the property after handover.

## 1. Project Summary

Kanvera Resort & Convention is a marketing and booking website for a single large property that contains multiple internal venues or sections.

Examples of venue sections:

- Farmstay
- Convention
- Mango Grove
- Lawn or event space

The website is designed so guests can browse the property, choose which venue they want, and send a booking enquiry through WhatsApp. The admin panel allows the operator to manage bookings, control date availability, and upload images for the property.

This is not a multi-city or multi-branch website. It is one property with multiple bookable sections inside it.

## 2. Main Purpose of the Website

The website helps Kanvera in four major ways:

- Present the property professionally to visitors
- Let guests submit a venue-specific booking enquiry
- Let the admin manage bookings and availability
- Let the admin manage public-facing images and venue sections

## 3. Public Website Pages

### Home Page

The home page is the main brand and marketing page.

It includes:

- Hero section
- Property highlights
- Walkthrough/gallery content
- Secondary venue-specific gallery sections
- Call-to-action for bookings
- Contact and social links

### Booking Page

The booking page is where guests submit an enquiry.

Guests can:

- enter their details
- choose dates
- select the venue they want to book
- submit the enquiry

The system stores the enquiry in Firestore and also prepares a WhatsApp booking message.

### Contact Page

The contact page shows:

- phone number
- email address
- Instagram page
- property address
- map link

## 4. Booking Model

This website uses a WhatsApp-first booking model.

That means:

- the website captures booking details
- the booking is stored in the system
- the user is redirected to WhatsApp to continue the conversation

This works well for hospitality businesses that want direct lead handling instead of full online payment checkout.

## 5. Venue-Based Booking Structure

Earlier, the project was built for a single booking target. It has now been upgraded to support multiple internal venue sections inside the same property.

Important idea:

- the entire place is one Kanvera property
- inside the property, there are multiple venues
- guests now choose which venue they want to book

Each venue section also works as a secondary gallery subcategory.

That means one venue record is reused in two places:

- booking form dropdown
- secondary image organization in admin

So when the admin creates a new venue, that venue becomes:

- a new selectable booking option
- a new secondary gallery category

## 6. Admin Panel Overview

The admin panel contains these areas:

- Dashboard
- Bookings
- Calendar
- Media

These are the current responsibilities of each section.

### Dashboard

The dashboard gives a quick summary view.

It shows:

- total bookings
- upcoming stays
- short occupancy summary
- a quick timeline of bookings

This page is mainly for overview and quick monitoring.

### Bookings

The bookings page is where the admin views guest enquiries and changes status.

The table shows:

- guest name
- selected venue
- room
- dates
- guest count
- booking status

The admin can:

- confirm a pending booking
- cancel a pending booking

Confirmed or canceled bookings are treated as finalized.

### Calendar

The calendar page is used to manage availability.

It allows the admin to:

- block dates for a room
- add a reason for the block
- view booked dates
- view manually blocked dates

This is useful for maintenance, private events, closures, or owner use.

### Media

The media page is used to manage venue sections and public images.

This page supports:

- creating venue sections
- editing venue sections
- deleting venue sections
- uploading hero images
- uploading walkthrough images
- uploading venue-specific secondary images
- deleting uploaded images

## 7. Admin Panel Step-by-Step Guide

This section is written for the buyer or property operator who may not be technical.

## 7.1 Login to the Admin Panel

### What this does

It allows an authorized admin to access the management tools.

### Steps

1. Open the admin login page.
2. Enter the registered admin email.
3. Enter the password.
4. Click `Sign in`.
5. After successful login, the system opens the admin dashboard.

### Result

The admin is taken to the backend management area.

## 7.2 View Dashboard Summary

### What this does

Gives a quick operational summary.

### Steps

1. Log in to the admin panel.
2. Open `Dashboard`.
3. Review the summary cards.

### What the admin sees

- total bookings in the system
- upcoming stays
- seven-day occupancy indicator
- booking timeline

### When to use it

- daily review
- checking active demand
- monitoring upcoming guest movement

## 7.3 View and Manage Bookings

### What this does

Lets the admin review guest enquiries and take action.

### Steps

1. Log in to the admin panel.
2. Open `Bookings`.
3. Review the booking table.
4. Check the guest name, venue, dates, room, and guest count.
5. If the booking is still pending, choose one of the available actions.
6. Click `Confirm` to approve the booking.
7. Click `Cancel` to reject the booking.

### Important note

Only pending bookings can be changed from this screen. Once a booking is confirmed or canceled, it is treated as finalized.

### Result

The booking status is updated in Firestore and the booking table reflects the new state.

## 7.4 Block Dates in the Calendar

### What this does

Prevents a room from being available during a selected date range.

### Typical use cases

- maintenance work
- private reservation
- room unavailability
- internal use

### Steps

1. Log in to the admin panel.
2. Open `Calendar`.
3. In the `Block dates` form, select the room.
4. Choose the start and end date.
5. Enter a reason.
6. Click `Block dates`.

### Result

The blocked dates are stored in Firestore and shown in the availability calendar.

### Calendar color meaning

- green markers show booked dates
- clay/orange markers show blocked dates

## 7.5 Create a New Venue Section

### What this does

Creates a new internal venue or section of the property.

Examples:

- Farmstay
- Convention
- Mango Grove
- Pool Deck

### Why this matters

When a new venue is created:

- it becomes available in the booking form dropdown
- it becomes available as a secondary gallery category

### Steps

1. Log in to the admin panel.
2. Open `Media`.
3. In `Create venue section`, type the venue name.
4. Optionally add its purpose.
5. Click `Create venue`.

### Result

The venue is added to Firestore and becomes available for public booking and secondary image uploads.

## 7.6 Edit an Existing Venue Section

### What this does

Updates the name or purpose of an existing venue.

### Steps

1. Log in to the admin panel.
2. Open `Media`.
3. In the venue list, find the venue you want to change.
4. Click `Edit`.
5. Change the venue name and/or purpose.
6. Click `Save changes`.

### Result

The venue details are updated and the new information is reflected wherever that venue is used.

## 7.7 Delete a Venue Section

### What this does

Removes a venue from the system.

### Important rule

A venue can only be deleted if no secondary images are still assigned to it.

### Steps

1. Log in to the admin panel.
2. Open `Media`.
3. Find the venue in the venue list.
4. Click `Delete`.
5. Confirm the deletion in the prompt.

### If deletion fails

That usually means secondary images are still attached to that venue. Delete those images first, then try again.

## 7.8 Upload a Hero Image

### What this does

Uploads a main banner-style image for the public website.

### Important note

Hero images are global. They are not attached to a venue.

### Steps

1. Log in to the admin panel.
2. Open `Media`.
3. In `Upload new image`, choose the image file.
4. Optionally enter a caption.
5. In `Category`, select `Hero`.
6. Click `Upload`.

### Result

The image is uploaded and used as a global hero image for the site.

### Current retention rule

The system keeps up to 2 hero images.

## 7.9 Upload a Walkthrough Image

### What this does

Uploads general walkthrough or showcase images for the property.

### Important note

Walkthrough images are global. They are not attached to a venue.

### Steps

1. Log in to the admin panel.
2. Open `Media`.
3. In `Upload new image`, choose the image file.
4. Optionally enter a caption.
5. In `Category`, select `Walkthrough`.
6. Click `Upload`.

### Result

The image is uploaded into the public walkthrough/gallery area.

### Current retention rule

The system keeps up to 8 walkthrough images.

### Extra walkthrough feature

Walkthrough images can be reordered using `Move up` and `Move down`.

## 7.10 Upload Secondary Images for a Venue

### What this does

Uploads venue-specific gallery images.

These are the images used under individual venue sections such as Farmstay, Convention, or Mango Grove.

### Important note

Secondary images are the only image type that belongs to a venue.

### Steps

1. Log in to the admin panel.
2. Open `Media`.
3. In `Upload new image`, choose the image file.
4. Optionally enter a caption.
5. In `Category`, select `Secondary`.
6. In `Venue section`, choose the correct venue.
7. Click `Upload`.

### Result

The image is uploaded and linked to the selected venue.

It will then:

- appear in that venue section on the public gallery
- support the venue-based content structure

### Current retention rule

The system keeps up to 5 secondary images per venue.

If more than 5 are uploaded for the same venue, older images in that same venue may be cleaned up automatically based on the media retention logic.

## 7.11 Delete an Uploaded Image

### What this does

Removes an uploaded image from the media library and attempts storage cleanup.

### Steps

1. Log in to the admin panel.
2. Open `Media`.
3. Select the category you want to manage.
4. If using `Secondary`, select the relevant venue.
5. Find the image card.
6. Click `Delete`.

### Result

The image is removed from the public-facing gallery and from Firestore.

## 7.12 Understand Category Behavior in Media Uploads

This is very important for the buyer/admin to understand.

### Hero

- global image type
- not attached to any venue

### Walkthrough

- global image type
- not attached to any venue

### Secondary

- venue-specific image type
- must be attached to a venue

### Admin UI behavior

When the admin changes category away from `Secondary`, the venue selection is cleared automatically because it is no longer relevant.

This prevents confusion and ensures only secondary images are tied to venues.

## 8. Data and Service Overview

The project currently uses the following services.

### Firebase Authentication

Used for admin login.

### Firestore

Used for:

- bookings
- rooms
- blocked dates
- venue records
- uploaded media records

### Cloudinary

Used for image uploads and hosted image storage.

### Vercel

Used as the deployment target for the frontend site.

## 9. Important Content Settings

Some shared brand and contact settings are centralized in the project and can be updated by a developer if needed.

These include:

- brand name
- tagline
- phone number
- email address
- Instagram URL
- address
- Google Maps link

Current live brand details include:

- brand name: Kanvera Resort & Convention
- email: kanverafarms@gmail.com
- Instagram: @kanvera_resort

## 10. Current Business Logic

The system currently follows these rules:

- one property with multiple internal venues
- venue records power both booking and secondary gallery organization
- bookings are WhatsApp-first
- only pending bookings can be confirmed or canceled from admin
- hero and walkthrough images are global
- secondary images are venue-specific
- venue deletion is blocked if images still use that venue

## 11. Known Technical Note

TypeScript checks are passing.

However, depending on the machine or folder setup, local Vite development may sometimes hit a Windows `spawn EPERM` issue. This is environment-specific and should be tested on the buyer's machine if they plan to run the project locally.

This does not change the project logic or the admin workflow, but it is worth noting in technical handover.

## 12. Recommended Buyer Handover Checklist

Before handing over to the buyer, make sure the following are complete:

1. Admin login credentials are shared securely.
2. Firebase project access is confirmed.
3. Firestore rules are deployed.
4. Cloudinary credentials are configured.
5. At least one venue is created in admin.
6. Hero images are uploaded.
7. Walkthrough images are uploaded.
8. Secondary images are uploaded for each important venue.
9. A test booking is created and verified in admin.
10. Contact details, Instagram, and map link are verified.

## 13. Quick Operating Summary for the Buyer

If the buyer only wants the short version:

- use `Bookings` to confirm or cancel enquiries
- use `Calendar` to block dates when a room is unavailable
- use `Media` to create venue sections and upload public images
- use `Secondary` images for venue-specific galleries
- use `Hero` and `Walkthrough` for general property visuals

This is the current working admin flow of the Kanvera Resort & Convention project.
