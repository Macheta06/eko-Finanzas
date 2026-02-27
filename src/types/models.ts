// src/types/models.ts

/**
 * Representa un Hogar (Home) con una clave compartida.
 */
export interface Home {
  id: string; // UUID referenciando Supabase auth o ID nativo
  name: string;
  share_code: string;
  created_at: string;
}

/**
 * Representa a un miembro del hogar y su ingreso mensual base.
 */
export interface Member {
  id: string;
  home_id: string;
  name: string;
  monthly_income: number;
  created_at: string;
}

/**
 * Tipos de gasto.
 * - FIJO: Gasto recurrente exacto (Alquiler, Internet)
 * - VARIABLE: Gasto que puede cambiar (Comida, Servicios)
 */
export type ExpenseType = 'FIXED' | 'VARIABLE';

/**
 * Ámbito del gasto.
 * - SHARED: Pagar por ambos proporcionalmente.
 * - INDIVIDUAL: Asignado solo a una persona.
 */
export type ExpenseScope = 'SHARED' | 'INDIVIDUAL';

export interface Expense {
  id: string;
  home_id: string;
  description: string;
  amount: number;
  type: ExpenseType;
  scope: ExpenseScope;
  member_id_assigned?: string; // Si el scope es INDIVIDUAL, a quién le pertenece
  created_at: string;
}

export interface ProratedResult {
  member_id: string;
  member_name: string;
  proportional_percentage: number; // Ej. 0.60 (60%)
  assigned_amount: number;         // Cuánto del gasto total debe poner esta persona
}
