'use client'

import { ReactNode } from 'react';
import { AuthProvider } from './context' 

type Props = {
    children: ReactNode;
  };

export function Providers({ children }: Props) {
  return (
    <AuthProvider>
        {children}
     </AuthProvider>
  );
}