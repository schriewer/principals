'use client';
import React, { createContext, useContext } from 'react';
import type { User } from '@/types';

const UserContext = createContext<User | null>(null);

export function UserProvider({ user, children }: { user: User; children: React.ReactNode }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
export function useUser() {
  return useContext(UserContext);
}
