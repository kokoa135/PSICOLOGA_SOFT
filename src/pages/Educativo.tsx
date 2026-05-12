import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Share2, 
  FileText, 
  History, 
  BarChart3, 
  ExternalLink,
  Copy,
  CheckCircle2,
  Filter,
  Search,
  ChevronRight,
  ChevronLeft,
  MessageCircle,
  TrendingUp,
  Brain,
  ShieldCheck,
  Eye,
  X,
  Save
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TEST_DEFINITIONS } from '../services/TestDefinitions';
import { supabase } from '../services/supabase';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Educativo.css';

const Educativo = () => {
  const [activeTab, setActiveTab] = useState<'tests' | 'results'>('tests');
  const [results, setResults] = useState<any[]>([]);
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [professionalNotes, setProfessionalNotes] = useState<string>('');
  const [generalObservations, setGeneralObservations] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
    
    // Suscribirse a cambios en tiempo real
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assessment_results' },
        () => {
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedResults = data.map(res => ({
          id: res.id,
          patientName: res.patient_name,
          testId: res.test_id,
          testTitle: TEST_DEFINITIONS[res.test_id]?.title || res.test_id,
          date: res.created_at,
          responses: res.responses,
          result: res.score_data,
          level: res.level,
          grade: res.grade,
          professionalNotes: res.professional_notes || ''
        }));
        setResults(formattedResults);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  useEffect(() => {
    if (selectedResult) {
      setProfessionalNotes(selectedResult.professional_notes || selectedResult.professionalNotes || '');
      setGeneralObservations(selectedResult.general_observations || '');
    }
  }, [selectedResult]);

  const handleSaveNotes = async () => {
    if (!selectedResult) return;
    
    try {
      const { error } = await supabase
        .from('assessment_results')
        .update({ 
          professional_notes: professionalNotes,
          general_observations: generalObservations 
        })
        .eq('id', selectedResult.id);

      if (error) throw error;

      setResults(prev => prev.map(res => 
        res.id === selectedResult.id ? { ...res, professional_notes: professionalNotes, general_observations: generalObservations } : res
      ));
      setSelectedResult({ ...selectedResult, professional_notes: professionalNotes, general_observations: generalObservations });
      alert('Información guardada correctamente');
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Error al guardar la información');
    }
  };

  const handleCopyLink = (testId: string) => {
    // Si estamos en localhost, usamos una URL base que el usuario pueda compartir
    // En producción esto debería ser el dominio real
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/evaluacion/${testId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(testId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleWhatsAppShare = (testId: string, testTitle: string) => {
    const url = `${window.location.origin}/evaluacion/${testId}`;
    const message = encodeURIComponent(`Hola, por favor completa la siguiente evaluación: *${testTitle}*\n\nLink: ${url}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handleExportPDF = async () => {
    if (!selectedResult) return;

    const doc = new jsPDF();
    
    // 1. Cabecera Institucional
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(30, 27, 75);
    doc.text('REPORTE DE EVALUACIÓN PSICOLÓGICA', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(79, 70, 229);
    doc.text(selectedResult.testTitle.toUpperCase(), 105, 28, { align: 'center' });

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 32, 196, 32);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(`Paciente: ${selectedResult.patientName}`, 14, 38);
    doc.text(`Fecha: ${new Date(selectedResult.date).toLocaleDateString()}`, 196, 38, { align: 'right' });

    let currentY = 45;

    // 2. Gráficos
    const chartsElement = document.querySelector('.report-charts') as HTMLElement;
    if (chartsElement) {
      try {
        const canvas = await html2canvas(chartsElement, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 14, currentY, 180, 70);
        currentY += 75;
      } catch (e) {
        currentY += 5;
      }
    }

    // 3. Cuestionario Respondido (2 Columnas)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 27, 75);
    doc.text('Cuestionario Respondido', 14, currentY);
    currentY += 6;

    const questions = TEST_DEFINITIONS[selectedResult.testId]?.questions || [];
    const mid = Math.ceil(questions.length / 2);
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);

    const drawCol = (data: any[], startX: number, startY: number) => {
      let y = startY;
      data.forEach((q) => {
        const ans = TEST_DEFINITIONS[selectedResult.testId]?.options?.find((o: any) => o.value === selectedResult.responses?.[q.id])?.label || 'N/A';
        const txt = q.text.length > 50 ? q.text.substring(0, 47) + '...' : q.text;
        doc.setFont('helvetica', 'normal');
        doc.text(txt, startX, y);
        doc.setFont('helvetica', 'bold');
        doc.text(ans, startX + 75, y, { align: 'right' });
        y += 4;
      });
      return y;
    };

    const leftY = drawCol(questions.slice(0, mid), 14, currentY);
    const rightY = drawCol(questions.slice(mid), 105, currentY);
    currentY = Math.max(leftY, rightY) + 8;

    // 4. Interpretación y Observaciones
    if (currentY > 240) { doc.addPage(); currentY = 20; }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Interpretación Clínica', 14, currentY);
    currentY += 6;

    const interpretation: Record<string, any> = selectedResult.result?.interpretation || {};
    doc.setFontSize(8);
    if (Object.keys(interpretation).length > 0) {
      Object.entries(interpretation).forEach(([cat, text]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${cat}:`, 14, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(String(text), 55, currentY);
        currentY += 4;
      });
    }

    currentY += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Observaciones Generales', 14, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    // COMBINAR IA + PROFESIONAL
    const iaSuggestions = getIASuggestions(selectedResult);
    let finalObs = "";
    if (iaSuggestions.length > 0) {
      finalObs += "Sugerencias de la IA:\n" + iaSuggestions.map(s => `• ${s}`).join('\n') + "\n\n";
    }
    if (professionalNotes.trim()) {
      finalObs += "Comentarios del Profesional:\n" + professionalNotes.trim();
    }
    if (!finalObs) finalObs = "No se registraron observaciones.";

    const obsLines = doc.splitTextToSize(finalObs, 180);
    doc.text(obsLines, 14, currentY);
    currentY += (obsLines.length * 5) + 15;

    // Firma
    if (currentY > 270) { doc.addPage(); currentY = 20; }
    doc.setDrawColor(200, 200, 200);
    doc.line(75, currentY + 10, 135, currentY + 10);
    doc.setFontSize(8);
    doc.text('Firma del Especialista', 105, currentY + 15, { align: 'center' });

    const fileName = `${selectedResult.patientName}_Reporte.pdf`;

    // 6. Guardar con Selector
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [{ description: 'PDF', accept: { 'application/pdf': ['.pdf'] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(doc.output('blob'));
        await writable.close();
      } catch (err) {
        if ((err as Error).name !== 'AbortError') doc.save(fileName);
      }
    } else {
      doc.save(fileName);
    }
  };

  const getIASuggestions = (res: any) => {
    if (!res || !res.result) return [];
    const testId = res.testId;
    const scores = res.result.breakdown || {};
    const total = res.result.total || 0;
    
    const suggestions = [];

    if (testId === 'edah') {
      if (scores['Hiperactividad'] > 10) suggestions.push('Implementar técnicas de refuerzo conductual positivo.');
      if (scores['Déficit de Atención'] > 10) suggestions.push('Entrenamiento en pausas activas y autoinstrucciones.');
      if (total > 30) suggestions.push('Coordinación estrecha con el entorno escolar y psicopedagogía.');
    } else if (testId === 'coopersmith') {
      if (total < 50) suggestions.push('Trabajar en el fortalecimiento del autoconcepto y autoaceptación.');
      suggestions.push('Fomentar actividades que promuevan la autonomía y seguridad.');
    } else {
      suggestions.push('Realizar seguimiento clínico periódico.');
      suggestions.push('Complementar con entrevistas a familiares o cuidadores.');
    }

    return suggestions;
  };

  const getChartData = (result: any) => {
    if (!result || !result.result || !result.result.breakdown) return [];
    return Object.entries(result.result.breakdown).map(([name, value]) => ({
      subject: name,
      A: value,
      fullMark: result.testId === 'edah' ? 30 : 10 // Approximation
    }));
  };

  return (
    <div className="educativo-container animate-fade-in">
      <header className="educativo-header">
        <div className="header-badge">
          <GraduationCap size={16} />
          <span>Psicología Educativa & Diagnóstica</span>
        </div>
        <div className="header-main">
          <div>
            <h1>Módulo Educativo</h1>
            <p>Gestión de evaluaciones psicométricas y proyectivas con seguimiento automatizado.</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{results.length}</span>
              <span className="stat-label">Evaluaciones</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Object.keys(TEST_DEFINITIONS).length}</span>
              <span className="stat-label">Tests Activos</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="educativo-tabs">
        <button 
          className={`tab-btn ${activeTab === 'tests' ? 'active' : ''}`}
          onClick={() => { setActiveTab('tests'); setSelectedResult(null); }}
        >
          <Brain size={18} />
          Banco de Tests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          <History size={18} />
          Resultados Recientes
        </button>
      </nav>

      <div className="educativo-content">
        {activeTab === 'tests' && (
          <div className="tests-grid">
            {Object.values(TEST_DEFINITIONS).map((test) => (
              <div key={test.id} className="test-card glass-v2">
                <div className="test-card-header">
                  <div className="test-icon">
                    <FileText size={24} />
                  </div>
                  <div className="test-badge">ACTIVO</div>
                </div>
                
                <div className="test-card-body">
                  <h3>{test.title}</h3>
                  <p>{test.description}</p>
                  
                  <div className="test-meta-info">
                    <span className="meta-tag"><Brain size={12} /> {test.questions.length} Ítems</span>
                    <span className="meta-tag"><History size={12} /> Autocalificable</span>
                  </div>
                </div>

                <div className="test-card-actions-v2">
                  <button 
                    className="btn-secondary-v2"
                    onClick={() => setPreviewTest(test)}
                  >
                    <Eye size={16} />
                    Vista Previa
                  </button>
                  <button 
                    className={`btn-primary-v2 ${copiedId === test.id ? 'success' : ''}`}
                    onClick={() => handleCopyLink(test.id)}
                    title="Copiar Link"
                  >
                    {copiedId === test.id ? (
                      <><CheckCircle2 size={16} /> ¡Copiado!</>
                    ) : (
                      <><Share2 size={16} /> Compartir</>
                    )}
                  </button>
                  <button 
                    className="btn-whatsapp-v2"
                    onClick={() => handleWhatsAppShare(test.id, test.title)}
                    title="Enviar por WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
            <div className="add-test-card glass-v2 dashed">
              <Plus size={32} />
              <span>Digitalizar Nuevo Test</span>
              <p>Sube un PDF para que la IA lo convierta en formulario.</p>
            </div>
          </div>
        )}

        {activeTab === 'results' && !selectedResult && (
          <div className="results-table-view glass-v2">
            <div className="table-header-actions">
              <div className="search-bar">
                <Search size={18} />
                <input type="text" placeholder="Buscar por paciente o test..." />
              </div>
              <button className="filter-btn"><Filter size={18} /> Filtros</button>
            </div>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Evaluación</th>
                  <th>Fecha</th>
                  <th>Puntaje Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? results.map((res) => (
                  <tr key={res.id}>
                    <td className="patient-name-cell">
                      <div className="avatar-sm">{res.patientName[0]}</div>
                      {res.patientName}
                    </td>
                    <td>{res.testTitle}</td>
                    <td>{new Date(res.date).toLocaleDateString()}</td>
                    <td><span className="score-badge">{res.result.total} pts</span></td>
                    <td>
                      <button className="view-btn" onClick={() => setSelectedResult(res)}>
                        Ver Reporte
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="empty-state">No hay resultados registrados aún.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedResult && (
          <div className="report-view-container animate-scale-up">
            <button className="back-btn" onClick={() => setSelectedResult(null)}>
              <ChevronLeft size={18} />
              Volver a resultados
            </button>
            
            <div className="report-glass-card glass-v2">
              <div className="report-layout">
                <div className="report-main">
                <div className="report-header">
                  <div>
                    <span className="report-badge">Reporte Clínico</span>
                    <h2>{selectedResult.testTitle}</h2>
                    <p>Paciente: <strong>{selectedResult.patientName}</strong> | Fecha: {new Date(selectedResult.date).toLocaleDateString()}</p>
                  </div>
                  <button className="btn-print-v2" onClick={handleExportPDF}><FileText size={16} /> Exportar PDF</button>
                </div>

                <div className="report-charts">
                  <div className="chart-box">
                    <h3>Perfil de Resultados</h3>
                    <div style={{ width: '100%', height: 280, marginBottom: '-2rem' }}>
                      <ResponsiveContainer>
                        <RadarChart cx="50%" cy="50%" outerRadius="90%" data={getChartData(selectedResult)} margin={{ top: 45, right: 30, bottom: 20, left: 30 }}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                          <Radar name="Puntaje" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="chart-box">
                    <h3>Comparativa por Áreas</h3>
                    <div style={{ width: '100%', height: 240, marginBottom: '0.25rem', paddingTop: '10px' }}>
                      <ResponsiveContainer>
                        <BarChart data={getChartData(selectedResult)} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          />
                          <Bar dataKey="A" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={30} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="report-questionnaire">
                  <h3>Cuestionario Respondido</h3>
                  <div className="answers-grid">
                    {TEST_DEFINITIONS[selectedResult.testId]?.questions.map((q: any) => (
                      <div key={q.id} className="answer-item">
                        <span className="q-text">{q.text}</span>
                        <span className="a-value">
                          {TEST_DEFINITIONS[selectedResult.testId]?.options?.find((o: any) => o.value === selectedResult.responses?.[q.id])?.label || 'N/A'}
                        </span>
                      </div>
                    ))}
                  </div>
                  {!selectedResult.responses && <p className="no-data-msg">Respuestas no disponibles para este registro antiguo.</p>}
                </div>

                <style>{`
                  .ia-suggestion-list {
                    padding-left: 1.25rem;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                  }
                  .ia-suggestion-list li {
                    color: #475569;
                    font-size: 0.9rem;
                    line-height: 1.4;
                  }
                  .ia-card-highlight {
                    border-left: 4px solid #6366f1;
                    background: #f5f7ff;
                  }
                `}</style>

                <div className="report-notes">
                  <h3>Notas del Profesional</h3>
                  <textarea 
                    placeholder="Escriba aquí sus observaciones clínicas, recomendaciones o conclusiones..."
                    value={professionalNotes}
                    onChange={(e) => setProfessionalNotes(e.target.value)}
                    className="professional-notes-area"
                  />
                  <button className="save-notes-btn no-print" onClick={handleSaveNotes}>
                    <Save size={14} /> Guardar Notas
                  </button>
                </div>
              </div>

              <div className="report-sidebar">
                <div className="sidebar-card">
                  <ShieldCheck size={24} />
                  <h3>Validez</h3>
                  <p>La prueba fue completada en 8 minutos. No se detectan patrones de respuesta inconsistentes.</p>
                </div>
                <div className="sidebar-card">
                  <Brain size={24} />
                  <h3>Sugerencias IA</h3>
                  <ul>
                    {getIASuggestions(selectedResult).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="report-full-width">
                <div className="report-interpretation">
                  <h3>Interpretación Clínica</h3>
                  <div className="interpretation-grid">
                    {selectedResult.result.interpretation && Object.entries(selectedResult.result.interpretation).map(([cat, text]) => (
                      <div key={cat} className="interpretation-card-v2">
                        <span className={`risk-pill ${text?.toString().toLowerCase().replace(' ', '-')}`}>
                          {text?.toString()}
                        </span>
                        <h4>{cat}</h4>
                        <p>Puntaje obtenido: {selectedResult.result.breakdown[cat]} pts</p>
                      </div>
                    ))}
                    
                    <div className="interpretation-card ia-card-highlight">
                      <TrendingUp size={24} className="trend-icon" />
                      <div>
                        <h4>Sugerencias de la IA (Automático)</h4>
                        <div className="ia-observations-content">
                          {getIASuggestions(selectedResult).length > 0 ? (
                            <ul className="ia-suggestion-list">
                              {getIASuggestions(selectedResult).map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>
                              Análisis basado en puntaje total: {selectedResult.result.total} pts. 
                              Se recomienda seguimiento clínico preventivo.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* MODAL DE VISTA PREVIA - REDISEÑO PREMIUM */}
      {previewTest && (
        <div className="preview-modal-overlay" onClick={() => setPreviewTest(null)}>
          <div className="preview-modal glass-v2 premium-modal animate-scale-up" onClick={e => e.stopPropagation()}>
            <header className="preview-header">
              <div className="preview-header-content">
                <div className="preview-icon-badge">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="preview-meta-top">Vista Previa del Test</div>
                  <h2>{previewTest.title}</h2>
                  <p className="preview-subtitle">Explora la estructura y los ítems de esta evaluación psicométrica.</p>
                </div>
              </div>
              <button className="close-preview-btn" onClick={() => setPreviewTest(null)} title="Cerrar">
                <X size={20} />
              </button>
            </header>

            <div className="preview-body-v2">
              <div className="preview-info-strip">
                <div className="info-pill">
                  <Brain size={14} />
                  <span>{previewTest.questions.length} Preguntas</span>
                </div>
                <div className="info-pill">
                  <History size={14} />
                  <span>Autocalificable</span>
                </div>
                <div className="info-pill">
                  <ShieldCheck size={14} />
                  <span>Validado</span>
                </div>
              </div>

              <div className="preview-questions-grid">
                {previewTest.questions.slice(0, 4).map((q: any, idx: number) => (
                  <div key={idx} className="preview-question-card">
                    <div className="q-header">
                      <span className="q-number">Ítem {idx + 1}</span>
                    </div>
                    <p className="q-text-v2">{q.text}</p>
                    <div className="q-options-v2">
                      {previewTest.options.slice(0, 4).map((opt: any, oIdx: number) => (
                        <div key={oIdx} className="q-option-pill">
                          {opt.label}
                        </div>
                      ))}
                      {previewTest.options.length > 4 && (
                        <div className="q-option-pill more">+{previewTest.options.length - 4} más</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="preview-footer-notice">
                <p>Este es un resumen de la evaluación completa. El paciente verá una interfaz limpia y optimizada para su resolución.</p>
              </div>
            </div>

            <footer className="preview-footer-v2">
              <button className="preview-btn-secondary" onClick={() => window.open(`/evaluacion/${previewTest.id}`, '_blank')}>
                <ExternalLink size={18} />
                Probar como Paciente
              </button>
              <button className="preview-btn-primary" onClick={() => handleCopyLink(previewTest.id)}>
                <Share2 size={18} />
                Copiar Link Público
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Educativo;
