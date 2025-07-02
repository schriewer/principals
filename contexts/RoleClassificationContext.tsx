'use client';
import React, { createContext, useContext } from 'react';
import type { RoleClassification } from '@/types';

const RoleClassificationContext = createContext<RoleClassification[]>([]);

export function RoleClassificationProvider({
  value,
  children,
}: {
  value: RoleClassification[];
  children: React.ReactNode;
}) {
  return (
    <RoleClassificationContext.Provider value={value}>
      {children}
    </RoleClassificationContext.Provider>
  );
}
export function useRoleClassifications() {
  return useContext(RoleClassificationContext);
}
