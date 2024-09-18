import React from 'react';
import { useRouter } from 'next/router';
import NearbyEvents from '@/app/components/NearbyEvents';
import Header from '@/app/components/header/Header';
import Search from '@/app/components/header/Search';

const CityPage = () => {
  const router = useRouter();
  const { lat, lon, city, cp } = router.query;

  return (
    <div>
      <Header />
      <Search />
      {lat && lon ? (
        <NearbyEvents lat={lat} lon={lon} />
      ) : city ? (
        <NearbyEvents city={city} cp={cp}/>
      ) : (
        <NearbyEvents />
      )}
    </div>
  );
};

export default CityPage;




