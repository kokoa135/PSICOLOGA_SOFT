import React from 'react';
import { 
  LayoutDashboard, 
  Calendar,
  Users, 
  BookOpen, 
  BrainCircuit, 
  Settings, 
  LogOut,
  Sparkles,
  DollarSign,
  X,
  GraduationCap
} from 'lucide-react';

import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout, isOpen, onToggle }) => {

  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Pacientes', path: '/pacientes' },
    { icon: Calendar, label: 'Agenda', path: '/agenda' },
    { icon: BrainCircuit, label: 'Copiloto IA', path: '/copiloto-ia' },
    { icon: GraduationCap, label: 'Educativo', path: '/educativo' },
    { icon: BookOpen, label: 'Biblioteca', path: '/biblioteca' },
    { icon: DollarSign, label: 'Finanzas', path: '/finanzas' },
    { icon: Settings, label: 'Configuración', path: '/configuracion' },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <Sparkles className="logo-icon" />
          {isOpen && <span className="logo-text">SoftPsy</span>}
        </div>
        <button className="sidebar-toggle-btn" onClick={onToggle}>
          {isOpen ? <X size={20} /> : <LayoutDashboard size={20} />}
        </button>
      </div>


      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path} title={!isOpen ? item.label : ''}>
                <item.icon size={20} />
                {isOpen && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {isOpen && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">KA</div>
            <div className="user-details">
              <span className="user-name">Karla A. Alvarez Q.</span>
              <span className="user-role">Psicóloga Clínica</span>
            </div>
          </div>
          <div className="footer-actions">
            <button className="icon-btn-sidebar"><Settings size={18} /></button>
            <button className="icon-btn-sidebar logout" onClick={onLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      )}
      {!isOpen && (
        <div className="sidebar-footer-collapsed">
           <button className="icon-btn-sidebar logout" onClick={onLogout}>
            <LogOut size={18} />
          </button>
        </div>
      )}

    </aside>
  );
};

export default Sidebar;
