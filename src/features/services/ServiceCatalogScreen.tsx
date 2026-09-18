import React from 'react';
import { Plus, Clock } from 'lucide-react';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { useData } from '../../context/DataContext';
import type { ScreenOpenHandler } from '../../types';

interface ServiceCatalogScreenProps {
  onClose: () => void;
  onOpenScreen: ScreenOpenHandler;
}

export const ServiceCatalogScreen: React.FC<ServiceCatalogScreenProps> = ({
  onClose,
  onOpenScreen,
}) => {
  const { services } = useData();
  return (
    <>
      <ScreenHeader title="Catálogo" onClose={onClose} />
      <main className="flex-1 overflow-y-auto p-5 space-y-4 pb-24">
        <button
          type="button"
          onClick={() => onOpenScreen('add_service')}
          className="w-full border-2 border-dashed border-[var(--brand-pink-light)] bg-[var(--brand-pink-bg)] text-[#FF85C2] rounded-3xl py-4 flex items-center justify-center gap-2 font-bold hover:bg-[#ffe1f0] active:scale-[0.98] transition-transform uppercase tracking-wider text-sm cursor-pointer"
        >
          <Plus size={18} /> Novo Serviço
        </button>

        <div className="space-y-3 mt-6">
          {services.map((svc, idx) => (
            <div
              key={svc.id || idx}
              onClick={() => onOpenScreen('add_service', svc)}
              className="bg-white p-5 rounded-3xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex justify-between items-center cursor-pointer hover:border-gray-50 border border-transparent transition-all"
            >
              <div>
                <h4 className="font-bold text-gray-800">{svc.name}</h4>
                <div className="flex gap-3 text-[10px] text-gray-400 mt-1.5 uppercase tracking-widest font-bold">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {svc.duration}
                  </span>
                  <span className="flex items-center gap-1 text-[#FF85C2] bg-[var(--brand-pink-bg)] px-2 py-0.5 rounded-md">
                    {svc.category}
                  </span>
                </div>
              </div>
              <div className="font-bold text-gray-700 text-lg">{svc.price}</div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

