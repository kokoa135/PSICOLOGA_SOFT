import React, { useState } from 'react';
import { BrainCircuit, Mail, Lock, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import './Login.css';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Demo credentials
    const validEmail = 'karla@softpsy.com';
    const validPass = 'psicologa2026';

    setTimeout(() => {
      setIsLoading(false);
      if (email === validEmail && password === validPass) {
        onLogin();
      } else {
        alert('Credenciales incorrectas. Prueba con:\nEmail: karla@softpsy.com\nPass: psicologa2026');
      }
    }, 1200);
  };

  return (
    <div className="login-container">
      <div className="login-visual-side">
        <div className="visual-content">
          <div className="logo-large">
            <BrainCircuit size={48} />
            <span>SoftPsy</span>
          </div>
          <h1>Tu Espacio Clínico Digital</h1>
          <p>Potenciando la sanación a través de la inteligencia clínica y el diseño compasivo.</p>
          <div className="visual-badges">
            <div className="v-badge">
              <ShieldCheck size={20} />
              <span>Cumplimiento HIPAA</span>
            </div>
            <div className="v-badge">
              <Sparkles size={20} />
              <span>Copiloto IA</span>
            </div>
          </div>
        </div>
        <div className="floating-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
      </div>

      <div className="login-form-side">
        <div className="form-card animate-slide-up">
          <div className="form-header">
            <h2>Bienvenida, Dra. Karla</h2>
            <p>Ingresa tus credenciales para acceder a tu consulta.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group-login">
              <label>Correo Electrónico</label>
              <div className="input-wrapper">
                <Mail size={20} />
                <input 
                  type="email" 
                  placeholder="karla@softpsy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-login">
              <label>Contraseña</label>
              <div className="input-wrapper">
                <Lock size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>
              <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <footer className="login-footer">
            <p>¿No tienes una cuenta? <a href="#">Contactar soporte</a></p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
