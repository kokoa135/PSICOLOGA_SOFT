import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, Download, Calendar, CheckCircle2,
  Clock, Plus, PieChart as PieIcon, Zap, X, User
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../context/AppContext';
import './Finances.css';

const Finances = () => {
  const { state, addTransaction, markPaid, showToast } = useApp();
  const [filter, setFilter] = useState('Mes');
  const [showNewTx, setShowNewTx] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [newTx, setNewTx] = useState({
    patientId: 0,
    amount: '',
    method: 'Transferencia',
    status: 'Pagado' as 'Pagado' | 'Pendiente',
    date: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
  });

  const { transactions } = state;
  const totalRevenue = transactions.filter(t => t.status === 'Pagado').reduce((s, t) => s + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === 'Pendiente').reduce((s, t) => s + t.amount, 0);
  const pendingCount = transactions.filter(t => t.status === 'Pendiente').length;
  const revenueGoal = 10000;
  const progress = Math.min(100, (totalRevenue / revenueGoal) * 100);

  // Build bar chart: group by month (last 5 months)
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May'];
  const chartData = months.map((m, i) => ({
    month: m,
    income: i === months.length - 1 ? totalRevenue : [4500, 5200, 4800, 6100][i] || 0,
  }));

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = state.patients.find(p => p.id === newTx.patientId);
    if (!patient) { showToast('Selecciona un paciente', 'error'); return; }
    addTransaction({
      patientId: patient.id,
      patient: patient.name,
      date: newTx.date,
      amount: parseFloat(newTx.amount) || 0,
      status: newTx.status,
      method: newTx.method,
    });
    setShowNewTx(false);
    setNewTx({ patientId: 0, amount: '', method: 'Transferencia', status: 'Pagado', date: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) });
  };

  const handleDownloadReport = () => {
    const lines = [
      `REPORTE FINANCIERO — SoftPsy`,
      `Generado: ${new Date().toLocaleDateString('es-PE')}`,
      `\nRESUMEN:`,
      `Ingresos cobrados: S/.${totalRevenue}`,
      `Por cobrar: S/.${pendingAmount} (${pendingCount} pendientes)`,
      `Meta mensual: S/.${revenueGoal} (${progress.toFixed(1)}% alcanzado)`,
      `\nDETALLE DE TRANSACCIONES:`,
      ...transactions.map(t =>
        `${t.date} | ${t.patient} | S/.${t.amount} | ${t.method} | ${t.status}`
      ),
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'ReporteFinanciero_SoftPsy.txt'; a.click();
    URL.revokeObjectURL(url);
    showToast('Reporte descargado', 'success');
  };

  const displayed = showAll ? transactions : transactions.slice(0, 5);

  return (
    <div className="finances-container animate-fade-in">
      <header className="finances-header">
        <div className="title-group">
          <DollarSign className="header-icon" />
          <div>
            <h1>Centro Financiero</h1>
            <p className="subtitle">Resumen de ingresos y proyecciones clínicas.</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="secondary-btn glass" onClick={handleDownloadReport}><Download size={18} /><span>Reporte PDF</span></button>
          <button className="primary-btn-pro" onClick={() => setShowNewTx(true)}><Plus size={18} /><span>Registrar Ingreso</span></button>
        </div>
      </header>

      <div className="finance-summary-grid">
        <div className="summary-card glass">
          <div className="card-top">
            <div className="icon-box income"><TrendingUp size={24} /></div>
            <span className="growth">Meta: S/.{revenueGoal}</span>
          </div>
          <div className="card-info">
            <h3>Ingresos Cobrados</h3>
            <div className="amount">S/.{totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        <div className="summary-card glass goal-card">
          <div className="card-top">
            <div className="icon-box goal"><Zap size={24} /></div>
            <span className="growth">{progress.toFixed(1)}% de la meta</span>
          </div>
          <div className="card-info">
            <h3>Progreso de Meta Mensual</h3>
            <div className="goal-progress-container">
              <div className="goal-bar">
                <div className="goal-fill" style={{ width: `${progress}%` }}>
                  <Zap size={10} className="zap-mini" />
                </div>
              </div>
              <span className="goal-label">S/.{totalRevenue} / S/.{revenueGoal}</span>
            </div>
          </div>
        </div>

        <div className="summary-card glass">
          <div className="card-top">
            <div className="icon-box pending"><Clock size={24} /></div>
            <span className="status-text">{pendingCount} pendientes</span>
          </div>
          <div className="card-info">
            <h3>Por Cobrar</h3>
            <div className="amount">S/.{pendingAmount.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="finances-main-grid">
        <div className="chart-container-fin glass animate-fade-in">
          <div className="section-header">
            <div className="title-group">
              <PieIcon size={20} className="header-icon-pro" />
              <h3>Flujo de Caja</h3>
            </div>
          </div>
          <div className="bar-chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="income" radius={[8, 8, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#6366f1' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="transactions-list glass animate-fade-in">
          <div className="section-header">
            <h3>Pagos Registrados</h3>
            <button className="text-btn" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Ocultar' : `Ver todos (${transactions.length})`}
            </button>
          </div>
          <div className="trans-items">
            {displayed.map((t) => (
              <div key={t.id} className="trans-row">
                <div className="trans-patient">
                  <strong>{t.patient}</strong>
                  <span>{t.method} · {t.date}</span>
                </div>
                <div className="trans-meta">
                  <div className="trans-amount">S/.{t.amount}</div>
                  {t.status === 'Pendiente' ? (
                    <button
                      className="mark-paid-btn"
                      onClick={() => markPaid(t.id)}
                      title="Marcar como pagado"
                    >
                      <CheckCircle2 size={14} /> Cobrar
                    </button>
                  ) : (
                    <span className="status-pill pagado">
                      <CheckCircle2 size={12} /> Pagado
                    </span>
                  )}
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p style={{textAlign:'center',color:'var(--text-muted)',padding:'2rem'}}>Sin transacciones registradas aún.</p>
            )}
          </div>
        </div>
      </div>

      {/* MODAL NUEVO INGRESO */}
      {showNewTx && (
        <div className="content-modal-overlay" onClick={() => setShowNewTx(false)}>
          <div className="content-modal animate-scale-up" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowNewTx(false)}><X size={24}/></button>
            <div className="modal-body">
              <div className="modal-header">
                <DollarSign size={24} className="sparkle-icon" />
                <h2>Registrar Pago</h2>
              </div>
              <form className="clinical-form" onSubmit={handleAddTransaction}>
                <div className="form-group">
                  <label>Paciente</label>
                  <select className="form-select" required value={newTx.patientId} onChange={e => setNewTx({...newTx, patientId: parseInt(e.target.value)})}>
                    <option value={0}>— Selecciona un paciente —</option>
                    {state.patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Monto (S/.)</label>
                    <input type="number" required placeholder="150" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Método de Pago</label>
                    <select className="form-select" value={newTx.method} onChange={e => setNewTx({...newTx, method: e.target.value})}>
                      <option>Efectivo</option>
                      <option>Transferencia</option>
                      <option>Yape/Plin</option>
                      <option>Tarjeta</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" checked={newTx.status === 'Pagado'} onChange={() => setNewTx({...newTx, status: 'Pagado'})} />
                      <span>Pagado</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" checked={newTx.status === 'Pendiente'} onChange={() => setNewTx({...newTx, status: 'Pendiente'})} />
                      <span>Pendiente</span>
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="secondary-btn" onClick={() => setShowNewTx(false)}>Cancelar</button>
                  <button type="submit" className="prescribe-large">
                    <CheckCircle2 size={18} /> Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finances;
