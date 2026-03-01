import React, { useState } from 'react';
import { BarChart2, Users, Receipt } from 'lucide-react';
import { useFinances } from '@/hooks/useFinances';
import { HomeSetupView } from '@/components/views/HomeSetupView';
import { DashboardView } from '@/components/views/DashboardView';
import { MembersManager } from '@/components/views/MembersManager';
import { ExpensesManager } from '@/components/views/ExpensesManager';

type Tab = 'dashboard' | 'members' | 'expenses';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Resumen', icon: <BarChart2 size={18} /> },
  { id: 'members',   label: 'Integrantes', icon: <Users size={18} /> },
  { id: 'expenses',  label: 'Gastos', icon: <Receipt size={18} /> },
];

function App() {
  const { home } = useFinances();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Gate: Si no hay hogar activo mostrar la pantalla de setup
  if (!home) {
    return <HomeSetupView />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-canvas)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{ background: 'var(--color-surface-1)', borderBottom: '1px solid var(--color-border-soft)', padding: '0 24px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em', color: 'var(--color-text-primary)' }}>
          Eko-Finanzas
        </span>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, maxWidth: '720px', width: '100%', margin: '0 auto', padding: '20px 16px 120px', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'members'   && <MembersManager />}
        {activeTab === 'expenses'  && <ExpensesManager />}
      </main>

      {/* Bottom tab bar — la firma de Eko, no sidebar */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '12px 16px 20px', background: 'var(--color-surface-1)', borderTop: '1px solid var(--color-border-soft)', display: 'flex', justifyContent: 'center' }}>
        <div className="tab-bar" style={{ width: '100%', maxWidth: '420px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
