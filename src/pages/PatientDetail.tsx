import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, Activity, FileText, Plus, ChevronRight,
  Download, Brain, Shield, Zap, Sparkles, Leaf, Target,
  Thermometer, AlertCircle, X, Stethoscope, CheckCircle, Mic, Upload
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp, ClinicalNote, SessionMetrics } from '../context/AppContext';
import './PatientDetail.css';

const SYMPTOMS_CONFIG = [
  { id: 'anxiety' as keyof SessionMetrics, label: 'Ansiedad', color: '#f59e0b' },
  { id: 'depression' as keyof SessionMetrics, label: 'Depresión', color: '#6366f1' },
  { id: 'stress' as keyof SessionMetrics, label: 'Estrés', color: '#ec4899' },
  { id: 'mood' as keyof SessionMetrics, label: 'Estado de Ánimo', color: '#10b981' },
];

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, addNote, getPatientNotes, getPatientNoteMetrics, showToast } = useApp();

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [activeNoteTab, setActiveNoteTab] = useState<'SOAP' | 'Libre'>('SOAP');
  const [selectedSymptoms, setSelectedSymptoms] = useState(['anxiety', 'depression', 'stress', 'mood']);
  const [showHistorial, setShowHistorial] = useState(false);
  const [viewingNote, setViewingNote] = useState<ClinicalNote | null>(null);

  const [noteForm, setNoteForm] = useState({
    subjective: '', objective: '', analysis: '', plan: '',
    metrics: { anxiety: 5, depression: 5, stress: 5, mood: 5 } as SessionMetrics,
  });

  const patientId = parseInt(id || '0');
  const patient = state.patients.find(p => p.id === patientId);
  const patientNotes = getPatientNotes(patientId);
  const chartData = getPatientNoteMetrics(patientId);

  if (!patient) {
    return (
      <div className="patient-detail-container animate-fade-in">
        <header className="detail-header">
          <Link to="/pacientes" className="back-link glass"><ArrowLeft size={18} /><span>Pacientes</span></Link>
        </header>
        <div style={{textAlign:'center', padding:'4rem', color:'var(--text-muted)'}}>
          <Brain size={48} style={{margin:'0 auto 1rem',display:'block',color:'#c4b5fd'}}/>
          <h3>Paciente no encontrado</h3>
          <p>Este paciente no existe en el directorio.</p>
        </div>
      </div>
    );
  }

  const progressLevel = Math.min(5, Math.max(1, Math.ceil(patientNotes.length / 2)));

  const toggleSymptom = (sId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(sId) ? prev.filter(id => id !== sId) : [...prev, sId]
    );
  };

  const handleMetricChange = (key: keyof SessionMetrics, val: number) => {
    setNoteForm(prev => ({ ...prev, metrics: { ...prev.metrics, [key]: val } }));
  };

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    addNote({
      patientId,
      date: now.toISOString().split('T')[0],
      dateLabel: now.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: activeNoteTab,
      subjective: noteForm.subjective,
      objective: noteForm.objective,
      analysis: noteForm.analysis,
      plan: noteForm.plan,
      metrics: noteForm.metrics,
    });
    setShowNoteModal(false);
    setNoteForm({ subjective: '', objective: '', analysis: '', plan: '', metrics: { anxiety: 5, depression: 5, stress: 5, mood: 5 } });
  };

  const handleDownloadHistory = () => {
    const lines = [
      `HISTORIA CLÍNICA — ${patient.name}`,
      `DNI: ${patient.dni} | Edad: ${patient.age} años | Tel: ${patient.phone}`,
      `Diagnóstico: ${patient.diagnosis}`,
      `Dirección: ${patient.address}`,
      `Email: ${patient.email}`,
      `\n--- NOTAS DE SESIÓN ---`,
      ...patientNotes.map(n =>
        `\n[${n.dateLabel}] Tipo: ${n.type}\nS: ${n.subjective}\nO: ${n.objective}\nA: ${n.analysis}\nP: ${n.plan}\nMétricas: Ansiedad ${n.metrics.anxiety} | Depresión ${n.metrics.depression} | Estrés ${n.metrics.stress} | Ánimo ${n.metrics.mood}`
      ),
    ].join('\n');

    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HistoriaClinica_${patient.name.replace(' ', '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Historia clínica descargada', 'success');
  };

  return (
    <div className="patient-detail-container animate-fade-in">
      <header className="detail-header">
        <Link to="/pacientes" className="back-link glass">
          <ArrowLeft size={18} /><span>Pacientes</span>
        </Link>
        <div className="header-actions">
          <button className="secondary-btn glass btn-small" onClick={handleDownloadHistory}>
            <Download size={16} /><span>Historia</span>
          </button>
          <button className="primary-btn-pro btn-small" onClick={() => setShowNoteModal(true)}>
            <Plus size={16} /><span>Nueva Nota</span>
          </button>
        </div>
      </header>

      {/* TOP CARDS */}
      <div className="detail-top-cards">
        <section className="patient-profile-card-mini glass animate-scale-up">
          <div className="profile-header-mini">
            <div className="avatar-med">{patient.name[0]}</div>
            <div className="profile-info-mini">
              <h1>{patient.name}</h1>
              <span className="diagnosis-badge-mini">{patient.diagnosis}</span>
            </div>
          </div>
          <div className="meta-stats-mini">
            <div className="meta-item"><Calendar size={14}/> {patient.age} años</div>
            <div className="meta-item"><Activity size={14}/> {patientNotes.length} sesiones</div>
          </div>
        </section>

        <section className="healing-garden-mini glass animate-scale-up">
          <div className="garden-header-mini">
            <Leaf size={14} /><span>Progreso Clínico</span>
          </div>
          <div className="garden-visual-mini">
            {Array.from({length: 5}).map((_, i) => (
              <div key={i} className={`garden-node-mini ${i < progressLevel ? 'active' : ''}`}>
                {i < progressLevel ? <Sparkles size={10} /> : null}
              </div>
            ))}
            <div className="garden-line-mini" style={{ width: `${(progressLevel - 1) * 25}%` }}></div>
          </div>
          <p style={{fontSize:'0.75rem',color:'#15803d',fontWeight:700,marginTop:'0.75rem',textAlign:'center'}}>
            {patientNotes.length} nota{patientNotes.length !== 1 ? 's' : ''} registrada{patientNotes.length !== 1 ? 's' : ''}
          </p>
        </section>

        <section className="copilot-insights-mini glass animate-scale-up" style={{cursor:'pointer'}} onClick={() => navigate('/copiloto-ia')}>
          <div className="insight-row-mini">
            <Target size={16} className="icon-target" />
            <p>Foco: <strong>Exposición Social</strong></p>
          </div>
          <div className="insight-row-mini">
            <AlertCircle size={16} className="icon-alert" />
            <p>IA: <strong>Abrir Copiloto →</strong></p>
          </div>
        </section>
      </div>

      {/* MAIN CONTENT */}
      <div className="detail-main-content">
        <section className="evolution-chart-card glass animate-fade-in">
          <div className="card-header-v3">
            <div className="title-group-v3">
              <h3>Evolución Clínica Longitudinal</h3>
              <p>{chartData.length > 0 ? `${chartData.length} sesiones registradas` : 'Aún no hay notas — crea la primera con el botón "Nueva Nota"'}</p>
            </div>
            <div className="symptom-legend-v3">
              {SYMPTOMS_CONFIG.map(s => (
                <button
                  key={s.id}
                  className={`legend-item-btn-v3 ${selectedSymptoms.includes(s.id) ? 'active' : ''}`}
                  onClick={() => toggleSymptom(s.id)}
                >
                  <span className="legend-dot-v3" style={{ backgroundColor: s.color }}></span>
                  <span className="legend-label-v3">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="chart-wrapper-detail">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11}} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, 10]} ticks={[0, 5, 10]} tick={{fontSize: 11}} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.08)'}} />
                  {SYMPTOMS_CONFIG.map(s => (
                    selectedSymptoms.includes(s.id) && (
                      <Line key={s.id} type="monotone" dataKey={s.id} name={s.label} stroke={s.color} strokeWidth={2.5} dot={{ r: 4 }} animationDuration={1000} />
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{height:200,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'1rem',color:'var(--text-muted)'}}>
                <Activity size={48} style={{color:'#e2e8f0'}}/>
                <p>La gráfica aparecerá al registrar notas con métricas.</p>
                <button className="primary-btn-pro btn-small" onClick={() => setShowNoteModal(true)}>
                  <Plus size={16}/> Registrar Primera Nota
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="clinical-notes-card-v3 glass animate-fade-in">
          <div className="card-header-v3">
            <h3>Últimas Notas</h3>
            <button className="text-btn" onClick={() => setShowHistorial(!showHistorial)}>
              {showHistorial ? 'Ocultar' : `Ver todas (${patientNotes.length})`}
            </button>
          </div>
          <div className="notes-list-compact">
            {(showHistorial ? patientNotes : patientNotes.slice(0, 3)).length > 0
              ? (showHistorial ? patientNotes : patientNotes.slice(0, 3)).map((note) => (
                  <div key={note.id} className="note-item-compact glass" style={{cursor:'pointer'}} onClick={() => setViewingNote(note)}>
                    <div className="note-meta-compact">
                      <span className="note-date">{note.dateLabel}</span>
                      <span className="note-badge">{note.type}</span>
                    </div>
                    <p>{note.subjective || note.plan}</p>
                    <div style={{display:'flex',gap:'0.5rem',marginTop:'0.5rem',flexWrap:'wrap'}}>
                      {SYMPTOMS_CONFIG.map(s => (
                        <span key={s.id} style={{fontSize:'0.65rem',fontWeight:700,color:s.color,background:`${s.color}15`,padding:'0.1rem 0.4rem',borderRadius:'6px'}}>
                          {s.label}: {note.metrics[s.id]}/10
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              : (
                <div style={{padding:'2rem',textAlign:'center',color:'var(--text-muted)'}}>
                  <FileText size={32} style={{color:'#e2e8f0',margin:'0 auto 0.75rem',display:'block'}}/>
                  <p>Sin notas registradas aún.</p>
                </div>
              )
            }
          </div>
        </section>
      </div>

      {/* ── MODAL NUEVA NOTA SOAP + MÉTRICAS ── */}
      {showNoteModal && (
        <div className="content-modal-overlay" onClick={() => setShowNoteModal(false)}>
          <div className="content-modal soap-modal-pro animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="modal-header-soap-pro">
              <div className="title-area">
                <Stethoscope size={22} className="header-icon-pro" />
                <h2>Nueva Nota: {patient.name}</h2>
              </div>
              <button className="close-modal-pro" onClick={() => setShowNoteModal(false)}><X size={20}/></button>
            </div>
            <form className="modal-content-split" onSubmit={handleSubmitNote}>
              <div className="soap-inputs-area">
                <div className="soap-tabs-pro">
                  <button type="button" className={activeNoteTab === 'SOAP' ? 'active' : ''} onClick={() => setActiveNoteTab('SOAP')}>Formato SOAP</button>
                  <button type="button" className={activeNoteTab === 'Libre' ? 'active' : ''} onClick={() => setActiveNoteTab('Libre')}>Nota Libre</button>
                </div>
                <div className="soap-fields-grid">
                  <div className="field-group">
                    <label>Subjetivo</label>
                    <textarea placeholder="Reporte del paciente..." value={noteForm.subjective} onChange={e => setNoteForm({...noteForm, subjective: e.target.value})}></textarea>
                  </div>
                  <div className="field-group">
                    <label>Objetivo</label>
                    <textarea placeholder="Observaciones clínicas..." value={noteForm.objective} onChange={e => setNoteForm({...noteForm, objective: e.target.value})}></textarea>
                  </div>
                  <div className="field-group">
                    <label>Análisis</label>
                    <textarea placeholder="Impresión diagnóstica..." value={noteForm.analysis} onChange={e => setNoteForm({...noteForm, analysis: e.target.value})}></textarea>
                  </div>
                  <div className="field-group">
                    <label>Plan</label>
                    <textarea placeholder="Tareas y seguimiento..." value={noteForm.plan} onChange={e => setNoteForm({...noteForm, plan: e.target.value})}></textarea>
                  </div>
                </div>
              </div>

              <div className="metrics-scoring-area">
                <h3>Métricas de la Sesión</h3>
                <p>Valores 0-10 observados hoy. Alimentan la gráfica.</p>
                <div className="metrics-list-pro">
                  {SYMPTOMS_CONFIG.map(s => (
                    <div key={s.id} className="metric-input-row">
                      <div className="metric-label-row">
                        <label style={{color: s.color}}>{s.label}</label>
                        <span className="metric-value" style={{background:`${s.color}15`,color:s.color}}>
                          {noteForm.metrics[s.id]}
                        </span>
                      </div>
                      <input
                        type="range" min="0" max="10" step="0.5"
                        value={noteForm.metrics[s.id]}
                        onChange={e => handleMetricChange(s.id, parseFloat(e.target.value))}
                        className="metric-range"
                        style={{ accentColor: s.color }}
                      />
                      <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.65rem',color:'#94a3b8',marginTop:'-0.25rem'}}>
                        <span>0</span><span>5</span><span>10</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="modal-actions-pro">
                  <button type="button" className="secondary-btn" onClick={() => setShowNoteModal(false)}>Cancelar</button>
                  <button type="submit" className="primary-btn-pro">
                    <Shield size={16} /> Firmar y Guardar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VER NOTA COMPLETA ── */}
      {viewingNote && (
        <div className="content-modal-overlay" onClick={() => setViewingNote(null)}>
          <div className="content-modal animate-scale-up" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setViewingNote(null)}><X size={24}/></button>
            <div className="modal-body">
              <div className="modal-header">
                <FileText size={24} className="sparkle-icon" />
                <h2>Nota del {viewingNote.dateLabel}</h2>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                {[
                  {l:'Subjetivo', v: viewingNote.subjective},
                  {l:'Objetivo', v: viewingNote.objective},
                  {l:'Análisis', v: viewingNote.analysis},
                  {l:'Plan', v: viewingNote.plan},
                ].map(f => f.v && (
                  <div key={f.l}>
                    <label style={{fontSize:'0.75rem',fontWeight:800,color:'var(--text-muted)',textTransform:'uppercase'}}>{f.l}</label>
                    <p style={{marginTop:'0.25rem',color:'var(--text-main)',lineHeight:1.6}}>{f.v}</p>
                  </div>
                ))}
                <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap',paddingTop:'1rem',borderTop:'1px solid var(--border-color)'}}>
                  {SYMPTOMS_CONFIG.map(s => (
                    <div key={s.id} style={{textAlign:'center',background:`${s.color}10`,padding:'0.75rem 1rem',borderRadius:'12px',minWidth:'80px'}}>
                      <div style={{fontSize:'1.5rem',fontWeight:800,color:s.color}}>{viewingNote.metrics[s.id]}</div>
                      <div style={{fontSize:'0.65rem',fontWeight:700,color:'var(--text-muted)'}}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetail;
