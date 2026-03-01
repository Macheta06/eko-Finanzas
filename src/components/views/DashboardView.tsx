import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
  PieChart, Pie, Legend,
} from 'recharts';
import { TrendingUp, Home, Share2, LogOut } from 'lucide-react';
import { useFinances } from '@/hooks/useFinances';

// Paleta de colores para las barras — derivada del domain color world
const MEMBER_COLORS = ['#1a7a50', '#b5651d', '#3b6fa8', '#7c3694', '#b34b1a'];

/** Tooltip personalizado para el gráfico tipo Recharts */
const CustomTooltip: React.FC<{ active?: boolean; payload?: { name: string; value: number }[]; label?: string }> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface-2" style={{ padding: '8px 12px', fontSize: '0.8rem' }}>
      <p style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="mono" style={{ color: 'var(--color-brand)' }}>
          ${Number(p.value).toLocaleString('es-CO', { minimumFractionDigits: 0 })}
        </p>
      ))}
    </div>
  );
};

/**
 * Dashboard principal: muestra resumen financiero y distribución de aportes.
 * Usa Recharts para las visualizaciones.
 */
export const DashboardView: React.FC = () => {
  const { home, members, expenses, calculateProrating, reset } = useFinances();
  const proration = calculateProrating();
  const totalIncome = members.reduce((sum, m) => sum + Number(m.monthly_income), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const sharedExpenses = expenses.filter((e) => e.scope === 'SHARED').reduce((sum, e) => sum + Number(e.amount), 0);

  const chartData = proration.map((p) => ({
    name: p.member_name,
    aporte: Number(p.assigned_amount.toFixed(0)),
  }));

  const pieData = members.map((m, i) => ({
    name: m.name,
    value: Number(m.monthly_income),
    fill: MEMBER_COLORS[i % MEMBER_COLORS.length],
  }));

  return (
    <div className="flex flex-col gap-5 animate-slide-up">
      {/* Header del hogar */}
      <div className="surface-1 p-5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Home size={18} color="#fff" />
          </div>
          <div>
            <h2 className="text-subheading">{home?.name ?? 'Mi Hogar'}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <Share2 size={12} style={{ color: 'var(--color-text-tertiary)' }} />
              <span className="mono text-label" style={{ letterSpacing: '0.12em' }}>{home?.share_code}</span>
            </div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={reset} title="Salir del hogar">
          <LogOut size={14} />
          Salir
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
        <div className="surface-1 p-4">
          <p className="text-label">Ingreso Total</p>
          <p className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px' }}>
            ${totalIncome.toLocaleString('es-CO')}
          </p>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>{members.length} integrante{members.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="surface-1 p-4">
          <p className="text-label">Gastos Totales</p>
          <p className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px', color: 'var(--color-danger)' }}>
            ${totalExpenses.toLocaleString('es-CO')}
          </p>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>{expenses.length} gasto{expenses.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="surface-1 p-4">
          <p className="text-label">Gastos Compartidos</p>
          <p className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px', color: 'var(--color-warning)' }}>
            ${sharedExpenses.toLocaleString('es-CO')}
          </p>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
            {totalExpenses > 0 ? `${((sharedExpenses / totalExpenses) * 100).toFixed(0)}% del total` : '—'}
          </p>
        </div>
        <div className="surface-1 p-4">
          <p className="text-label">Balance</p>
          <p className="mono" style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '4px', color: totalIncome - totalExpenses >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
            ${(totalIncome - totalExpenses).toLocaleString('es-CO')}
          </p>
          <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>ingreso − gastos</p>
        </div>
      </div>

      {/* Charts — only when we have data */}
      {proration.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {/* Bar: Aporte por miembro */}
          <div className="surface-1 p-5">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <TrendingUp size={14} style={{ color: 'var(--color-brand)' }} />
              <span className="text-subheading" style={{ fontSize: '0.9rem' }}>Aporte por integrante</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)', fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontFamily: 'DM Mono' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-border-soft)' }} />
                <Bar dataKey="aporte" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={MEMBER_COLORS[index % MEMBER_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie: Distribución de ingresos */}
          <div className="surface-1 p-5">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <TrendingUp size={14} style={{ color: 'var(--color-brand)' }} />
              <span className="text-subheading" style={{ fontSize: '0.9rem' }}>Distribución de ingresos</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-CO')}`} />
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tabla de prorrateo */}
      {proration.length > 0 && (
        <div className="surface-1 p-5">
          <h3 className="text-subheading" style={{ marginBottom: '12px', fontSize: '0.9rem' }}>Resumen de aportes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px', padding: '6px 0', borderBottom: '1px solid var(--color-border-default)' }}>
              <span className="text-label">Integrante</span>
              <span className="text-label" style={{ textAlign: 'right' }}>Proporción</span>
              <span className="text-label" style={{ textAlign: 'right' }}>Aporte</span>
            </div>
            {proration.map((p, i) => (
              <div key={p.member_id} className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '8px', padding: '10px 0', borderBottom: '1px solid var(--color-border-soft)', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: MEMBER_COLORS[i % MEMBER_COLORS.length], flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{p.member_name}</span>
                </div>
                <span className="badge badge-green" style={{ justifySelf: 'end' }}>{(p.proportional_percentage * 100).toFixed(1)}%</span>
                <span className="mono" style={{ fontSize: '0.9rem', fontWeight: 700, textAlign: 'right', minWidth: '90px' }}>
                  ${p.assigned_amount.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {proration.length === 0 && (
        <div className="surface-1 p-6" style={{ textAlign: 'center' }}>
          <p className="text-secondary">Agrega integrantes y gastos para ver el cálculo de aportes aquí.</p>
        </div>
      )}
    </div>
  );
};
