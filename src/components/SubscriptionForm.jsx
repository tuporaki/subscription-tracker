import React, { useState } from 'react';
import './SubscriptionForm.css';

const CATEGORIES = [
  'Streaming',
  'Música',
  'Software',
  'Negocios/Web',
  'Seguridad (VPN)',
  'Gimnasio / salud',
  'Educación',
  'ONGs',
  'Otros'
];

const PERIODICITIES = ['Mensual', 'Trimestral', 'Anual'];
const PAYMENT_METHODS = ['Cuenta corriente', 'Tarjeta', 'PayPal', 'Otras'];

const SubscriptionForm = ({ onAddSubscription }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    periodicity: 'Mensual',
    category: '',
    billingDate: '',
    paymentMethod: '',
    paymentDetails: '',
    comments: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre no puede estar vacío');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError('El importe debe ser mayor que 0');
      return;
    }
    if (!formData.category) {
      setError('Debes seleccionar una categoría');
      return;
    }
    if (!formData.billingDate) {
      setError('Debes seleccionar una fecha de pago');
      return;
    }
    if (!formData.paymentMethod) {
      setError('Debes seleccionar una forma de pago');
      return;
    }

    // Limpiar error y enviar
    setError('');
    onAddSubscription({
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      price: Number(formData.price),
      periodicity: formData.periodicity,
      category: formData.category,
      billingDate: formData.billingDate,
      paymentMethod: formData.paymentMethod,
      paymentDetails: formData.paymentDetails.trim(),
      comments: formData.comments.trim(),
      status: 'Activo'
    });

    // Resetear formulario
    setFormData({
      name: '',
      price: '',
      periodicity: 'Mensual',
      category: '',
      billingDate: '',
      paymentMethod: '',
      paymentDetails: '',
      comments: ''
    });
  };

  return (
    <form className="subscription-form" onSubmit={handleSubmit}>
      <h2>Añadir Suscripción</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Nombre del servicio</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Netflix" />
        </div>

        <div className="form-group row-group">
          <div className="sub-group flex-1">
            <label htmlFor="price">Importe (€)</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" step="0.01" min="0" />
          </div>
          <div className="sub-group flex-1">
            <label htmlFor="periodicity">Periodicidad</label>
            <select id="periodicity" name="periodicity" value={formData.periodicity} onChange={handleChange}>
              {PERIODICITIES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Categoría</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange}>
            <option value="">Selecciona una categoría</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="billingDate">Fecha del primer/próximo cobro</label>
          <input type="date" id="billingDate" name="billingDate" value={formData.billingDate} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="paymentMethod">Forma de pago</label>
          <select id="paymentMethod" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
            <option value="">Selecciona un método</option>
            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="paymentDetails">Detalles de pago (Opcional)</label>
          <input type="text" id="paymentDetails" name="paymentDetails" value={formData.paymentDetails} onChange={handleChange} placeholder="Ej. ING Direct, Tarjeta *1234" />
        </div>

        <div className="form-group full-width">
          <label htmlFor="comments">Comentarios (Opcional)</label>
          <input type="text" id="comments" name="comments" value={formData.comments} onChange={handleChange} placeholder="Anotaciones extra..." />
        </div>
      </div>

      <button type="submit" className="submit-btn">Añadir Suscripción</button>
    </form>
  );
};

export default SubscriptionForm;
