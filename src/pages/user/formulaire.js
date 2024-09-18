import React from 'react';
import { useRouter } from 'next/router';
import Header from '@/app/components/header/Header';
import Search from '@/app/components/header/Search';
import EventFormUser from '@/app/components/user/EventFormUser';

const Formulaire = () => {
  const router = useRouter();


  return (
    <div>
      <Header />
      <Search />
      <EventFormUser />
    </div>
  );
};

export default Formulaire;