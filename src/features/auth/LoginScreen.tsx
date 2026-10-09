import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { ButterflyIcon } from '../../components/common/ButterflyIcon';
import { useAuth } from '../../presentation/hooks/useAuth';
import { useToast } from '../../context/ToastContext';

interface LoginScreenProps {
  onForgotPassword?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onForgotPassword }) => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('admin@larinails.com');
  const [senha, setSenha] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({ email, senha });
      showToast('🌸 Bem-vinda de volta!', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Credenciais inválidas';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-between"
      style={{ backgroundColor: 'var(--brand-pink)' }}
    >
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-[20px] border-white" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full border-[10px] border-white" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-white mb-14 relative w-full">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/80 bg-white/10 shadow-[0_10px_25px_rgba(255,255,255,0.12)] backdrop-blur-sm">
            <span className="font-script text-5xl leading-none tracking-wide">LM</span>
          </div>
          <h1 className="text-4xl font-script tracking-wide whitespace-nowrap z-10 relative text-center">
            Larissa Machado
          </h1>
          <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.45em] text-white/75">
            Nails
          </p>
          <div className="mt-4 w-28 h-10 border-b-2 border-l-2 border-r-2 border-white/90 relative flex justify-end items-end pr-2">
            <ButterflyIcon className="w-8 h-8 text-white absolute -right-4 -bottom-4 bg-[#FF85C2]" />
          </div>
        </div>

        {errorMessage && (
          <div className="w-full mb-4 p-3 rounded-2xl bg-red-500/80 border border-white/40 text-white text-xs font-medium text-center backdrop-blur-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-pink-200" size={20} />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 backdrop-blur-sm transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-pink-200" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 backdrop-blur-sm transition-all"
              required
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

          <div className="flex justify-end pt-1 pb-4">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-white/80 text-sm font-medium hover:text-white cursor-pointer bg-transparent border-none p-0 transition-colors"
            >
              Esqueceu a senha?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-white text-[#FF85C2] font-bold text-lg shadow-[0_8px_20px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-transform uppercase tracking-wider cursor-pointer hover:bg-white/95 disabled:opacity-70"
          >
            {isSubmitting ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>

        {/* Card informativo de credenciais para teste */}
        <div className="mt-5 w-full p-3 rounded-2xl bg-white/15 border border-white/20 text-white text-xs text-center backdrop-blur-sm">
          <p className="font-semibold text-white/90">Credenciais para Validação:</p>
          <p className="font-mono text-white/85 mt-0.5">admin@larinails.com • admin123</p>
        </div>
      </div>

      <div className="pb-8 text-center z-10">
        <p className="text-white/70 text-xs uppercase tracking-widest">Painel Administrativo</p>
      </div>
    </div>
  );
};
