/**
 * patrón de diseño: State Store Pattern con Persistencia (Zustand + LocalStorage).
 * Separa el almacenamiento de los datos puros de la lógica de negocio, 
 * encargando a Zustand solamente el guardado/recuperado y las mutaciones atómicas.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Home, Member, Expense } from '../types/models';
import { v4 as uuidv4 } from 'uuid';

export interface HomeState {
  home: Home | null;
  members: Member[];
  expenses: Expense[];
  
  // Actions
  setHome: (name: string, shareCode: string) => void;
  loadHome: (home: Home, members: Member[], expenses: Expense[]) => void;
  addMember: (name: string, monthlyIncome: number) => void;
  removeMember: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'home_id' | 'created_at'>) => void;
  removeExpense: (id: string) => void;
  reset: () => void;
}

export const useHomeStore = create<HomeState>()(
  persist(
    (set) => ({
      home: null,
      members: [],
      expenses: [],

      setHome: (name, shareCode) =>
        set(() => {
          const newHome: Home = {
            id: uuidv4(),
            name,
            share_code: shareCode,
            created_at: new Date().toISOString(),
          };
          return { home: newHome, members: [], expenses: [] };
        }),

      loadHome: (home, members, expenses) =>
        set(() => ({ home, members, expenses })),

      addMember: (name, monthlyIncome) =>
        set((state) => {
          if (!state.home) return state;
          const newMember: Member = {
            id: uuidv4(),
            home_id: state.home.id,
            name,
            monthly_income: monthlyIncome,
            created_at: new Date().toISOString(),
          };
          return { members: [...state.members, newMember] };
        }),

      removeMember: (id) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== id),
          // Las expenses asignadas individualmente a este miembro deberían borrarse o reasignarse, 
          // pero por simplicidad las borramos:
          expenses: state.expenses.filter((e) => e.member_id_assigned !== id),
        })),

      addExpense: (expenseData) =>
        set((state) => {
          if (!state.home) return state;
          const newExpense: Expense = {
            id: uuidv4(),
            home_id: state.home.id,
            ...expenseData,
            created_at: new Date().toISOString(),
          };
          return { expenses: [...state.expenses, newExpense] };
        }),

      removeExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        })),

      reset: () => set({ home: null, members: [], expenses: [] }),
    }),
    {
      name: 'eko-finanzas-storage', // key in localStorage
    }
  )
);
