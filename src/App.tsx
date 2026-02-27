import { Layout } from '@/components/layout/Layout';

function App() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 sm:text-4xl">
          Distribuye los gastos de forma justa
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
          Eko-Finanzas te ayuda a calcular el aporte ideal de cada miembro del hogar basado en sus ingresos mensuales.
        </p>
        <div className="flex gap-4">
          <button className="bg-brand-primary text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-emerald-600 transition-colors">
            Crear Hogar
          </button>
          <button className="bg-white text-slate-700 font-semibold py-3 px-6 rounded-lg shadow border border-slate-200 hover:bg-slate-50 transition-colors">
            Unirse
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default App;
