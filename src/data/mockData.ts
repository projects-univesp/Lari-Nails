import type {
  Appointment,
  Client,
  Service,
  PendingAppointment,
  ClientHistoryItem,
  Transaction
} from '../types';

export const INITIAL_AGENDA_BLOCKS = [
  { id: 1, reason: 'Compromisso pessoal', date: 'Hoje', startTime: '16:30', endTime: '17:30' },
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    time: '09:00',
    client: 'Amanda Silva',
    service: 'Manutenção Fibra',
    status: 'confirmado',
    date: 'Hoje',
    price: 'R$ 120,00',
    paymentStatus: 'pendente'
  },
  {
    id: 2,
    time: '11:00',
    client: 'Bruna Costa',
    service: 'Esmaltação em Gel',
    status: 'concluido',
    date: 'Hoje',
    price: 'R$ 60,00',
    paymentStatus: 'recebido',
    paymentMethod: 'Pix'
  },
  {
    id: 3,
    time: '14:00',
    client: 'Carla Dias',
    service: 'Alongamento Acrílico',
    status: 'pendente',
    date: 'Hoje',
    price: 'R$ 180,00',
    paymentStatus: 'pendente'
  },
];

export const INITIAL_PENDING_APPROVALS: PendingAppointment[] = [
  { id: 1, name: 'Carla Dias', service: 'Alongamento Acrílico', date: 'Hoje', time: '14:00', phone: '(11) 99999-3333' },
  { id: 2, name: 'Mariana Silva', service: 'Manutenção', date: 'Amanhã', time: '10:00', phone: '(11) 98888-4444' },
];

export const INITIAL_CLIENTS: Client[] = [
  { name: 'Amanda Silva', phone: '(11) 99999-1111', tags: ['VIP', 'Mensalista'], lastVisit: 'Há 15 dias', bday: '12/04' },
  { name: 'Bruna Costa', phone: '(11) 99999-2222', tags: ['Quinzenal'], lastVisit: 'Hoje', bday: '05/09' },
  { name: 'Carla Dias', phone: '(11) 99999-3333', tags: ['Avulso', 'Devedora'], lastVisit: 'Há 2 meses', bday: '22/11' },
  { name: 'Diana Rocha', phone: '(11) 99999-4444', tags: ['Mensalista'], lastVisit: 'Há 5 dias', bday: '30/01' },
];

export const INITIAL_SERVICES: Service[] = [
  { name: 'Manutenção Fibra', duration: '2h', price: 'R$ 120', category: 'Manutenção' },
  { name: 'Esmaltação em Gel', duration: '1h', price: 'R$ 60', category: 'Esmaltação' },
  { name: 'Alongamento Acrílico', duration: '3h', price: 'R$ 180', category: 'Alongamento' },
  { name: 'Banho de Gel', duration: '1h 30min', price: 'R$ 90', category: 'Esmaltação' },
  { name: 'Remoção + Spa', duration: '1h', price: 'R$ 75', category: 'Spa' },
];

export const CLIENT_SAMPLE_HISTORY: ClientHistoryItem[] = [
  {
    id: 101,
    date: '15 Ago 2026',
    service: 'Manutenção Fibra',
    status: 'concluido',
    amount: 'R$ 120,00',
    paymentStatus: 'recebido',
    paymentMethod: 'Pix'
  },
  {
    id: 102,
    date: '01 Ago 2026',
    service: 'Manutenção Fibra',
    status: 'concluido',
    amount: 'R$ 120,00',
    paymentStatus: 'pendente'
  },
  {
    id: 103,
    date: '18 Jul 2026',
    service: 'Alongamento Acrílico',
    status: 'concluido',
    amount: 'R$ 180,00',
    paymentStatus: 'recebido',
    paymentMethod: 'Cartão'
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    service: 'Esmaltação em Gel',
    client: 'Bruna Costa',
    amount: 'R$ 60,00',
    numericAmount: 60,
    method: 'Pix',
    status: 'recebido',
    date: 'Hoje, 11:30'
  },
  {
    id: 2,
    service: 'Manutenção Fibra',
    client: 'Amanda Silva',
    amount: 'R$ 120,00',
    numericAmount: 120,
    method: 'Cartão',
    status: 'pendente',
    date: 'Hoje, 09:00'
  },
  {
    id: 3,
    service: 'Alongamento Acrílico',
    client: 'Carla Dias',
    amount: 'R$ 180,00',
    numericAmount: 180,
    method: 'Pix',
    status: 'pendente',
    date: 'Ontem, 16:45'
  },
  {
    id: 4,
    service: 'Banho de Gel',
    client: 'Diana Rocha',
    amount: 'R$ 90,00',
    numericAmount: 90,
    method: 'Cartão',
    status: 'recebido',
    date: 'Ontem, 14:00'
  },
  {
    id: 5,
    service: 'Remoção + Spa',
    client: 'Gabriela Lima',
    amount: 'R$ 75,00',
    numericAmount: 75,
    method: 'Dinheiro',
    status: 'recebido',
    date: '03 Set, 10:15'
  },
  {
    id: 6,
    service: 'Manutenção Fibra',
    client: 'Helena Souza',
    amount: 'R$ 120,00',
    numericAmount: 120,
    method: 'Pix',
    status: 'recebido',
    date: '02 Set, 15:30'
  },
];

export const AVAILABLE_CLIENT_TAGS: string[] = [
  'VIP',
  'Mensalista',
  'Quinzenal',
  'Avulso',
  'Devedora',
  'Problemática'
];
