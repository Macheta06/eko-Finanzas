import React, { useState } from 'react';
import { UserPlus, Trash2, Users } from 'lucide-react';
import { useFinances } from '@/hooks/useFinances';

/**
 * Gestiona la lista de miembros del Hogar y sus ingresos mensuales.
 * Aplica patrón Observer: reacciona al store global via useFinances.
 */
export const MembersManager: React.FC = () => {
  const { members, addMember, removeMember, calculateProrating } = useFinances();
  const [name, setName] = useState('');
  const [income, setIncome] = useState('');
  const proration = calculateProrating();
  const totalIncome = members.reduce((sum, m) => sum + Number(m.monthly_income), 0);

  const handleAdd = () => {
    const incomeNum = parseFloat(income);
    if (!name.trim() || isNaN(incomeNum) || incomeNum <= 0) return;
    addMember(name.trim(), incomeNum);
    setName('');
    setIncome('');
  };

  return (
    <div className="surface-1 p-5 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Users size={16} style={{ color: 'var(--color-brand)' }} />
        <h2 className="text-subheading">Integrantes</h2>
      </div>

      {/* Formulario de adición */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="flex flex-col gap-1" style={{ flex: 2 }}>
            <label className="text-label">Nombre</label>
            <input
              className="input-field"
              placeholder="Ej. Ana"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
          <div className="flex flex-col gap-1" style={{ flex: 3 }}>
            <label className="text-label">Ingreso mensual ($)</label>
            <input
              className="input-field mono"
              type="number"
              min="0"
              placeholder="0.00"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
          </div>
        </div>
        <button
          className="btn btn-primary"
          style={{ alignSelf: 'flex-start' }}
          disabled={!name.trim() || !income.trim()}
          onClick={handleAdd}
        >
          <UserPlus size={14} />
          Agregar integrante
        </button>
      </div>

      {/* Lista de miembros */}
      {members.length === 0 ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '12px 0' }}>
          Aún no hay integrantes. Agrega el primero.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Ingreso total */}
          <div className="flex items-center justify-between" style={{ paddingBottom: '8px', borderBottom: '1px solid var(--color-border-soft)' }}>
            <span className="text-label">Ingreso total del hogar</span>
            <span className="mono" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              ${totalIncome.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
            </span>
          </div>

          {members.map((member) => {
            const pror = proration.find((p) => p.member_id === member.id);
            const pct = pror ? pror.proportional_percentage : 0;

            return (
              <div key={member.id} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{member.name}</span>
                    <span className="mono text-secondary" style={{ fontSize: '0.8rem' }}>
                      ${Number(member.monthly_income).toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-green">{(pct * 100).toFixed(0)}%</span>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeMember(member.id)}
                      title="Eliminar integrante"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                {/* Signature: proportion bar */}
                <div className="proportion-track">
                  <div className="proportion-fill" style={{ width: `${pct * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
