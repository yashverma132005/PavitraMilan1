# Multi-Agent Development Prompt – Matrimonial Platform

You are a team of 4 expert AI software engineers collaborating to build a production-ready matrimonial platform.

Project Name: HaihayaMilan

Goal:
Build a secure, scalable, modern matrimonial website that allows users to register, create detailed profiles, search compatible matches, send interests, chat after matching, and verify authenticity through multiple verification methods.

Tech Stack:

Frontend:

* React
* Vanilla CSS
* React Router
* Axios

Backend:

* Node.js
* Express.js

Database:

* PostgreSQL
* Prisma ORM

Authentication:

* Firebase Authentication

  * Phone OTP
  * Email Verification
  * Google Sign-In

Storage:

* Cloudinary

Real-Time Features:

* Socket.IO

Deployment:

* Vercel (Frontend)
* Render (Backend)

---

# Agent 1 — Frontend Architect

Responsibilities:

Design and develop all frontend pages and components.

Pages:

* Landing Page
* Login
* Registration
* OTP Verification
* Dashboard
* Profile Creation
* Profile Edit
* Browse Profiles (filters and sorting)
* Profile Details
* Interests
* Matches
* Chat
* Settings
* Report User
* About
* Privacy Policy

Requirements:

* Mobile-first responsive design
* Vanilla CSS only
* Dark & Light Theme
* Reusable component architecture
* Form validation
* Error handling
* Loading states
* Accessibility

Deliverables:

* Component hierarchy
* Folder structure
* Routing setup
* CSS architecture
* Complete frontend implementation

---

# Agent 2 — Backend Engineer

Responsibilities:

Build the complete backend API.

Authentication:

* Firebase Integration
* JWT Session Handling
* Route Protection

APIs:

Users

* Register
* Login
* Update User
* Delete User

Profiles

* Create Profile
* Update Profile
* View Profile
* Browse Profiles with Filters and Sorting

Interests

* Send Interest
* Accept Interest
* Reject Interest

Matches

* Create Match
* Fetch Matches

Messages

* Send Message
* Fetch Conversation

Reports

* Report User
* Block User

Requirements:

* RESTful architecture
* MVC structure
* Validation middleware
* Rate limiting
* Helmet security
* Error handling

Deliverables:

* API routes
* Controllers
* Services
* Middleware
* API documentation

---

# Agent 3 — Database & Realtime Engineer

Responsibilities:

Design database and realtime systems.

Database Models:

Users
Profiles
PartnerPreferences
Interests
Matches
Messages
Reports
BlockedUsers
VerificationRequests
Notifications

Requirements:

* Prisma schema
* Foreign key relationships
* Optimized indexing
* Profile search optimization
* Migration scripts

Realtime Features:

* Socket.IO server
* Private messaging
* Online status
* Typing indicators
* Read receipts

Deliverables:

* Database schema
* ER diagram
* Prisma models
* Realtime architecture

---

# Agent 4 — Security, Verification & Product Lead

Responsibilities:

Design trust, verification, moderation, and deployment systems.

Verification:

* Mobile OTP Verification
* Email Verification
* Photograph Verification
* Optional Government ID Upload
* Verification Badge System

Moderation:

* Report User
* Block User
* Admin Review Queue
* Fake Profile Detection
* Suspicious Activity Monitoring

Security:

* JWT Security
* Input Sanitization
* Environment Variables
* File Upload Validation
* Access Control

Deployment:

* Vercel Configuration
* Render Configuration
* Environment Setup
* CI/CD Recommendations

Documentation:

* README
* Setup Guide
* Deployment Guide
* API Documentation

Deliverables:

* Security architecture
* Verification workflow
* Moderation workflow
* Deployment plan

---

# Registration Form Requirements

Create a 4-step registration process.

Step 1: Personal Details

* Full Name
* Gender
* Date of Birth
* Age (Auto Calculated)
* Birth Time
* Marital Status
* Height
* Weight
* Blood Group
* Profile Photo
* Mobile Number
* Email Address
* City
* State
* Country
* About Me
* Expectations From Life Partner

Step 2: Education & Career

* Highest Qualification
* College/University
* Occupation
* Company Name
* Annual Income
* Work Location

Step 3: Family & Religion

* Father's Name
* Father's Occupation
* Mother's Name
* Mother's Occupation
* Number of Brothers
* Number of Sisters
* Family Type
* Family Status
* Religion
* Caste
* Sub-Caste
* Gotra
* Manglik Status
* Mother Tongue

Optional Horoscope:

* Date of Birth
* Time of Birth
* Place of Birth

Lifestyle:

* Diet
* Smoking Habit
* Drinking Habit
* Hobbies & Interests

Step 4: Partner Preferences

* Preferred Age Range
* Preferred Height Range
* Preferred Education
* Preferred Occupation
* Preferred Location
* Preferred Religion/Caste
* Other Expectations

---

# Success Criteria

The final system must support:

Register → Verify Account → Complete Profile → Browse Profiles → Send Interest → Accept Interest → Match → Share WhatsApp Contact → Report/Block User

Generate:

* Complete architecture
* Folder structure
* Database schema
* API design
* UI design
* Security strategy
* Deployment strategy
* Documentation

Act as a coordinated team and ensure all agents produce compatible outputs.
