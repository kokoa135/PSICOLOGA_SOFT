import React, { useState, useRef } from 'react';
import { 
  Settings as SettingsIcon, User, Bell, Shield, Palette, 
  Save, Camera, X, Check, Heart, MessageCircle,
  Code2, Zap, Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Settings.css';

const Settings = () => {
  const { state, updateSettings, showToast } = useApp();
  const [activeSection, setActiveSection] = useState('Perfil');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ ...state.settings });

  const sections = [
    { id: 'Perfil', icon: User, label: 'Perfil Profesional' },
    { id: 'Notificaciones', icon: Bell, label: 'Notificaciones' },
    { id: 'Seguridad', icon: Shield, label: 'Seguridad' },
    { id: 'Apariencia', icon: Palette, label: 'Apariencia' },
    { id: 'Acerca de', icon: Code2, label: 'Acerca de SoftPsy' },
  ];


  const handleSave = () => {
    updateSettings(form);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setForm(prev => ({ ...prev, logo: result }));
      showToast('Logo actualizado — guarda para confirmar', 'info');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="settings-container animate-fade-in">
      <header className="settings-header">
        <div className="title-group">
          <SettingsIcon className="header-icon" />
          <div>
            <h1>Configuración</h1>
            <p className="subtitle">Personaliza tu experiencia clínica.</p>
          </div>
        </div>
        <button className="primary-btn-pro" onClick={handleSave}>
          <Save size={18} /><span>Guardar Cambios</span>
        </button>
      </header>

      <div className="settings-layout">
        <nav className="settings-nav glass">
          {sections.map(s => (
            <button
              key={s.id}
              className={`nav-item ${activeSection === s.id ? 'active' : ''}`}
              onClick={() => setActiveSection(s.id)}
            >
              <s.icon size={20} />
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        <div className="settings-content glass">
          {activeSection === 'Perfil' && (
            <div className="settings-section animate-fade-in">
              <h2>Perfil Profesional</h2>
              <p>Esta información aparecerá en los reportes e historias clínicas.</p>

              {/* Logo Upload */}
              <div className="logo-upload-area">
                <div className="logo-preview" onClick={() => logoInputRef.current?.click()}>
                  {form.logo
                    ? <img src={form.logo} alt="Logo clínica" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}}/>
                    : <Camera size={32} />
                  }
                  <div className="logo-overlay"><Camera size={16} /> Cambiar</div>
                </div>
                <div>
                  <h3>Logo de la Clínica</h3>
                  <p>PNG o JPG, recomendado 200×200px</p>
                  <button className="secondary-btn" onClick={() => logoInputRef.current?.click()}>
                    <Camera size={16} /> Subir Logo
                  </button>
                  <input ref={logoInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleLogoChange} />
                </div>
              </div>

              <div className="settings-form">
                <div className="form-group">
                  <label>Nombre del Profesional</label>
                  <input type="text" value={form.professional} onChange={e => setForm({...form, professional: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre de la Clínica</label>
                    <input type="text" value={form.clinicName} onChange={e => setForm({...form, clinicName: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Especialidad</label>
                    <input type="text" value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Número de WhatsApp (Notificaciones)</label>
                  <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="51987654321" />
                </div>
                <div className="form-group">
                  <label>Dirección del Consultorio</label>
                  <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Instagram / Redes Sociales</label>
                  <input type="text" value={form.instagram} onChange={e => setForm({...form, instagram: e.target.value})} placeholder="@tu.consultorio" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Notificaciones' && (
            <div className="settings-section animate-fade-in">
              <h2>Notificaciones</h2>
              <p>Controla cómo y cuándo recibes alertas.</p>
              <div className="toggle-list">
                {[
                  'Recordatorio de citas (24h antes)',
                  'Paciente sin cita en 30 días',
                  'Alerta de métricas críticas (IA)',
                  'Resumen semanal por correo',
                ].map(label => (
                  <div key={label} className="toggle-row">
                    <div>
                      <strong>{label}</strong>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '20px', border: '1px dashed rgba(99, 102, 241, 0.2)' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Prueba de Sistema</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Verifica que las notificaciones automáticas y el enlace a tu WhatsApp funcionen correctamente.</p>
                <button 
                  className="secondary-btn" 
                  style={{ background: 'var(--primary)', color: 'white', border: 'none' }}
                  onClick={() => {
                    // Trigger a test notification
                    if ("Notification" in window && Notification.permission === "granted") {
                      new Notification("SOFTPSY: Prueba de Sistema", {
                        body: "Si ves esto, las notificaciones automáticas están operativas.",
                        icon: '/favicon.svg'
                      });
                    }
                    
                    const message = `🚨 *SOFTPSY PRUEBA DE CONEXIÓN* 🚨\n\n` +
                      `Hola ${form.professional},\n` +
                      `Esta es una prueba directa desde tu configuración.\n\n` +
                      `✅ Si recibes esto, el sistema de avisos de citas está listo.`;
                      
                    const waUrl = new URL('https://api.whatsapp.com/send');
                    waUrl.searchParams.set('phone', form.phone);
                    waUrl.searchParams.set('text', message);
                    window.open(waUrl.toString(), '_blank');
                    
                    showToast('Prueba enviada a WhatsApp', 'success');
                  }}
                >
                  <Zap size={16} /> Enviar Mensaje de Prueba
                </button>
              </div>
            </div>
          )}

          {activeSection === 'Seguridad' && (
            <div className="settings-section animate-fade-in">
              <h2>Seguridad y Acceso</h2>
              <p>Gestión de contraseña y sesiones activas.</p>
              <div className="settings-form">
                <div className="form-group">
                  <label>Contraseña Actual</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nueva Contraseña</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label>Confirmar Contraseña</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <button className="primary-btn-pro" style={{width:'fit-content'}} onClick={() => showToast('Contraseña actualizada', 'success')}>
                  <Shield size={18}/> Actualizar Contraseña
                </button>
              </div>
            </div>
          )}

          {activeSection === 'Apariencia' && (
            <div className="settings-section animate-fade-in">
              <h2>Apariencia</h2>
              <p>Personaliza los colores y el tema de la plataforma.</p>
              <div className="color-grid">
                {[
                  { label: 'Índigo Clínico', primary: '#6366f1', secondary: '#8b5cf6' },
                  { label: 'Teal Sereno', primary: '#0d9488', secondary: '#06b6d4' },
                  { label: 'Rosa Cálido', primary: '#ec4899', secondary: '#f43f5e' },
                  { label: 'Ámbar Natural', primary: '#d97706', secondary: '#f59e0b' },
                ].map(theme => (
                  <button key={theme.label} className="theme-card glass" onClick={() => showToast(`Tema "${theme.label}" aplicado`, 'info')}>
                    <div className="theme-preview" style={{background:`linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`}}></div>
                    <span>{theme.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'Acerca de' && (
            <div className="settings-section animate-fade-in">
              <div className="app-info">
                <div className="app-logo-mini">
                  <SettingsIcon size={24} />
                </div>
                <div className="app-details">
                  <h4>SoftPsy — Suite Clínica</h4>
                  <span>Versión 2.0.0 · Mayo 2026</span>
                </div>
              </div>

              <div className="developer-card">
                <div className="dev-header">
                  <Code2 size={14} />
                  <span>Desarrollado por</span>
                </div>
                <div className="dev-name">JAQ Biomedical · Jorge Álvarez Quispe</div>
                <p className="dev-description">
                  Sistema de gestión clínica diseñado especialmente para psicólogos y terapeutas. 
                  Flujo clínico completo, Copiloto IA integrado y evolución de pacientes en tiempo real.
                </p>
                <button
                  className="contact-dev-btn"
                  onClick={() => window.open('https://wa.me/51953699210?text=Hola%2C%20me%20interesa%20saber%20más%20sobre%20SoftPsy', '_blank')}
                >
                  <MessageCircle size={18} />
                  Contactar Desarrollador · WhatsApp
                </button>
              </div>

              <div className="tech-info">
                <div className="tech-item">
                  <Zap size={16} style={{color:'#f59e0b'}} />
                  <span>React · Vite · TypeScript · Recharts · Framer Motion</span>
                </div>
                <div className="tech-item">
                  <Lock size={16} style={{color:'#10b981'}} />
                  <span>Datos cifrados y almacenados localmente de forma segura</span>
                </div>
                <div className="tech-item">
                  <Heart size={16} style={{color:'#f472b6'}} />
                  <span>Hecho con amor para el bienestar mental</span>
                </div>
              </div>

              <div className="about-footer">
                © 2026 JAQ Biomedical. Todos los derechos reservados. SoftPsy es una herramienta de apoyo clínico, no reemplaza el juicio profesional.
              </div>
            </div>
          )}


          <div className="save-bar">
            <button className="primary-btn-pro" onClick={handleSave}>
              <Save size={18} /> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
