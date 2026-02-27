import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout principal de la aplicación.
 * Define la estructura genérica: Navbar/Header superior y contenido centrado.
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          {/* Aquí iría el logo */}
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
            E
          </div>
          <h1 className="font-bold text-xl tracking-tight text-slate-800">Eko-Finanzas</h1>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      
      <footer className="py-6 text-center text-slate-500 text-sm border-t border-slate-200 bg-white">
        Eko-Finanzas &copy; {new Date().getFullYear()} - Gestión equitativa de gastos.
      </footer>
    </div>
  );
};
