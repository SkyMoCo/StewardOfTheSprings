---
title: "Steward of the Springs — Admin Guide"
subtitle: "For Site Administrators and Org Staff"
date: "2026"
geometry: margin=1in
colorlinks: true
---

# Getting Started

## Accessing the Site

The public website is at **https://sos.skymoco.dev**

Visitors can use the public pages (Home, Stewardship, About) without logging in.

## Accessing the Admin Panel

1. Go to **https://sos.skymoco.dev/admin/login**
2. Enter your admin username and password
3. You will be taken to the Admin Dashboard

> Keep your login credentials private. Contact your technical administrator to reset a forgotten password.

---

# The Admin Dashboard

The Dashboard is the first screen you see after logging in. It shows a live count of:

- **Springs** — locations being monitored
- **Participants** — registered stewards and volunteers
- **Visit Logs** — stewardship check-ins submitted
- **Milestones** — achievements earned by participants

Use the sidebar on the left to navigate between sections.

---

# Managing Springs

## What is a Spring record?

Each spring in the system represents a physical hot spring location. Springs are connected to visit logs and participant assignments.

## Adding a New Spring

1. Click **Springs** in the sidebar
2. Click **+ Add Spring**
3. Fill in the details:
   - **Spring Name** *(required)* — the common name for this location
   - **Region** — general area (e.g., "Central Utah", "Eastern Sierra")
   - **Status** — Active, Inactive, or Monitoring
   - **Latitude / Longitude** — GPS coordinates (decimal format, e.g., 38.5733, -109.5498)
   - **Description** — any notes about the spring
4. Click **Add Spring**

## Editing a Spring

1. Find the spring in the list
2. Click **Edit** on that row
3. Update the fields and click **Save Changes**

## Removing a Spring

Click **Delete** on a spring row. You will be asked to confirm. This cannot be undone.

---

# Managing Participants

## What is a Participant?

Participants are the people who visit and steward springs — volunteers, stewards, and monitors. Each person has one record linked to their email address.

## Adding a New Participant

1. Click **Participants** in the sidebar
2. Click **+ Add Participant**
3. Fill in:
   - **First Name** and **Last Name** *(required)*
   - **Email** *(required)* — must be unique
   - **Phone** *(optional)*
   - **Status** — Active or Inactive
4. Click **Add Participant**

## Editing a Participant

Click **Edit** next to their name, update the fields, and click **Save Changes**.

## Deactivating a Participant

Rather than deleting, set their status to **Inactive**. This keeps their history intact.

---

# Visit Logs

## What is a Visit Log?

Every time a steward submits a Stewardship Check-In on the public site, it creates a Visit Log. Logs record:

- Which spring was visited
- Who visited
- The visit date
- Conditions observed
- Notes and actions taken

## Viewing Logs

Click **Visit Logs** in the sidebar to see all check-ins in reverse order.

> Logs submitted through the public Stewardship Check-In page appear here automatically.

---

# The Public Website

The public-facing website has three pages visitors can access:

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Overview, mission, and process |
| Stewardship | `/stewardship` | Activity guide and Check-In form |
| About | `/about` | Org story and values |

## The Stewardship Check-In Form

Visitors fill out the form at `/stewardship` to log their visit. When submitted, the entry appears in the Admin Panel under **Visit Logs**.

---

# Common Tasks

## Someone wants to become a steward
Add them as a Participant with status **Active**. They can then submit check-ins on the public site.

## A spring is temporarily closed
Edit the spring and set its status to **Monitoring** or **Inactive**.

## I need to see all visits to a specific spring
Go to **Visit Logs** — filtering by spring will be added in a future update.

---

# Getting Help

For technical issues, contact your developer. Please include:

- What you were trying to do
- What happened instead
- A screenshot if possible

**Admin Panel:** https://sos.skymoco.dev/admin  
**Public Site:** https://sos.skymoco.dev
