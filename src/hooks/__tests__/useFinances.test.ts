import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHomeStore } from '../../store/homeStore';
import { useFinances } from '../useFinances';
import type { Member, Expense } from '../../types/models';

function createMockMember(overrides: Partial<Member> = {}): Member {
  return {
    id: crypto.randomUUID(),
    home_id: 'home-1',
    name: 'Test Member',
    monthly_income: 0,
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

function createMockExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: crypto.randomUUID(),
    home_id: 'home-1',
    description: 'Test Expense',
    amount: 0,
    type: 'VARIABLE',
    scope: 'SHARED',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

describe('calculateProrating', () => {
  beforeEach(() => {
    useHomeStore.setState({
      home: {
        id: 'home-1',
        name: 'Test Home',
        share_code: 'ABC123',
        created_at: new Date().toISOString(),
      },
      members: [],
      expenses: [],
    });
  });

  it('distributes shared expenses equally when members have the same income', () => {
    const member1 = createMockMember({
      id: 'm1',
      name: 'Alice',
      monthly_income: 5000,
    });
    const member2 = createMockMember({
      id: 'm2',
      name: 'Bob',
      monthly_income: 5000,
    });
    useHomeStore.setState({ members: [member1, member2] });

    const expense = createMockExpense({ amount: 200, scope: 'SHARED' });
    useHomeStore.setState({ expenses: [expense] });

    const { result } = renderHook(() => useFinances());
    const calcResult = result.current.calculateProrating();

    expect(calcResult).toHaveLength(2);
    expect(calcResult[0].member_name).toBe('Alice');
    expect(calcResult[0].proportional_percentage).toBe(0.5);
    expect(calcResult[0].assigned_amount).toBe(100);
    expect(calcResult[1].member_name).toBe('Bob');
    expect(calcResult[1].proportional_percentage).toBe(0.5);
    expect(calcResult[1].assigned_amount).toBe(100);
  });

  it('divides equally when all members have zero income', () => {
    const member1 = createMockMember({
      id: 'm1',
      name: 'Alice',
      monthly_income: 0,
    });
    const member2 = createMockMember({
      id: 'm2',
      name: 'Bob',
      monthly_income: 0,
    });
    const member3 = createMockMember({
      id: 'm3',
      name: 'Charlie',
      monthly_income: 0,
    });
    useHomeStore.setState({ members: [member1, member2, member3] });

    const expense = createMockExpense({ amount: 300, scope: 'SHARED' });
    useHomeStore.setState({ expenses: [expense] });

    const { result } = renderHook(() => useFinances());
    const calcResult = result.current.calculateProrating();

    expect(calcResult).toHaveLength(3);
    calcResult.forEach((r) => {
      expect(r.proportional_percentage).toBeCloseTo(1 / 3);
      expect(r.assigned_amount).toBe(100);
    });
  });

  it('assigns individual expenses to the correct member', () => {
    const member1 = createMockMember({
      id: 'm1',
      name: 'Alice',
      monthly_income: 5000,
    });
    const member2 = createMockMember({
      id: 'm2',
      name: 'Bob',
      monthly_income: 5000,
    });
    useHomeStore.setState({ members: [member1, member2] });

    const sharedExpense = createMockExpense({
      id: 'e1',
      amount: 200,
      scope: 'SHARED',
    });
    const individualExpense = createMockExpense({
      id: 'e2',
      amount: 50,
      scope: 'INDIVIDUAL',
      member_id_assigned: 'm1',
    });
    useHomeStore.setState({ expenses: [sharedExpense, individualExpense] });

    const { result } = renderHook(() => useFinances());
    const calcResult = result.current.calculateProrating();

    // Alice (m1): 50% of 200 = 100 + 50 individual = 150
    // Bob (m2): 50% of 200 = 100 + 0 individual = 100
    expect(calcResult.find((r) => r.member_id === 'm1')!.assigned_amount).toBe(
      150,
    );
    expect(calcResult.find((r) => r.member_id === 'm2')!.assigned_amount).toBe(
      100,
    );
  });

  it('returns zero assigned_amount when there are no expenses', () => {
    const member1 = createMockMember({
      id: 'm1',
      name: 'Alice',
      monthly_income: 5000,
    });
    const member2 = createMockMember({
      id: 'm2',
      name: 'Bob',
      monthly_income: 3000,
    });
    useHomeStore.setState({ members: [member1, member2] });

    const { result } = renderHook(() => useFinances());
    const calcResult = result.current.calculateProrating();

    expect(calcResult).toHaveLength(2);
    calcResult.forEach((r) => {
      expect(r.assigned_amount).toBe(0);
    });
  });

  it('handles expenses with amount zero correctly', () => {
    const member1 = createMockMember({
      id: 'm1',
      name: 'Alice',
      monthly_income: 5000,
    });
    const member2 = createMockMember({
      id: 'm2',
      name: 'Bob',
      monthly_income: 5000,
    });
    useHomeStore.setState({ members: [member1, member2] });

    const zeroExpense = createMockExpense({ amount: 0, scope: 'SHARED' });
    useHomeStore.setState({ expenses: [zeroExpense] });

    const { result } = renderHook(() => useFinances());
    const calcResult = result.current.calculateProrating();

    expect(calcResult).toHaveLength(2);
    calcResult.forEach((r) => {
      expect(r.assigned_amount).toBe(0);
    });
  });

  it('returns empty array when there are no members', () => {
    const { result } = renderHook(() => useFinances());
    const calcResult = result.current.calculateProrating();

    expect(calcResult).toEqual([]);
  });
});
