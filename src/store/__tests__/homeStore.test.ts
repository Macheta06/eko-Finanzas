import { describe, it, expect, beforeEach } from 'vitest';
import { useHomeStore } from '../homeStore';

describe('homeStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useHomeStore.setState({
      home: null,
      members: [],
      expenses: [],
    });
  });

  describe('setHome', () => {
    it('creates a home with name and shareCode', () => {
      const store = useHomeStore.getState();
      store.setHome('Mi Casa', 'XYZ789');

      const state = useHomeStore.getState();
      expect(state.home).not.toBeNull();
      expect(state.home!.name).toBe('Mi Casa');
      expect(state.home!.share_code).toBe('XYZ789');
      expect(state.home!.id).toBeDefined();
      expect(state.home!.created_at).toBeDefined();
    });

    it('resets members and expenses when creating a new home', () => {
      const store = useHomeStore.getState();
      // Simulate existing data
      store.addMember('Alice', 5000);
      store.addExpense({
        description: 'Rent',
        amount: 1000,
        type: 'FIXED',
        scope: 'SHARED',
      });

      // Create new home
      store.setHome('New Home', 'NEW123');
      const state = useHomeStore.getState();
      expect(state.members).toHaveLength(0);
      expect(state.expenses).toHaveLength(0);
    });
  });

  describe('addMember', () => {
    it('adds a member to the members list', () => {
      const store = useHomeStore.getState();
      store.setHome('Test Home', 'TEST1');
      store.addMember('Alice', 5000);

      const state = useHomeStore.getState();
      expect(state.members).toHaveLength(1);
      expect(state.members[0].name).toBe('Alice');
      expect(state.members[0].monthly_income).toBe(5000);
      expect(state.members[0].home_id).toBe(state.home!.id);
      expect(state.members[0].id).toBeDefined();
      expect(state.members[0].created_at).toBeDefined();
    });

    it('does not add a member when there is no home', () => {
      const store = useHomeStore.getState();
      store.addMember('Ghost', 1000);

      const state = useHomeStore.getState();
      expect(state.members).toHaveLength(0);
    });
  });

  describe('removeMember', () => {
    it('removes a member by id', () => {
      const store = useHomeStore.getState();
      store.setHome('Test Home', 'TEST1');
      store.addMember('Alice', 5000);
      store.addMember('Bob', 3000);

      const stateAfterAdd = useHomeStore.getState();
      const bobId = stateAfterAdd.members.find((m) => m.name === 'Bob')!.id;

      useHomeStore.getState().removeMember(bobId);
      const state = useHomeStore.getState();
      expect(state.members).toHaveLength(1);
      expect(state.members[0].name).toBe('Alice');
    });
  });

  describe('addExpense', () => {
    it('adds a shared expense', () => {
      const store = useHomeStore.getState();
      store.setHome('Test Home', 'TEST1');
      store.addExpense({
        description: 'Internet',
        amount: 80,
        type: 'FIXED',
        scope: 'SHARED',
      });

      const state = useHomeStore.getState();
      expect(state.expenses).toHaveLength(1);
      expect(state.expenses[0].description).toBe('Internet');
      expect(state.expenses[0].amount).toBe(80);
      expect(state.expenses[0].scope).toBe('SHARED');
      expect(state.expenses[0].home_id).toBe(state.home!.id);
      expect(state.expenses[0].id).toBeDefined();
    });

    it('does not add an expense when there is no home', () => {
      const store = useHomeStore.getState();
      store.addExpense({
        description: 'Rent',
        amount: 1000,
        type: 'FIXED',
        scope: 'SHARED',
      });

      const state = useHomeStore.getState();
      expect(state.expenses).toHaveLength(0);
    });
  });

  describe('removeExpense', () => {
    it('removes an expense by id', () => {
      const store = useHomeStore.getState();
      store.setHome('Test Home', 'TEST1');
      store.addExpense({
        description: 'Rent',
        amount: 1000,
        type: 'FIXED',
        scope: 'SHARED',
      });
      store.addExpense({
        description: 'Internet',
        amount: 80,
        type: 'FIXED',
        scope: 'SHARED',
      });

      const stateAfterAdd = useHomeStore.getState();
      const internetId = stateAfterAdd.expenses.find(
        (e) => e.description === 'Internet',
      )!.id;

      useHomeStore.getState().removeExpense(internetId);
      const state = useHomeStore.getState();
      expect(state.expenses).toHaveLength(1);
      expect(state.expenses[0].description).toBe('Rent');
    });
  });

  describe('removeMember cleans up expenses', () => {
    it('removes individual expenses assigned to the deleted member', () => {
      const store = useHomeStore.getState();
      store.setHome('Test Home', 'TEST1');
      store.addMember('Alice', 5000);
      store.addMember('Bob', 3000);

      const stateAfterAdd = useHomeStore.getState();
      const aliceId = stateAfterAdd.members.find((m) => m.name === 'Alice')!.id;
      const bobId = stateAfterAdd.members.find((m) => m.name === 'Bob')!.id;

      // Add shared expense
      store.addExpense({
        description: 'Rent',
        amount: 1000,
        type: 'FIXED',
        scope: 'SHARED',
      });

      // Add individual expenses for Alice
      store.addExpense({
        description: 'Alice Phone',
        amount: 50,
        type: 'VARIABLE',
        scope: 'INDIVIDUAL',
        member_id_assigned: aliceId,
      });

      // Add individual expenses for Bob
      store.addExpense({
        description: 'Bob Gym',
        amount: 30,
        type: 'VARIABLE',
        scope: 'INDIVIDUAL',
        member_id_assigned: bobId,
      });

      // Remove Alice — her individual expense should be cleaned up
      useHomeStore.getState().removeMember(aliceId);
      const state = useHomeStore.getState();

      expect(state.members).toHaveLength(1);
      expect(state.members[0].name).toBe('Bob');
      expect(state.expenses).toHaveLength(2); // shared + Bob's individual
      expect(
        state.expenses.filter((e) => e.scope === 'INDIVIDUAL'),
      ).toHaveLength(1);
      expect(
        state.expenses.find((e) => e.description === 'Alice Phone'),
      ).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('returns to initial state with null home, empty members and expenses', () => {
      const store = useHomeStore.getState();
      store.setHome('Test Home', 'TEST1');
      store.addMember('Alice', 5000);
      store.addMember('Bob', 3000);
      store.addExpense({
        description: 'Rent',
        amount: 1000,
        type: 'FIXED',
        scope: 'SHARED',
      });

      useHomeStore.getState().reset();
      const state = useHomeStore.getState();
      expect(state.home).toBeNull();
      expect(state.members).toHaveLength(0);
      expect(state.expenses).toHaveLength(0);
    });
  });
});
