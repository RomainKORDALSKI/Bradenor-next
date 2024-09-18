import React from 'react';
import '@/app/styles/global.scss';
import { FavoritesProvider } from '@/app/context/FavoritesContext';
import ScrollToTopButton from '@/app/components/header/ScrollTopButton';
import { AuthProvider } from '@/app/context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
    <FavoritesProvider>
      <Component {...pageProps} />
      <ScrollToTopButton />
    </FavoritesProvider>
    </AuthProvider>
  );
}

export default MyApp;