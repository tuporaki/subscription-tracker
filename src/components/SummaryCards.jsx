import React from 'react';
import './SummaryCards.css';

const SummaryCards = ({ totalMonthly = 0, totalAnnual = 0, committedAnnual = 0 }) => {
  return (
    <div className="summary-cards">
      <div className="card">
        <h3>Gasto Mensual</h3>
        <p className="amount">{totalMonthly.toFixed(2)} €</p>
      </div>
      <div className="card annual">
        <h3>Gasto Anual Total</h3>
        <p className="amount">{totalAnnual.toFixed(2)} €</p>
      </div>
      <div className="card committed">
        <h3>Anual Comprometido</h3>
        <p className="amount">{committedAnnual.toFixed(2)} €</p>
      </div>
    </div>
  );
};

export default SummaryCards;
