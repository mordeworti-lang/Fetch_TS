import { CircuitBreakerConfig, CircuitBreakerState } from '@/types';

export class CircuitBreaker {
  private state: CircuitBreakerState = {
    failures: 0,
    lastFailureTime: null,
    state: 'CLOSED'
  };

  constructor(private config: CircuitBreakerConfig) {}

  canExecute(): boolean {
    if (this.state.state === 'CLOSED') return true;
    if (this.state.state === 'OPEN') {
      const now = Date.now();
      if (this.state.lastFailureTime && 
          now - this.state.lastFailureTime >= this.config.resetTimeout) {
        this.state.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }
    return true;
  }

  recordSuccess(): void {
    this.state.failures = 0;
    this.state.state = 'CLOSED';
    this.state.lastFailureTime = null;
  }

  recordFailure(): void {
    this.state.failures++;
    this.state.lastFailureTime = Date.now();
    if (this.state.failures >= this.config.failureThreshold) {
      this.state.state = 'OPEN';
    }
  }

  getState(): CircuitBreakerState {
    return { ...this.state };
  }
}

