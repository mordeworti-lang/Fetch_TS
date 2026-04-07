import { describe, it, expect } from 'vitest';
import { MetricsCollector } from '../src/core/metrics';

describe('MetricsCollector', () => {
  it('should record successful requests', () => {
    const metrics = new MetricsCollector();
    
    metrics.recordRequest(100, false);
    metrics.recordRequest(200, false);

    const result = metrics.getMetrics();
    expect(result.requestCount).toBe(2);
    expect(result.errorCount).toBe(0);
    expect(result.averageLatency).toBe(150);
  });

  it('should record errors', () => {
    const metrics = new MetricsCollector();
    
    metrics.recordRequest(100, true);
    metrics.recordRequest(200, false);

    const result = metrics.getMetrics();
    expect(result.requestCount).toBe(2);
    expect(result.errorCount).toBe(1);
  });

  it('should reset metrics', () => {
    const metrics = new MetricsCollector();
    
    metrics.recordRequest(100, false);
    metrics.reset();

    const result = metrics.getMetrics();
    expect(result.requestCount).toBe(0);
    expect(result.totalLatency).toBe(0);
  });
});

