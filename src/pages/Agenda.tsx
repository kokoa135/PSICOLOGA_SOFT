import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight,
  MessageCircle, Video, MapPin, X, Sparkles, Check, 
  Stethoscope, ClipboardList, BarChart3, Pill, AlertCircle, Info, 
  Calendar, Trash2, Edit2, Phone, Smartphone
} from 'lucide-react';
import { useApp, Appointment } from '../context/AppContext';
import TimeGridSelector from '../components/Agenda/TimeGridSelector';
import './Agenda.css';

const Agenda = () => {
  const navigate = useNavigate();
  const { state, addAppointment, updateAppointmentStatus, deleteAppointment, showToast } = useApp();
  const [view, setView] = useState('Mes');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  
  const [newApt, setNewApt] = useState({
    patientId: 0,
    date: new Date().toISOString().split('T')[0],
    selectedTimes: [] as string[],
    duration: '50 min',
    type: 'Consulta' as any,
    status: 'Pendiente' as any,
    notes: '',
  });

  const today = new Date().toISOString().split('T')[0];
  const appointments = state.appointments;

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = state.patients.find(p => p.id === newApt.patientId);
    if (!patient) { showToast('Selecciona un paciente', 'error'); return; }
    addAppointment({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      date: newApt.date,
      time: newApt.selectedTimes.join(', '),
      duration: newApt.duration,
      type: newApt.type,
      status: 'Pendiente',
      notes: newApt.notes,
    });
    setShowNewAppointment(false);
    showToast('Sesión programada correctamente', 'success');
  };

  const handleSendToWhatsApp = (app: Appointment) => {
    const dateObj = new Date(app.date + 'T12:00:00');
    const formattedDate = dateObj.toLocaleDateString('es-PE', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });

    const message = 
      `¡Hola ${app.patientName}! 👋\n\n` +
      `Te confirmo tu cita en SoftPsy:\n\n` +
      `📅 *Fecha:* ${formattedDate}\n` +
      `⏰ *Hora:* ${app.time}\n` +
      `📝 *Tipo:* ${app.type}\n\n` +
      `¡Te esperamos! ✨`;

    const waUrl = new URL('https://api.whatsapp.com/send');
    waUrl.searchParams.set('phone', app.patientPhone);
    waUrl.searchParams.set('text', message);
    
    window.open(waUrl.toString(), '_blank');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita definitivamente?')) {
      deleteAppointment(id);
      setSelectedApt(null);
      showToast('Cita eliminada correctamente', 'info');
    }
  };

  // Monthly Grid Helper
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const daysOfWeek = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  return (
    <div className="agenda-container animate-fade-in">
      <header className="agenda-header glass-panel">
        <div className="calendar-title">
          <h1>Agenda de Citas</h1>
          <p>Visualización y administración de tu red clínica</p>
        </div>
        <button className="btn-primary-neon" onClick={() => setShowNewAppointment(true)}>
          <Plus size={20} /><span>Nueva Cita</span>
        </button>
      </header>

      <div className="agenda-legend-bar">
        <div className="legend-item"><span className="dot consulta"></span>🩺 Consulta</div>
        <div className="legend-item"><span className="dot seguimiento"></span>📝 Seguimiento</div>
        <div className="legend-item"><span className="dot estudio"></span>📊 Estudio</div>
        <div className="legend-item"><span className="dot tratamiento"></span>💊 Tratamiento</div>
        <div style={{ width: '1px', height: '16px', background: 'var(--border-color)', margin: '0 0.5rem' }}></div>
        <div className="legend-item"><span className="dot pendiente"></span>🟠 Pendiente</div>
        <div className="legend-item"><span className="dot confirmada"></span>🔵 Confirmada</div>
        <div className="legend-item"><span className="dot completada"></span>🟢 Completada</div>
      </div>

      <div className="agenda-toolbar">
        <div className="nav-controls">
          <button className="btn-nav-glass">Hoy</button>
          <button className="btn-nav-glass"><ChevronLeft size={16} /> Anterior</button>
          <button className="btn-nav-glass">Siguiente <ChevronRight size={16} /></button>
        </div>
        <div className="current-period">mayo 2026</div>
        <div className="view-switcher-glass">
          <div className="view-switcher" style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.25rem', display: 'flex' }}>
            {['Mes', 'Semana', 'Día', 'Agenda'].map(v => (
              <button 
                key={v} 
                className={view === v ? 'active' : ''} 
                onClick={() => setView(v)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  background: view === v ? 'var(--primary)' : 'none',
                  color: view === v ? 'white' : 'var(--text-muted)',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === 'Mes' && (
        <div className="month-grid-container animate-scale-up">
          <div className="month-grid-header">
            {daysOfWeek.map(d => <div key={d} className="header-day">{d}</div>)}
          </div>
          <div className="month-days-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`prev-${i}`} className="day-cell" style={{ background: '#fcfcff', opacity: 0.5 }}>
                <span className="day-number">{27 + i}</span>
              </div>
            ))}
            
            {daysInMonth.map(day => {
              const dateStr = `2026-05-${day.toString().padStart(2, '0')}`;
              const dayAppointments = appointments.filter(a => a.date === dateStr);
              
              return (
                <div key={day} className={`day-cell ${day === 6 ? 'current' : ''}`} onClick={() => {
                  setNewApt({...newApt, date: dateStr, selectedTimes: []});
                  setShowNewAppointment(true);
                }}>
                  <span className="day-number">{day}</span>
                  <div className="cell-appointments">
                    {dayAppointments.map((apt, idx) => (
                      <div 
                        key={idx} 
                        className={`apt-mini-card ${apt.type.toLowerCase()} ${apt.status.toLowerCase()}`}
                        onClick={(e) => { e.stopPropagation(); setSelectedApt(apt); }}
                      >
                        {apt.time} - {apt.patientName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'Semana' && (
        <div className="week-view-container animate-fade-in">
          <div className="week-grid">
            {['Lun 04', 'Mar 05', 'Mié 06', 'Jue 07', 'Vie 08', 'Sáb 09', 'Dom 10'].map((dayLabel, i) => {
              const dateStr = `2026-05-0${4 + i}`;
              const dayApts = appointments.filter(a => a.date === dateStr);
              return (
                <div key={i} className={`week-col ${dateStr === today ? 'today' : ''}`}>
                  <div className="week-day-header">{dayLabel}</div>
                  <div className="week-day-content">
                    {dayApts.map((apt, idx) => (
                      <div key={idx} className={`apt-card-podo ${apt.type.toLowerCase()}`} onClick={() => setSelectedApt(apt)}>
                        <span className="time">{apt.time}</span>
                        <span className="name">{apt.patientName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'Día' && (
        <div className="day-view-container animate-fade-in">
          <div className="day-detail-card glass-panel">
            <div className="day-header-podo">
              <h2>Jueves, 07 de Mayo</h2>
              <span>{appointments.filter(a => a.date === '2026-05-07').length} citas programadas</span>
            </div>
            <div className="day-hours-list">
              {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(hour => {
                const apt = appointments.find(a => a.date === '2026-05-07' && a.time.includes(hour));
                return (
                  <div key={hour} className="hour-row">
                    <div className="hour-label">{hour}</div>
                    <div className="hour-slot">
                      {apt ? (
                        <div className={`apt-slot-card ${apt.type.toLowerCase()}`} onClick={() => setSelectedApt(apt)}>
                          <strong>{apt.patientName}</strong>
                          <span>{apt.type} • {apt.duration}</span>
                        </div>
                      ) : (
                        <div className="empty-slot" onClick={() => { setNewApt({...newApt, date: '2026-05-07', selectedTimes: [hour]}); setShowNewAppointment(true); }}>
                          + Disponible
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {view === 'Agenda' && (
        <div className="agenda-list-view animate-fade-in">
          {appointments.length === 0 ? (
            <div className="empty-agenda">No hay citas programadas</div>
          ) : (
            <div className="agenda-list-scroll">
              {[...appointments].sort((a, b) => a.date.localeCompare(b.date)).map((apt, idx) => (
                <div key={idx} className="agenda-list-item glass-panel" onClick={() => setSelectedApt(apt)}>
                  <div className="apt-date-badge">
                    <span className="day">{apt.date.split('-')[2]}</span>
                    <span className="month">MAY</span>
                  </div>
                  <div className="apt-info">
                    <h3>{apt.patientName}</h3>
                    <div className="apt-meta">
                      <Clock size={14} /> <span>{apt.time} ({apt.duration})</span>
                      <span className={`status-tag ${apt.status.toLowerCase()}`}>{apt.status}</span>
                    </div>
                  </div>
                  <div className="apt-type-label">
                    {apt.type}
                  </div>
                  <ChevronRight size={20} className="arrow-icon" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL NUEVA CITA */}
      {showNewAppointment && (
        <div className="content-modal-overlay" onClick={() => setShowNewAppointment(false)}>
          <div className="content-modal animate-scale-up" style={{ maxWidth: '600px', borderRadius: '32px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-body" style={{ padding: '3rem' }}>
              <div className="modal-header" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                <div style={{ background: '#f5f3ff', padding: '1rem', borderRadius: '24px', color: 'var(--primary)', marginBottom: '1rem', display: 'inline-block' }}>
                  <CalendarIcon size={32} />
                </div>
                <h2 style={{ fontSize: '2rem', fontWeight: 850 }}>Nueva Cita</h2>
                <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Programa una nueva sesión clínica</p>
              </div>

              <form className="clinical-form" onSubmit={handleCreateAppointment}>
                <div className="pro-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="pro-form-group">
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Paciente</label>
                    <select
                      className="pro-form-input"
                      style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1.5px solid var(--border-color)', background: '#fcfcff', fontWeight: 600 }}
                      required
                      value={newApt.patientId}
                      onChange={e => setNewApt({ ...newApt, patientId: parseInt(e.target.value) })}
                    >
                      <option value={0}>Seleccionar...</option>
                      {state.patients.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="pro-form-group">
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Fecha</label>
                    <input 
                      type="date" 
                      className="pro-form-input" 
                      style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1.5px solid var(--border-color)' }} 
                      value={newApt.date} 
                      onChange={e => setNewApt({ ...newApt, date: e.target.value })} 
                    />
                  </div>
                </div>

                <TimeGridSelector 
                  selectedTimes={newApt.selectedTimes}
                  onChange={(selectedTimes) => setNewApt({ ...newApt, selectedTimes })}
                  onExtend={() => showToast('Duración extendida', 'info')}
                />

                <div className="pro-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                  <div className="pro-form-group">
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Tipo</label>
                    <select
                      className="pro-form-input"
                      style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1.5px solid var(--border-color)' }}
                      value={newApt.type}
                      onChange={e => setNewApt({ ...newApt, type: e.target.value as any })}
                    >
                      <option value="Consulta">🩺 Consulta</option>
                      <option value="Seguimiento">📝 Seguimiento</option>
                      <option value="Estudio">📊 Estudio</option>
                      <option value="Tratamiento">💊 Tratamiento</option>
                    </select>
                  </div>
                  <div className="pro-form-group">
                    <label style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'block' }}>Estado</label>
                    <select
                      className="pro-form-input"
                      style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1.5px solid var(--border-color)' }}
                      value={newApt.status}
                      onChange={e => setNewApt({ ...newApt, status: e.target.value as any })}
                    >
                      <option value="Pendiente">🟠 Pendiente</option>
                      <option value="Confirmada">🔵 Confirmada</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer" style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                  <button type="button" className="btn-nav-glass" style={{ flex: 1 }} onClick={() => setShowNewAppointment(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary-neon" style={{ flex: 2 }}>Programar Sesión</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLES / EDICIÓN - PODOSCOPE STYLE */}
      {selectedApt && (
        <div className="content-modal-overlay" onClick={() => setSelectedApt(null)}>
          <div className="content-modal podoscope-modal animate-scale-up" style={{ maxWidth: '550px', borderRadius: '32px' }} onClick={e => e.stopPropagation()}>
              <div className="modal-header-compact">
                <div className="header-info">
                  <div className="apt-avatar">
                    {selectedApt.patientName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="modal-title-podo">Detalle de la Cita</h2>
                    <p className="modal-subtitle-podo">{selectedApt.patientName}</p>
                  </div>
                </div>
                <button className="close-btn" onClick={() => setSelectedApt(null)}>
                  <X size={24} />
                </button>
              </div>

              <div className="apt-details-grid">
                <div className="detail-item">
                  <label>Fecha y Hora</label>
                  <div className="detail-value">
                    <Calendar size={14} /> <span>{selectedApt.date}</span>
                    <Clock size={14} style={{ marginLeft: '8px' }} /> <span>{selectedApt.time}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <label>Estado</label>
                  <select
                    className="pro-form-input-podo"
                    value={selectedApt.status}
                    onChange={e => updateAppointmentStatus(selectedApt.id, e.target.value as any)}
                  >
                    <option value="Pendiente">🟠 Pendiente</option>
                    <option value="Confirmada">🔵 Confirmada</option>
                    <option value="Completada">🟢 Completada</option>
                    <option value="Cancelada">🔴 Cancelada</option>
                  </select>
                </div>
              </div>

              <div className="podo-divider"></div>
              
              <div className="podoscope-actions-bar">
                <button className="btn-podo-red" onClick={() => handleDelete(selectedApt.id)}>
                  <Trash2 size={16} />
                  <span>Eliminar</span>
                </button>
                <button className="btn-podo-green" onClick={() => handleSendToWhatsApp(selectedApt)}>
                  <Smartphone size={16} />
                  <span>WhatsApp</span>
                </button>
                <button className="btn-podo-purple" onClick={() => setSelectedApt(null)}>
                  <span>Cancelar</span>
                </button>
                <button className="btn-podo-purple" onClick={() => { setSelectedApt(null); showToast('Cita actualizada', 'success'); }}>
                  <span>Actualizar</span>
                </button>
              </div>

              <button className="btn-start-session-podo" onClick={() => { setSelectedApt(null); navigate(`/pacientes/${selectedApt.patientId}`); }}>
                <Sparkles size={18} /> Iniciar Sesión Clínica
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Agenda;
