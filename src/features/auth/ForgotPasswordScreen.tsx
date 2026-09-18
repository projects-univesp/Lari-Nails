import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ButterflyIcon } from '../../components/common/ButterflyIcon';

interface ForgotPasswordScreenProps {
  onClose?: () => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onClose,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('contato@larissamachado.com');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  const handleReturn = () => {
    if (onClose) {
      onClose();
    }
    onBackToLogin();
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-between"
      style={{ backgroundColor: 'var(--brand-pink)' }}
    >
      {/* Detalhes geométricos decorativos em branco (igual à tela de Login) */}
      <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full border-[20px] border-white" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full border-[10px] border-white" />
      </div>

      {/* Cabeçalho de navegação de retorno */}
      <div className="pt-10 px-6 z-10">
        <button
          type="button"
          onClick={handleReturn}
          className="flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft size={20} />
          <span>Voltar ao Login</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Identidade Visual da Marca */}
        <div className="flex flex-col items-center text-white mb-10 relative w-full">
          <div className="flex items-end justify-center w-full relative h-16 mb-2">
            <div className="absolute left-1/4 h-16 w-0.5 bg-white" />
            <div className="text-6xl font-extralight tracking-widest absolute right-1/4 flex">
              <span className="font-light">M</span>
            </div>
          </div>
          <h1 className="text-4xl font-script tracking-wide whitespace-nowrap z-10 relative">
            Larissa Machado
          </h1>
          <div className="w-3/5 h-8 border-b-2 border-l-2 border-r-2 border-white mt-1 relative flex justify-end items-end pr-2">
            <ButterflyIcon className="w-7 h-7 text-white absolute -right-3.5 -bottom-3.5 bg-[#FF85C2]" />
          </div>
        </div>

        {/* Card e Formulário */}
        <div className="w-full text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Recuperar Acesso</h2>
          <p className="text-white/80 text-xs leading-relaxed max-w-[280px] mx-auto mb-8 font-medium">
            Digite seu e-mail para receber o link de recuperação de senha e redefinir seu acesso.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-pink-200" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail cadastrado"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:bg-white/30 backdrop-blur-sm transition-all text-sm font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-white text-[#FF85C2] font-bold text-lg shadow-[0_8px_20px_rgba(0,0,0,0.1)] active:scale-[0.98] transition-transform uppercase tracking-wider cursor-pointer"
              >
                Enviar Link
              </button>
            </form>
          ) : (
            <div className="bg-white/20 border border-white/30 rounded-3xl p-6 text-white backdrop-blur-sm space-y-4 animate-in fade-in zoom-in-95 duration-400">
              <div className="w-14 h-14 rounded-full bg-white text-[#FF85C2] mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-bold text-lg">E-mail Enviado!</h3>
              <p className="text-xs text-white/90 leading-relaxed font-medium">
                Enviamos as instruções para <span className="font-bold underline">{email}</span>. Verifique sua caixa de entrada e spam.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-white/80 hover:text-white underline font-semibold block mx-auto pt-2 cursor-pointer"
              >
                Enviar novamente
              </button>
            </div>
          )}

          <div className="mt-8">
            <button
              type="button"
              onClick={handleReturn}
              className="text-white/90 hover:text-white text-xs font-bold uppercase tracking-widest cursor-pointer underline transition-colors"
            >
              Voltar para o Login
            </button>
          </div>
        </div>
      </div>

      <div className="pb-8 text-center z-10">
        <p className="text-white/70 text-xs uppercase tracking-widest">Painel Administrativo Seguro</p>
      </div>
    </div>
  );
};

