import React from 'react';
import Providers from '@/components/Providers';
import './globals.css';
import { Inter } from 'next/font/google';
import AppBar from '@/components/AppBar';
import RootStyleRegistry from '@/components/mui/emotion';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="emotion-insertion-point"
          content=""
        />
      </head>
      <body className={inter.className}>
        <RootStyleRegistry>
          <Providers>
            <AppBar />
            {children}
          </Providers>
        </RootStyleRegistry>
      </body>
    </html>
  );
}
