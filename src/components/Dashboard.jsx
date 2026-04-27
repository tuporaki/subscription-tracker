import React, { useMemo } from 'react';
import Charts from './Charts';
import './Dashboard.css';

const getNextBillingDate = (dateStr, periodicity) => {
  const billingDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0,0,0,0);
  
  if (billingDate >= today) return billingDate;

  let nextDate = new Date(billingDate);
  while (nextDate < today) {
    if (periodicity === 'Mensual') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else if (periodicity === 'Trimestral') {
      nextDate.setMonth(nextDate.getMonth() + 3);
    } else if (periodicity === 'Anual') {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    } else {
      break;
    }
  }
  return nextDate;
};

const Dashboard = ({ subscriptions }) => {
  const upcomingPayments = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) return [];
    
    const withNextDate = subscriptions.map(sub => {
      const periodicity = sub.periodicity || 'Mensual';
      const price = sub.price !== undefined ? sub.price : (sub.monthlyPrice || 0);
      const nextDate = getNextBillingDate(sub.billingDate, periodicity);
      const today = new Date();
      today.setHours(0,0,0,0);
      const diffTime = Math.abs(nextDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return { ...sub, price, periodicity, nextDate, diffDays };
    });

    return withNextDate
      .sort((a, b) => a.nextDate - b.nextDate)
      .slice(0, 3);
  }, [subscriptions]);

  const topImpact = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) return [];
    
    const withAnnualCost = subscriptions.map(sub => {
      const periodicity = sub.periodicity || 'Mensual';
      const price = sub.price !== undefined ? sub.price : (sub.monthlyPrice || 0);
      let annualCost = 0;
      if (periodicity === 'Mensual') annualCost = price * 12;
      else if (periodicity === 'Trimestral') annualCost = price * 4;
      else if (periodicity === 'Anual') annualCost = price;
      
      return { ...sub, annualCost };
    });

    return withAnnualCost
      .sort((a, b) => b.annualCost - a.annualCost)
      .slice(0, 3);
  }, [subscriptions]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  if (subscriptions.length === 0) return null;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card charts-section">
        <h3>Visualización Avanzada</h3>
        <Charts subscriptions={subscriptions} />
      </div>

      <div className="dashboard-bottom-grid">
        <div className="dashboard-card upcoming-card">
          <h3>Próximos Cobros</h3>
          <div className="upcoming-list">
            {upcomingPayments.map(sub => (
              <div key={sub.id} className="upcoming-item">
                <div className="upcoming-info">
                  <span className="upcoming-name">{sub.name}</span>
                  <span className="upcoming-price">{sub.price.toFixed(2)} € <span className="period-mini">/{sub.periodicity.substring(0,3)}</span></span>
                </div>
                <div className="upcoming-meta">
                  <span className="upcoming-date">{formatDate(sub.nextDate)}</span>
                  <span className={`upcoming-days ${sub.diffDays <= 2 ? 'urgent' : sub.diffDays <= 7 ? 'warning' : 'safe'}`}>
                    {sub.diffDays === 0 ? '¡Hoy!' : `en ${sub.diffDays} días`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card analysis-card">
          <h3>Análisis de Decisiones (Top Impacto Anual)</h3>
          <div className="upcoming-list">
            {topImpact.map((sub, index) => (
              <div key={sub.id} className="upcoming-item impact-item">
                <div className="impact-rank">#{index + 1}</div>
                <div className="upcoming-info flex-1">
                  <span className="upcoming-name">{sub.name}</span>
                  <span className="upcoming-price impact-price">{sub.annualCost.toFixed(2)} € <span className="period-mini">/año</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
