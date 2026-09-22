import { useState } from 'react';
import { Plus } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav } from './components/layout/BottomNav';
import { ToastContainer } from './components/common/Toast';
import { ToastProvider } from './context/ToastContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './presentation/context/AuthContext';
import { useAuth } from './presentation/hooks/useAuth';
import { LoginScreen } from './features/auth/LoginScreen';
import { SetupScreen } from './features/auth/SetupScreen';
import { ForgotPasswordScreen } from './features/auth/ForgotPasswordScreen';
import { DashboardTab } from './features/dashboard/DashboardTab';
import { AgendaTab } from './features/agenda/AgendaTab';
import { ClientesTab } from './features/clients/ClientesTab';
import { ConfiguracoesTab } from './features/settings/ConfiguracoesTab';
import { OverlayScreen } from './features/overlays/OverlayScreen';
import { ButterflyIcon } from './components/common/ButterflyIcon';
import type { ScreenStackItem, ScreenName, TabType } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { currentUser, isSetupCompleted, isLoading } = useAuth();
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [screenStack, setScreenStack] = useState<ScreenStackItem[]>([]);

  const openScreen = (screenName: ScreenName, data: unknown = null) => {
    setScreenStack((prev) => [...prev, { name: screenName, data }]);
  };

  const closeScreen = () => {
    setScreenStack((prev) => prev.slice(0, -1));
  };

  const activeScreen = screenStack.length > 0 ? screenStack[screenStack.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-900 sm:bg-gray-100 flex justify-center font-brand font-normal text-gray-700">
      <div className="w-full max-w-md bg-[#FAFAFA] relative shadow-2xl overflow-hidden min-h-screen sm:h-[850px] sm:my-8 sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-800 flex flex-col">
        {/* Notificações Toasts Globais */}
        <ToastContainer />

        {isLoading ? (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center text-white"
            style={{ backgroundColor: 'var(--brand-pink)' }}
          >
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm animate-pulse border border-white/30">
              <ButterflyIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-script tracking-wide mb-3">Larissa Machado</h1>
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin mt-2" />
          </div>
        ) : isSetupCompleted === false ? (
          <SetupScreen />
        ) : !currentUser ? (
          isForgotPassword ? (
            <ForgotPasswordScreen onBackToLogin={() => setIsForgotPassword(false)} />
          ) : (
            <LoginScreen onForgotPassword={() => setIsForgotPassword(true)} />
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
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}