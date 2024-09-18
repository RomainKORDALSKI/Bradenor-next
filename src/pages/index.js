import Header from '@/app/components/header/Header';
import Search from '@/app/components/header/Search';
import EventMap from '@/app/components/map/EventMap';

const HomePage = () => {
  return (
    <div>
      <Header />
      <Search />
      <EventMap />
    </div>
  );
};

export default HomePage;
