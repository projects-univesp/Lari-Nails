import React from 'react';
import { Home, Calendar as CalendarIcon, Users, Settings } from 'lucide-react';
import { NavItem } from './NavItem';
import type { TabType } from '../../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="absolute bottom-0 w-full bg-white flex justify-around items-center h-20 px-2 pb-2 sm:pb-4 sm:h-24 z-30 sm:rounded-b-[2rem] shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
      <NavItem
        icon={<Home />}
        label="Início"
        isActive={activeTab === 'dashboard'}
        onClick={() => setActiveTab('dashboard')}
      />
      <NavItem
        icon={<CalendarIcon />}
        label="Agenda"
        isActive={activeTab === 'agenda'}
        onClick={() => setActiveTab('agenda')}
      />
      <NavItem
        icon={<Users />}
        label="Clientes"
        isActive={activeTab === 'clientes'}
        onClick={() => setActiveTab('clientes')}
      />
      <NavItem
        icon={<Settings />}
        label="Ajustes"
        isActive={activeTab === 'config'}
        onClick={() => setActiveTab('config')}
      />
    </nav>
  );
};

