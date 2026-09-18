/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_PENDING_APPROVALS,
  INITIAL_CLIENTS,
  INITIAL_TRANSACTIONS,
  CLIENT_SAMPLE_HISTORY
  ,INITIAL_SERVICES
  ,AVAILABLE_CLIENT_TAGS
} from '../data/mockData';
import type {
  Appointment,
  PendingAppointment,
  Client,
  Transaction,
  AppointmentStatus,
  PaymentStatus,
  ClientHistoryItem
  ,AgendaBlock
  ,Service
} from '../types';
import { INITIAL_AGENDA_BLOCKS } from '../data/mockData';

interface DataContextType {
  appointments: Appointment[];
  transactions: Transaction[];
  clients: Client[];
  services: Service[];
  clientTags: string[];
  pendingApprovals: PendingAppointment[];
  clientHistory: ClientHistoryItem[];
  agendaBlocks: AgendaBlock[];
  updateAppointmentStatus: (
    id: number | undefined,
    status: AppointmentStatus,
    paymentInfo?: { amount: string; paymentStatus: PaymentStatus; paymentMethod?: string }
  ) => void;
  addAppointment: (appointment: Appointment) => void;
  rescheduleAppointment: (id: number | undefined, date: string, time: string) => void;
  cancelAppointment: (id: number | undefined) => void;
  approvePending: (id: number) => void;
  rejectPending: (id: number) => void;
  reschedulePending: (id: number, date: string, time: string) => void;
  denyPending: (id: number, reason: string) => void;
  addAgendaBlock: (block: Omit<AgendaBlock, 'id'>) => void;
  updateAgendaBlock: (block: AgendaBlock) => void;
  deleteAgendaBlock: (id: number) => void;
  addService: (service: Service) => void;
  updateService: (service: Service) => void;
  updateClient: (client: Client) => void;
  addClientTag: (tag: string) => void;
  removeClientTag: (tag: string) => void;
  updateClientHistoryPayment: (id: number, amount: string, paymentMethod: string) => void;
  updateTransactionPayment: (id: number, paymentStatus: PaymentStatus, paymentMethod?: string) => void;
  completeAppointmentCheckout: (
    appointment: Appointment,
    amount: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: string
  ) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [clientTags, setClientTags] = useState<string[]>(AVAILABLE_CLIENT_TAGS);
  const [pendingApprovals, setPendingApprovals] = useState<PendingAppointment[]>(INITIAL_PENDING_APPROVALS);
  const [, setDeniedReasons] = useState<Record<number, string>>({});
  const [clientHistory, setClientHistory] = useState<ClientHistoryItem[]>(CLIENT_SAMPLE_HISTORY);
  const [agendaBlocks, setAgendaBlocks] = useState<AgendaBlock[]>(INITIAL_AGENDA_BLOCKS);

  const updateAppointmentStatus = (
    id: number | undefined,
    status: AppointmentStatus,
    paymentInfo?: { amount: string; paymentStatus: PaymentStatus; paymentMethod?: string }
  ) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              status,
              ...(paymentInfo && {
                price: paymentInfo.amount,
                paymentStatus: paymentInfo.paymentStatus,
                paymentMethod: paymentInfo.paymentMethod
              })
            }
          : apt
      )
    );
  };

  const addAppointment = (appointment: Appointment) => {
    const newApt: Appointment = {
      ...appointment,
      id: appointment.id || Date.now()
    };
    setAppointments((prev) => [...prev, newApt]);
  };

  const rescheduleAppointment = (id: number | undefined, date: string, time: string) => {
    setAppointments((prev) => prev.map((item) => item.id === id ? { ...item, date, time, status: 'confirmado' } : item));
  };

  const cancelAppointment = (id: number | undefined) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'bloqueado' } : apt))
    );
  };

  const approvePending = (id: number) => {
    const pendingItem = pendingApprovals.find((p) => p.id === id);
    if (pendingItem) {
      const newApt: Appointment = {
        id: Date.now(),
        client: pendingItem.name,
        service: pendingItem.service,
        date: pendingItem.date,
        time: pendingItem.time,
        status: 'confirmado',
        paymentStatus: 'pendente'
      };
      setAppointments((prev) => [...prev, newApt]);
      setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const rejectPending = (id: number) => {
    setPendingApprovals((prev) => prev.filter((p) => p.id !== id));
  };

  const reschedulePending = (id: number, date: string, time: string) => {
    setPendingApprovals((prev) => prev.map((item) => item.id === id ? { ...item, date, time, proposedDate: date, proposedTime: time, status: 'reagendamento_sugerido' } : item));
  };

  const denyPending = (id: number, reason: string) => {
    setDeniedReasons((prev) => ({ ...prev, [id]: reason }));
    setPendingApprovals((prev) => prev.map((item) => item.id === id ? { ...item, status: 'negado', denialReason: reason } : item));
  };

  const addAgendaBlock = (block: Omit<AgendaBlock, 'id'>) => {
    setAgendaBlocks((prev) => [...prev, { ...block, id: Date.now() }]);
  };

  const updateAgendaBlock = (block: AgendaBlock) => {
    setAgendaBlocks((prev) => prev.map((item) => item.id === block.id ? block : item));
  };

  const deleteAgendaBlock = (id: number) => {
    setAgendaBlocks((prev) => prev.filter((item) => item.id !== id));
  };

  const addService = (service: Service) => setServices((prev) => [...prev, { ...service, id: Date.now() }]);
  const updateService = (service: Service) => setServices((prev) => prev.map((item) => item.id === service.id ? service : item));
  const updateClient = (client: Client) => setClients((prev) => prev.map((item) => item.phone === client.phone ? client : item));
  const addClientTag = (tag: string) => setClientTags((prev) => prev.includes(tag) ? prev : [...prev, tag]);
  const removeClientTag = (tag: string) => setClientTags((prev) => prev.filter((item) => item !== tag));
  const updateClientHistoryPayment = (id: number, amount: string, paymentMethod: string) => {
    setClientHistory((prev) => prev.map((item) => item.id === id ? { ...item, amount, paymentStatus: 'recebido', paymentMethod } : item));
  };

  const updateTransactionPayment = (
    id: number,
    paymentStatus: PaymentStatus,
    paymentMethod?: string
  ) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              status: paymentStatus,
              method: paymentMethod || tx.method
            }
          : tx
      )
    );

    // Também atualiza no histórico do cliente correspondente se houver
    setClientHistory((prev) =>
      prev.map((item, idx) =>
        idx === 1 && paymentStatus === 'recebido'
          ? { ...item, paymentStatus: 'recebido', paymentMethod: paymentMethod || 'Pix' }
          : item
      )
    );
  };

  const completeAppointmentCheckout = (
    appointment: Appointment,
    amount: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: string
  ) => {
    // 1. Atualiza o agendamento para concluído
    updateAppointmentStatus(appointment.id, 'concluido', {
      amount,
      paymentStatus,
      paymentMethod
    });

    // 2. Extrai valor numérico aproximado
    const numericStr = amount.replace(/[^\d,]/g, '').replace(',', '.');
    const numericAmount = parseFloat(numericStr) || 0;

    // 3. Adiciona na lista de transações
    const newTx: Transaction = {
      id: Date.now(),
      appointmentId: appointment.id,
      client: appointment.client,
      service: appointment.service,
      amount,
      numericAmount,
      method: paymentMethod || 'A Definir',
      status: paymentStatus,
      date: 'Hoje, ' + (appointment.time || '12:00')
    };
    setTransactions((prev) => [newTx, ...prev]);

    // 4. Adiciona no histórico do cliente
    const newHistoryItem: ClientHistoryItem = {
      id: Date.now(),
      date: 'Hoje',
      service: appointment.service,
      status: 'concluido',
      amount,
      paymentStatus,
      paymentMethod
    };
    setClientHistory((prev) => [newHistoryItem, ...prev]);
  };

  return (
    <DataContext.Provider
      value={{
        appointments,
        transactions,
        clients,
        services,
        clientTags,
        pendingApprovals,
        clientHistory,
        agendaBlocks,
        updateAppointmentStatus,
        addAppointment,
        rescheduleAppointment,
        cancelAppointment,
        approvePending,
        rejectPending,
        reschedulePending,
        denyPending,
        addAgendaBlock,
        updateAgendaBlock,
        deleteAgendaBlock,
        addService,
        updateService,
        updateClient,
        addClientTag,
        removeClientTag,
        updateClientHistoryPayment,
        updateTransactionPayment,
        completeAppointmentCheckout
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser utilizado dentro de um DataProvider');
  }
  return context;
};
