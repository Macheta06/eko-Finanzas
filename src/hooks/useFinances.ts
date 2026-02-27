import { useHomeStore } from '../store/homeStore';
import type { ProratedResult } from '../types/models';

/**
 * Hook personalizado para manejar la lógica de estado y cálculos de finanzas.
 * Actúa como una capa Facade (Arquitectura Limpia) entre la UI y el Store.
 */
export function useFinances() {
  const store = useHomeStore();

  /**
   * Calcula el aporte proporcional de cada miembro.
   * Fórmula:
   * 1. Suma el ingreso total de todos los miembros.
   * 2. Calcula el porcentaje de cada miembro (Ingreso individual / Ingreso total).
   * 3. Suma todos los gastos compartidos (SCOPE = SHARED).
   * 4. Asigna a cada miembro su % de los gastos compartidos + sus gastos individuales (SCOPE = INDIVIDUAL).
   *
   * @returns {ProratedResult[]} Array con los resultados de prorrateo por miembro.
   */
  const calculateProrating = (): ProratedResult[] => {
    if (store.members.length === 0) return [];

    const totalIncome = store.members.reduce((sum, m) => sum + Number(m.monthly_income), 0);

    // Gastos compartidos totales
    const totalSharedExpenses = store.expenses
      .filter((e) => e.scope === 'SHARED')
      .reduce((sum, e) => sum + Number(e.amount), 0);

    return store.members.map((member) => {
      const income = Number(member.monthly_income);
      
      // Manejar el caso de división por cero si el ingreso total es 0
      const proportionalPercentage = totalIncome > 0 ? (income / totalIncome) : (1 / store.members.length);

      // Aporte de gastos compartidos
      const sharedContribution = proportionalPercentage * totalSharedExpenses;

      // Gastos estrictamente individuales asignados a este miembro
      const individualExpenses = store.expenses
        .filter((e) => e.scope === 'INDIVIDUAL' && e.member_id_assigned === member.id)
        .reduce((sum, e) => sum + Number(e.amount), 0);

      return {
        member_id: member.id,
        member_name: member.name,
        proportional_percentage: proportionalPercentage,
        assigned_amount: sharedContribution + individualExpenses,
      };
    });
  };

  return {
    // State
    home: store.home,
    members: store.members,
    expenses: store.expenses,
    
    // Mutations
    setHome: store.setHome,
    addMember: store.addMember,
    removeMember: store.removeMember,
    addExpense: store.addExpense,
    removeExpense: store.removeExpense,
    reset: store.reset,

    // Calculations
    calculateProrating,
  };
}
