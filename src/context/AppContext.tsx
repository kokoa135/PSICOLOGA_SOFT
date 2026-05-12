import React, { createContext, useContext, useReducer, useEffect } from 'react';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export interface SessionMetrics {
  anxiety: number;
  depression: number;
  stress: number;
  mood: number;
}

export interface ClinicalNote {
  id: string;
  patientId: number;
  appointmentId?: string;
  date: string;
  dateLabel: string;
  type: 'SOAP' | 'Libre';
  subjective: string;
  objective: string;
  analysis: string;
  plan: string;
  metrics: SessionMetrics;
}

export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  dni: string;
  address: string;
  age: string; // Changed to string to store "X años, Y meses, Z días"
  birthDate?: string; // ISO string or simple YYYY-MM-DD
  diagnosis: string;
  lastSession: string;
  status: 'Activo' | 'Inactivo';
}


export interface Appointment {
  id: string;
  patientId: number;
  patientName: string;
  patientPhone: string;
  date: string;
  time: string;
  duration: string;
  type: 'Presencial' | 'Online';
  status: 'Pendiente' | 'Confirmado' | 'Completado' | 'Cancelado';
  notes: string;
}

export interface Transaction {
  id: string;
  patientId: number;
  patient: string;
  date: string;
  amount: number;
  status: 'Pagado' | 'Pendiente';
  method: string;
  appointmentId?: string;
}

export interface ClinicSettings {
  clinicName: string;
  professional: string;
  specialty: string;
  address: string;
  license: string;
  instagram: string;
  phone: string;
  logo: string | null;
}

export interface AppState {
  patients: Patient[];
  appointments: Appointment[];
  notes: ClinicalNote[];
  transactions: Transaction[];
  settings: ClinicSettings;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
}

// ─── ESTADO INICIAL ───────────────────────────────────────────────────────────

const initialState: AppState = {
  patients: [
    { id: 1, name: 'Ana García', email: 'ana@example.com', phone: '51987654321', dni: '72345678', address: 'Av. Larco 123, Miraflores', age: '32 años, 4 meses, 12 días', birthDate: '1993-12-24', diagnosis: 'Trastorno de Ansiedad Generalizada', lastSession: '02 May 2026', status: 'Activo' },
    { id: 2, name: 'Carlos Ruiz', email: 'carlos@example.com', phone: '51912345678', dni: '45678912', address: 'Calle Los Pinos 456, San Isidro', age: '28 años, 2 meses, 5 días', birthDate: '1998-03-01', diagnosis: 'Episodio Depresivo Leve', lastSession: '04 May 2026', status: 'Activo' },
    { id: 3, name: 'Elena Beltrán', email: 'elena@example.com', phone: '51955443221', dni: '12345678', address: 'Jr. Ica 789, Cercado de Lima', age: '45 años, 1 mes, 18 días', birthDate: '1981-03-18', diagnosis: 'Estrés Postraumático', lastSession: '30 Abr 2026', status: 'Inactivo' },
  ],

  appointments: [
    { id: 'apt-1', patientId: 1, patientName: 'Ana García', patientPhone: '51987654321', date: '2026-05-06', time: '09:00', duration: '50 min', type: 'Presencial', status: 'Confirmado', notes: 'Seguimiento TCC' },
    { id: 'apt-2', patientId: 2, patientName: 'Carlos Ruiz', patientPhone: '51912345678', date: '2026-05-06', time: '11:00', duration: '50 min', type: 'Online', status: 'Pendiente', notes: 'Evaluación inicial' },
    { id: 'apt-3', patientId: 3, patientName: 'Elena Beltrán', patientPhone: '51955443221', date: '2026-05-06', time: '16:00', duration: '90 min', type: 'Presencial', status: 'Confirmado', notes: 'Terapia de regulación emocional' },
  ],
  notes: [
    { id: 'note-1', patientId: 1, date: '2026-05-02', dateLabel: '02 May 2026', type: 'SOAP', subjective: 'Paciente reporta mejoría en el sueño.', objective: 'Afecto adecuado, lenguaje fluido.', analysis: 'Progreso notable en técnicas de relajación.', plan: 'Continuar con higiene de sueño y registro de pensamientos.', metrics: { anxiety: 5, depression: 4, stress: 4, mood: 6 } },
    { id: 'note-2', patientId: 1, date: '2026-04-25', dateLabel: '25 Abr 2026', type: 'SOAP', subjective: 'Reporta episodios de rumiación nocturna.', objective: 'Tensión muscular visible, evitación del contacto visual.', analysis: 'Patrón de catastrofismo activo.', plan: 'Reestructuración cognitiva, tarea: registro ABC.', metrics: { anxiety: 7, depression: 5, stress: 7, mood: 4 } },
    { id: 'note-3', patientId: 2, date: '2026-05-04', dateLabel: '04 May 2026', type: 'SOAP', subjective: 'Refiere menor energía y anhedonia parcial.', objective: 'Ánimo bajo, pero colaborador.', analysis: 'Episodio depresivo leve respondiendo a AC.', plan: 'Aumentar actividades de refuerzo positivo.', metrics: { anxiety: 4, depression: 6, stress: 5, mood: 5 } },
  ],
  transactions: [
    { id: 'tx-1', patientId: 1, patient: 'Ana García', date: '02 May 2026', amount: 150, status: 'Pagado', method: 'Transferencia' },
    { id: 'tx-2', patientId: 2, patient: 'Carlos Ruiz', date: '04 May 2026', amount: 120, status: 'Pendiente', method: 'Efectivo' },
    { id: 'tx-3', patientId: 3, patient: 'Elena Beltrán', date: '30 Abr 2026', amount: 200, status: 'Pagado', method: 'Tarjeta' },
    { id: 'tx-4', patientId: 1, patient: 'Roberto Lima', date: 'Hoy', amount: 150, status: 'Pagado', method: 'Yape/Plin' },
  ],
  settings: {
    clinicName: 'SoftPsy Clinic',
    professional: 'Dra. Karla A. Alvarez Q.',
    specialty: 'Psicología Clínica y TCC',
    address: 'Av. San Martín 123, Tacna',
    license: 'C.Ps.P. 12345',
    instagram: '@dra.karla_alvarez',
    phone: '51987654321',
    logo: null,
  },
  toast: null,
};

// ─── ACCIONES ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_PATIENT'; payload: Patient }
  | { type: 'DELETE_PATIENT'; payload: number }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT_STATUS'; payload: { id: string; status: Appointment['status'] } }
  | { type: 'DELETE_APPOINTMENT'; payload: string }
  | { type: 'ADD_NOTE'; payload: ClinicalNote }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'MARK_PAID'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<ClinicSettings> }
  | { type: 'SHOW_TOAST'; payload: AppState['toast'] }
  | { type: 'HIDE_TOAST' }
  | { type: 'LOAD_STATE'; payload: AppState };

// ─── REDUCER ──────────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_PATIENT':
      return { ...state, patients: [action.payload, ...state.patients] };

    case 'DELETE_PATIENT':
      return { ...state, patients: state.patients.filter(p => p.id !== action.payload) };

    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [action.payload, ...state.appointments] };

    case 'UPDATE_APPOINTMENT_STATUS': {
      const updated = state.appointments.map(a =>
        a.id === action.payload.id ? { ...a, status: action.payload.status } : a
      );
      // If completed, update lastSession for patient
      const apt = state.appointments.find(a => a.id === action.payload.id);
      const updatedPatients = action.payload.status === 'Completado' && apt
        ? state.patients.map(p =>
            p.id === apt.patientId
              ? { ...p, lastSession: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) }
              : p
          )
        : state.patients;
      return { ...state, appointments: updated, patients: updatedPatients };
    }

    case 'DELETE_APPOINTMENT':
      return { ...state, appointments: state.appointments.filter(a => a.id !== action.payload) };

    case 'ADD_NOTE': {
      const updatedPatients = state.patients.map(p =>
        p.id === action.payload.patientId
          ? { ...p, lastSession: action.payload.dateLabel }
          : p
      );
      return { ...state, notes: [action.payload, ...state.notes], patients: updatedPatients };
    }

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case 'MARK_PAID':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload ? { ...t, status: 'Pagado' } : t
        ),
      };

    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };

    case 'HIDE_TOAST':
      return { ...state, toast: null };

    default:
      return state;
  }
}

// ─── CONTEXTO ─────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Helpers
  addPatient: (p: Omit<Patient, 'id'>) => void;
  deletePatient: (id: number) => void;
  addAppointment: (a: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  deleteAppointment: (id: string) => void;
  addNote: (n: Omit<ClinicalNote, 'id'>) => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  markPaid: (id: string) => void;
  updateSettings: (s: Partial<ClinicSettings>) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  getPatientNotes: (patientId: number) => ClinicalNote[];
  getPatientNoteMetrics: (patientId: number) => Array<{ name: string } & SessionMetrics>;
  getTodayAppointments: () => Appointment[];
  getPendingTransactions: () => Transaction[];
  getTotalRevenue: () => number;
}

const AppContext = createContext<AppContextType | null>(null);

// ─── PROVIDER ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'softpsy_state_v2';

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Inicialización sincrónica para evitar pérdida de datos
  const [state, dispatch] = useReducer(appReducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...initial, ...parsed, toast: null };
      }
    } catch (e) {
      console.error('Error loading state:', e);
    }
    return initial;
  });

  // Persistir a localStorage solo cuando el estado cambie
  useEffect(() => {
    try {
      const { toast, ...persist } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persist));
    } catch (e) {
      console.error('Error persisting state:', e);
    }
  }, [state]);

  // Auto-hide toast
  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  // ── Helpers ──

  const addPatient = (p: Omit<Patient, 'id'>) => {
    dispatch({ type: 'ADD_PATIENT', payload: { ...p, id: Date.now() } });
    showToast(`Paciente ${p.name} registrado correctamente`, 'success');
  };

  const deletePatient = (id: number) => {
    dispatch({ type: 'DELETE_PATIENT', payload: id });
    showToast('Paciente eliminado', 'info');
  };

  const addAppointment = (a: Omit<Appointment, 'id'>) => {
    dispatch({ type: 'ADD_APPOINTMENT', payload: { ...a, id: `apt-${Date.now()}` } });
    showToast('Cita programada correctamente', 'success');
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    dispatch({ type: 'UPDATE_APPOINTMENT_STATUS', payload: { id, status } });
    const labels: Record<Appointment['status'], string> = {
      Confirmado: 'Cita confirmada',
      Completado: 'Sesión marcada como completada',
      Cancelado: 'Cita cancelada',
      Pendiente: 'Cita marcada como pendiente',
    };
    showToast(labels[status], status === 'Cancelado' ? 'error' : 'success');
  };

  const deleteAppointment = (id: string) => {
    dispatch({ type: 'DELETE_APPOINTMENT', payload: id });
    showToast('Cita eliminada', 'info');
  };

  const addNote = (n: Omit<ClinicalNote, 'id'>) => {
    dispatch({ type: 'ADD_NOTE', payload: { ...n, id: `note-${Date.now()}` } });
    showToast('Nota clínica guardada y firmada', 'success');
  };

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: { ...t, id: `tx-${Date.now()}` } });
    showToast('Pago registrado correctamente', 'success');
  };

  const markPaid = (id: string) => {
    dispatch({ type: 'MARK_PAID', payload: id });
    showToast('Pago marcado como completado', 'success');
  };

  const updateSettings = (s: Partial<ClinicSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: s });
    showToast('Configuración guardada', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
  };

  const getPatientNotes = (patientId: number) =>
    state.notes.filter(n => n.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date));

  const getPatientNoteMetrics = (patientId: number) => {
    const notes = getPatientNotes(patientId).reverse();
    return notes.map((n, i) => ({
      name: `S${i + 1}`,
      anxiety: n.metrics.anxiety,
      depression: n.metrics.depression,
      stress: n.metrics.stress,
      mood: n.metrics.mood,
    }));
  };

  const getTodayAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return state.appointments.filter(a => a.date === today);
  };

  const getPendingTransactions = () =>
    state.transactions.filter(t => t.status === 'Pendiente');

  const getTotalRevenue = () =>
    state.transactions.filter(t => t.status === 'Pagado').reduce((sum, t) => sum + t.amount, 0);

  return (
    <AppContext.Provider value={{
      state, dispatch,
      addPatient, deletePatient,
      addAppointment, updateAppointmentStatus, deleteAppointment,
      addNote, addTransaction, markPaid,
      updateSettings, showToast,
      getPatientNotes, getPatientNoteMetrics,
      getTodayAppointments, getPendingTransactions, getTotalRevenue,
    }}>
      {children}
      {/* TOAST GLOBAL */}
      {state.toast && (
        <div className={`global-toast global-toast-${state.toast.type}`}>
          {state.toast.type === 'success' && '✓ '}
          {state.toast.type === 'error' && '✕ '}
          {state.toast.type === 'info' && 'ℹ '}
          {state.toast.message}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
