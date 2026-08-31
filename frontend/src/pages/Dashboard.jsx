import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  const isTeacher = currentUser?.role === 'PROFESOR';

  return (
    <div>
      {/* Barra de navegación superior */}
      <header className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
            Portal Escolar
          </h1>
          <span
            className={`badge ${
              isTeacher ? 'badge-profesor' : 'badge-alumno'
            }`}
          >
            {currentUser?.role}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              {currentUser?.firstName} {currentUser?.lastName}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Identificador (user): <strong>{currentUser?.user}</strong>
            </p>
          </div>
          <button onClick={logout} className="btn btn-outline">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="dashboard-container">
        {/* Banner de Bienvenida */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '0.75rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            ¡Bienvenido(a), {currentUser?.firstName}!
          </h2>
          <p style={{ opacity: 0.9 }}>
            Sprint 1: Módulo de Fundación y Acceso completado con éxito.
          </p>
        </div>

        {/* Resumen y Próximos Sprints */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Tarjeta Sprint 1 - Estado de la Cuenta */}
          <div className="card" style={{ maxWidth: 'none' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1e293b' }}>
              Detalles de Autenticación
            </h3>
            <ul style={{ listStyle: 'none', lineHeight: '1.8', fontSize: '0.9rem' }}>
              <li>
                <strong>ID:</strong> {currentUser?.id}
              </li>
              <li>
                <strong>Identificador (user):</strong> {currentUser?.user}
              </li>
              <li>
                <strong>Email:</strong> {currentUser?.email}
              </li>
              <li>
                <strong>Rol asignado:</strong> {currentUser?.role}
              </li>
              <li>
                <strong>Estado:</strong> <span style={{ color: '#16a34a' }}>● Activo</span>
              </li>
            </ul>
          </div>

          {/* Tarjeta de Próximos Módulos según Rol */}
          <div className="card" style={{ maxWidth: 'none' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#1e293b' }}>
              {isTeacher ? 'Panel de Docente' : 'Panel de Estudiante'}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>
              {isTeacher
                ? 'Próximamente disponible en Sprint 2: Creación, asignación y gestión del ciclo de vida de tareas escolares.'
                : 'Próximamente disponible en Sprint 2: Visualización de asignaciones, entregas de archivos y seguimiento.'}
            </p>
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#f1f5f9',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                color: '#475569',
              }}
            >
              📅 <strong>Siguiente Sprint:</strong> CRUD de Tareas & Evaluaciones
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
