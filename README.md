# Project: "EzMove"

## Idea:
### Problem
In Egypt, especially in Cairo, public transportation is diverse but scattered across many systems: Metro, buses, BRT, Light Rail, and Monorail. While these services are valuable, newcomers, visitors, students, and even locals often find it difficult to choose the most efficient route due to the lack of a unified platform.

### Solution
The Egypt Transport Guide project aims to solve this challenge by providing a simple, intuitive, and centralized application—available as a web or mobile app—that allows users to:
- Enter their starting point and destination.
- Instantly see optimized route options.
- Compare alternatives based on time, cost, and transfers.
- The goal is to create a fast, accessible, and reliable platform that empowers people to navigate Cairo and travel between Egyptian cities without confusion.

## Features
1. Smart Route Planner
- Allows users to input a start location and a destination.
- The system suggests multiple possible routes, so the user isn’t restricted to only one option.
- Each route is displayed with a step-by-step breakdown (e.g., Walk → Metro Line 1 → Bus → Destination).
- Routes are optimized based on shortest time, lowest cost, or fewest transfers, depending on user needs.

2. Multi-Mode Transport Integration
- Covers all major transport systems available in Egypt:
  - Metro (all lines in Cairo).
  - Buses (traditional lines + modern BRT).
  - Light Rail Transit (LRT).
  - Monorail (New Capital and 6th of October lines).
- Uses GTFS transit data from Transport for Cairo to ensure accuracy.
- Icons/visual cues help users quickly identify the mode of transport.

3. Favorites (Saved Routes)
- Users can save frequently used routes (e.g., home → work, university → dorm).
- Favorites are stored in the database (Firebase/Supabase), so they can be accessed anytime.
- Helps daily commuters plan faster without re-entering the same trip every day.

4. Clean & Responsive UI/UX
- Minimalistic design to avoid clutter and make navigation simple.
- Responsive for all screen sizes (mobile, tablet, desktop).
- Clear icons and visuals for transport modes, so even non-experts can understand routes easily.
- Intuitive input system for choosing start and end points (map-based or text search).

5. Notifications & Updates (Optional)
- Users receive alerts about:
  - Service delays.
  - Temporary closures (e.g., metro maintenance).
  - Real-time congestion updates (if data is available).
- Keeps commuters informed, reducing wasted time and frustration.

6. Multiple Route Options with Breakdown
- Each suggested route includes:
  - Estimated travel time (in minutes).
  - Approximate cost (ticket price).
  - Number of transfers (how many times the user must switch between modes).
- Users can compare routes and choose the one that suits them best (fastest, cheapest, or most direct).

7. Basic Analytics (Optional – for Future Expansion)
- Track which routes are most frequently used.
- Provide insights into travel patterns (e.g., peak hours, popular destinations).
- Could be helpful for transport authorities to improve services.

8. Intercity Travel Support (Optional – Expansion Goal)
- Extend beyond Cairo to cover major cities in Egypt (e.g., Cairo ↔ Alexandria).
- Include railways and long-distance buses for city-to-city trips.
- Helps students, workers, and travelers plan journeys more efficiently.

## Tech Stack
1. UI/UX & Design
- Figma → Used for creating wireframes, prototypes, and user flows.
- Illustrator (Optional) → For designing icons and custom visuals.
- Focus on minimalistic, responsive, and intuitive design to ensure easy navigation for both locals and newcomers.

2. Frontend (Web/Mobile)
- HTML5 → Structure of the web application.
- CSS3 → Styling, responsive layout, animations, and theming.
- JavaScript (ES6+) → Core logic, interactivity, and dynamic updates.
- React.js → For building the web application with reusable components and fast rendering.
- React Native (optional) → For creating a mobile version of the app (Android & iOS).
- Tailwind CSS (optional) → To speed up UI styling with utility-first CSS framework.

3. Transit Data & APIs
- GTFS (General Transit Feed Specification) → The main data source for transit schedules and routes.
- Transport for Cairo (TfC) → Provides Cairo’s GTFS data and GIS datasets.
- GTFS-Flex (optional) → For future integration of on-demand transport services.
- Map APIs (e.g., Google Maps API, OpenStreetMap, or Leaflet.js) → For location input, route visualization, and geocoding (turning addresses into coordinates).

4. Backend & Database
- Firebase (Firestore, Authentication, Cloud Functions):
  - Handles user accounts and saved routes.
  - Stores favorites and preferences.
  - Provides analytics and push notifications.
- Supabase (alternative to Firebase):
  - PostgreSQL-based backend for storing transit and user data.
  - Real-time updates and user authentication.
- Node.js (optional) → For custom backend APIs if needed.

5. Hosting & Deployment
- Netlify / Vercel → For hosting the web app (fast deployment + continuous integration with GitHub).
- Firebase Hosting → Alternative hosting option integrated with Firebase backend.
- Expo (for React Native) → For building, testing, and deploying the mobile app.

6. Testing & Version Control
- Jest / React Testing Library → Unit and integration testing for React components.
- Git & GitHub → Version control, collaboration, and project documentation.

7. Optional / Future Expansion
- Real-Time Data Integration → APIs for live bus/metro tracking (if available from providers).
- Analytics Dashboard → To track app usage and most popular routes.
- CI/CD Pipelines → GitHub Actions for automated testing and deployment.

## Team Members
- Safaa Taher : https://github.com/SafaaTaher
- Noura Mamdouh : https://github.com/Noura201
- Sara Elwaraky : https://github.com/saraElwaraky
- Yasmine Hatim : https://github.com/Yasminasoliman
- Aya Sherif : https://github.com/ayaengsherif13200-commits
- Marem Khaled : https://github.com/gitmariemkhaled/
