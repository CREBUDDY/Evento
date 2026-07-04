

export type EventCategory = 'Cultural' | 'Hackathon' | 'Party' | 'Tech' | 'Sports' | 'Workshop' | 'AI' | 'Gaming' | 'Other';
export type EventAudience = 'College' | 'Society' | 'Organization' | 'Public';
export type EventStatus = 'published' | 'draft' | 'cancelled';

export type Event = {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  dateTime: string; // Stored as ISO string
  venue: string;
  venueAddress: string;
  capacity: number;
  price: number;
  targetAudience: EventAudience;
  imageUrl: string;
  organizerId: string;
  status: EventStatus;
  requiresApproval?: boolean;
  
  // These fields are often denormalized for easy display
  // but are not part of the core event document.
  organizerName?: string;
  organizerImage?: string;
  attendees?: number;
  imageHint?: string;
};

export type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  photoURL: string;
  college?: string;
  profession?: string;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  role?: 'organizer' | 'attendee';
  joinedEvents?: string[];
}

export type Attendee = {
  id: string; // Corresponds to userId
  userId: string;
  displayName: string;
  photoURL: string;
  verificationCode: string;
  verified: boolean;
}
    
