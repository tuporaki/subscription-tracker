import React from 'react';
import './HelpModal.css';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ayuda y FAQs</h2>
          <button className="close-btn" onClick={onClose} aria-label="Cerrar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div className="modal-body">
          <div className="faq-item">
            <h3>🔴 ¿Cómo funciona el Semáforo de Pagos?</h3>
            <p>
              En la lista de suscripciones verás un punto luminoso junto a la fecha de cobro:
              <br/>- <strong>Rojo:</strong> Cobro muy urgente (en menos de 48 horas).
              <br/>- <strong>Naranja:</strong> Cobro próximo (en menos de 7 días).
              <br/>- <strong>Verde:</strong> Aún tienes margen de sobra.
            </p>
          </div>

          <div className="faq-item">
            <h3>⏸️ ¿Para qué sirve el botón de Pausar?</h3>
            <p>
              Si cancelas temporalmente un servicio pero quieres recordar que lo tienes (ej. Netflix en verano), dale a pausar. 
              La tarjeta se oscurecerá y <strong>dejará de sumar dinero</strong> a tus gráficos y a tu cálculo de gasto mensual, pero no se borrará tu historial.
            </p>
          </div>

          <div className="faq-item">
            <h3>💰 ¿Qué es el "Gasto Anual Comprometido"?</h3>
            <p>
              Es la proyección real de lo que te vas a gastar este año entero si no cancelas ninguna de las suscripciones que tienes activas actualmente. Te ayuda a ver el impacto a largo plazo de los pagos pequeños.
            </p>
          </div>

          <div className="faq-item">
            <h3>🎨 ¿Cómo aparecen los logos de las marcas?</h3>
            <p>
              La aplicación busca los logos automáticamente usando Inteligencia Artificial basada en el nombre que escribas. Intenta usar el nombre oficial de la marca (ej. "Spotify" en lugar de "Musica Spotify") para que lo detecte sin problemas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
