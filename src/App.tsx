import { useEffect, useState } from 'react';
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
import { useToast } from './context/ToastContext';
import { useClients } from './presentation/hooks/useClients';
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
  const { clients } = useClients();
  const { showToast } = useToast();
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [screenStack, setScreenStack] = useState<ScreenStackItem[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const birthdayClients = clients.filter((client) => {
      if (!client.bday) return false;
      const parts = client.bday.split(/[/-]/).map(Number);
      const month = client.bday.includes('-') ? parts[1] : parts[1];
      const day = client.bday.includes('-') ? parts[2] : parts[0];
      return month === today.getMonth() + 1 && day === today.getDate();
    });
    if (birthdayClients.length === 0 || sessionStorage.getItem(`birthday-reminder-${todayKey}`)) return;
    sessionStorage.setItem(`birthday-reminder-${todayKey}`, 'shown');
    const names = birthdayClients.map((client) => client.nome).join(', ');
    showToast(`Hoje é aniversário de ${names}. Confira o perfil e envie uma mensagem!`, 'info');
  }, [clients, currentUser, showToast]);

  const openScreen = (screenName: ScreenName, data: unknown = null) => {
    setScreenStack((prev) => [...prev, { name: screenName, data }]);
  };

  const closeScreen = () => {
    setScreenStack((prev) => prev.slice(0, -1));
  };

  const activeScreen = screenStack.length > 0 ? screenStack[screenStack.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-900 sm:bg-gray-100 flex justify-center font-brand font-normal text-gray-700">
      <div className="w-full max-w-md bg-[#FAFAFA] relative shadow-2xl overflow-hidden min-h-screen sm:h-[850px] sm:max-h-[calc(100vh-2rem)] sm:my-8 sm:rounded-[2.5rem] sm:border-[8px] sm:border-gray-800 flex flex-col">
        {/* Notificações Toasts Globais */}
        <ToastContainer />

        {isLoading ? (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center text-white"
            style={{ backgroundColor: 'var(--brand-pink)' }}
          >
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm animate-pulse border border-white/30">
              <span className="font-script text-4xl leading-none tracking-wide">LM</span>
            </div>
            <h1 className="text-3xl font-script tracking-wide mb-1 text-center">Larissa Machado</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/80 mb-3">Nails</p>
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
                <AppHeader onOpenScreen={openScreen} />
                <main className="flex-1 min-h-0 overflow-y-auto px-4 py-4 pb-28 no-scrollbar scroll-smooth">
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