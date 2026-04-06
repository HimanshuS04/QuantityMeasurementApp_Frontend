# QuantityMeasurementApp Frontend

## 🌐 Overview
A polished frontend project for the Quantity Measurement application, showcasing both a plain web UI and an Angular-based SPA. The app supports authentication, quantity operations, and history viewing with role-based admin controls.

## 🚀 Features Implemented

### UC19 — Web Frontend (HTML, CSS, JavaScript)
- Built a clean browser-based frontend using plain web technologies
- Added login and registration UI flows
- Created an interactive dashboard for:
  - selecting measurement category
  - choosing operation type
  - entering values and units
  - displaying results instantly
- Supported categories:
  - Length
  - Weight
  - Volume
  - Temperature
- Added actions:
  - Comparison
  - Conversion
  - Arithmetic
- Organized frontend logic into modular JavaScript:
  - `apiClient.js` for request handling
  - `auth.js` for login/register and JWT storage
  - `operations.js` for quantity and history API calls
  - `main.js` for event binding and UI state management
- Stored JWT and user email in `localStorage` for session continuity
- Implemented history features:
  - My History for authenticated users
  - Admin User History for admins
- Added responsive styling for better desktop and mobile support

### UC20 — Angular Frontend (Angular SPA)
- Created a modern Angular frontend using standalone components
- Designed a public quantity dashboard with login required only for history access
- Added a header-based user experience for:
  - Login / Signup for public users
  - Email + Logout for logged-in users
- Implemented session handling with `sessionStorage` for:
  - JWT token
  - email
  - role
- Restored session state on refresh
- Built Angular dashboard support for:
  - category selection
  - action selection
  - comparison
  - conversion
  - arithmetic
- Integrated with backend APIs using Angular `HttpClient`
- Added history features for users and admin-only history access
- Used responsive SCSS and clean layout patterns

## 🧠 Concepts Demonstrated
- Frontend-backend integration using Fetch API and Angular HttpClient
- Modular JavaScript architecture
- Browser-side JWT storage and parsing
- DOM event handling and UI state updates
- Role-based UI rendering
- Responsive design and dynamic history rendering
- Angular component communication and state handling

## 📁 Project Structure
- `index.html` — static HTML structure for the web frontend
- `styles.css` — styling and responsive design
- `apiClient.js` — shared API request utilities
- `auth.js` — authentication and token management
- `operations.js` — quantity operation and history calls
- `main.js` — UI events and rendering logic
- Angular app files — standalone component-based SPA implementation

## ✅ Result
A full frontend implementation for Quantity Measurement that supports both classic web pages and a modern Angular single-page experience, with authentication, operation handling, history management, and admin-aware UI controls.
