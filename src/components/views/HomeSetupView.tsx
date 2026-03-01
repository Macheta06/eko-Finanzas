import React, { useState } from 'react';
import { Home, Plus, LogIn } from 'lucide-react';
import { useFinances } from '@/hooks/useFinances';

/**
 * Vista de entrada cuando no existe un Hogar activo.
 * Permite crear un Hogar nuevo o unirse con un código compartido.
 */
export const HomeSetupView: React.FC = () => {
  const [mode, setMode] = useState<'idle' | 'create' | 'join'>('idle');
  const [homeName, setHomeName] = useState('');
  const [shareCode, setShareCode] = useState('');
  const { setHome } = useFinances();

  const handleCreate = () => {
    if (!homeName.trim()) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setHome(homeName.trim(), code);
  };

  const handleJoin = () => {
    if (!shareCode.trim()) return;
    // En un MVP real, aquí llamaríamos a Supabase para buscar el hogar por código.
    // Por ahora, usamos el mismo método pero indicamos que es un código externo.
    setHome(`Hogar ${shareCode.toUpperCase()}`, shareCode.toUpperCase());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ background: 'var(--color-canvas)' }}>
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
               style={{ background: 'var(--color-brand)', boxShadow: '0 1px 0 rgba(0,0,0,0.15) inset' }}>
            <Home size={28} color="#fff" />
          </div>
          <h1 className="text-heading" style={{ fontSize: '1.75rem' }}>Eko-Finanzas</h1>
          <p className="text-secondary mt-1" style={{ fontSize: '0.9rem' }}>Gastos del hogar, distribuidos con justicia</p>
        </div>

        {mode === 'idle' && (
          <div className="surface-1 p-6 flex flex-col gap-3">
            <h2 className="text-subheading text-center mb-2">¿Cómo quieres empezar?</h2>
            <button className="btn btn-primary" style={{ width: '100%', padding: '14px' }} onClick={() => setMode('create')}>
              <Plus size={16} />
              Crear un nuevo Hogar
            </button>
            <button className="btn btn-secondary" style={{ width: '100%', padding: '14px' }} onClick={() => setMode('join')}>
              <LogIn size={16} />
              Unirme con un código
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="surface-1 p-6 flex flex-col gap-4 animate-fade-in">
            <div>
              <h2 className="text-subheading mb-1">Crea tu Hogar</h2>
              <p className="text-muted">Después podrás compartir el código con los demás integrantes.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label">Nombre del hogar</label>
              <input
                className="input-field"
                placeholder="Ej. Casa Familia García"
                value={homeName}
                onChange={(e) => setHomeName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary" style={{ flex: '0 0 auto' }} onClick={() => setMode('idle')}>Atrás</button>
              <button className="btn btn-primary" style={{ flex: 1 }} disabled={!homeName.trim()} onClick={handleCreate}>
                Crear Hogar
              </button>
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div className="surface-1 p-6 flex flex-col gap-4 animate-fade-in">
            <div>
              <h2 className="text-subheading mb-1">Unirte a un Hogar</h2>
              <p className="text-muted">Ingresa el código que te compartieron.</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-label">Código de acceso</label>
              <input
                className="input-field mono"
                placeholder="Ej. A1B2C3"
                value={shareCode}
                onChange={(e) => setShareCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                style={{ letterSpacing: '0.15em' }}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary" style={{ flex: '0 0 auto' }} onClick={() => setMode('idle')}>Atrás</button>
              <button className="btn btn-primary" style={{ flex: 1 }} disabled={!shareCode.trim()} onClick={handleJoin}>
                Unirme
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
