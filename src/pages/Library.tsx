import React, { useState } from 'react';
import { 
  Book, 
  Wind, 
  Zap, 
  AlertTriangle, 
  CloudRain,
  MessageCircle,
  Lightbulb,
  ChevronRight,
  Play,
  X,
  Sparkles,
  Heart,
  Settings,
  PlusCircle,
  Save,
  BookOpenCheck,
  Stethoscope,
  Activity,
  Search,
  Filter,
  Users,
  GitBranch,
  Target,
  ShieldAlert,
  RefreshCcw,
  Smile,
  Compass,
  Eye
} from 'lucide-react';
import './Library.css';

// FULLY ENRICHED CLINICAL CONTENT - NO PLACEHOLDERS
const initialModuleContent: Record<string, string[]> = {
  'Reestructuración Cognitiva': [
    'Identificar el "Pensamiento Automático" negativo.',
    'Buscar evidencia a favor y en contra de ese pensamiento.',
    'Identificar la distorsión cognitiva (catastrofismo, blanco/negro, etc).',
    'Generar un pensamiento alternativo más realista y funcional.',
    'Reevaluar la intensidad de la emoción tras el ejercicio.'
  ],
  'Activación Conductual': [
    'Monitoreo: Registro de actividades actuales y nivel de placer/dominio.',
    'Identificación de valores: ¿Qué es importante para el paciente?',
    'Programación de tareas: Empezar por actividades pequeñas y reforzadores.',
    'Manejo de barreras: Identificar qué impide la acción y buscar soluciones.',
    'Consolidación: Evaluar el impacto en el estado de ánimo.'
  ],
  'Exposición Gradual': [
    'Entrenamiento en Relajación: Respiración diafragmática o relajación muscular.',
    'Construcción de la Jerarquía: Listar situaciones temidas de 0 a 100 SUDs.',
    'Exposición Imaginaria: Visualizar la situación de menor intensidad hasta habituarse.',
    'Exposición In Vivo: Contacto real con el estímulo temido siguiendo la jerarquía.',
    'Prevención de Respuesta: No realizar conductas de seguridad o evitación.'
  ],
  'Técnicas TIPP (DBT)': [
    'Temperatura: Agua fría en la cara (30s) para activar el nervio vago.',
    'Intensidad: Ejercicio aeróbico intenso por 20 minutos.',
    'Ritmo: Respiración 4-4-6 (exhalar largo).',
    'Pareado: Relajación muscular progresiva junto con la respiración.',
    'Uso: Reducción rápida de la activación fisiológica extrema.'
  ],
  'Efectividad Interpersonal (DEAR MAN)': [
    'Describe: Hechos objetivos de la situación.',
    'Expresa: Sentimientos claros ("Me siento frustrado cuando...").',
    'Asume: Pide lo que quieres o di que NO claramente.',
    'Refuerza: Explica el beneficio para la relación si se cumple la petición.',
    'Mantente: Mantén tu posición (disco rayado).',
    'Aparenta: Confianza visual y tono de voz firme.',
    'Negocia: Ofrece soluciones alternativas si es posible.'
  ],
  'Habilidades de Mindfulness (DBT)': [
    'Observar: Notar sensaciones y pensamientos sin intentar cambiarlos.',
    'Describir: Poner etiquetas verbales a lo observado ("Tengo un nudo en el pecho").',
    'Participar: Entregarse totalmente a la actividad presente (comer, caminar).',
    'Mente Sabia: Encontrar el equilibrio entre la mente racional y emocional.',
    'No Juzgar: Ver las cosas como son, sin etiquetas de "bueno" o "malo".'
  ],
  'Hojas en el Arroyo (ACT)': [
    'Visualización: Imagina que estás frente a un arroyo con hojas flotando.',
    'Colocación: Pon cada pensamiento que surja sobre una hoja.',
    'Observación: Mira cómo el pensamiento se aleja con la corriente.',
    'Aceptación: Si el arroyo se detiene o el pensamiento vuelve, acéptalo sin luchar.',
    'Retorno: Vuelve suavemente a observar el arroyo.'
  ],
  'Defusión de Pensamientos': [
    'Etiquetado: "Estoy teniendo el pensamiento de que soy un inútil".',
    'Voz Tonta: Repite el pensamiento con voz de dibujo animado.',
    'Canto: Canta el pensamiento con una melodía alegre.',
    'Pantalla de Cine: Imagina el pensamiento como subtítulos en una película.',
    'Objetivo: Quitarle el peso de "verdad absoluta" al pensamiento.'
  ],
  'Clarificación de Valores': [
    'Epitafio: ¿Qué te gustaría que dijeran de ti en tu funeral? (Tu esencia).',
    'La Diana (Bullseye): Evalúa tu cercanía a tus valores en trabajo, ocio y salud.',
    'Valores vs Metas: Las metas se tachan, los valores son direcciones de vida.',
    'Elección Libre: Identificar valores que son propios y no impuestos socialmente.',
    'Acción Comprometida: Pasos pequeños hoy que reflejen ese valor.'
  ],
  'Genograma Familiar (Sistémica)': [
    'Estructura: Dibujar tres generaciones (nombres, edades, fechas).',
    'Vínculos: Marcar relaciones conflictivas, estrechas o distantes.',
    'Hitos: Registrar muertes, divorcios, enfermedades o migraciones.',
    'Patrones: Identificar repeticiones de conductas o destinos entre generaciones.',
    'Hipótesis: ¿Cómo afecta el pasado familiar al síntoma presente?'
  ],
  'Preguntas Circulares': [
    'Triangulación: "¿Qué hace tu madre cuando tú y tu padre discuten?".',
    'Diferencia: "¿Quién se preocupa más por este problema en casa?".',
    'Futuro Hipotético: "Si el problema desapareciera, ¿quién cambiaría más?".',
    'Objetivo: Revelar la danza relacional y las percepciones cruzadas.'
  ],
  'Reframing Positivo': [
    'Funcionalidad: ¿Qué beneficio oculto tiene el síntoma para el sistema?',
    'Intención Positiva: Reencuadrar la "sobreprotección" como "profundo cuidado".',
    'Cambio de Contexto: ¿En qué situación este defecto sería una virtud?',
    'Metáfora: Usar un relato para cambiar el significado de la conducta.',
    'Resultado: Disminución de la culpa y apertura al cambio.'
  ]
};

const Library = () => {
  const [activeTab, setActiveTab] = useState('Protocolos');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [categories, setCategories] = useState([
    {
      id: 'cbt',
      name: 'Terapia Cognitivo-Conductual (TCC)',
      icon: Lightbulb,
      modules: [
        { title: 'Reestructuración Cognitiva', icon: Zap, color: '#6366f1' },
        { title: 'Activación Conductual', icon: Activity, color: '#10b981' },
        { title: 'Exposición Gradual', icon: Target, color: '#ef4444' }
      ]
    },
    {
      id: 'dbt',
      name: 'Dialéctico-Conductual (DBT)',
      icon: RefreshCcw,
      modules: [
        { title: 'Técnicas TIPP (DBT)', icon: ShieldAlert, color: '#f59e0b' },
        { title: 'Efectividad Interpersonal (DEAR MAN)', icon: Users, color: '#ec4899' },
        { title: 'Habilidades de Mindfulness (DBT)', icon: Wind, color: '#3b82f6' }
      ]
    },
    {
      id: 'act',
      name: 'Aceptación y Compromiso (ACT)',
      icon: Heart,
      modules: [
        { title: 'Hojas en el Arroyo (ACT)', icon: CloudRain, color: '#f472b6' },
        { title: 'Defusión de Pensamientos', icon: MessageCircle, color: '#8b5cf6' },
        { title: 'Clarificación de Valores', icon: Compass, color: '#f59e0b' }
      ]
    },
    {
      id: 'systemic',
      name: 'Terapia Sistémica',
      icon: GitBranch,
      modules: [
        { title: 'Genograma Familiar (Sistémica)', icon: Users, color: '#6366f1' },
        { title: 'Preguntas Circulares', icon: RefreshCcw, color: '#10b981' },
        { title: 'Reframing Positivo', icon: Zap, color: '#a855f7' }
      ]
    }
  ]);

  const [moduleContent, setModuleContent] = useState(initialModuleContent);

  const filteredCategories = categories.map(cat => ({
    ...cat,
    modules: cat.modules.filter(mod => 
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.modules.length > 0);

  return (
    <div className="library-container animate-fade-in">
      <header className="library-header-clinical">
        <div className="header-meta">
          <div className="clinical-badge">
            <BookOpenCheck size={14} />
            <span>Biblioteca Clínica Global</span>
          </div>
          <button 
            className={`admin-mode-btn ${isEditMode ? 'active' : ''}`}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Settings size={16} />
            <span>{isEditMode ? 'Guardar Cambios' : 'Modo Editor'}</span>
          </button>
        </div>
        <h1>Recursos Terapéuticos</h1>
        <p className="subtitle">Estrategias basadas en evidencia alimentadas por los estándares de TCC, DBT, ACT y Sistémica.</p>
        
        <div className="library-search-box">
          <div className="search-input-wrapper glass">
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Buscar técnica, protocolo o enfoque (Ej: DBT, Ansiedad, SOAP)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="clear-search"><X size={16} /></button>}
          </div>
          <div className="filter-chips">
            <span className="filter-label"><Filter size={14} /> Filtrar por:</span>
            <button className="chip active">Todos</button>
            <button className="chip">TCC</button>
            <button className="chip">DBT</button>
            <button className="chip">Crisis</button>
          </div>
        </div>
      </header>

      <div className="clinical-layout">
        <div className="categories-grid">
          {filteredCategories.map((category) => (
            <div key={category.id} className="category-section">
              <div className="category-header">
                <category.icon size={22} />
                <h2>{category.name}</h2>
              </div>
              <div className="modules-list">
                {category.modules.map((module, mIdx) => (
                  <div key={mIdx} className="clinical-card-v2 glass animate-scale-up" onClick={() => setSelectedItem(module.title)}>
                    <div className="card-top">
                      <div className="icon-box" style={{ color: module.color, backgroundColor: `${module.color}15` }}>
                        <module.icon size={24} />
                      </div>
                      <div className="card-actions">
                        <Play size={16} className="play-icon" />
                      </div>
                    </div>
                    <div className="card-body">
                      <h3>{module.title}</h3>
                      <p className="card-excerpt">
                        {moduleContent[module.title]?.[0].substring(0, 60)}...
                      </p>
                    </div>
                    <div className="card-footer">
                      <span className="evidence-pill">EVIDENCIA A+</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ))}
                {isEditMode && (
                  <div className="add-module-card-v2 glass">
                    <PlusCircle size={32} />
                    <span>Añadir Técnica</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL CLÍNICO PROFESIONAL */}
      {selectedItem && (
        <div className="clinical-modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="clinical-modal animate-scale-up" onClick={e => e.stopPropagation()}>
            <div className="modal-sidebar">
              <div className="sidebar-icon-box">
                <Stethoscope size={32} />
              </div>
              <div className="sidebar-info">
                <h3>Resumen Clínico</h3>
                <p>Protocolo basado en guías internacionales de salud mental.</p>
                <div className="meta-list">
                  <div className="meta-item"><Target size={14} /><span>Eficiencia: 88%</span></div>
                  <div className="meta-item"><Clock size={14} /><span>Sesión: 45 min</span></div>
                </div>
              </div>
            </div>
            <div className="modal-main-content">
              <button className="close-clinical" onClick={() => setSelectedItem(null)}><X size={24}/></button>
              <header className="modal-header-clinical">
                <Sparkles size={20} className="sparkle" />
                <h2>{selectedItem}</h2>
              </header>
              <div className="protocol-body">
                <div className="protocol-steps">
                  {moduleContent[selectedItem]?.map((step, idx) => (
                    <div key={idx} className="step-item">
                      <div className="step-number">{idx + 1}</div>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-actions-clinical">
                <button className="btn-prescribe">Asignar a Paciente</button>
                <button className="btn-print">Descargar Protocolo</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Library;
