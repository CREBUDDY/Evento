import { getEvents } from '@/actions/events';
import HomePageClient from './HomePageClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const events = await getEvents();
  return <HomePageClient allEvents={events} />;
}
