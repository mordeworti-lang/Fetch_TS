import { Metrics } from '@/types';

export class MetricsCollector {
  private metrics: Metrics = {
    requestCount: 0,
    errorCount: 0,
    totalLatency: 0,
    averageLatency: 0
  };

  recordRequest(latency: number, isError: boolean): void {
    this.metrics.requestCount++;
    this.metrics.totalLatency += latency;
    
    if (isError) {
      this.metrics.errorCount++;
    }
    
    this.metrics.averageLatency = 
      this.metrics.totalLatency / this.metrics.requestCount;
  }

  getMetrics(): Metrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      requestCount: 0,
      errorCount: 0,
      totalLatency: 0,
      averageLatency: 0
    };
  }
}

