import { getEvents } from '@/actions/events';
import ExploreClient from './ExploreClient';

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const events = await getEvents();
  return <ExploreClient allEvents={events} />;
}
