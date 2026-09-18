import React from 'react';
import { PendingApprovalsScreen } from '../appointments/PendingApprovalsScreen';
import { AddAppointmentScreen } from '../appointments/AddAppointmentScreen';
import { AgendaBlockScreen } from '../agenda/AgendaBlockScreen';
import { AppointmentDetailsScreen } from '../appointments/AppointmentDetailsScreen';
import { ClientProfileScreen } from '../clients/ClientProfileScreen';
import { EditClientScreen } from '../clients/EditClientScreen';
import { ServiceCatalogScreen } from '../services/ServiceCatalogScreen';
import { AddServiceScreen } from '../services/AddServiceScreen';
import { BusinessHoursScreen } from '../settings/BusinessHoursScreen';
import { ClientTagsScreen } from '../settings/ClientTagsScreen';
import { FaturamentoScreen } from '../finance/FaturamentoScreen';
import { CheckoutOverlay } from './CheckoutOverlay';
import { BotCustomizationScreen } from '../settings/BotCustomizationScreen';
import { ForgotPasswordScreen } from '../auth/ForgotPasswordScreen';
import type { ScreenStackItem, ScreenOpenHandler, Appointment, Client, AgendaBlock } from '../../types';

interface OverlayScreenProps {
  screen: ScreenStackItem;
  onClose: () => void;
  onOpenScreen: ScreenOpenHandler;
}

export const OverlayScreen: React.FC<OverlayScreenProps> = ({
  screen,
  onClose,
  onOpenScreen,
}) => {
  return (
    <div className="absolute inset-0 z-50 bg-[#FAFAFA] flex flex-col animate-in slide-in-from-right-8 duration-300">
      {screen.name === 'pending_approvals' && (
        <PendingApprovalsScreen onClose={onClose} />
      )}
      {screen.name === 'add_appointment' && (
        <AddAppointmentScreen
          data={screen.data as { mode?: string; client?: string; service?: string; date?: string; time?: string } | undefined}
          onClose={onClose}
        />
      )}
      {screen.name === 'agenda_block' && (
        <AgendaBlockScreen block={screen.data as AgendaBlock | undefined} onClose={onClose} />
      )}
      {screen.name === 'appointment_details' && (
        <AppointmentDetailsScreen
          appointment={screen.data as Appointment | undefined}
          onClose={onClose}
          onOpenScreen={onOpenScreen}
        />
      )}
      {screen.name === 'checkout' && (
        <CheckoutOverlay
          appointment={screen.data as Appointment | undefined}
          onClose={onClose}
        />
      )}
      {screen.name === 'client_profile' && (
        <ClientProfileScreen
          client={screen.data as Client | undefined}
          onClose={onClose}
          onOpenScreen={onOpenScreen}
        />
      )}
      {screen.name === 'edit_client' && (
        <EditClientScreen
          client={screen.data as Client | undefined}
          onClose={onClose}
        />
      )}
      {screen.name === 'service_catalog' && (
        <ServiceCatalogScreen onClose={onClose} onOpenScreen={onOpenScreen} />
      )}
      {screen.name === 'add_service' && (
        <AddServiceScreen onClose={onClose} service={screen.data as import('../../types').Service | undefined} />
      )}
      {screen.name === 'business_hours' && (
        <BusinessHoursScreen onClose={onClose} onOpenScreen={onOpenScreen} />
      )}
      {screen.name === 'client_tags' && <ClientTagsScreen onClose={onClose} />}
      {(screen.name === 'financial_dashboard' || screen.name === 'faturamento') && (
        <FaturamentoScreen onClose={onClose} onOpenScreen={onOpenScreen} />
      )}
      {screen.name === 'bot_customization' && (
        <BotCustomizationScreen onClose={onClose} onOpenScreen={onOpenScreen} />
      )}
      {screen.name === 'forgot_password' && (
        <ForgotPasswordScreen onClose={onClose} onBackToLogin={onClose} />
      )}
    </div>
  );
};
