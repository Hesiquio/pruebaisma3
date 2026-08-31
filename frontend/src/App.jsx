import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import './index.css';

/**
 * Componente Raíz de la Aplicación
 * Configuración central del enrutador y rutas protegidas.
 */
export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública de acceso */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas que requieren sesión activa */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas exclusivas por rol (Preparadas para Sprint 2 y 3) */}
          <Route
            path="/teacher/*"
            element={
              <ProtectedRoute allowedRoles={['PROFESOR']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['ALUMNO']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
