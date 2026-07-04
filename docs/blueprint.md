# **App Name**: EventoHub

## Core Features:

- User Authentication: Secure user authentication using Firebase Auth with Google Sign-In and role-based access (organizer/attendee). User details are stored in Firestore.
- Dynamic Event Creation & Management: Event organizers can create, edit, and manage events with details like title, description, category, date/time, venue (with Google Maps), capacity, entry fee, target audience, and poster/banner upload (Firebase Storage). Includes real-time Firestore updates.
- Intelligent Event Discovery: Dynamic homepage displaying events fetched from Firestore with filtering and categories (Free/Paid, Upcoming/Ongoing, Near Me, Trending/Popular). Includes a search bar with live filtering and 'For You' recommendations based on user interests. The system uses an AI tool to determine if it needs to consider previous attended events, location, and search history for personalizing recommendations.
- Secure Event Joining & Ticketing: Attendees can join events with payment options (Cash/Pay at Venue, UPI/Online using Razorpay/Stripe). Generates unique ticket (QR code) upon joining, saved in Firestore, with QR verification for check-in.
- Organizer Analytics Dashboard: Dashboard for organizers to view hosted events with analytics like total attendees, revenue (if paid), ticket scan statistics, and options to edit/cancel events or download attendee lists.
- Attendee Management Dashboard: Personalized page for attendees to view joined events, access digital tickets, see payment/check-in status, and add events to Google Calendar.
- Social Event Sharing: Function to Generate Firebase Dynamic Links for each event, and support easy sharing via WhatsApp, Telegram, Instagram, and more.

## Style Guidelines:

- Primary color: Dark, saturated purple (#9400D3), creating a sophisticated and energetic atmosphere.
- Background color: Desaturated dark purple (#23152E) for a dark, glassy aesthetic.
- Accent color: A cooler purple (#4600D3), for UI accents and highlights that complement the dark background.
- Body font: 'Inter', a grotesque-style sans-serif, will ensure a neutral and machine-like look appropriate for information display. Headline font: 'Space Grotesk' sans-serif provides a computerized feel; the combination of 'Inter' and 'Space Grotesk' delivers excellent legibility in this use case.
- Note: currently only Google Fonts are supported.
- Use minimalistic white icons with a line art style to maintain the clean, dark theme.
- Employ a dark glassmorphism UI with translucent black cards, white blur, and a frosted glass look, set against an abstract dark paper texture or gradient background. Ensure the design is responsive across all devices.
- Implement smooth fade-in/out transitions and ripple effects on buttons for an interactive and modern user experience.