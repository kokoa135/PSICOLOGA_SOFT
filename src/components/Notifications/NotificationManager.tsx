import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Zap, Smartphone, X } from 'lucide-react';

interface NotifiedAppointment {
  id: string;
  type: '30min' | '10min' | 'now';
}

const NotificationManager: React.FC = () => {
  const { state, showToast } = useApp();
  const [activeAlert, setActiveAlert] = useState<{
    id: string;
    patientName: string;
    time: string;
    type: '30min' | '10min' | 'now';
  } | null>(null);
  
  const notifiedRefs = useRef<NotifiedAppointment[]>([]);

  // Solicitar permiso de notificaciones al montar
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    const checkAppointments = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const todayApts = state.appointments.filter(a => a.date === todayStr);

      todayApts.forEach(apt => {
        const firstTime = apt.time.split(',')[0].trim();
        const [hours, minutes] = firstTime.split(':').map(Number);
        
        const aptDate = new Date();
        aptDate.setHours(hours, minutes, 0, 0);
        
        const diffMs = aptDate.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        const checkAndNotify = (mins: number, type: NotifiedAppointment['type']) => {
          const alreadyNotified = notifiedRefs.current.some(n => n.id === apt.id && n.type === type);
          
          let shouldNotify = false;
          if (type === '30min' && diffMins <= 30 && diffMins > 28) shouldNotify = true;
          if (type === '10min' && diffMins <= 10 && diffMins > 8) shouldNotify = true;
          if (type === 'now' && diffMins <= 0 && diffMins > -2) shouldNotify = true;

          if (shouldNotify && !alreadyNotified) {
            notifiedRefs.current.push({ id: apt.id, type });
            
            const label = type === '30min' ? 'en 30 minutos' : 
                          type === '10min' ? 'en 10 minutos' : '¡AHORA MISMO!';

            // 1. NOTIFICACIÓN DEL SISTEMA (AUTOMÁTICA)
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification(`SOFTPSY: Cita con ${apt.patientName}`, {
                body: `La sesión de las ${firstTime} comienza ${label}.`,
                icon: '/favicon.svg',
                tag: `${apt.id}-${type}`,
                silent: false
              });
            }

            // 2. ALERTA VISUAL EN APP
            setActiveAlert({
              id: apt.id,
              patientName: apt.patientName,
              time: firstTime,
              type
            });
            
            // Sonido de alerta
            try {
              const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
              audio.play();
            } catch (e) {}
          }
        };

        checkAndNotify(30, '30min');
        checkAndNotify(10, '10min');
        checkAndNotify(0, 'now');
      });
    };

    const interval = setInterval(checkAppointments, 30000); 
    checkAppointments();

    return () => clearInterval(interval);
  }, [state.appointments, state.settings.professional]);

  const handleSendToWhatsApp = () => {
    if (!activeAlert) return;
    
    const label = activeAlert.type === '30min' ? 'en 30 minutos' : 
                  activeAlert.type === '10min' ? 'en 10 minutos' : 'AHORA';
                  
    const message = `🚨 *SOFTPSY AVISO AUTOMÁTICO* 🚨\n\n` +
      `Hola ${state.settings.professional},\n` +
      `Te recordamos tu próxima cita:\n\n` +
      `👤 *Paciente:* ${activeAlert.patientName}\n` +
      `⏰ *Hora:* ${activeAlert.time}\n` +
      `⚠️ *Estado:* Inicia ${label}\n\n` +
      `¡Mucho éxito en la sesión! ✨`;

    const waUrl = new URL('https://api.whatsapp.com/send');
    waUrl.searchParams.set('phone', state.settings.phone);
    waUrl.searchParams.set('text', message);
    
    window.open(waUrl.toString(), '_blank');
    setActiveAlert(null);
  };

  if (!activeAlert) return null;

  const alertLabels = {
    '30min': 'Cita en 30 minutos',
    '10min': 'Cita en 10 minutos',
    'now': '¡LA CITA COMIENZA AHORA!'
  };

  return (
    <div className="automated-reminder-overlay">
      <div className="automated-reminder-card animate-scale-up">
        <div className="reminder-header">
          <div className="reminder-icon-orb">
            <Bell className="animate-pulse" />
          </div>
          <button className="reminder-close" onClick={() => setActiveAlert(null)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="reminder-content">
          <span className="reminder-tag">{alertLabels[activeAlert.type]}</span>
          <h3>{activeAlert.patientName}</h3>
          <p>Tu sesión de las {activeAlert.time} está por comenzar.</p>
        </div>

        <button className="reminder-action-btn" onClick={handleSendToWhatsApp}>
          <Smartphone size={18} />
          <span>Enviar aviso a mi WhatsApp</span>
        </button>
        
        <p className="reminder-footer">Este aviso es automático para que estés preparado.</p>
      </div>

      <style>{`
        .automated-reminder-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 11, 20, 0.85);
          backdrop-filter: blur(10px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .automated-reminder-card {
          background: #0a0b14;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          width: 100%;
          max-width: 400px;
          padding: 2.5rem;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
        }
        .reminder-header {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .reminder-icon-orb {
          width: 64px;
          height: 64px;
          background: var(--gradient-primary);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.4);
        }
        .reminder-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .reminder-close:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: rotate(90deg);
        }
        .reminder-tag {
          background: rgba(99, 102, 241, 0.1);
          color: #818cf8;
          padding: 0.5rem 1rem;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
          display: inline-block;
        }
        .automated-reminder-card h3 {
          font-size: 1.75rem;
          color: white;
          margin-bottom: 0.5rem;
          font-weight: 850;
        }
        .automated-reminder-card p {
          color: #94a3b8;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }
        .reminder-action-btn {
          width: 100%;
          background: #10b981;
          color: white;
          border: none;
          padding: 1.25rem;
          border-radius: 18px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
        }
        .reminder-action-btn:hover {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3);
        }
        .reminder-footer {
          margin-top: 1.5rem;
          font-size: 0.7rem;
          color: #475569 !important;
          margin-bottom: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default NotificationManager;
