import React from 'react';
import { Clock, Plus } from 'lucide-react';
import './TimeGridSelector.css';

interface TimeGridSelectorProps {
  selectedTimes: string[];
  onChange: (times: string[]) => void;
  onExtend: () => void;
  occupiedTimes?: string[];
}

const TimeGridSelector: React.FC<TimeGridSelectorProps> = ({ 
  selectedTimes, 
  onChange, 
  onExtend,
  occupiedTimes = [] 
}) => {
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    const h = hour.toString().padStart(2, '0');
    timeSlots.push(`${h}:00`, `${h}:30`);
  }

  return (
    <div className="time-grid-selector">
      <div className="time-grid-header">
        <Clock size={16} />
        <span>Seleccionar Horario</span>
        <button type="button" className="extend-time-btn" onClick={onExtend}>
          <Plus size={14} />
          <span>+ 30 min más</span>
        </button>
      </div>
      <div className="time-slots-grid">
        {timeSlots.map(slot => {
          const isOccupied = occupiedTimes.includes(slot);
          const isSelected = selectedTimes.includes(slot);
          
          const handleToggle = () => {
            if (isSelected) {
              onChange(selectedTimes.filter(t => t !== slot));
            } else {
              onChange([...selectedTimes, slot].sort());
            }
          };

          return (
            <button
              key={slot}
              type="button"
              className={`time-slot-btn ${isSelected ? 'active' : ''} ${isOccupied ? 'occupied' : ''}`}
              disabled={isOccupied}
              onClick={handleToggle}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeGridSelector;
