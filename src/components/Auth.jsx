import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Escuchar el evento de recuperación de contraseña de Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    // Fallback: detectar type=recovery en el hash de la URL
    if (window.location.hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // Limpiar la URL para evitar quedarse atascado en modo recovery
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      onAuthSuccess(); // Entrar directamente a la app tras cambiar la clave
    }
  };

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

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMsg('Ingresa tu correo en el campo de arriba para recuperar tu contraseña.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname,
    });
    if (error) {
      setErrorMsg(error.message);
    } else {
      setErrorMsg('Te hemos enviado un correo con un enlace para restablecer tu contraseña. Revísalo y haz clic en el enlace.');
    }
    setLoading(false);
  };

  if (isRecovery) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Nueva Contraseña</h2>
          <p className="auth-subtitle">Ingresa tu nueva contraseña para actualizarla</p>

          {errorMsg && <div className="auth-error">{errorMsg}</div>}

          <form onSubmit={handleUpdatePassword} className="auth-form">
            <div className="auth-group">
              <label>Nueva Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                minLength={6}
              />
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </form>
        </div>
      </div>
    );
  }

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

        {isLogin && (
          <div className="auth-forgot-password">
            <button 
              type="button" 
              className="forgot-password-btn"
              onClick={handleResetPassword}
              disabled={loading}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}

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
