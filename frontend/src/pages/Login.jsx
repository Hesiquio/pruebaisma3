import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [formData, setFormData] = useState({
    user: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.user || !formData.password) {
      setErrorMessage('Por favor ingresa tu identificador (user) y contraseña.');
      return;
    }

    try {
      // Invocación al contexto pasando estrictamente 'user' y 'password'
      await login(formData.user, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Error al iniciar sesión.');
    }
  };

  const setQuickCredentials = (userValue) => {
    setFormData({
      user: userValue,
      password: 'Password123!',
    });
  };

  return (
    <div className="auth-container">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
            Instituto Tecnológico
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Sistema de Administración de Tareas Escolares
          </p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user">Identificador de Usuario (user)</label>
            <input
              type="text"
              id="user"
              name="user"
              placeholder="Ej. profesor_demo o alumno_demo"
              value={formData.user}
              onChange={handleChange}
              disabled={loading}
              autoComplete="off"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem', textAlign: 'center' }}>
            Cuentas de prueba para desarrollo (Sprint 1):
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              onClick={() => setQuickCredentials('profesor_demo')}
            >
              Profesor Demo
            </button>
            <button
              type="button"
              className="btn btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
              onClick={() => setQuickCredentials('alumno_demo')}
            >
              Alumno Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
