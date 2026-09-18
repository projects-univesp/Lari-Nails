import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';
import { LoginScreen } from './features/auth/LoginScreen';
import { ForgotPasswordScreen } from './features/auth/ForgotPasswordScreen';
import { DashboardTab } from './features/dashboard/DashboardTab';
import { AgendaTab } from './features/agenda/AgendaTab';
import { ClientesTab } from './features/clients/ClientesTab';
import { ConfiguracoesTab } from './features/settings/ConfiguracoesTab';
import { OverlayScreen } from './features/overlays/OverlayScreen';
import type { ScreenStackItem, ScreenName, TabType } from './types';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [screenStack, setScreenStack] = useState<ScreenStackItem[]>([]);

  const openScreen = (screenName: ScreenName, data: unknown = null) => {
    setScreenStack((prev) => [...prev, { name: screenName, data }]);
  };

  const closeScreen = () => {
    setScreenStack((prev) => prev.slice(0, -1));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const activeScreen = screenStack.length > 0 ? screenStack[screenStack.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-900 sm:bg-gray-100 flex justify-center font-brand font-normal text-gray-700">
      <div className="w-full max-w-md bg-[#FAFAFA] relative shadow-2xl overflow-hidden min-h-screen sm:h-[850px] sm:my-8 sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-800 flex flex-col">
        {/* Notificações Toasts Globais */}
        <ToastContainer />

        {!isAuthenticated ? (
          isForgotPassword ? (
            <ForgotPasswordScreen onBackToLogin={() => setIsForgotPassword(false)} />
          ) : (
            <LoginScreen
              onLogin={handleLogin}
              onForgotPassword={() => setIsForgotPassword(true)}
            />
          )
        ) : (
          <>
            {activeScreen ? (
              <OverlayScreen
                screen={activeScreen}
                onClose={closeScreen}
                onOpenScreen={openScreen}
              />
            ) : (
              <>
                <AppHeader />
                <main className="p-4 pb-28 overflow-y-auto h-full no-scrollbar scroll-smooth flex-1">
                  {activeTab === 'dashboard' && <DashboardTab onOpenScreen={openScreen} />}
                  {activeTab === 'agenda' && <AgendaTab onOpenScreen={openScreen} />}
                  {activeTab === 'clientes' && <ClientesTab onOpenScreen={openScreen} />}
                  {activeTab === 'config' && <ConfiguracoesTab onOpenScreen={openScreen} />}
                </main>

                {(activeTab === 'dashboard' || activeTab === 'agenda') && (
                  <button
                    type="button"
                    onClick={() => openScreen('add_appointment')}
                    aria-label="Adicionar agendamento"
                    className="absolute bottom-24 right-6 w-14 h-14 bg-[#FF85C2] text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(255,133,194,0.4)] hover:bg-[#e86ba8] hover:scale-105 transition-all z-20 active:scale-95 cursor-pointer"
                  >
                    <Plus size={28} />
                  </button>
                )}

                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ToastProvider>
  );
}