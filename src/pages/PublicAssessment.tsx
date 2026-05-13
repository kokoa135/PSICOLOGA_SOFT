import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TEST_DEFINITIONS } from '../services/TestDefinitions';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { supabase } from '../services/supabase';
import './PublicAssessment.css';

const PublicAssessment = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const test = TEST_DEFINITIONS[testId || ''];

  const [currentStep, setCurrentStep] = useState(0); 
  const [responses, setResponses] = useState<Record<number, number>>({});
  const [patientName, setPatientName] = useState('');
  const [level, setLevel] = useState<'Primaria' | 'Secundaria'>('Primaria');
  const [grade, setGrade] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!test) {
    return (
      <div className="not-found-assessment">
        <h1>Test no encontrado</h1>
        <button onClick={() => navigate('/')}>Volver al inicio</button>
      </div>
    );
  }

  const questions = test.questions;
  const totalQuestions = questions.length;
  const progress = Math.min((Object.keys(responses).length / totalQuestions) * 100, 100);

  const handleOptionSelect = (questionId: number, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    if (currentStep <= totalQuestions) {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = test.scoring(responses, { grade });
    
    try {
      const { error } = await supabase
        .from('assessment_results')
        .insert([{
          test_id: testId,
          patient_name: patientName,
          level: level,
          grade: grade,
          responses: responses,
          score_data: result
        }]);

      if (error) throw error;
      setCurrentStep(totalQuestions + 2);
    } catch (error) {
      console.error('Error saving results:', error);
      alert('Hubo un error al enviar tus respuestas. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="public-assessment-container">
      <div className="assessment-glass-bg"></div>
      
      <div className="assessment-card-wrapper">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="assessment-step welcome-step"
            >
              <div className="step-header">
                <Sparkles className="sparkle-icon" size={48} />
                <h1>{test.title}</h1>
                <p>{test.description}</p>
              </div>
              
              <div className="patient-inputs">
                <div className="patient-input-box">
                  <label>Nombre completo del evaluado:</label>
                  <input 
                    type="text" 
                    value={patientName} 
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                {test.id === 'edah' && (
                  <div className="patient-input-box">
                    <label>Nivel y Grado escolar:</label>
                    
                    <div className="level-selector">
                      <button 
                        type="button"
                        className={`level-btn ${level === 'Primaria' ? 'active' : ''}`}
                        onClick={() => { setLevel('Primaria'); setGrade(1); }}
                      >
                        Primaria
                      </button>
                      <button 
                        type="button"
                        className={`level-btn ${level === 'Secundaria' ? 'active' : ''}`}
                        onClick={() => { setLevel('Secundaria'); setGrade(1); }}
                      >
                        Secundaria
                      </button>
                    </div>

                    <div className="grade-selection-grid">
                      {(level === 'Primaria' ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5]).map((g) => (
                        <button
                          key={`${level}-${g}`}
                          type="button"
                          className={`grade-pill-btn ${grade === g ? 'active' : ''}`}
                          onClick={() => setGrade(g)}
                        >
                          <span className="grade-number">{g}º</span>
                          <span className="grade-label">{level}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="instructions-box">
                <h3>Instrucciones:</h3>
                <p>{test.instructions}</p>
              </div>

              <button 
                className="start-btn" 
                disabled={!patientName.trim()}
                onClick={() => setCurrentStep(1)}
              >
                Comenzar Evaluación
                <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {currentStep > 0 && currentStep <= totalQuestions && (
            <motion.div 
              key={`q-${currentStep}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="assessment-step question-step"
            >
              <div className="progress-bar-container">
                <div className="progress-info">
                  <span>Pregunta {currentStep} de {totalQuestions}</span>
                  <span>{Math.round(progress)}% completado</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
              </div>

              <div className="question-content">
                <span className="question-category">{questions[currentStep - 1].category}</span>
                <h2>{questions[currentStep - 1].text}</h2>
                
                <div className="options-grid">
                  {(questions[currentStep - 1].options || test.options).map((option: any) => (
                    <button 
                      key={option.value}
                      className={`option-btn ${responses[questions[currentStep - 1].id] === option.value ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(questions[currentStep - 1].id, option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="step-navigation">
                <button 
                  className="nav-btn prev" 
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  <ChevronLeft size={20} />
                  Anterior
                </button>
                <button 
                  className="nav-btn next" 
                  disabled={responses[questions[currentStep - 1].id] === undefined}
                  onClick={() => setCurrentStep(prev => prev + 1)}
                >
                  Siguiente
                  <ChevronRight size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === totalQuestions + 1 && (
            <motion.div 
              key="submit"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="assessment-step submit-step"
            >
              <div className="step-header">
                <CheckCircle2 size={64} className="success-icon" />
                <h1>¡Has completado el test!</h1>
                <p>Haz clic en enviar para finalizar la evaluación y que tu profesional pueda revisar los resultados.</p>
              </div>

              <div className="summary-box">
                <div className="summary-item">
                  <span>Paciente:</span>
                  <strong>{patientName}</strong>
                </div>
                <div className="summary-item">
                  <span>Test:</span>
                  <strong>{test.title}</strong>
                </div>
              </div>

              <button 
                className="submit-btn" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Resultados'}
                {!isSubmitting && <Send size={20} />}
              </button>
            </motion.div>
          )}

          {currentStep === totalQuestions + 2 && (
            <motion.div 
              key="final"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="assessment-step final-step"
            >
              <div className="step-header">
                <div className="confetti-placeholder">🎉</div>
                <h1>¡Gracias, {patientName}!</h1>
                <p>Tus respuestas han sido enviadas correctamente. Puedes cerrar esta ventana ahora.</p>
              </div>
              
              <div className="final-info">
                <p>El profesional encargado recibirá un reporte detallado con tus mediciones.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PublicAssessment;
