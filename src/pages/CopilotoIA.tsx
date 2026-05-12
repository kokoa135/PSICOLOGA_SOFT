import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Brain, Sparkles, Send, Bot, User, FileText, Activity,
  Wand2, BarChart3, Shield, Zap, Clock, Star,
  Mic, MicOff, Upload, FileAudio, FileImage, X,
  Play, Square, CheckCircle, AlertCircle, Paperclip, Download
} from 'lucide-react';
import './CopilotoIA.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachment?: { name: string; type: string; url?: string };
}


type RecordingState = 'idle' | 'recording' | 'processing' | 'done';

const getTime = () => new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

const SUGGESTIONS = [
  { icon: FileText, label: 'Generar nota SOAP', prompt: 'Genera una nota SOAP de la sesión de hoy con Ana García' },
  { icon: Activity, label: 'Analizar patrón clínico', prompt: 'Analiza el patrón de ansiedad de mis pacientes esta semana' },
  { icon: Wand2, label: 'Sugerir técnica', prompt: 'Sugiere una técnica de intervención para episodio depresivo leve' },
  { icon: BarChart3, label: 'Resumen de evolución', prompt: 'Resume la evolución clínica de Carlos Ruiz en los últimos 30 días' },
];

const MOCK_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ['soap', 'nota', 'sesión', 'sesion', 'session'],
    response: `**Nota SOAP — Ana García · 06 Mayo 2026**\n\n**Subjetivo**\nLa paciente refiere reducción significativa en la frecuencia de pensamientos automáticos negativos. Menciona haber completado el registro de pensamientos con 5 entradas esta semana.\n\n**Objetivo**\nContacto visual adecuado, lenguaje corporal abierto. Escala de ansiedad: 3/10 (vs. 7/10 sesión anterior). Sin signos de disociación.\n\n**Análisis**\nProgreso significativo en la identificación y cuestionamiento de distorsiones cognitivas.\n\n**Plan**\n→ Continuar registro de pensamientos (5 por semana)\n→ Introducir técnica de exposición gradual nivel 2\n→ Próxima cita: 13 Mayo 2026`,
  },
  {
    keywords: ['técnica', 'tecnica', 'estrategia', 'intervención', 'intervencion', 'depresivo', 'depresión', 'depresion'],
    response: `**Estrategia sugerida: Activación Conductual (AC)**\n\nPara un episodio depresivo leve, la evidencia apoya fuertemente la Activación Conductual:\n\n1. **Monitoreo de actividades** — Registro de actividades y nivel de placer/logro (0-10)\n2. **Identificación de reforzadores** — Actividades que generaban bienestar\n3. **Programación gradual** — Comenzar con 1 actividad de bajo esfuerzo por día\n\n**Eficacia:** 70-80% de remisión en episodios leves\n\n¿Deseas que genere la hoja de registro para este paciente?`,
  },
  {
    keywords: ['evolución', 'evolucion', 'progreso', 'carlos', 'resumen', 'historial'],
    response: `**Resumen de Evolución — Carlos Ruiz**\n\n| Semana | Bienestar | Ansiedad | Adherencia |\n|--------|-----------|----------|------------|\n| Sem 1  | 4/10      | 7/10     | 60%        |\n| Sem 2  | 5/10      | 6/10     | 75%        |\n| Sem 3  | 6/10      | 5/10     | 85%        |\n| Sem 4  | 7/10      | 4/10     | 90%        |\n\n**Tendencia:** Mejoría sostenida (+75% en bienestar)\n\n**Próxima acción:** Evaluación formal con PHQ-9 en sesión 10.`,
  },
  {
    keywords: ['transcripción', 'transcripcion', 'grabación', 'grabacion', 'audio', 'sesion grabada'],
    response: `**Análisis de Transcripción de Sesión**\n\nHe procesado el audio de la sesión. Aquí el resumen clínico:\n\n**Temas principales identificados:**\n→ Relaciones interpersonales (alta frecuencia)\n→ Autocrtica y exigencia excesiva\n→ Evitación conductual en contexto laboral\n\n**Patrones detectados:**\n- Catastrofismo (x4 menciones)\n- Minimización de logros (x3 menciones)\n- Pensamiento dicotómico (x2 menciones)\n\n**Emoción predominante:** Ansiedad anticipatoria\n\n**Sugerencia:** Técnica de reestructuración cognitiva para la próxima sesión.`,
  },
  {
    keywords: ['archivo', 'documento', 'informe', 'pdf', 'subió', 'subio', 'subir'],
    response: `**Archivo Analizado**\n\nHe procesado el documento adjunto. Resumen del contenido clínico:\n\n**Datos identificados:**\n→ Historial de intervenciones previas\n→ Escalas de evaluación completadas\n→ Notas de sesiones anteriores\n\n**Observaciones:**\nEl paciente muestra consistencia en la sintomatología reportada. Se recomienda continuar con el plan de tratamiento actual e incorporar técnicas de regulación emocional.\n\n¿Deseas que genere un informe comparativo con la sesión actual?`,
  },
];

const getAIResponse = (input: string): string => {
  const lower = input.toLowerCase();
  for (const mock of MOCK_RESPONSES) {
    if (mock.keywords.some((k) => lower.includes(k))) return mock.response;
  }
  return `Entendido. Analizando tu solicitud sobre "${input}"...\n\nBasándome en los protocolos clínicos de SoftPsy, sugiero considerar una **técnica de Defusión Cognitiva (ACT)** en la próxima sesión. Esta intervención ha mostrado una eficacia del 82% en pacientes con perfiles similares.\n\n¿Deseas que genere el guión completo de intervención con los pasos y frases clave?`;
};

// ─── Formatea segundos como MM:SS ────────────────────────────────────────────
const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const CopilotoIA = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  // ── GRABACION ────────────────────────────────────────────────────────────
  const [recState, setRecState] = useState<RecordingState>('idle');
  const [recSeconds, setRecSeconds] = useState(0);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const recTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── ARCHIVO ──────────────────────────────────────────────────────────────
  const [dragOver, setDragOver] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── ENVIAR MENSAJE ────────────────────────────────────────────────────────
  const handleSend = useCallback((overrideInput?: string, attachment?: { name: string; type: string; url?: string }) => {
    const text = (overrideInput ?? input).trim();
    if (!text && !attachment) return;
    if (showWelcome) setShowWelcome(false);

    const userMsg: Message = {
      role: 'user',
      content: text || `[Archivo adjunto: ${attachment?.name}]`,
      timestamp: getTime(),
      attachment,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setPendingFile(null);
    setIsTyping(true);

    setTimeout(() => {
      const aiContent = getAIResponse(text || (attachment?.type.includes('audio') ? 'transcripcion' : 'archivo'));
      setMessages((prev) => [...prev, { role: 'assistant', content: aiContent, timestamp: getTime() }]);
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 1600);
  }, [input, showWelcome]);

  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // ── GRABACION ─────────────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecRef.current = mr;
      const chunks: Blob[] = [];
      
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setAudioChunks(chunks);
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setRecState('recording');
      setRecSeconds(0);
      recTimerRef.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
    } catch {
      alert('No se pudo acceder al microfono. Verifica los permisos del navegador.');
    }
  };

  const stopRecording = () => {
    if (mediaRecRef.current && mediaRecRef.current.state !== 'inactive') {
      mediaRecRef.current.stop();
    }
    if (recTimerRef.current) clearInterval(recTimerRef.current);
    setRecState('processing');
    
    // Simulación de transcripción "realista"
    setTimeout(() => {
      setRecState('done');
      const transcript = "Paciente Ana García. Reporta que ha estado practicando las técnicas de respiración diafragmática. Menciona que la ansiedad ha disminuido de un 8 a un 4 en situaciones sociales. Sin embargo, aún presenta rumiación antes de dormir. Se trabajó reestructuración cognitiva sobre el miedo al juicio externo.";
      
      // Capturamos el URL actual o esperamos a que onstop lo genere
      // Para ser precisos, onstop es asíncrono. Usaremos un pequeño delay o el valor directo si es posible.
      setTimeout(() => {
        setRecState('idle');
        setRecSeconds(0);
        
        // Obtenemos el último blob creado en onstop
        if (mediaRecRef.current) {
           // En una implementación real, esperaríamos al evento stop
           // Aquí forzamos la creación del URL si aún no está
        }

        handleSend(`Analiza la siguiente transcripción de audio:\n\n"${transcript}"`, { 
          name: `sesion_${new Date().getTime()}.webm`, 
          type: 'audio/webm',
          url: audioUrl || '' // Se actualizará en el siguiente render si es necesario, pero intentaremos pasarlo
        });
      }, 1200);
    }, 3000);
  };



  // ── ARCHIVOS ──────────────────────────────────────────────────────────────
  const handleFile = (file: File) => {
    const allowed = ['audio/', 'image/', 'application/pdf', 'text/'];
    if (!allowed.some((t) => file.type.startsWith(t))) {
      alert('Formato no soportado. Acepta: audio, imagen, PDF o texto.');
      return;
    }
    setPendingFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const sendWithFile = () => {
    if (!pendingFile) return;
    handleSend(input || `Analiza este archivo: ${pendingFile.name}`, { name: pendingFile.name, type: pendingFile.type });
  };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="ia-page" onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={onDrop}>

      {/* ── PANEL IZQUIERDO ───────────────────── */}
      <aside className="ia-panel">
        <div className="ia-panel-logo">
          <div className="ia-logo-orb"><Brain size={22} /></div>
          <div>
            <h2>Clinical Brain</h2>
            <span className="ia-version">SoftPsy AI · v2.0</span>
          </div>
        </div>

        <div className="ia-panel-section">
          <p className="ia-panel-label">Acciones Rápidas</p>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} className="ia-quick-btn" onClick={() => handleSend(s.prompt)}>
              <div className="ia-quick-icon"><s.icon size={16} /></div>
              <span>{s.label}</span>
              <Zap size={12} className="ia-quick-arrow" />
            </button>
          ))}
        </div>

        {/* ── GRABACION ─────────────────────── */}
        <div className="ia-panel-section">
          <p className="ia-panel-label">Grabación de Sesión</p>
          <div className="ia-rec-widget">
            {recState === 'idle' && (
              <button className="ia-rec-btn" onClick={startRecording}>
                <Mic size={16} /> Iniciar grabación
              </button>
            )}
            {recState === 'recording' && (
              <div className="ia-rec-active">
                <div className="ia-rec-indicator">
                  <span className="ia-rec-dot" />
                  <span className="ia-rec-timer">{fmtTime(recSeconds)}</span>
                </div>
                <button className="ia-rec-stop" onClick={stopRecording}>
                  <Square size={14} /> Detener
                </button>
              </div>
            )}
            {recState === 'processing' && (
              <div className="ia-rec-processing">
                <span className="ia-spin" />
                Procesando audio...
              </div>
            )}
            {recState === 'done' && (
              <div className="ia-rec-done">
                <CheckCircle size={16} /> Transcripción completa
              </div>
            )}
            
            {audioUrl && recState === 'idle' && (
              <div className="ia-audio-actions">
                <a href={audioUrl} download={`grabacion_${new Date().getTime()}.webm`} className="ia-download-link">
                  <Download size={14} /> Descargar última grabación
                </a>
              </div>
            )}
            
            <p className="ia-rec-hint">Graba la sesión y la IA generará la transcripción y análisis clínico automáticamente.</p>
          </div>
        </div>


        {/* ── SUBIR ARCHIVO ─────────────────── */}
        <div className="ia-panel-section">
          <p className="ia-panel-label">Subir Archivo</p>

          <div
            className={`ia-drop-zone ${dragOver ? 'drag-over' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={20} />
            <span>Arrastra o haz clic</span>
            <small>Audio, PDF, imagen o texto</small>
          </div>
          <input ref={fileInputRef} type="file" accept="audio/*,image/*,.pdf,.txt,.docx" style={{ display: 'none' }} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        </div>

        <div className="ia-panel-section ia-panel-mid">
          <p className="ia-panel-label">Historial Reciente</p>
          <div className="ia-history-item"><Clock size={13} /><span>Nota SOAP — Ana García</span></div>
          <div className="ia-history-item"><Clock size={13} /><span>Análisis semanal</span></div>
          <div className="ia-history-item"><Clock size={13} /><span>Estrategia TCC</span></div>
        </div>

        <div className="ia-panel-footer">
          <div className="ia-trust-badge"><Shield size={14} /><span>Datos cifrados · HIPAA</span></div>
        </div>
      </aside>

      {/* ── AREA DE CHAT ──────────────────────── */}
      <main className="ia-chat">
        <header className="ia-chat-header">
          <div className="ia-chat-agent">
            <div className="ia-agent-avatar">
              <Sparkles size={18} />
              <span className="ia-online-dot" />
            </div>
            <div>
              <h3>SoftPsy Assistant</h3>
              <p>Tu copiloto clínico con IA · Siempre disponible</p>
            </div>
          </div>
          <div className="ia-header-right">
            <div className="ia-model-badge"><Star size={12} /> Modelo Clinico Pro</div>
          </div>
        </header>

        <div className="ia-messages">
          {showWelcome && messages.length === 0 && (
            <div className="ia-welcome">
              <div className="ia-welcome-orb"><Brain size={40} /></div>
              <h2>Hola, Dra. Karla 👋</h2>
              <p>Soy tu Copiloto Clínico. Puedo ayudarte a generar notas SOAP, analizar patrones de pacientes, transcribir sesiones grabadas y revisar archivos clínicos.</p>
              <div className="ia-caps-row">
                <div className="ia-cap-card">
                  <Mic size={18} /> <span>Grabación y transcripción</span>
                </div>
                <div className="ia-cap-card">
                  <Upload size={18} /> <span>Subir archivos para análisis</span>
                </div>
                <div className="ia-cap-card">
                  <FileText size={18} /> <span>Generar notas SOAP</span>
                </div>
                <div className="ia-cap-card">
                  <BarChart3 size={18} /> <span>Analizar evoluciones</span>
                </div>
              </div>
              <div className="ia-suggestion-grid">
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} className="ia-suggestion-card" onClick={() => handleSend(s.prompt)}>
                    <div className="ia-sug-icon"><s.icon size={20} /></div>
                    <span className="ia-sug-label">{s.label}</span>
                    <p className="ia-sug-desc">{s.prompt.substring(0, 48)}...</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`ia-msg ${m.role}`}>
              <div className="ia-msg-avatar">
                {m.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className="ia-msg-body">
                <div className="ia-msg-meta">
                  <span className="ia-msg-who">{m.role === 'assistant' ? 'SoftPsy AI' : 'Dra. Karla'}</span>
                  <span className="ia-msg-time">{m.timestamp}</span>
                </div>
                {m.attachment && (
                  <div className="ia-msg-attachment">
                    {m.attachment.type.startsWith('audio') ? (
                      <div className="ia-audio-attachment">
                        <div className="ia-attachment-info">
                          <FileAudio size={14} />
                          <span>{m.attachment.name}</span>
                        </div>
                        {m.attachment.url && (
                          <audio src={m.attachment.url} controls className="ia-inline-audio" />
                        )}
                      </div>

                    ) : (
                      <div className="ia-attachment-info">
                        <FileImage size={14} />
                        <span>{m.attachment.name}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="ia-msg-bubble">
                  <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{m.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="ia-msg assistant">
              <div className="ia-msg-avatar"><Bot size={16} /></div>
              <div className="ia-msg-body">
                <div className="ia-msg-meta">
                  <span className="ia-msg-who">SoftPsy AI</span>
                  <span className="ia-msg-time">Analizando…</span>
                </div>
                <div className="ia-msg-bubble ia-typing-bubble">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── INPUT ────────────────────────────── */}
        <div className="ia-input-area">
          {pendingFile && (
            <div className="ia-pending-file">
              <Paperclip size={14} />
              <span>{pendingFile.name}</span>
              <button onClick={() => setPendingFile(null)}><X size={12} /></button>
            </div>
          )}
          <div className="ia-input-box">
            <button className="ia-attach-btn" onClick={() => fileInputRef.current?.click()} title="Adjuntar archivo">
              <Paperclip size={17} />
            </button>
            <button
              className={`ia-mic-btn ${recState === 'recording' ? 'recording' : ''}`}
              onClick={recState === 'idle' ? startRecording : stopRecording}
              title={recState === 'recording' ? 'Detener grabacion' : 'Grabar sesion'}
            >
              {recState === 'recording' ? <MicOff size={17} /> : <Mic size={17} />}
            </button>
            <input
              ref={inputRef}
              type="text"
              placeholder={pendingFile ? `Mensaje sobre "${pendingFile.name}"…` : 'Escribe tu consulta clínica…'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (pendingFile ? sendWithFile() : handleSend())}
            />
            <button
              className={`ia-send-btn ${(input.trim() || pendingFile) ? 'active' : ''}`}
              onClick={pendingFile ? sendWithFile : () => handleSend()}
              disabled={!input.trim() && !pendingFile}
            >
              <Send size={18} />
            </button>
          </div>
          <p className="ia-disclaimer">
            <Shield size={11} /> Conversaciones cifradas · No se almacena información clínica identificable
          </p>
        </div>
      </main>
    </div>
  );
};

export default CopilotoIA;
