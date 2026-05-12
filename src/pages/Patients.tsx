import React, { useState } from 'react';
import { 
  Users, Search, Plus, UserPlus, ChevronDown, ChevronUp, X,
  Trash2, Phone, Mail, Calendar, ChevronRight, Sparkles, Target,
  FileText, Clock, IdCard, MapPin, ArrowRight, ArrowLeft, Check, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, Patient } from '../context/AppContext';
import './Patients.css';

const Stethoscope = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2a.3.3 0 0 0-.2.3Z"/>
    <path d="M10 22v-2"/>
    <path d="M7 16v-4a5 5 0 0 1 10 0v4"/>
    <path d="M10 16h4"/>
    <path d="M8 10V5a3 3 0 0 1 6 0v5"/>
    <path d="M18 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"/>
    <path d="M13 14h.01"/>
    <path d="M22 12v1a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-1"/>
  </svg>
);

const Patients = () => {
  const { state, addPatient, deletePatient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const calculateDetailedAge = (birthDate: string) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return `${years} años, ${months} meses, ${days} días`;
  };

  const [newPatient, setNewPatient] = useState({
    name: '', email: '', phone: '', dni: '', address: '', age: '', birthDate: '', diagnosis: ''
  });

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    addPatient({
      name: newPatient.name,
      dni: newPatient.dni,
      address: newPatient.address,
      email: newPatient.email || `${newPatient.name.toLowerCase().replace(' ', '.')}@softpsy.com`,
      phone: newPatient.phone.replace(/\D/g, ''),
      age: newPatient.age || calculateDetailedAge(newPatient.birthDate),
      birthDate: newPatient.birthDate,
      diagnosis: newPatient.diagnosis,
      lastSession: 'Pendiente',
      status: 'Activo',
    });
    setShowNewPatientModal(false);
    setCurrentStep(1);
    setNewPatient({ name: '', email: '', phone: '', dni: '', address: '', age: '', birthDate: '', diagnosis: '' });
  };


  const handleDelete = (id: number) => {
    deletePatient(id);
    setConfirmDeleteId(null);
    if (expandedId === id) setExpandedId(null);
  };

  const filteredPatients = state.patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.dni.includes(searchTerm)
  );

  const steps = [
    { id: 1, label: 'Identidad', icon: IdCard },
    { id: 2, label: 'Contacto', icon: Phone },
    { id: 3, label: 'Clínica', icon: Stethoscope },
  ];

  return (
    <div className="patients-container animate-fade-in">
      <header className="patients-header-v3">
        <div className="header-info">
          <h1>Directorio Clínico</h1>
          <p>{state.patients.length} pacientes registrados en SoftPsy</p>
        </div>
        <button className="primary-btn-round" onClick={() => setShowNewPatientModal(true)}>
          <Plus size={20} /><span>Nuevo Paciente</span>
        </button>
      </header>

      <div className="search-bar-v3 glass">
        <Search size={20} />
        <input
          type="text"
          placeholder="Búsqueda inteligente: Nombre, DNI, diagnóstico..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="patients-list-v3">
        {filteredPatients.length === 0 ? (
          <div style={{textAlign:'center',padding:'4rem',color:'var(--text-muted)'}}>
            <Users size={48} style={{color:'#e2e8f0',margin:'0 auto 1rem',display:'block'}}/>
            <p>No se encontraron pacientes.</p>
          </div>
        ) : filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className={`patient-row-v3 glass ${expandedId === patient.id ? 'expanded' : ''}`}
            onClick={() => setExpandedId(expandedId === patient.id ? null : patient.id)}
          >
            <div className="row-main">
              <div className="patient-basic">
                <div className="p-avatar-mini">{patient.name[0]}</div>
                <div className="p-name-meta">
                  <h3>{patient.name}</h3>
                  <span className="p-id">DNI: {patient.dni}</span>
                </div>
              </div>
              <div className="p-diagnosis-brief">
                <Target size={14} /><span>{patient.diagnosis}</span>
              </div>
              <div className="p-status-pill">
                <span className={`dot ${patient.status.toLowerCase()}`}></span>
                {patient.status}
              </div>
              <div className="p-actions-brief">
                {expandedId === patient.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </div>

            <AnimatePresence>
              {expandedId === patient.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="row-expanded"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="expanded-grid">
                    <div className="info-section">
                      <h4>Datos Personales</h4>
                      <div className="info-item"><IdCard size={14}/> DNI: {patient.dni}</div>
                      <div className="info-item"><MapPin size={14}/> {patient.address}</div>
                      <div className="info-item"><Phone size={14}/> {patient.phone}</div>
                      <div className="info-item"><Mail size={14}/> {patient.email}</div>
                    </div>
                    <div className="info-section">
                      <h4>Seguimiento</h4>
                      <div className="info-item"><Calendar size={14}/> Edad: {patient.age} años</div>
                      <div className="info-item"><Clock size={14}/> Última: {patient.lastSession}</div>
                      <div className="info-item"><Target size={14}/> {patient.diagnosis}</div>
                    </div>
                    <div className="expanded-actions">
                      <Link to={`/pacientes/${patient.id}`} className="action-btn primary" onClick={e => e.stopPropagation()}>
                        <FileText size={16} /> Ficha Completa
                      </Link>
                      <button
                        className="action-btn danger"
                        onClick={e => { e.stopPropagation(); setConfirmDeleteId(patient.id); }}
                      >
                        <Trash2 size={16} /> Eliminar
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* MODAL NUEVO PACIENTE */}
      <AnimatePresence>
        {showNewPatientModal && (
          <div className="content-modal-overlay" onClick={() => setShowNewPatientModal(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="premium-stepper-modal glass"
              onClick={e => e.stopPropagation()}
            >
              <button className="close-modal-pro" onClick={() => setShowNewPatientModal(false)}><X size={24}/></button>
              <div className="stepper-header">
                <div className="stepper-visual">
                  {steps.map((s, i) => (
                    <React.Fragment key={s.id}>
                      <div className={`step-circle ${currentStep >= s.id ? 'active' : ''} ${currentStep > s.id ? 'completed' : ''}`}>
                        {currentStep > s.id ? <Check size={18} /> : <s.icon size={18} />}
                        <span className="step-label-floating">{s.label}</span>
                      </div>
                      {i < steps.length - 1 && <div className={`step-line ${currentStep > s.id ? 'active' : ''}`}></div>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="stepper-body">
                <form onSubmit={handleAddPatient}>
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="step-content">
                        <div className="step-intro">
                          <IdCard size={32} className="step-icon-main" />
                          <h2>Identidad del Paciente</h2>
                          <p>Comencemos con los datos básicos de identificación.</p>
                        </div>
                        <div className="pro-form-group">
                          <label>Nombre y Apellidos</label>
                          <input type="text" required placeholder="Nombre completo..." value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
                        </div>
                        <div className="pro-form-row">
                          <div className="pro-form-group">
                            <label>Fecha de Nacimiento</label>
                            <input 
                              type="date" 
                              required 
                              value={newPatient.birthDate} 
                              onChange={e => {
                                const bDate = e.target.value;
                                setNewPatient({...newPatient, birthDate: bDate, age: calculateDetailedAge(bDate)});
                              }} 
                            />
                          </div>
                          <div className="pro-form-group">
                            <label>Edad Calculada</label>
                            <input 
                              type="text" 
                              placeholder="0 años..." 
                              readOnly
                              value={newPatient.age} 
                              className="readonly-input"
                            />
                          </div>
                        </div>
                        <div className="pro-form-row">
                          <div className="pro-form-group">
                            <label>DNI</label>
                            <input type="text" required placeholder="Número de documento" value={newPatient.dni} onChange={e => setNewPatient({...newPatient, dni: e.target.value})} />
                          </div>
                          <div className="pro-form-group">
                            <label>Dirección</label>
                            <input type="text" placeholder="Dirección de residencia..." value={newPatient.address} onChange={e => setNewPatient({...newPatient, address: e.target.value})} />
                          </div>
                        </div>

                      </motion.div>
                    )}
                    {currentStep === 2 && (
                      <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="step-content">
                        <div className="step-intro">
                          <Phone size={32} className="step-icon-main" />
                          <h2>Canales de Contacto</h2>
                          <p>¿Cómo nos comunicaremos con el paciente?</p>
                        </div>
                        <div className="pro-form-group">
                          <label>WhatsApp / Teléfono</label>
                          <div className="input-with-icon">
                            <Phone size={18} />
                            <input type="tel" required placeholder="51987654321" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} />
                          </div>
                        </div>
                        <div className="pro-form-group">
                          <label>Correo Electrónico</label>
                          <div className="input-with-icon">
                            <Mail size={18} />
                            <input type="email" placeholder="email@ejemplo.com" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} />
                          </div>
                        </div>
                        <div className="info-alert-pro glass">
                          <Sparkles size={16} />
                          <span>Usaremos estos datos para enviar recordatorios automáticos.</span>
                        </div>
                      </motion.div>
                    )}
                    {currentStep === 3 && (
                      <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="step-content">
                        <div className="step-intro">
                          <Target size={32} className="step-icon-main" />
                          <h2>Contexto Clínico</h2>
                          <p>Define el punto de partida del proceso terapéutico.</p>
                        </div>
                        <div className="pro-form-group">
                          <label>Diagnóstico Inicial / Motivo de Consulta</label>
                          <textarea required placeholder="Describe brevemente por qué el paciente busca ayuda..." value={newPatient.diagnosis} onChange={e => setNewPatient({...newPatient, diagnosis: e.target.value})}></textarea>
                        </div>
                        <div className="summary-preview glass">
                          <p><strong>Resumen:</strong> Creando ficha para <span>{newPatient.name}</span> con DNI <span>{newPatient.dni}</span>.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="stepper-footer">
                    {currentStep > 1 && (
                      <button type="button" className="btn-back-pro" onClick={() => setCurrentStep(p => p - 1)}>
                        <ArrowLeft size={18} /> Atrás
                      </button>
                    )}
                    <div style={{ flex: 1 }}></div>
                    {currentStep < 3 ? (
                      <button type="button" className="btn-next-pro" onClick={() => setCurrentStep(p => p + 1)} disabled={!newPatient.name && currentStep === 1}>
                        Siguiente <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button type="submit" className="btn-finish-pro">
                        <Check size={18} /> Finalizar Registro
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM DELETE */}
      {confirmDeleteId !== null && (
        <div className="content-modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="content-modal animate-scale-up" style={{maxWidth:'420px'}} onClick={e => e.stopPropagation()}>
            <div className="modal-body" style={{textAlign:'center'}}>
              <AlertTriangle size={48} style={{color:'#ef4444',margin:'0 auto 1rem',display:'block'}}/>
              <h2 style={{marginBottom:'0.75rem'}}>¿Eliminar Paciente?</h2>
              <p style={{color:'var(--text-muted)',marginBottom:'2rem'}}>Esta acción eliminará al paciente y no se puede deshacer.</p>
              <div style={{display:'flex',gap:'1rem',justifyContent:'center'}}>
                <button className="secondary-btn" onClick={() => setConfirmDeleteId(null)}>Cancelar</button>
                <button className="prescribe-large" style={{background:'#ef4444',boxShadow:'0 10px 20px rgba(239,68,68,0.2)'}} onClick={() => handleDelete(confirmDeleteId)}>
                  <Trash2 size={18} /> Sí, Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
