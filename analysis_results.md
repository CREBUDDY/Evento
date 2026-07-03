# Evento Platform Analysis

I have completed an analysis of the Evento project codebase. Here are the key findings regarding the architecture, tech stack, and features of the application.

## 1. Project Overview & Architecture
**Evento** is an event management platform primarily designed for college societies and organizations. It provides dual functionality: an Organizer dashboard (for creating/managing events) and an Attendee dashboard (for browsing and purchasing tickets).

The project is built on **Next.js 15 (App Router)** and utilizes a serverless architecture powered by **Firebase** (Auth, Firestore).

## 2. Technology Stack
- **Frontend Framework:** Next.js (React 18) with Turbopack for local development.
- **Styling:** Tailwind CSS with `tailwindcss-animate`.
- **UI Components:** [Radix UI](https://www.radix-ui.com/) primitives wrapped in a custom design system (likely generated via shadcn/ui). Includes complex components like Carousels (Embla), Dialogs, Tabs, and Date Pickers (`react-day-picker`).
- **Icons:** `lucide-react`.
- **Form Handling & Validation:** `react-hook-form` coupled with `zod`.
- **Backend/BaaS:** Firebase v11 (Authentication and Firestore).
- **AI Integration:** The project includes dependencies for Genkit (`@genkit-ai/google-genai`, `@genkit-ai/next`), suggesting features like AI-assisted event creation or recommendations are either planned or implemented.

## 3. Core Features & Routing Structure
The application structure (`src/app`) reveals several core user flows:

- **Public Pages:**
  - `/` (Home): Displays an animated hero section and lists upcoming events (filterable by All, Free, Paid).
  - `/events`: Likely a dedicated page for browsing events in detail.
  - `/login`: Authentication page handling user sign-in.
  - `/privacy`, `/terms`: Standard legal pages.
- **Dashboard (`/dashboard`):**
  - **Organizer View (`/dashboard/organizer`):** Allows users to create, manage, and track their hosted events. Also includes a `/drafts` sub-route for unpublished events.
  - **Attendee View (`/dashboard/attendee`):** Where users can access their tickets and view joined events.
- **Event Creation (`/create-event`, `/creato`):** Dedicated routes for the event creation wizard/form.

## 4. State Management & Data Flow
- **Firebase Context:** The application heavily relies on a custom `FirebaseClientProvider` (`src/firebase/provider.tsx`) that wraps the application in `src/app/layout.tsx`. This provider manages:
  - Initialization of the Firebase App.
  - Firestore and Auth instances.
  - Global User state (`useUser` hook) which listens to `onAuthStateChanged`.
- **Data Fetching:** Data is fetched directly from Firestore using custom hooks like `useCollection` and `useFirestore`. For example, the homepage queries the `creato` collection for published events.

## 5. Security & Data Model
The database uses **Firestore** with a denormalized structure. The `firestore.rules` file enforces a strict user-ownership model:
- **`users` Collection:** Stores user profile information. Users can only read and write their own profile data (`userId` must match `request.auth.uid`).
- **`creato` (Events) Collection:** Stores event details. Events are publicly readable, but write access is restricted to the event organizer (enforced via an `organizerId` field on the event document).

> [!NOTE]
> The database schema refers to the events collection as `creato` rather than `events`.

## Next Steps
If there are specific areas you would like to modify, enhance, or debug (such as the Genkit AI integration, the event creation flow, or the dashboard layout), please let me know!
