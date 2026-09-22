import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import { ButterflyIcon } from '../../components/common/ButterflyIcon';
import { useAuth } from '../../presentation/hooks/useAuth';
import { useToast } from '../../context/ToastContext';

export const SetupScreen: React.FC = () => {
  const { setup } = useAuth();
  const { showToast } = useToast();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await setup({ nome, email, senha });
      showToast('✨ Setup inicial concluído com sucesso!', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao realizar configuração inicial';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-between overflow-y-auto"
      style={{ backgroundColor: 'var(--brand-pink)' }}
    >
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-[20px] border-white" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full border-[10px] border-white" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 z-10 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-white mb-8 relative w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-3 backdrop-blur-sm border border-white/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Primeiro Acesso</h1>
          <p className="text-white/80 text-xs mt-1 max-w-[260px]">
            Crie o perfil de administradora para começar a usar a Lari Nails API
          </p>
          <div className="w-4/5 h-6 border-b-2 border-l-2 border-r-2 border-white mt-3 relative flex justify-end items-end pr-2">
            <ButterflyIcon className="w-6 h-6 text-white absolute -right-3 -bottom-3 bg-[#FF85C2]" />
          </div>
        </div>

        {errorMessage && (
          <div className="w-full mb-4 p-3 rounded-2xl bg-red-500/80 border border-white/40 text-white text-xs font-medium text-center backdrop-blur-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-pink-200" size={20} />
            <input
              type="text"
              placeholder="Seu Nome Completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 backdrop-blur-sm transition-all text-sm"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-pink-200" size={20} />
            <input
              type="email"
              placeholder="E-mail de acesso"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 backdrop-blur-sm transition-all text-sm"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-pink-200" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Crie uma Senha (mínimo 6 dígitos)"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 backdrop-blur-sm transition-all text-sm"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              className="absolute right-4 top-3.5 text-pink-200 hover:text-white cursor-pointer"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-white text-[#FF85C2] font-bold text-base shadow-[0_8px_20px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-transform uppercase tracking-wider cursor-pointer hover:bg-white/95 mt-4 disabled:opacity-70"
          >
            {isSubmitting ? 'Configurando...' : 'Concluir Setup'}
          </button>
        </form>
      </div>

      <div className="pb-6 text-center z-10">
        <p className="text-white/70 text-xs uppercase tracking-widest">Painel Administrativo • Setup</p>
      </div>
    </div>
  );
};
