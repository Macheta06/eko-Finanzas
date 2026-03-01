import React, { useState } from 'react';
import { Plus, Trash2, Receipt } from 'lucide-react';
import { useFinances } from '@/hooks/useFinances';
import type { ExpenseScope, ExpenseType } from '@/types/models';

/**
 * Gestiona los gastos del hogar.
 * Permite marcar gastos como SHARED o INDIVIDUAL, y si es individual, 
 * asignarlo a un miembro específico.
 */
export const ExpensesManager: React.FC = () => {
  const { expenses, members, addExpense, removeExpense } = useFinances();
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<ExpenseType>('FIXED');
  const [scope, setScope] = useState<ExpenseScope>('SHARED');
  const [assignedId, setAssignedId] = useState('');

  const handleAdd = () => {
    const amountNum = parseFloat(amount);
    if (!desc.trim() || isNaN(amountNum) || amountNum <= 0) return;
    addExpense({
      description: desc.trim(),
      amount: amountNum,
      type,
      scope,
      member_id_assigned: scope === 'INDIVIDUAL' ? assignedId || undefined : undefined,
    });
    setDesc('');
    setAmount('');
    setScope('SHARED');
    setType('FIXED');
    setAssignedId('');
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="surface-1 p-5 flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Receipt size={16} style={{ color: 'var(--color-brand)' }} />
        <h2 className="text-subheading">Gastos</h2>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="flex flex-col gap-1" style={{ flex: 3 }}>
            <label className="text-label">Descripción</label>
            <input className="input-field" placeholder="Ej. Arriendo" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1" style={{ flex: 2 }}>
            <label className="text-label">Monto ($)</label>
            <input className="input-field mono" type="number" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
        </div>

        {/* Tipo de gasto */}
        <div className="flex gap-2">
          <div className="flex flex-col gap-1" style={{ flex: 1 }}>
            <label className="text-label">Tipo</label>
            <select
              className="input-field"
              value={type}
              onChange={(e) => setType(e.target.value as ExpenseType)}
            >
              <option value="FIXED">Fijo</option>
              <option value="VARIABLE">Variable</option>
            </select>
          </div>
          <div className="flex flex-col gap-1" style={{ flex: 1 }}>
            <label className="text-label">Ámbito</label>
            <select
              className="input-field"
              value={scope}
              onChange={(e) => setScope(e.target.value as ExpenseScope)}
            >
              <option value="SHARED">Compartido</option>
              <option value="INDIVIDUAL">Individual</option>
            </select>
          </div>
        </div>

        {/* Asignación individual */}
        {scope === 'INDIVIDUAL' && (
          <div className="flex flex-col gap-1 animate-fade-in">
            <label className="text-label">Asignar a</label>
            <select className="input-field" value={assignedId} onChange={(e) => setAssignedId(e.target.value)}>
              <option value="">Selecciona un integrante...</option>
              {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        )}

        <button
          className="btn btn-primary"
          style={{ alignSelf: 'flex-start' }}
          disabled={!desc.trim() || !amount.trim()}
          onClick={handleAdd}
        >
          <Plus size={14} />
          Agregar gasto
        </button>
      </div>

      {/* Lista de gastos */}
      {expenses.length === 0 ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '12px 0' }}>
          Aún no hay gastos registrados.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between" style={{ paddingBottom: '8px', borderBottom: '1px solid var(--color-border-soft)' }}>
            <span className="text-label">Total gastos</span>
            <span className="mono" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              ${totalExpenses.toLocaleString('es-CO', { minimumFractionDigits: 0 })}
            </span>
          </div>
          {expenses.map((expense) => {
            const assignedMember = members.find((m) => m.id === expense.member_id_assigned);
            return (
              <div key={expense.id}
                className="animate-fade-in"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '8px 0', borderBottom: '1px solid var(--color-border-soft)' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>{expense.description}</span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    <span className={`badge ${expense.type === 'FIXED' ? 'badge-green' : 'badge-copper'}`}>
                      {expense.type === 'FIXED' ? 'Fijo' : 'Variable'}
                    </span>
                    <span className={`badge ${expense.scope === 'SHARED' ? 'badge-green' : 'badge-copper'}`}>
                      {expense.scope === 'SHARED' ? 'Compartido' : `Individual${assignedMember ? ` · ${assignedMember.name}` : ''}`}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span className="mono" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    ${Number(expense.amount).toLocaleString('es-CO')}
                  </span>
                  <button className="btn btn-danger btn-sm" onClick={() => removeExpense(expense.id)} title="Eliminar">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
