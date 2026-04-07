import { describe, it, expect } from 'vitest';
import { CircuitBreaker } from '../src/core/circuit.breaker';

describe('CircuitBreaker', () => {
  const config = { failureThreshold: 3, resetTimeout: 100 };

  it('should allow execution when closed', () => {
    const cb = new CircuitBreaker(config);
    expect(cb.canExecute()).toBe(true);
  });

  it('should open after threshold failures', () => {
    const cb = new CircuitBreaker(config);
    
    cb.recordFailure();
    cb.recordFailure();
    cb.recordFailure();

    expect(cb.canExecute()).toBe(false);
    expect(cb.getState().state).toBe('OPEN');
  });

  it('should close after success', () => {
    const cb = new CircuitBreaker(config);
    
    cb.recordFailure();
    cb.recordSuccess();

    expect(cb.getState().state).toBe('CLOSED');
    expect(cb.getState().failures).toBe(0);
  });

  it('should transition to half-open after timeout', async () => {
    const cb = new CircuitBreaker({ ...config, resetTimeout: 50 });
    
    cb.recordFailure();
    cb.recordFailure();
    cb.recordFailure();
    
    expect(cb.canExecute()).toBe(false);
    
    await new Promise(r => setTimeout(r, 60));
    
    expect(cb.canExecute()).toBe(true);
    expect(cb.getState().state).toBe('HALF_OPEN');
  });
});

