import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    let error;

    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      error = signInError;
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      error = signUpError;
    }

    if (error) {
      setErrorMsg(error.message);
    } else {
      onAuthSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Subscription Tracker</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Inicia sesión para gestionar tus suscripciones' : 'Crea una cuenta para empezar'}
        </p>

        {errorMsg && <div className="auth-error">{errorMsg}</div>}

        <form onSubmit={handleAuth} className="auth-form">
          <div className="auth-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="tu@email.com" 
              required 
            />
          </div>
          <div className="auth-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
            />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Procesando...' : (isLogin ? 'Entrar' : 'Registrarse')}
          </button>
        </form>

        <div className="auth-toggle">
          <span>{isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}</span>
          <button 
            type="button" 
            className="toggle-mode-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
