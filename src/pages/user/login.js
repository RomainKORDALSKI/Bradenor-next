import React from 'react';
import { useRouter } from 'next/router';
import Header from '@/app/components/header/Header';
import Search from '@/app/components/header/Search';
import Login from '@/app/components/user/Login';

const LoginPage = () => {
  const router = useRouter();


  return (
    <div>
      <Header />
      <Search />
      <Login />
    </div>
  );
};

export default LoginPage;