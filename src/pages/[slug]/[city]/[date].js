import { useRouter } from 'next/router';
import EventsPerDate from '@/app/components/EventsPerDate';
import Header from '@/app/components/header/Header';
import Search from '@/app/components/header/Search';

const EventsForSpecificDate = () => {
  const router = useRouter();
  const { slug, city, date } = router.query;

  return (
    <div>
      <Header />
      <Search />
      <EventsPerDate date={date} />
    </div>
  );
};

export default EventsForSpecificDate;
