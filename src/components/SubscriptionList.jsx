import React from 'react';
import './SubscriptionList.css';

const getNextBillingDate = (dateStr, periodicity) => {
  const billingDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0,0,0,0);
  
  if (billingDate >= today) return billingDate;

  let nextDate = new Date(billingDate);
  while (nextDate < today) {
    if (periodicity === 'Mensual') nextDate.setMonth(nextDate.getMonth() + 1);
    else if (periodicity === 'Trimestral') nextDate.setMonth(nextDate.getMonth() + 3);
    else if (periodicity === 'Anual') nextDate.setFullYear(nextDate.getFullYear() + 1);
    else break;
  }
  return nextDate;
};

const ServiceLogo = ({ name }) => {
  const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
  const initial = name.charAt(0).toUpperCase();
  
  return (
    <div className="logo-container">
      <img 
        src={`https://logo.clearbit.com/${domain}`} 
        alt={`${name} logo`}
        className="service-logo"
        onError={(e) => {
          e.target.style.display = 'none';
          if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="logo-fallback" style={{ display: 'none' }}>
        {initial}
      </div>
    </div>
  );
};

const SubscriptionList = ({ subscriptions, onDelete, onToggleStatus }) => {
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="empty-state">
        <p>No tienes ninguna suscripción registrada aún. ¡Añade la primera!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="subscription-list">
      <h2>Tus Suscripciones</h2>
      <div className="list-container">
        {subscriptions.map(sub => {
          const periodicity = sub.periodicity || 'Mensual';
          const price = sub.price !== undefined ? sub.price : (sub.monthlyPrice || 0);
          const nextDate = getNextBillingDate(sub.billingDate, periodicity);
          const today = new Date();
          today.setHours(0,0,0,0);
          const diffDays = Math.ceil(Math.abs(nextDate - today) / (1000 * 60 * 60 * 24));
          
          let trafficLight = 'safe';
          if (diffDays <= 2) trafficLight = 'urgent';
          else if (diffDays <= 7) trafficLight = 'warning';

          const isPaused = sub.status === 'Pausado';

          return (
            <div key={sub.id} className={`subscription-item ${isPaused ? 'paused' : ''}`}>
              <ServiceLogo name={sub.name} />
              
              <div className="item-info">
                <h3>{sub.name}</h3>
                <div className="badges">
                  <span className="category-badge">{sub.category}</span>
                  <span className="period-badge">{periodicity}</span>
                  {isPaused && <span className="status-badge">Pausada</span>}
                </div>
                
                <div className="extra-details">
                  <p><strong>Pago:</strong> {sub.paymentMethod} {sub.paymentDetails && `(${sub.paymentDetails})`}</p>
                  {sub.comments && <p className="comments">"{sub.comments}"</p>}
                </div>
              </div>
              
              <div className="item-details">
                <div className="detail countdown-detail">
                  <span className={`countdown-dot ${trafficLight}`}></span>
                  <div className="detail-text">
                    <span className="label">Próximo cobro:</span>
                    <span className="value countdown-text">{diffDays === 0 ? '¡Hoy!' : `En ${diffDays} días`}</span>
                  </div>
                </div>
                <div className="price-tag">
                  {price.toFixed(2)} € <span>/{periodicity.toLowerCase()}</span>
                </div>
              </div>
              
              <div className="item-actions">
                <button 
                  className={`toggle-btn ${isPaused ? 'play' : 'pause'}`}
                  onClick={() => onToggleStatus(sub.id)}
                  aria-label={isPaused ? "Reactivar" : "Pausar"}
                  title={isPaused ? "Reactivar suscripción" : "Pausar suscripción"}
                >
                  {isPaused ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                  )}
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => onDelete(sub.id)}
                  aria-label={`Eliminar ${sub.name}`}
                  title="Eliminar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionList;
