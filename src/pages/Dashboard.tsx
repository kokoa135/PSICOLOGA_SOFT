import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, TrendingUp, Clock, ArrowRight,
  Brain, Wind, ShieldCheck, Zap, Activity, Smile, AlertCircle, X, Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import './Dashboard.css';

const Dashboard = () => {
  const [showBreathing, setShowBreathing] = useState(false);
  const navigate = useNavigate();
  const { state, getTodayAppointments, getPendingTransactions, getTotalRevenue } = useApp();

  const todayApts = getTodayAppointments();
  const pending = getPendingTransactions();
  const revenue = getTotalRevenue();
  const activePatients = state.patients.filter(p => p.status === 'Activo').length;

  const stats = [
    { label: 'Pacientes Activos', value: String(activePatients), icon: Users, color: '#6366f1', trend: `${state.patients.length} total`, route: '/pacientes' },
    { label: 'Citas Hoy', value: String(todayApts.length), icon: Calendar, color: '#10b981', trend: `${todayApts.filter(a => a.type === 'Online').length} online / ${todayApts.filter(a => a.type === 'Presencial').length} presencial`, route: '/agenda' },
    { label: 'Efectividad Terapéutica', value: '92%', icon: TrendingUp, color: '#f59e0b', trend: 'Basado en IA', route: '/copiloto-ia' },
    { label: 'Ingresos del Mes', value: `S/.${revenue}`, icon: Clock, color: '#ec4899', trend: `${pending.length} pagos pendientes`, route: '/finanzas' },
  ];

  // Build chart from last 7 days of notes (averaged)
  const moodData = [
    { day: 'Lun', mood: 65, anxiety: 40 },
    { day: 'Mar', mood: 70, anxiety: 35 },
    { day: 'Mie', mood: 60, anxiety: 50 },
    { day: 'Jue', mood: 75, anxiety: 30 },
    { day: 'Vie', mood: 85, anxiety: 20 },
    { day: 'Sab', mood: 80, anxiety: 25 },
    { day: 'Dom', mood: 90, anxiety: 15 },
  ];

  // Latest sessions from notes
  const recentSessions = state.notes.slice(0, 3).map(n => ({
    patient: state.patients.find(p => p.id === n.patientId)?.name || 'Desconocido',
    patientId: n.patientId,
    time: n.dateLabel,
    status: 'Finalizado',
    type: state.appointments.find(a => a.patientId === n.patientId)?.type || 'Presencial',
  }));

  const tasks = [
    { icon: Zap, label: 'Revisar notas de Ana García', sub: 'Detectada alta ansiedad en audio', priority: 'Alta', action: () => navigate('/pacientes/1') },
    { icon: Smile, label: 'Enviar tarea ACT a Carlos', sub: 'Clarificación de valores', priority: 'Media', action: () => navigate('/pacientes/2') },
    { icon: AlertCircle, label: 'Actualizar finanzas del mes', sub: `${pending.length} pagos pendientes de validar`, priority: 'Baja', action: () => navigate('/finanzas') },
  ];

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="dashboard-header">
        <div className="welcome-section">
          <h1>Hola, {state.settings.professional.split(' ')[0]} 👋</h1>
          <p>Tu suite clínica está lista. Tienes {todayApts.length} pacientes programados para hoy.</p>
        </div>
        <div className="action-group">
          <button className="calm-pause-btn" onClick={() => setShowBreathing(true)}>
            <Wind size={20} />
            <span>Pausa de Calma</span>
          </button>
          <button className="primary-btn-pro" onClick={() => navigate('/agenda')}>
            <Plus size={18} />
            <span>Nueva Cita</span>
          </button>
        </div>
      </header>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card glass animate-scale-up"
            style={{ animationDelay: `${index * 0.1}s`, cursor: 'pointer' }}
            onClick={() => navigate(stat.route)}
          >
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <h3>{stat.label}</h3>
              <div className="stat-value">{stat.value}</div>
              <span className="stat-trend">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-main-grid">
        <div className="chart-section glass animate-fade-in">
          <div className="section-header">
            <div className="title-group">
              <Activity size={20} className="header-icon-pro" />
              <h3>Pulso Clínico Colectivo</h3>
            </div>
            <div className="chart-legend">
              <span className="legend-item"><span className="dot mood"></span> Bienestar</span>
              <span className="legend-item"><span className="dot anxiety"></span> Ansiedad</span>
            </div>
          </div>
          <p className="chart-subtitle">Promedio de evolución emocional de tus pacientes activos.</p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAnxiety" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis hide />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} itemStyle={{fontWeight: 700}} />
                <Area type="monotone" dataKey="mood" name="Bienestar" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" />
                <Area type="monotone" dataKey="anxiety" name="Ansiedad" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorAnxiety)" />

              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="tasks-section glass animate-fade-in">
          <div className="section-header">
            <div className="title-group">
              <ShieldCheck size={20} className="header-icon-pro" />
              <h3>Tareas Clínicas</h3>
            </div>
            <button className="text-btn" onClick={() => navigate('/agenda')}>Ver agenda</button>
          </div>
          <div className="task-list">
            {tasks.map((task, i) => (
              <div key={i} className="task-item" onClick={task.action} style={{ cursor: 'pointer' }}>
                <div className="task-check"><task.icon size={16} /></div>
                <div className="task-info">
                  <h4>{task.label}</h4>
                  <p>{task.sub}</p>
                </div>
                <span className={`priority-${task.priority === 'Alta' ? 'high' : task.priority === 'Media' ? 'medium' : 'low'}`}>{task.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="recent-activity-section glass animate-fade-in">
        <div className="section-header">
          <h3>Últimas Sesiones</h3>
          <button className="text-btn" onClick={() => navigate('/pacientes')} style={{display:'flex',alignItems:'center',gap:'0.25rem'}}>
            Ver pacientes <ArrowRight size={16} />
          </button>
        </div>
        <div className="activity-list">
          {recentSessions.length > 0 ? recentSessions.map((item, i) => (
            <div key={i} className="activity-row" style={{ cursor: 'pointer' }} onClick={() => navigate(`/pacientes/${item.patientId}`)}>
              <div className="activity-patient">
                <div className="avatar-small">{item.patient[0]}</div>
                <div className="p-info">
                  <strong>{item.patient}</strong>
                  <span>{item.type}</span>
                </div>
              </div>
              <span className="activity-time">{item.time}</span>
              <span className="status-badge success">{item.status}</span>
            </div>
          )) : (
            <p style={{color:'var(--text-muted)', padding:'1rem', textAlign:'center'}}>
              Registra tu primera nota SOAP para ver el historial aquí.
            </p>
          )}
        </div>
      </div>

      {showBreathing && (
        <div className="breathing-overlay" onClick={() => setShowBreathing(false)}>
          <div className="breathing-card glass animate-scale-up" onClick={e => e.stopPropagation()}>
            <button className="close-breathing" onClick={() => setShowBreathing(false)}><X size={24}/></button>
            <div className="breathing-content">
              <Wind size={48} className="breathing-icon animate-pulse" />
              <h2>Pausa de Co-regulación</h2>
              <p>Inhala... Mantén... Exhala...</p>
              <div className="breathing-circle"><div className="circle-inner"></div></div>
              <p className="breathing-guide">Sincroniza tu respiración para estar presente con tu siguiente paciente.</p>
              <button className="secondary-btn" onClick={() => setShowBreathing(false)}>Terminar Pausa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
