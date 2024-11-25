'use client';

import { WikipediaInfo } from '@/lib/type';
import React, { createContext, useContext, useMemo, useState } from 'react';

// Define types
interface FilterContextType {
  setInput: React.Dispatch<React.SetStateAction<string | null>>;
  selectedField: string | null;
  setSelectedField: React.Dispatch<React.SetStateAction<string | null>>;
  selectedWork: string | null;
  setSelectedWork: React.Dispatch<React.SetStateAction<string | null>>;
  setPioneers: React.Dispatch<React.SetStateAction<WikipediaInfo[] | null>>;
  pioneers: WikipediaInfo[] | null;
  allFields: string[];
  allNotableWorks: string[];
  input: string | null;
}

// Create Context
const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedWork, setSelectedWork] = useState<string | null>(null);
  const [pioneers, setPioneers] = useState<WikipediaInfo[] | null>(null);
  const [input, setInput] = useState<string | null>(null);

  // Extract dynamic fields and works using useMemo for optimization
  const allFields = useMemo(
    () =>
      Array.from(new Set(pioneers?.flatMap((person) => person.fieldOfWork))),
    [pioneers],
  );

  const allNotableWorks = useMemo(
    () =>
      Array.from(new Set(pioneers?.flatMap((person) => person.notableWorks))),
    [pioneers],
  );

  return (
    <FilterContext.Provider
      value={{
        input,
        selectedField,
        setSelectedField,
        selectedWork,
        setSelectedWork,
        allFields,
        allNotableWorks,
        pioneers,
        setPioneers,
        setInput,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Custom Hook
export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
