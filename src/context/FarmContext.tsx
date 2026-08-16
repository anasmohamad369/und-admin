import React, { createContext, useContext, useState } from 'react';
import { Farm } from '../types/farm';

interface FarmContextType {
  selectedFarmId: string; // 'ALL' or specific farmId (e.g. 'farm-01')
  setSelectedFarmId: (id: string) => void;
  selectedFarm: Farm | null;
  setSelectedFarm: (farm: Farm | null) => void;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFarmId, setSelectedFarmId] = useState<string>('ALL');
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  return (
    <FarmContext.Provider
      value={{
        selectedFarmId,
        setSelectedFarmId,
        selectedFarm,
        setSelectedFarm,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarmContext = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarmContext must be used within a FarmProvider');
  }
  return context;
};
