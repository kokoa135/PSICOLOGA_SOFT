import React, { useState } from 'react';
import { Sparkles, Heart, Sun, Moon, Send } from 'lucide-react';
import './GratitudeJournal.css';

const GratitudeJournal = () => {
  const [entry, setEntry] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    if (!entry) return;
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    setEntry('');
  };

  return (
    <div className="gratitude-card glass animate-fade-in">
      <div className="gratitude-header">
        <Heart className="heart-icon" fill="#ec4899" />
        <div className="text">
          <h4>Diario de Gratitud</h4>
          <p>¿Qué momento de luz hubo hoy?</p>
        </div>
      </div>
      
      <div className="gratitude-input-wrapper">
        <textarea 
          placeholder="Hoy me siento agradecido/a por..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
        />
        <button className="save-entry-btn" onClick={handleSave} disabled={!entry}>
          <Send size={16} />
        </button>
      </div>

      {isSaved && (
        <div className="save-message">
          <Sparkles size={14} />
          <span>Semilla de gratitud plantada.</span>
        </div>
      )}

      <div className="gratitude-footer">
        <div className="insight-mini">
          <Sun size={14} />
          <span>Mañana: Intención</span>
        </div>
        <div className="insight-mini">
          <Moon size={14} />
          <span>Noche: Refugio</span>
        </div>
      </div>
    </div>
  );
};

export default GratitudeJournal;
