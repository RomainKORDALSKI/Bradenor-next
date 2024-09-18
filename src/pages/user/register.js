import React from 'react';
import { useRouter } from 'next/router';
import Header from '@/app/components/header/Header';
import Search from '@/app/components/header/Search';
import Register from '@/app/components/user/Register';

const RegisterPage = () => {
  const router = useRouter();

  return (
    <div>
      <Header />
      <Search />
      <Register />
    </div>
  );
};

export default RegisterPage;