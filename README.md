# ✈️ TripOS — Travel Operating System

TripOS is a modern travel planning and trip management web application designed to bring your entire travel workspace into one place.

Instead of managing destinations, itineraries, activities, expenses, and trip information across multiple apps and notes, TripOS provides a centralized workspace where travelers can plan, organize, and manage their trips.

---

## 🌍 What is TripOS?

TripOS stands for **Travel Operating System**.

It is a frontend-focused travel management application built with React that allows users to create and manage trips, build itineraries, track expenses, discover destinations, and manage their travel workspace.

The goal of TripOS is to make trip planning more structured and easier to manage by bringing different parts of a trip into a single interface.

---

## ✨ Features

### 🏠 Dashboard

The dashboard provides an overview of the user's travel workspace.

It includes:

- Active trip overview
- Trip destination and dates
- Trip status
- Budget overview
- Amount spent
- Remaining budget
- Number of planned activities
- List of saved trips
- Quick access to the trip planner

---

### 🗺️ Trip Planner

The planner allows users to create and manage their daily itinerary.

Users can:

- Add activities
- Select activity type
- Set activity time
- Assign activities to specific days
- Add notes
- Add activity costs
- Remove activities
- View activities in a timeline
- Switch between timeline and map views
- Export itinerary data as JSON

Supported activity types include:

- ✈️ Flight
- 🏨 Stay
- 🍴 Food
- 🚗 Transport
- 🧭 Experience

---

### 💰 Budget Management

TripOS includes a dedicated budget management system.

Users can:

- Set a trip budget
- Track expenses
- Add new expenses
- Categorize expenses
- Calculate total spending
- Calculate remaining budget
- View spending percentages
- View recent transactions
- Break spending down by category

Supported expense categories include:

- Food
- Stay
- Transport
- Experience
- Shopping

---

### 🌎 Destination Discovery

The Discover section provides a collection of destinations that users can explore and save.

Users can:

- Browse destinations
- Save destinations to favorites
- Remove destinations from favorites
- Copy destination information

Example destinations include:

- Kyoto
- Lisbon
- Bali
- Cape Town
- Amalfi
- Istanbul

---

### ❤️ Favorites

Users can save destinations they are interested in.

Favorites are stored locally so they remain available when the user reloads the application.

---

### 👤 User Profile

TripOS includes a user profile section where users can access their account controls.

The profile section includes:

- User information
- Traveler account information
- Profile settings access
- Account section
- Login/logout functionality

Authentication in the current version is handled locally in the browser.

---

### 🔐 Local Authentication

The current version includes a lightweight local authentication system.

Users can:

- Log in
- Log out
- Maintain their login state across page refreshes

Authentication state is stored using browser `localStorage`.

> **Note:** This is not server-side authentication. A production version would use a backend authentication system with secure password handling and sessions/JWT.

---

### 🌙 Dark & Light Mode

TripOS supports:

- Dark mode
- Light mode

The selected theme is saved locally so the preference persists between sessions.

---

### 💾 Local Data Persistence

TripOS currently uses browser `localStorage` for application data.

This allows the application to preserve:

- Trips
- Active trip
- Itinerary activities
- Expenses
- Favorites
- Theme preference
- Login state

No external database is required to run the current version.

---

### 📱 Responsive Interface

The interface is designed to work across different screen sizes.

It includes:

- Responsive sidebar
- Mobile navigation
- Responsive cards
- Responsive itinerary layouts
- Mobile-friendly modals
- Responsive dashboard

---

## 🛠️ Technology Stack

### Frontend

- React
- React DOM
- React Router
- JavaScript
- CSS

### UI & Icons

- Lucide React
- Custom CSS
- Responsive layouts

### Development

- Vite
- npm
- Git
- GitHub

### Data Storage

- Browser `localStorage`

---

## 📂 Project Structure

```text
tripos-pro/
│
├── src/
│   ├── main.jsx
│   └── styles.css
│
├── public/
│
├── index.html
├── package.json
├── package-lock.json
├── .gitignore
└── README.md