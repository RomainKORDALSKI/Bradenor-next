import React from 'react';
import { useRouter } from 'next/router';
import CityEvents from '@/app/components/CityEvents';
import Header from '@/app/components/header/Header';
import Search from '@/app/components/header/Search';

const CityEventsPage = () => {
  const router = useRouter();
  const { city } = router.query;

  return (
    <div>
      <Header />
      <Search />
      <CityEvents city={city} />
    </div>
  );
};

export default CityEventsPage;